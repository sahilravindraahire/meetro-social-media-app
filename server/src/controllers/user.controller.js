import {User} from "../models/User.model.js"
import {apiError} from "../utils/apiError.js"
import {apiResponse} from "../utils/apiResponse.js"
import {asyncHandler} from "../utils/asynchandler.js"
import {uploadOnCloudinary, deleteFromCloudinary} from "../utils/cloudinary.js"
import {Notification} from "../models/Notification.model.js"
import {getSocketId, io} from "../socket/socket.js"

export const getCurrentUser = asyncHandler(async(req, res) => {
    const userId = req.user._id

    const user = await User.findById(userId)
    .populate("posts loops story following")

    if(!user){
        throw new apiError(400, "user not found")
    }

    return res
    .status(200)
    .json(new apiResponse(200, user))
})

export const suggestedUsers = asyncHandler(async(req, res) => {
    const users = await User.find({
        _id: {$ne: req.user._id}
    }).select("-password")

    if(!users){
        throw new apiError(400, "error while fetching other users")
    }

    return res
    .status(200)
    .json(new apiResponse(200, users))
})

export const editProfile = asyncHandler(async(req, res) => {
    const {name, userName, bio, profession, gender} = req.body

    if(!name || !userName || !bio || !profession || !gender){
        throw new apiError(400, "atleast give one field to edit")
    }

    const user = await User.findById(req.user._id).select("-password")

    if(!user){
        throw new apiError(400, "user not found")
    }

    const takenUserName = await User.findOne({userName}).select("-password")

    if(takenUserName && takenUserName._id !== req.user._id){
        throw new apiError(400, "username is already taken")
    }

    if(req.file){
        if(user.userPublicId){
            await deleteFromCloudinary(user.userPublicId)
        }

        const uploadRes = await uploadOnCloudinary(req.file?.path)

        if(!uploadRes){
            throw new apiError(500, "error while uplaoding profile photo on cloudinary")
        }

        user.profileImage = uploadRes.secure_url
        user.userPublicId = uploadRes.public_id
    }

    user.name = name || user.name
    user.userName = userName || user.userName
    user.bio = bio || user.bio
    user.profession = profession || user.profession
    user.gender = gender || user.gender

    await user.save()

    return res
    .status(200)
    .json(new apiResponse(200, user))
})

export const getProfile = asyncHandler(async(req, res) => {
    const userName = req.params.userName

    const user = await User.findOne({userName})
    .select("-password")
    .populate("posts loops followers following")

    if(!user){
        throw new apiError(400, "user not found")
    }

    return res
    .status(200)
    .json(new apiResponse(200, user))
})

export const follow = asyncHandler(async(req, res) => {
    const currentUserId = req.user._id
    const targetUserId = req.params.targetUserId

    if(!targetUserId){
        throw new apiError(400, "target user not found")
    }

    if(currentUserId === targetUserId){
        throw new apiError(400, "can't follow yourself")
    }

    const currentUser = await User.findById(currentUserId).select("-password")

    const targetUser = await User.findById(targetUserId).select("-password")

    const isFollowing = currentUser.following.includes(targetUserId)

    if(isFollowing){
        currentUser.following = currentUser.following.filter((id) => id.toString() !== targetUserId)

        targetUser.followers = targetUser.followers.filter((id) => id.toString() !== currentUserId)

        await currentUser.save()
        await targetUser.save()

        return res
        .status(200)
        .json(new apiResponse(200, {following: false}, "unfollow successfully"))
    }else{
        currentUser.following.push(targetUserId)
        targetUser.followers.push(currentUserId)

        if(currentUser._id !== targetUser._id){
            const notification = await Notification.create({
                sender: currentUser._id,
                receiver: targetUser._id,
                type: "follow",
                message: "started following you"
            })

            const populatedNotification = await Notification.findById(notification._id)
            .populate("sender receiver")

            const receiverSocketId = getSocketId(targetUser._id)

            if(receiverSocketId){
                io.to(receiverSocketId).emit("newNotification", populatedNotification)
            }
        }

        await currentUser.save()
        await targetUser.save()

        return res
        .status(200)
        .json(new apiResponse(200, {following: true}, "follow successfully"))
    }
})

export const followingList = asyncHandler(async(req, res) => {
    const user = await User.findById(req.user._id)

    const result = user.following

    return res
    .status(200)
    .json(new apiResponse(200, result))
})

export const search = asyncHandler(async(req, res) => {
    const keyWord = req.query.keyWord

    if(!keyWord){
        throw new apiError(400, "keyword is required")
    }

    const users = await User.find({
        $or: [
            {userName: {$regex: keyWord, $options: "i"}},
            {name: {$regex: keyWord, $options: "i"}}
        ]
    }).select("-password")

    return res
    .status(200)
    .json(new apiResponse(200, users))
})

export const getAllNotification = asyncHandler(async(req, res) => {
    const notification = await Notification.find({receiver: req.user._id})
    .populate("sender receiver post loop")
    .sort({createdAt: -1})

    return res
    .status(200)
    .json(new apiResponse(200, notification))
})

export const markAsRead = asyncHandler(async(req, res) => {
    const {notificationId} = req.body

    if(Array.isArray(notificationId)){
        // bulk mark-as-read
        await Notification.updateMany(
            {_id: {$in: notificationId}, receiver: req.user._id},
            {$set: {isRead: true}}
        )
    }else{
        // mark single notification as read
        await Notification.findOneAndUpdate(
            {_id: notificationId, receiver: req.user._id},
            {$set: {isRead: true}}
        )
    }

    return res
    .status(200)
    .json(new apiResponse(200, "marked as read"))
})

export const searchUsers = asyncHandler(async(req, res) => {
    const {q} = req.query

    if(!q) return res.status(200).json(new apiResponse(200, []))

    const users = await User.find({
        $or: [
            {name: {$regex: q, $options: "i"}},
            {userName: {$regex: q, $options: "i"}}
        ],
        _id: {$ne: req.user._id}
    }).select("name userName profileImage").limit(10)

    return res.status(200).json(new apiResponse(200, users))
})