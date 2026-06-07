import {Post} from "../models/Post.model.js"
import {Notification} from "../models/Notification.model.js"
import {apiError} from "../utils/apiError.js"
import {apiResponse} from "../utils/apiResponse.js"
import {asyncHandler} from "../utils/asynchandler.js"
import {uploadOnCloudinary, deleteFromCloudinary} from "../utils/cloudinary.js"
import {getSocketId, io} from "../socket/socket.js"
import {User} from "../models/User.model.js"

export const uplaodPost = asyncHandler(async(req, res) => {
    const {caption, mediaType} = req.body

    let media
    let mediaPublicId

    if(req.file){
        const uploadRes = await uploadOnCloudinary(req.file?.path)

        if(!uploadRes){
            throw new apiError(500, "error while uplaoding on cloudinary")
        }

        media = uploadRes.secure_url
        mediaPublicId = uploadRes.public_id
    }

    const post = await Post.create({
        caption, media, mediaPublicId, mediaType, author: req.user._id
    })

    const user = await User.findById(req.user._id)

    user.posts.push(post._id)

    await user.save()

    const populatedPost = await Post.findById(post._id)
    .populate("author", "name userName profileImage")

    return res
    .status(201)
    .json(new apiResponse(200, populatedPost))
})

export const getAllPosts = asyncHandler(async(req, res) => {
    const posts = await Post.find({})
    .populate("author", "name userName profileImage")
    .populate("comments.author", "name userName profileImage")
    .sort({createdAt: -1})

    if(!posts){
        throw new apiError(400, "error while fetching posts")
    }

    return res
    .status(200)
    .json(new apiResponse(200, posts))
})

export const like = asyncHandler(async(req, res) => {
    const postId = req.params.postId

    const post = await Post.findById(postId)

    if(!post){
        throw new apiError(400, "post not found")
    }

    const alreadyLiked = post.likes.some(
        (id) => id.toString() === req.user._id.toString()
    )

    if(alreadyLiked){
        post.likes = post.likes.filter((id) => id.toString() !== req.user._id.toString())
    }else{
        post.likes.push(req.user._id)
        if(post.author._id !== req.user._id){
            const notification = await Notification.create({
                sender: req.user._id,
                receiver: post.author._id,
                type: "like",
                post: post._id,
                message: "Liked your post"
            })

            const populatedNotification = await Notification.findById(notification._id)
            .populate("sender receiver post")

            const receiverSocketId = getSocketId(post.author._id)

            if(receiverSocketId){
                io.to(receiverSocketId).emit("newNotification", populatedNotification)
            }
        }
    }

    await post.save()
    await post.populate("author", "name userName profileImage")
    io.emit("likePost", {
        postId: post._id,
        likes: post.likes
    })

    return res
    .status(200)
    .json(new apiResponse(200, post))
})

export const comment = asyncHandler(async(req, res) => {
    const {message} = req.body
    const postId = req.params.postId

    const post = await Post.findById(postId)

    if(!post){
        throw new apiError(404, "post not found")
    }

    post.comments.push({
        author: req.user._id,
        message
    })

    if(post.author._id !== req.user._id){
        const notification = await Notification.create({
            sender: req.user._id,
            receiver: post.author._id,
            type: "comment",
            post: post._id,
            message: "commented on your post"
        })

        const populatedNotification = await Notification.findById(notification._id)
        .populate("sender receiver post")

        const receiverSocketId = getSocketId(post.author._id)
        if(receiverSocketId){
            io.to(receiverSocketId).emit("newNotification", populatedNotification)
        }
    }

    await post.save()
    await post.populate("author", "name userName profileImage")
    await post.populate("comments.author")
    io.emit("commentedOnPost", {
        postId: post._id,
        comments: post.comments
    })

    return res
    .status(200)
    .json(new apiResponse(200, post))
})

export const saved = asyncHandler(async(req, res) => {
    const postId = req.params.postId

    const user = await User.findById(req.user._id)

    const alreadySaved = user.saved.some(
        (id) => id.toString() === postId.toString()
    )

    if(alreadySaved){
        user.saved = user.saved.filter(
            (id) => id.toString() !== postId.toString()
        )
    }else{
        user.saved.push(postId)
    }

    await user.save()

    user.populate("saved")

    return res
    .status(200)
    .json(new apiResponse(200, user))
})

export const deletePost = asyncHandler(async(req, res) => {
    console.log("DELETE HIT — params:", req.params)
    const {postId} = req.params
    const userId = req.user._id

    const post = await Post.findById(postId)

    if(!post){
        throw new apiError(404, "post not found")
    }

    if(post.author.toString() !== userId.toString()){
        throw new apiError(400, "you are not authorized to delete this post")
    }

    if(post.mediaPublicId){
        const deleteRes = await deleteFromCloudinary(post.mediaPublicId, post.mediaType)

        if(!deleteRes){
            throw new apiError(500, "error while deleting from cloudinary")
        }
    }

    await User.findByIdAndUpdate(
        userId,
        {
            $pull: {
                posts: post._id
            }
        }
    )

    await post.deleteOne()

    return res
    .status(200)
    .json(new apiResponse(200, null, "post deleted successfully"))
})