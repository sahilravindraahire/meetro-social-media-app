import {useSelector, useDispatch} from "react-redux"
import {signIn, signUp, signOut, clearError} from "../store/slices/authSlice.js"

export const useAuth = () => {
    const dispatch = useDispatch()
    const {user, loading, error} = useSelector((state) => state.auth)

    return {
        user,
        loading,
        error,
        signIn: (data) => dispatch(signIn(data)),
        signUp: (data) => dispatch(signUp(data)),
        signOut: () => dispatch(signOut()),
        clearError: () => dispatch(clearError())
    }
}