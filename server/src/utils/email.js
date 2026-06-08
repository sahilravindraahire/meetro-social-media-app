import nodemailer from "nodemailer"
import dotenv from "dotenv"

dotenv.config()

export const sendEmail = async (email, otp) => {
    try {
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        })

        const mailOptions = {
            from: `meetroo Support <${process.env.EMAIL_USER}>`,
            to: email,
            subject: `OTP for new password`,
            html: `
            <h2>Welcome to MEETRO!</h2>
            <p>Your OTP for password reset :</p>
            <h1 style="letter-spacing: 4px">${otp}</h1>
            <p>This OTP is valid for <strong>5 minutes</strong>.</p>
            `
        }

        await transporter.sendMail(mailOptions)
    } catch (error) {
        console.error(`Failed to send email to ${email}: ${error.message}`)
    }
}