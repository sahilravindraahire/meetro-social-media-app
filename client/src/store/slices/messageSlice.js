import {createAsyncThunk, createSlice} from "@reduxjs/toolkit"
import {getConversationsApi, getMessageApi, sendMessageApi, deleteMessageApi, editMessageApi, markMessageReadApi} from "../../api/media.api.js"

export const fetchConversations = createAsyncThunk(
    "messages/fetchConversation",
    async(_, {rejectWithValue}) => {
        try {
            const res = await getConversationsApi()
            return res.data.data
        } catch (error) {
            return rejectWithValue(error.response?.data?.message)
        }
    }
)

export const fetchMessages = createAsyncThunk(
    "messages/fetchMessages",
    async(partnerId, {rejectWithValue}) => {
        try {
            const res = await getMessageApi(partnerId)
            return res.data.data
        } catch (error) {
            return rejectWithValue(error.response?.data?.message)
        }
    }
)

export const sendMessage = createAsyncThunk(
    "messages/send",
    async({receiverId, data}, {rejectWithValue}) => {
        try {
            const res = await sendMessageApi(receiverId, data)
            return res.data.data
        } catch (error) {
            return rejectWithValue(error.response?.data?.message)
        }
    }
)

export const deleteMessage = createAsyncThunk(
    "messages/deleteMessage",
    async(messageId, {rejectWithValue}) => {
        try {
            await deleteMessageApi(messageId)
            return messageId
        } catch (error) {
            return rejectWithValue(error?.response?.data?.message)
        }
    }
)

export const editMessage = createAsyncThunk(
    "message/editMessage",
    async({messageId, message}, {rejectWithValue}) => {
        try {
            const res = await editMessageApi(messageId, message)
            return res.data.data
        } catch (error) {
            return rejectWithValue(error.response?.data?.message)
        }
    }
)

const messageSlice = createSlice({
    name: "messages",
    initialState: {
        conversations: [],
        messages: [],
        activeConversation: null,
        loading: false,
        onlineUsers: []
    },
    reducers: {
        setActiveConversation: (state, action) => {
            state.activeConversation = action.payload
        },
        addMessages: (state, action) => {
            state.messages.push(action.payload)
        },
        // removeMessages: (state, action) => {
        //     state.messages = state.messages.filter((m) => m._id !== action.payload._id)
        // },
        removeMessages: (state, action) => {
            state.messages = state.messages.filter((m) => m._id !== action.payload)
        },
        updateMessage: (state, action) => {
            const idx = state.messages.findIndex((m) => m._id === action.payload._id)
            if(idx !== -1) state.messages[idx] = action.payload
        },
        setOnlineUsers: (state, action) => {
            state.onlineUsers = action.payload
        }
    },
    extraReducers: (builder) => {
        builder.addCase(fetchConversations.fulfilled, (state, action) => {
            state.conversations = action.payload
            state.loading = false
        })
        builder.addCase(fetchMessages.pending, (state) => {
            state.loading = true
            state.messages = []
        })
        builder.addCase(fetchMessages.fulfilled, (state, action) => {
            state.loading = false
            state.messages = action.payload
        })
        builder.addCase(sendMessage.fulfilled, (state, action) => {
            state.messages.push(action.payload)
            state.loading = false
        })
        builder.addCase(deleteMessage.fulfilled, (state, action) => {
            state.messages = state.messages.filter((m) => m._id !== action.payload)
        })
        builder.addCase(editMessage.fulfilled, (state, action) => {
            const idx = state.messages.findIndex((m) => m._id === action.payload._id)
            if(idx !== -1) state.messages[idx] = action.payload
        })
    }
})

export const {setActiveConversation, addMessages, removeMessages, updateMessage, setOnlineUsers} = messageSlice.actions
export default messageSlice.reducer