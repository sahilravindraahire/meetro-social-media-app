import dotenv from "dotenv"
dotenv.config()

import nodemailer from "nodemailer"


const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
})


export const sendEmail = async(to, otp) => {
    
    try {
        await transporter.sendMail({
            from: `MEETRO support: <${process.env.EMAIL_USER}>`,
            to,
            subject: "Reset Your Password",
            html: `
            <h2>Welcome to MEETRO!</h2>
            <p>Your OTP for password reset :</p>
            <h1 style="letter-spacing: 4px">${otp}</h1>
            <p>This OTP is valid for <strong>5 minutes</strong>.</p>
            `
        })
        console.log("Email sent successfully")
    } catch (error) {
        console.log("Email sending failed:", error.message)
        throw error
    }
}

