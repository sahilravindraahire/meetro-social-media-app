import {createSlice, createAsyncThunk} from "@reduxjs/toolkit"
import {getNotificationApi, markNotificationsReadApi} from "../../api/user.api.js"

export const fetchNotification = createAsyncThunk(
    "notifications/fetch", 
    async(_, {rejectWithValue}) => {
        try {
            const res = await getNotificationApi()
            return res.data.data
        } catch (error) {
            return rejectWithValue(error.response?.data?.message)
        }
    }
)

export const markNotificationRead = createAsyncThunk(
    "notification/markRead",
    async(ids, {rejectWithValue}) => {
        try {
            await markNotificationsReadApi(ids)
            return ids
        } catch (error) {
            return rejectWithValue(error.response?.data?.message)
        }
    }
)

const notificationSlice = createSlice({
    name: "notifications",
    initialState: {
        notifications: [],
        unreadCount: 0
    },
    reducers: {
        addNotification: (state, action) => {
            state.notifications.unshift(action.payload)
            state.unreadCount += 1
        }
    },
    extraReducers: (builder) => {
        builder.addCase(fetchNotification.fulfilled, (state, action) => {
            state.notifications = action.payload
            state.unreadCount = action.payload.filter((n) => !n.isRead).length
        })
        builder.addCase(markNotificationRead.fulfilled, (state, action) => {
            const ids = Array.isArray(action.payload) ? action.payload : [action.payload]
            state.notifications = state.notifications.map((n) => ids.includes(n._id) ? {...n, isRead: true} : n)
            state.unreadCount = state.notifications.filter((n) => !n.isRead).length
        })
    }
})

export const {addNotification} = notificationSlice.actions
export default notificationSlice.reducer