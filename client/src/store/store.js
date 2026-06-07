import {configureStore} from "@reduxjs/toolkit"
import authReducer from "./slices/authSlice.js"
import postReducer from "./slices/postSlice.js"
import messageReducer from "./slices/messageSlice.js"
import notificationReducer from "./slices/notificationSlice.js"

export const store = configureStore({
    reducer: {
        auth: authReducer,
        posts: postReducer,
        messages: messageReducer,
        notifications: notificationReducer
    }
})

