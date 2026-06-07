import {useSelector} from "react-redux"
import {Navigate} from "react-router-dom"

export default function ProtectedRoute({children}){
    const {user, initialized} = useSelector((s) => s.auth)

    if(!initialized){
        return(
            <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-[#a855f7] border-t-transparent rounded-full animate-spin"/>
            </div>
        )
    }

    if(!user) return <Navigate to="/signin" replace/>
    return children
}