import {createSlice, createAsyncThunk, buildCreateSlice} from "@reduxjs/toolkit"
import {getAllPostApi, likePostApi, commentPostApi, savePostApi, deletePostApi, uploadPostApi} from "../../api/post.api.js"

// thunk
export const fetchPosts = createAsyncThunk(
    "posts/fetchAll",
    async(_, {rejectWithValue}) => {
        try {
            const res = await getAllPostApi()
            return res.data.data
        } catch (error) {
            return rejectWithValue(error.response?.data?.message)
        }
    }
)

export const uploadPost = createAsyncThunk(
    "posts/upload",
    async(data, {rejectWithValue}) => {
        try {
            const res = await uploadPostApi(data)
            return res.data.data
        } catch (error) {
            return rejectWithValue(error.response?.data?.message)
        }
    }
)

export const likePost = createAsyncThunk(
    "posts/like",
    async(postId, {rejectWithValue}) => {
        try {
            const res = await likePostApi(postId)
            return res.data.data
        } catch (error) {
            return rejectWithValue(error.response?.data?.message)
        }
    }
)

export const commentPost = createAsyncThunk(
    "posts/comment",
    async({postId, message}, {rejectWithValue}) => {
        try {
            const res = await commentPostApi(postId, message)
            return res.data.data
        } catch (error) {
            return rejectWithValue(error.response?.data?.message)
        }
    }
)

export const savePost = createAsyncThunk(
    "posts/save",
    async(postId, {rejectWithValue}) => {
        try {
            const res = await savePostApi(postId)
            return res.data.data
        } catch (error) {
            return rejectWithValue(error.response?.data?.message)
        }
    }
)

export const deletePost = createAsyncThunk(
    "posts/delete",
    async(postId, {rejectWithValue}) => {
        try {
            await deletePostApi(postId)
            return postId
        } catch (error) {
            return rejectWithValue(error.response?.data?.message)
        }
    }
)

// slice
const postSlice = createSlice({
    name: "posts",
    initialState: {
        posts: [],
        loading: false,
        error: null
    },
    reducers: {
        updatePostLikes: (state, action) => {
            const {postId, likes} = action.payload
            const post = state.posts.find((p) => p._id === postId)
            if(post) post.likes = likes
        },
        updatePostComments: (state, action) => {
            const {postId, comments} = action.payload
            const post = state.posts.find((p) => p._id === postId)
            if(post) post.comments = comments
        }
    },
    extraReducers: (builder) => {
        // fetchPost
        builder.addCase(fetchPosts.pending, (state) => {
            state.loading = true
        })
        builder.addCase(fetchPosts.fulfilled, (state, action) => {
            state.loading = false
            state.posts = action.payload
        })
        builder.addCase(fetchPosts.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload
        })

        // uploadPost
        builder.addCase(uploadPost.fulfilled, (state, action) => {
            state.posts.unshift(action.payload)
        })

        // likepost
        builder.addCase(likePost.fulfilled, (state, action) => {
            const idx = state.posts.findIndex((p) => p._id === action.payload._id)
            if(idx !== -1) state.posts[idx] = action.payload
        })

        // commentPost
        builder.addCase(commentPost.fulfilled, (state, action) => {
            const idx = state.posts.findIndex((p) => p._id === action.payload._id)
            if(idx !== -1) state.posts[idx] = action.payload
        })

        // deletePost
        builder.addCase(deletePost.fulfilled, (state, action) => {
            state.posts = state.posts.filter((p) => p._id != action.payload)
        })
    }
})

export const {updatePostLikes, updatePostComments} = postSlice.actions
export default postSlice.reducer