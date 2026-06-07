import dotenv from "dotenv"
dotenv.config()

import nodemailer from "nodemailer"


const transporter = nodemailer.createTransport({
    service: "Gmail",
    port: 2525,
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
})

// export const sendEmail = async(to, otp) => {
//     await transporter.sendMail({
//         from:`MEETRO support: <${process.env.EMAIL_USER}>`,
//         to,
//         subject: "Reset Your Password",
//         html: `
//         <h2>Welcome to MEETRO!</h2>
//         <p>Your OTP for password reset :</p>
//         <h1 style="letter-spacing: 4px">${otp}</h1>
//         <p>This OTP is valid for <strong>5 minutes</strong>.</p>
//         `
//     })
// }


export const sendEmail = async(to, otp) => {
    console.log("Attempting to send email to:", to)
    console.log("EMAIL_USER:", process.env.EMAIL_USER)
    console.log("EMAIL_PASS exists:", !!process.env.EMAIL_PASS)
    
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

