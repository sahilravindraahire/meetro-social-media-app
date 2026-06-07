import {useEffect} from "react"
import {useDispatch, useSelector} from "react-redux"
import {connectSocket, disconnectSocket, getSocket} from "../socket/socket.js"
import {addMessages, removeMessages, updateMessage, setOnlineUsers} from "../store/slices/messageSlice.js"
import {addNotification} from "../store/slices/notificationSlice.js"
import {updatePostLikes, updatePostComments} from "../store/slices/postSlice.js"

export const useSocket = () => {
    const dispatch = useDispatch()
    const {user} = useSelector((state) => state.auth)
    const {activeConversation} = useSelector((state) => state.messages)

    useEffect(() => {
        if(!user?._id) return

        const socket = connectSocket(user._id)

        socket.on("getOnlineUsers", (users) => dispatch(setOnlineUsers(users)))
        socket.on("newMessage", (msg) => {
            const partnerId = activeConversation?.partner?._id?.toString()
            const senderId = msg.sender?.toString()
            const receiverId = msg.receiver?.toString()
            const userId = user._id?.toString()
            if(
                partnerId && 
                ((senderId === partnerId && receiverId === userId) ||
                (senderId === userId && receiverId === partnerId))
            ){
                dispatch(addMessages(msg))
            }
        })
        socket.on("messageDeleted", ({messageId}) => dispatch(removeMessages(messageId)))
        socket.on("messageEdited", (msg) => dispatch(updateMessage(msg)))
        socket.on("newNotification", (notifi) => dispatch(addNotification(notifi)))
        socket.on("likePost", (data) => dispatch(updatePostLikes(data)))
        socket.on("commentedOnPost", (data) => dispatch(updatePostComments(data)))

        return () => {
            disconnectSocket()
        }
    }, [user?._id, activeConversation, dispatch])

    return getSocket()
}