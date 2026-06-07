import api from "./axios.js"

export const uploadPostApi = (data) => api.post("/posts/upload", data, {
    headers: {"Content-Type": "multipart/form-data"}
})
export const getAllPostApi = () => api.get("/posts")
export const likePostApi = (postId) => api.put(`/posts/like/${postId}`)
export const commentPostApi = (postId, message) => api.post(`/posts/comment/${postId}`, {message})
export const savePostApi = (postId) => api.put(`/posts/save/${postId}`)
export const deletePostApi = (postId) => api.delete(`/posts/${postId}`)