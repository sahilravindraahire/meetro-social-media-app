import {createSlice, createAsyncThunk} from "@reduxjs/toolkit"
import {signUpApi, signInApi, signOutApi} from "../../api/auth.api.js"
import {getCurrentUserApi} from "../../api/user.api.js"

// thunks
export const signUp = createAsyncThunk(
    "auth/signUp",
    async(data, {rejectWithValue}) => {
        try {
            const res = await signUpApi(data)
            return res.data.data
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "sign up failed")
        }
    }
)

export const signIn = createAsyncThunk(
    "auth/signIn",
    async(data, {rejectWithValue}) => {
        try {
            const res = await signInApi(data)
            return res.data.data
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "sign in failed")
        }
    }
)

export const signOut = createAsyncThunk(
    "auth/signOut", 
    async(_, {rejectWithValue}) => {
        try {
            await signOutApi()
        } catch (error) {
            return rejectWithValue(error.response?.data?.message)
        }
    }
)

export const fetchCurrentUser = createAsyncThunk(
    "auth/fetchCurrentUser",
    async(_, {rejectWithValue}) => {
        try {
            const res = await getCurrentUserApi()
            return res.data.data
        } catch (error) {
            return rejectWithValue(null)
        }
    }
)

// slices
const authSlice = createSlice({
    name: "auth",
    initialState: {
        user: null,
        loading: false,
        error: null,
        initialized: false
    },
    reducers: {
        clearError: (state) => {
            state.error = null
        },
        setUser: (state, action) => {
            state.user = action.payload
        }
    },
    extraReducers: (builder) => {
        const pending = (state) => {
            state.loading = true
            state.error = null
        }
        const rejected = (state, action) => {
            state.loading = false
            state.error = action.payload
        }

        // signup
        builder.addCase(signUp.pending, pending)
        builder.addCase(signUp.fulfilled, (state, action) => {
            state.loading = false
            state.user = action.payload
        })
        builder.addCase(signUp.rejected, rejected)

        // signin
        builder.addCase(signIn.pending, pending)
        builder.addCase(signIn.fulfilled, (state, action) => {
            state.loading = false
            state.user = action.payload
        })
        builder.addCase(signIn.rejected, rejected)

        // signout
        builder.addCase(signOut.fulfilled, (state) => {
            state.user = null
        })

        // fetchCurrentUser
        builder.addCase(fetchCurrentUser.pending, (state) => {
            state.loading = true
        })
        builder.addCase(fetchCurrentUser.fulfilled, (state, action) => {
            state.loading = false
            state.user = action.payload
            state.initialized = true
        })
        builder.addCase(fetchCurrentUser.rejected, (state) => {
            state.loading = false
            state.initialized = true
        })
    }
})

export const {clearError, setUser} = authSlice.actions
export default authSlice.reducer