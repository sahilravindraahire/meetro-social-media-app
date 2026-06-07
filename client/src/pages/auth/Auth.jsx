import {useState, useEffect, use} from "react"
import {Link, useNavigate} from "react-router-dom"
import {useAuth} from "../../hooks/useAuth.js"
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai"

export function SignIn() {

  const {signIn, loading, error, user, clearError} = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ userName: "", password: "" })
  const [showPass, setShowPass] = useState(false)

  useEffect(() => {
    if(user) navigate("/")
  }, [user, navigate])

  useEffect(() => {
    return () => clearError()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    await signIn(form)
  }

  return(
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-black text-white tracking-tight">
            loop<span className="text-[#a855f7]">.</span>
          </h1>
          <p className="text-white/40 text-sm mt-2">Sign in to continue</p>
        </div>
 
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-xl px-4 py-3">
              {error}
            </div>
          )}
 
          <div>
            <label className="text-xs text-white/50 font-medium mb-1.5 block">Username</label>
            <input
              value={form.userName}
              onChange={(e) => setForm({ ...form, userName: e.target.value })}
              placeholder="your_username"
              className="w-full bg-white/5 text-white placeholder-white/20 rounded-xl px-4 py-3 border border-white/10 focus:outline-none focus:border-[#a855f7]/50 transition-colors"
            />
          </div>
 
          <div>
            <label className="text-xs text-white/50 font-medium mb-1.5 block">Password</label>
            <div className="relative">
              <input
                type={showPass ? "text" : "password"}
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="••••••••"
                className="w-full bg-white/5 text-white placeholder-white/20 rounded-xl px-4 py-3 pr-10 border border-white/10 focus:outline-none focus:border-[#a855f7]/50 transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60"
              >
                {showPass ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
              </button>
            </div>
          </div>
 
          <Link to="/forget-password" className="block text-right text-xs text-[#a855f7] hover:text-[#9333ea] transition-colors">
            Forgot password?
          </Link>
 
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#a855f7] hover:bg-[#9333ea] disabled:opacity-50 text-white font-semibold py-3 rounded-xl transition-colors duration-200"
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>
 
        <p className="text-center text-white/40 text-sm mt-6">
          Don't have an account?{" "}
          <Link to="/signup" className="text-[#a855f7] hover:text-[#9333ea] font-semibold transition-colors">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  )
}

export function SignUp() {

  const {signUp, loading, error, user, clearError} = useAuth()
  const navigate = useNavigate() 
  const [form, setForm] = useState({ name: "", userName: "", email: "", password: "" })
  const [showPass, setShowPass] = useState(false)

  useEffect(() => {
    if(user) navigate("/")
  }, [user, navigate])

  useEffect(() => {
    return () => clearError()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    await signUp(form)
  }

  const fields = [
    { key: "name", label: "Full Name", placeholder: "your name....", type: "text" },
    { key: "userName", label: "Username", placeholder: "your username....", type: "text" },
    { key: "email", label: "Email", placeholder: "your email....", type: "email" },
  ]

  return(
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-black text-white tracking-tight">
            loop<span className="text-[#a855f7]">.</span>
          </h1>
          <p className="text-white/40 text-sm mt-2">Create your account</p>
        </div>
 
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-xl px-4 py-3">
              {error}
            </div>
          )}
 
          {fields.map(({ key, label, placeholder, type }) => (
            <div key={key}>
              <label className="text-xs text-white/50 font-medium mb-1.5 block">{label}</label>
              <input
                type={type}
                value={form[key]}
                onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                placeholder={placeholder}
                className="w-full bg-white/5 text-white placeholder-white/20 rounded-xl px-4 py-3 border border-white/10 focus:outline-none focus:border-[#a855f7]/50 transition-colors"
              />
            </div>
          ))}
 
          <div>
            <label className="text-xs text-white/50 font-medium mb-1.5 block">Password</label>
            <div className="relative">
              <input
                type={showPass ? "text" : "password"}
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="Min. 8 characters"
                className="w-full bg-white/5 text-white placeholder-white/20 rounded-xl px-4 py-3 pr-10 border border-white/10 focus:outline-none focus:border-[#a855f7]/50 transition-colors"
              />
              <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60">
                {showPass ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
              </button>
            </div>
          </div>
 
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#a855f7] hover:bg-[#9333ea] disabled:opacity-50 text-white font-semibold py-3 rounded-xl transition-colors duration-200"
          >
            {loading ? "Creating account..." : "Create account"}
          </button>
        </form>
 
        <p className="text-center text-white/40 text-sm mt-6">
          Already have an account?{" "}
          <Link to="/signin" className="text-[#a855f7] hover:text-[#9333ea] font-semibold transition-colors">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}