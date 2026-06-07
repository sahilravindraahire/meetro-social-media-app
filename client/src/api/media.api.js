import api from "./axios.js"

// loops
export const uploadLoopApi = (data) => api.post("/loops/upload", data, {
    headers: {"Content-Type": "multipart/form-data"}
})
export const getAllLoopsApi = () => api.get("/loops")
export const likeLoopApi = (loopId) => api.put(`/loops/like/${loopId}`)
export const commentLoopApi = (loopId, message) => api.post(`/loops/comment/${loopId}`, {message})
export const deleteLoopApi = (loopId) => api.delete(`/loops/${loopId}`)

// stories
export const uploadStoryApi = (data) => api.post("/stories/upload", data, {
    headers: {"Content-Type": "multipart/form-data"}
})
export const getAllStoriesApi = () => api.get("/stories")
export const getStoryByUserNameApi = (userName) => api.get(`/stories/user/${userName}`)
export const viewStoryApi = (storyId) => api.get(`/stories/view/${storyId}`)
export const deleteStoryApi = (storyId) => api.delete(`/stories/${storyId}`)

// messages
export const sendMessageApi = (receiverId, data) => api.post(`/messages/send/${receiverId}`, data, {headers: {"Content-Type": "multipart/form-data"}})
export const getMessageApi = (conversationParterId) => api.get(`/messages/${conversationParterId}`)
export const getConversationsApi = () => api.get("/messages/conversation/all")
export const markMessageReadApi = (senderId) => api.put(`/messages/read/${senderId}`)
export const editMessageApi = (messageId, message) => api.put(`/messages/edit/${messageId}`, {message})
export const deleteMessageApi = (messageId) => api.delete(`/messages/${messageId}`)