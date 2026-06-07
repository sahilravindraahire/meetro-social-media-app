import api from "./axios.js"

export const getCurrentUserApi = () => api.get("/users/me")
export const getSuggestedUsersApi = () => api.get("/users/suggested")
export const editProfileApi = (data) => api.put("/users/edit-profile", data, {
    headers: {"Content-Type": "multipart/form-data"}
})
export const getProfileApi = (userName) => api.get(`/users/profile/${userName}`)
export const followUserApi = (targetUserId) => api.put(`/users/follow/${targetUserId}`)
export const getFollowingListApi = () => api.get("/users/following")
export const searchUsersApi = (query) => api.get(`/users/search?q=${query}`)
export const getNotificationApi = () => api.get("/users/notifications")
export const markNotificationsReadApi = (notificationId) => api.put("/users/notifications/read", {notificationId})