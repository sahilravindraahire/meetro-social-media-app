import {useState, useRef} from 'react'
import {useDispatch, useSelector} from "react-redux"
import {setUser} from "../../store/slices/authSlice.js"
import {editProfileApi} from "../../api/user.api.js"
import {AiOutlineCamera} from "react-icons/ai"

function Settings() {

  const {user} = useSelector((state) => state.auth)
  const dispatch = useDispatch()
  const [form, setForm] = useState({
    name: user?.name || "",
    userName: user?.userName || "",
    bio: user?.bio || "",
    profession: user?.profession || "",
    gender: user?.gender || "",
  })
  const [profileImage, setProfileImage] = useState(null)
  const [preview, setPreview] = useState(user?.profileImage)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState("")
  const [error, setError] = useState("")
  const fileRef = useRef(null)

  const handleImageChange = (e) => {
    const f = e.target.files[0]
    if(!f) return
    setProfileImage(f)
    setPreview(URL.createObjectURL(f))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true) 
    setError("")
    setSuccess("")
    try {
      const formData = new FormData()
      Object.entries(form).forEach(([k, v]) => {if (v) formData.append(k, v)})
        if(profileImage) formData.append("profileImage", profileImage)
          const res = await editProfileApi(formData)
        dispatch(setUser(res.data.data))
        setSuccess("Profile updated successfully!")
    } catch (error) {
      setError(error.response?.data?.message || "Update failed")
    } finally {setLoading(false)}
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-8">
      <h1 className="text-xl font-bold text-white mb-8">Edit Profile</h1>
 
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Avatar */}
        <div className="flex justify-center">
          <div className="relative">
            <img
              src={preview || `https://ui-avatars.com/api/?name=${user?.name}&background=a855f7&color=fff`}
              alt="profile"
              className="w-24 h-24 rounded-full object-cover ring-4 ring-white/10"
            />
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="absolute bottom-0 right-0 bg-[#a855f7] text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-[#9333ea] transition-colors"
            >
              <AiOutlineCamera />
            </button>
          </div>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
        </div>
 
        {success && (
          <div className="bg-green-500/10 border border-green-500/20 text-green-400 text-sm rounded-xl px-4 py-3">
            {success}
          </div>
        )}
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-xl px-4 py-3">
            {error}
          </div>
        )}
 
        {[
          { key: "name", label: "Full Name", placeholder: "John Doe" },
          { key: "userName", label: "Username", placeholder: "john_doe" },
          { key: "bio", label: "Bio", placeholder: "Tell people about yourself..." },
          { key: "profession", label: "Profession", placeholder: "Designer, Developer, etc." },
        ].map(({ key, label, placeholder }) => (
          <div key={key}>
            <label className="text-xs text-white/50 font-medium mb-1.5 block">{label}</label>
            {key === "bio" ? (
              <textarea
                value={form[key]}
                onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                placeholder={placeholder}
                rows={3}
                className="w-full bg-white/5 text-white placeholder-white/20 rounded-xl px-4 py-3 border border-white/10 focus:outline-none focus:border-[#a855f7]/50 transition-colors resize-none text-sm"
              />
            ) : (
              <input
                value={form[key]}
                onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                placeholder={placeholder}
                className="w-full bg-white/5 text-white placeholder-white/20 rounded-xl px-4 py-3 border border-white/10 focus:outline-none focus:border-[#a855f7]/50 transition-colors text-sm"
              />
            )}
          </div>
        ))}
 
        <div>
          <label className="text-xs text-white/50 font-medium mb-1.5 block">Gender</label>
          <select
            value={form.gender}
            onChange={(e) => setForm({ ...form, gender: e.target.value })}
            className="w-full bg-white/5 text-white rounded-xl px-4 py-3 border border-white/10 focus:outline-none focus:border-[#a855f7]/50 transition-colors text-sm"
          >
            <option value="" className="bg-[#1a1a1a]">Prefer not to say</option>
            <option value="male" className="bg-[#1a1a1a]">Male</option>
            <option value="female" className="bg-[#1a1a1a]">Female</option>
            <option value="other" className="bg-[#1a1a1a]">Other</option>
          </select>
        </div>
 
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#a855f7] hover:bg-[#9333ea] disabled:opacity-50 text-white font-semibold py-3 rounded-xl transition-colors"
        >
          {loading ? "Saving..." : "Save changes"}
        </button>
      </form>
    </div>
  )
}

export default Settings
