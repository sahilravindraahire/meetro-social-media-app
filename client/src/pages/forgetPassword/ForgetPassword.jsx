import {useState} from 'react'
import {useNavigate, Link} from "react-router-dom"
import {sendOtpApi, verifyOtpApi, resetPasswordApi} from "../../api/auth.api.js"

function ForgetPassword() {

  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [email, setEmail] = useState("")
  const [otp, setOtp] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSendOtp = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    try {
      await sendOtpApi(email)
      setStep(2)
    } catch (error) {
      setError(error.response?.data?.message || "Failed to send OTP")
    } finally {setLoading(false)}
  }

  const handleVerifyOtp = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    try {
      await verifyOtpApi({email, otp})
      setStep(3)
    } catch (error) {
      setError(error.response?.data?.message || "Invalid OTP")
    } finally {setLoading(false)}
  }

  const handleReset = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    try {
      await resetPasswordApi({email, password})
      navigate("/signin")
    } catch (error) {
      setError(error.response?.data?.message || "Failed to reset password")
    } finally {setLoading(false)}
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-black text-white tracking-tight">
            loop<span className="text-[#a855f7]">.</span>
          </h1>
          <p className="text-white/40 text-sm mt-2">
            {step === 1 ? "Reset your password" : step === 2 ? "Enter the OTP" : "Set new password"}
          </p>
        </div>
 
        {/* Steps indicator */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`h-1.5 rounded-full transition-all duration-300 ${s <= step ? "bg-[#a855f7] w-8" : "bg-white/10 w-4"}`}
            />
          ))}
        </div>
 
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-xl px-4 py-3 mb-4">
            {error}
          </div>
        )}
 
        {step === 1 && (
          <form onSubmit={handleSendOtp} className="space-y-4">
            <div>
              <label className="text-xs text-white/50 font-medium mb-1.5 block">Email address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="john@example.com"
                className="w-full bg-white/5 text-white placeholder-white/20 rounded-xl px-4 py-3 border border-white/10 focus:outline-none focus:border-[#a855f7]/50 transition-colors"
              />
            </div>
            <button
              type="submit"
              disabled={loading || !email}
              className="w-full bg-[#a855f7] hover:bg-[#9333ea] disabled:opacity-50 text-white font-semibold py-3 rounded-xl transition-colors"
            >
              {loading ? "Sending..." : "Send OTP"}
            </button>
          </form>
        )}
 
        {step === 2 && (
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <p className="text-sm text-white/50 text-center">OTP sent to {email}</p>
            <div>
              <label className="text-xs text-white/50 font-medium mb-1.5 block">OTP Code</label>
              <input
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Enter 4-digit OTP"
                maxLength={4}
                className="w-full bg-white/5 text-white placeholder-white/20 rounded-xl px-4 py-3 border border-white/10 focus:outline-none focus:border-[#a855f7]/50 transition-colors text-center text-xl tracking-widest"
              />
            </div>
            <button
              type="submit"
              disabled={loading || otp.length !== 4}
              className="w-full bg-[#a855f7] hover:bg-[#9333ea] disabled:opacity-50 text-white font-semibold py-3 rounded-xl transition-colors"
            >
              {loading ? "Verifying..." : "Verify OTP"}
            </button>
          </form>
        )}
 
        {step === 3 && (
          <form onSubmit={handleReset} className="space-y-4">
            <div>
              <label className="text-xs text-white/50 font-medium mb-1.5 block">New Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Min. 8 characters"
                className="w-full bg-white/5 text-white placeholder-white/20 rounded-xl px-4 py-3 border border-white/10 focus:outline-none focus:border-[#a855f7]/50 transition-colors"
              />
            </div>
            <button
              type="submit"
              disabled={loading || password.length < 8}
              className="w-full bg-[#a855f7] hover:bg-[#9333ea] disabled:opacity-50 text-white font-semibold py-3 rounded-xl transition-colors"
            >
              {loading ? "Resetting..." : "Reset Password"}
            </button>
          </form>
        )}
 
        <p className="text-center text-white/40 text-sm mt-6">
          <Link to="/signin" className="text-[#a855f7] hover:text-[#9333ea] font-semibold transition-colors">
            Back to sign in
          </Link>
        </p>
      </div>
    </div>
  )
}

export default ForgetPassword
