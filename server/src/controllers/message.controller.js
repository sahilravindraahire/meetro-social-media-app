import {apiError} from "../utils/apiError.js"
import {apiResponse} from "../utils/apiResponse.js"
import {asyncHandler} from "../utils/asynchandler.js"
import {uploadOnCloudinary, deleteFromCloudinary} from "../utils/cloudinary.js"
import {Message} from "../models/Message.model.js"
import {Conversation} from "../models/Conversation.model.js"
import {getSocketId, io} from "../socket/socket.js"

export const sendMessage = asyncHandler(async(req, res) => {
    const senderId = req.user._id
    const {receiverId} = req.params
    const {message} = req.body

    if(!message && !req.file){
        throw new apiError(400, "message or image is required")
    }

    let image
    let mediaPublicId

    if(req.file){
        const uploadRes = await uploadOnCloudinary(req.file?.path)

        if(!uploadRes){
            throw new apiError(500, "failed to upload image")
        }

        image = uploadRes.secure_url
        mediaPublicId = uploadRes.public_id
    }

    const newMessage = await Message.create({
        sender: senderId,
        receiver: receiverId,
        message: message || "",
        image,
        mediaPublicId
    })

    let conversation = await Conversation.findOne({
        participants: {$all: [senderId, receiverId]}
    })

    if(!conversation){
        conversation = await Conversation.create({
            participants: [senderId, receiverId],
            messages: [newMessage._id]
        })
    }else{
        conversation.messages.push(newMessage._id)
        await conversation.save()
    }

    const receiverSocketId = getSocketId(receiverId)

    if(receiverSocketId){
        io.to(receiverSocketId).emit("newMessage", newMessage)
    }

    return res
    .status(200)
    .json(new apiResponse(200, newMessage))
})

export const getMessage = asyncHandler(async(req, res) => {
    const userId = req.user._id
    const {conversationPartnerId} = req.params

    const conversation = await Conversation.findOne({
        participants: {$all: [userId, conversationPartnerId]}
    }).populate("messages")

    if(!conversation){
    return res.status(200).json(new apiResponse(200, []))
}

    return res
    .status(200)
    .json(new apiResponse(200, conversation.messages))
})



export const deleteMessage = asyncHandler(async(req, res) => {
    const userId = req.user._id
    const {messageId} = req.params

    const message = await Message.findById(messageId)

    if(!message){
        throw new apiError(404, "message not found")
    }

    if(message.sender.toString() !== userId.toString()){
        throw new apiError(403, "you are not authorized to delete message")
    }

    if(message.mediaPublicId){
        await deleteFromCloudinary(message.mediaPublicId, "image")
    }

    await Conversation.updateOne(
        {messages: messageId},
        {$pull: {messages: messageId}}
    )

    await Message.findByIdAndDelete(messageId)

    const receiverSocketId = getSocketId(message.receiver.toString())

    if(receiverSocketId){
        io.to(receiverSocketId).emit("messageDeleted", {messageId})
    }

    return res
    .status(200)
    .json(new apiResponse(200, {messageId}, "message deleted successfully"))
})

export const getConversation = asyncHandler(async(req, res) => {
    const userId = req.user._id

    const conversations = await Conversation.find({
        participants: {$in: [userId]}
    })
    .populate("participants", "name userName profileImage")
    .sort({updatedAt: -1})

    if(!conversations.length){
        return res
        .status(200)
        .json(new apiResponse(200, [], "no conversations found"))
    }

    // The Promise.all() method in JavaScript is a built-in static helper function used to execute multiple asynchronous operations concurrently and wait for all of them to complete.
    const formattedConversation = await Promise.all(
        conversations.map(async(conv) => {
            const partner = conv.participants.find(
                (p) => p._id.toString() !== userId.toString()
            )

            const unreadCount = await Message.countDocuments({
                sender: partner?._id,
                receiver: userId,
                isRead: false
            })

            const lastMessage = conv.messages[0] || null

            return{
                conversationId: conv._id,
                partner,
                lastMessage,
                unreadCount,
                updatedAt: conv.updatedAt
            }
        })
    )

    return res
    .status(200)
    .json(new apiResponse(200, formattedConversation, "conversation fetched successfully"))
})

export const markAsRead = asyncHandler(async(req, res) => {
    const userId = req.user._id
    const {senderId} = req.params

    const result = await Message.updateMany(
        {
            sender: senderId,
            receiver: userId,
            isRead: false
        },
        {$set: {isRead: true}}
    )

    const senderSocketId = getSocketId(senderId)

    if(senderSocketId){
        io.to(senderSocketId).emit("messageRead", {by: userId, senderId})
    }

    return res
    .status(200)
    .json(new apiResponse(200, {modifiedCount: result.modifiedCount}, "message marked as read"))
})

export const editMessage = asyncHandler(async(req, res) => {
    const userId = req.user._id
    const {messageId} = req.params
    const {message} = req.body

    if(!message.trim()){
        throw new apiError(400, "updated message text is required")
    }

    const existingMessage = await Message.findById(messageId)

    if(!existingMessage){
        throw new apiError(404, "message not found")
    }

    if(existingMessage.sender.toString() !== userId.toString()){
        throw new apiError(403, "You are not authorized to edit this message")
    }

    if(!existingMessage.message && existingMessage.image){
        throw new apiError(400, "Image-only messages cannot be edited")
    }

    const EDIT_WINDOW_MS = 15*60*1000

    const ageMs = Date.now() - new Date(existingMessage.createdAt).getTime()

    if(ageMs > EDIT_WINDOW_MS){
        throw new apiError(403, "Messages can only be edited within 15 minutes of sending")
    }

    existingMessage.message = message.trim()
    existingMessage.isEdited = true

    await existingMessage.save()

    const receiverSocketId = getSocketId(existingMessage.receiver.toString())

    if(receiverSocketId){
        io.to(receiverSocketId).emit("messageEdited", existingMessage)
    }

    return res
    .status(200)
    .json(new apiResponse(200, existingMessage, "message edited successfully"))
})