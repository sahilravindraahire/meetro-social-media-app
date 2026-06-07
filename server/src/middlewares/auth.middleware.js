import jwt from "jsonwebtoken"
import {asyncHandler} from "../utils/asynchandler.js"
import {apiError} from "../utils/apiError.js"
import { User } from "../models/User.model.js"

export const verifyAuth = asyncHandler(async(req, res, next) => {
    try {
        const token = req.cookies?.token || req.header("Authorization")?.replace("Bearer ", "")
    
        if(!token){
            throw new apiError(400, "Unauthorized request")
        }
    
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET)
    
        if(!decodedToken){
            throw new apiError(400, "invalid token")
        }
    
        const user = await User.findById(decodedToken.id).select("-password")
    
        if(!user){
            throw new apiError(401, "user not found")
        }
    
        req.user = user
    
        next()
    } catch (error) {
        if(error instanceof apiError) throw error
        throw new apiError(500, `Auth error: ${error.message}`)
    }
})