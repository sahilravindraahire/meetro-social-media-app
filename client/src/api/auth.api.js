import api from "./axios.js"

export const signUpApi = (data) => api.post("/auth/signup", data)
export const signInApi = (data) => api.post("/auth/signin", data)
export const signOutApi = () => api.post("/auth/signout")
export const sendOtpApi = (email) => api.post("/auth/send-otp", {email})
export const verifyOtpApi = (data) => api.post("/auth/verify-otp", data)
export const resetPasswordApi = (data) => api.post("/auth/reset-password", data)