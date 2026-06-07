import {apiError} from "../utils/apiError.js"
import {apiResponse} from "../utils/apiResponse.js"
import {asyncHandler} from "../utils/asynchandler.js"
import {uploadOnCloudinary, deleteFromCloudinary} from "../utils/cloudinary.js"
import {Loop} from "../models/Loop.model.js"
import {User} from "../models/User.model.js"
import {Notification} from "../models/Notification.model.js"
import {getSocketId, io} from "../socket/socket.js"

export const uploadLoop = asyncHandler(async(req, res) => {
    const {caption} = req.body 

    let media

    let mediaPublicId

    if(req.file){
        const uploadRes = await uploadOnCloudinary(req.file?.path)

        if(!uploadRes){
            throw new apiError(400, "error while uploading loop")
        }

        media = uploadRes.secure_url
        mediaPublicId = uploadRes.public_id
    }

    const loop = await Loop.create({
        caption,
        media,
        mediaPublicId,
        author: req.user._id
    })

    const user = await User.findById(req.user._id)

    user.loops.push(loop._id)

    await user.save()

    const populatedLoop = await Loop.findById(loop._id)
    .populate("author", "name userName profileImage")

    return res
    .status(200)
    .json(new apiResponse(200, populatedLoop))
})

// export const like = asyncHandler(async(req, res) => {
//     const loopId = req.params.loopId

//     const loop = await Loop.findById(loopId)

//     if(!loop){
//         throw new apiError(400, "loop not found")
//     }

//     const alreadyLiked = loop.likes.some(
//         (id) => id.toString() === req.user._id.toString()
//     )

//     if(alreadyLiked){
//         loop.likes = loop.likes.filter((id) => id.toString() !== req.user._id.toString())
//     }else{
//         loop.likes.push(req.user._id)

//         if(loop.author._id !== req.user._id){
//             const notification = await Notification.create({
//                 sender: req.user._id,
//                 receiver: loop.author._id,
//                 type: "like",
//                 loop: loop._id,
//                 message: "liked your loop"
//             })

//             const populatedNotification = await Notification.findById(notification._id)
//             .populate("sender receiver loop")

//             const receiverSocketId = getSocketId(loop.author._id)

//             if(receiverSocketId){
//                 io.to(receiverSocketId).emit("newNotification", populatedNotification)
//             }
//         }
//     }

//     await loop.save()

//     await loop.populate("author", "name userName profileImage")
//     io.emit("likedLoop", {
//         loopId: loop._id,
//         likes: loop.likes
//     })

//     return res
//     .status(200)
//     .json(new apiResponse(200, loop))
// })

export const like = asyncHandler(async(req, res) => {
    const loopId = req.params.loopId
    const loop = await Loop.findById(loopId)

    if(!loop){
        throw new apiError(400, "loop not found")
    }

    const alreadyLiked = loop.likes.some(
        (id) => id.toString() === req.user._id.toString()
    )

    let updatedLoop

    if(alreadyLiked){
        updatedLoop = await Loop.findByIdAndUpdate(
            loopId,
            { $pull: { likes: req.user._id } },
            { new: true }
        ).populate("author", "name userName profileImage")
    } else {
        updatedLoop = await Loop.findByIdAndUpdate(
            loopId,
            { $push: { likes: req.user._id } },
            { new: true }
        ).populate("author", "name userName profileImage")

        if(loop.author._id.toString() !== req.user._id.toString()){
            const notification = await Notification.create({
                sender: req.user._id,
                receiver: loop.author._id,
                type: "like",
                loop: loop._id,
                message: "liked your loop"
            })

            const populatedNotification = await Notification.findById(notification._id)
            .populate("sender receiver loop")

            const receiverSocketId = getSocketId(loop.author._id)
            if(receiverSocketId){
                io.to(receiverSocketId).emit("newNotification", populatedNotification)
            }
        }
    }

    io.emit("likedLoop", {
        loopId: updatedLoop._id,
        likes: updatedLoop.likes
    })

    return res
    .status(200)
    .json(new apiResponse(200, updatedLoop))
})

export const comment = asyncHandler(async(req, res) => {
    const {message} = req.body

    const loopId =  req.params.loopId

    const loop = await Loop.findById(loopId)

    if(!loop){
        throw new apiError(400, "loop not found")
    }

    loop.comments.push({
        author: req.user._id,
        message
    })

    if(loop.author._id !== req.user._id){
        const notification = await Notification.create({
            sender: req.user._id,
            receiver: loop.author._id,
            type: "comment",
            loop: loop._id,
            message: "commentd on your loop"
        })

        const populatedNotification = await Notification.findById(notification._id)
        .populate("sender receiver loop")

        const receiverSocketId = getSocketId(loop.author._id)

        if(receiverSocketId){
            io.to(receiverSocketId).emit("newNotification", populatedNotification)
        }
    }

    await loop.save()
    await loop.populate("author", "name userName profileImage")
    await loop.populate("comments.author")
    io.emit("commentedLoop", {
        loopId: loop._id,
        comments: loop.comments
    })

    return res
    .status(200)
    .json(new apiResponse(200, loop))
})

export const getAllLoops = asyncHandler(async(req, res) => {
    const loops = await Loop.find({})
    .populate("author", "name userName profileImage")
    .populate("comments.author", "name userName profileImage")

    if(!loops){
        throw new apiError(400, "error while fetching loops")
    }

    return res
    .status(200)
    .json(new apiResponse(200, loops))
})

export const deleteLoop = asyncHandler(async(req, res) => {
    const {loopId} = req.params

    const loop = await Loop.findById(loopId)

    if(!loop){
        throw new apiError(400, "error while loading loop")
    }

    if(loop.author.toString() !== req.user._id.toString()){
        throw new apiError(402, "not authorized to delete this loop")
    }

    if(loop.mediaPublicId){
        await deleteFromCloudinary(loop.mediaPublicId)
    }

    await User.findByIdAndUpdate(
        req.user._id,
        {
            $pull: {
                loops: loop._id
            }
        }
    )

    await loop.deleteOne()

    return res
    .status(200)
    .json(new apiResponse(200, null, "Loop deleted successfully"))
})