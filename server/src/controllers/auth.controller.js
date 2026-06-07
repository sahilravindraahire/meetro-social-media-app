import {User} from "../models/User.model.js"
import {apiError} from "../utils/apiError.js"
import {apiResponse} from "../utils/apiResponse.js"
import {asyncHandler} from "../utils/asynchandler.js"
import jwt from "jsonwebtoken"
import {sendEmail} from "../utils/email.js"
import bcrypt from "bcryptjs"

const generateToken = (id) => {
    return jwt.sign({id}, process.env.JWT_SECRET, {expiresIn: process.env.JWT_EXPIRE})
}

const cookieOption = {
    httpOnly: true,
    secure: true,
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    maxAge: 1 * 365 * 24 * 60 * 60 * 1000
}

export const signUp = asyncHandler(async(req, res) => {
    const {name, email, password, userName} = req.body

    if(!name || !userName || !email || !password){
        throw new apiError(400, "all field are required")
    }

    const existingUser = await User.findOne({
        $or: [{userName}, {email}]
    })

    if(existingUser){
        if(existingUser.userName === userName){
            throw new apiError(400, "username already exists")
        }

        if(existingUser.email === email){
            throw new apiError(400, "email address is already used")
        }
    }

    if(password.length < 8){
        throw new apiError(400, "password at least contain 8 characters")
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await User.create({
        name,
        userName,
        email,
        password: hashedPassword
    })

    const token = generateToken(user._id)

    return res
    .status(201)
    .cookie("token", token, cookieOption)
    .json(new apiResponse(201, user, "signUp successfully"))
})

export const signIn = asyncHandler(async(req, res) => {
    const {userName, password} = req.body

    if(!userName || !password){
        throw new apiError(400, "all fields are required")
    }

    const user = await User.findOne({userName})

    if(!user){
        throw new apiError(400, "user not found")
    }

    const passMatch = await bcrypt.compare(password, user.password)

    if(!passMatch){
        throw new apiError(400, "Incorrect password")
    }

    const token = generateToken(user._id)

    return res
    .status(200)
    .cookie("token", token, cookieOption)
    .json(new apiResponse(200, user, "signIn successfully"))
})

export const signOut = asyncHandler(async(req, res) => {
    return res
    .status(200)
    .clearCookie("token", cookieOption)
    .json(new apiResponse(200, "sign out successfully"))
})

export const sendOtp = asyncHandler(async(req, res) => {
    const {email} = req.body

    if(!email){
        throw new apiError(400, "email is not given or Incorrect")
    }

    const user = await User.findOne({email}).select("-password")

    if(!user){
        throw new apiError(400, "user not found")
    }

    const otp = Math.floor(1000 + Math.random() * 9000).toString()

    user.resetOtp = otp
    user.otpExpires = Date.now() + 5 * 60 * 1000
    user.isOtpVerified = false

    await user.save()
    try {
        await sendEmail(email, otp)
    } catch (error) {
        console.log("Email error:", error.message)
        throw new apiError(500, "Failed to send OTP email. Check email configuration.")
    }

    return res
    .status(200)
    .json(new apiResponse(200, "otp email send successfullt"))
})

export const verifyOtp = asyncHandler(async(req, res) => {
    const {email, otp} = req.body

    const user = await User.findOne({email}).select("-password")

    if(!user || user.resetOtp !== otp || user.otpExpires < Date.now()){
        throw new apiError(400, "Invalid or expired OTP")
    }

    user.isOtpVerified = true
    user.resetOtp = undefined
    user.otpExpires = undefined

    await user.save()

    return res
    .status(200)
    .json(new apiResponse(200, "otp verified usccessfully"))
})

export const resetPassword = asyncHandler(async(req, res) => {
    const {email, password} = req.body

    const user = await User.findOne({email}).select("-password")

    if(!user){
        throw new apiError(400, "user not find")
    }

    if(user.isOtpVerified === false){
        throw new apiError(400, "otp verification is required")
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    user.password = hashedPassword
    user.isOtpVerified = false

    await user.save()

    return res
    .status(200)
    .json(new apiResponse(200, "password reset successfully"))
})