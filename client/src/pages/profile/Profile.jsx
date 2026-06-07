import {useEffect, useState} from 'react'
import {useParams, Link} from "react-router-dom"
import {useSelector} from "react-redux"
import {getProfileApi, followUserApi} from "../../api/user.api.js"
import { AiOutlineFileImage } from "react-icons/ai"
import { MdOutlineVideoLibrary } from "react-icons/md"
import PostCard from "../../components/post/PostCard.jsx"

function Profile() {

  const {userName} = useParams() 
  const {user: currentUser} = useSelector((s) => s.auth)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState("posts")
  const [isFollowing, setIsFollowing] = useState(false)

  useEffect(() => {
    setLoading(true)
    getProfileApi(userName)
    .then((res) => {
      setProfile(res.data.data)
      setIsFollowing(res.data.data?.followers?.some((f) => f._id === currentUser?._id || f === currentUser?._id))
    })
    .catch(() => {})
    .finally(() => setLoading(false))
  }, [userName, currentUser?._id])

  const handleFollow = async () => {
    try {
      await followUserApi(profile._id)
      setIsFollowing(!isFollowing)
      setProfile((prev) => ({
        ...prev,
        followers: isFollowing
  ? prev.followers.filter((id) => id.toString() !== currentUser._id.toString())
  : [...prev.followers, currentUser._id]
      }))
    } catch {}
  }

  const isOwnProfile = currentUser?.userName === userName

  if(loading){
    return(
      <div className="max-w-2xl mx-auto px-4 py-8 animate-pulse">
        <div className="flex items-center gap-6 mb-8">
          <div className="w-24 h-24 rounded-full bg-white/10" />
          <div className="space-y-3">
            <div className="w-40 h-5 bg-white/10 rounded" />
            <div className="w-28 h-3 bg-white/10 rounded" />
            <div className="w-64 h-3 bg-white/10 rounded" />
          </div>
        </div>
      </div>
    )
  }

  if(!profile) return <div className="text-center py-20 text-white/30">User not found</div>

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      {/* Profile Header */}
      <div className="mb-8">
        <div className="flex items-start gap-6 mb-6">
          <div className="flex-shrink-0">
            {profile.story ? (
              <div className="w-24 h-24 rounded-full p-[3px] bg-gradient-to-tr from-[#a855f7] to-[#ec4899]">
                <img
                  src={profile.profileImage || `https://ui-avatars.com/api/?name=${profile.name}&background=a855f7&color=fff`}
                  alt={profile.name}
                  className="w-full h-full rounded-full object-cover ring-3 ring-[#0a0a0a]"
                />
              </div>
            ) : (
              <img
                src={profile.profileImage || `https://ui-avatars.com/api/?name=${profile.name}&background=a855f7&color=fff`}
                alt={profile.name}
                className="w-24 h-24 rounded-full object-cover ring-2 ring-white/10"
              />
            )}
          </div>
 
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-2 flex-wrap">
              <h1 className="text-xl font-bold text-white">{profile.userName}</h1>
              {isOwnProfile ? (
                <Link to="/settings" className='px-4 py-1.5 bg-white/10 hover:bg-white/15 text-white text-sm font-semibold rounded-lg transition-colors'>
                Edit profile
                </Link>
              ) : (
                <button
                  onClick={handleFollow}
                  className={`px-4 py-1.5 text-sm font-semibold rounded-lg transition-colors ${
                    isFollowing
                      ? "bg-white/10 hover:bg-white/15 text-white"
                      : "bg-[#a855f7] hover:bg-[#9333ea] text-white"
                  }`}
                >
                  {isFollowing ? "Following" : "Follow"}
                </button>
              )}
            </div>
 
            <p className="text-white font-semibold">{profile.name}</p>
            {profile.bio && <p className="text-white/60 text-sm mt-1">{profile.bio}</p>}
            {profile.profession && <p className="text-white/40 text-xs mt-1">{profile.profession}</p>}
 
            <div className="flex gap-6 mt-4">
              <div className="text-center">
                <p className="text-white font-bold">{profile.posts?.length || 0}</p>
                <p className="text-white/40 text-xs">posts</p>
              </div>
              <div className="text-center">
                <p className="text-white font-bold">{profile.followers?.length || 0}</p>
                <p className="text-white/40 text-xs">followers</p>
              </div>
              <div className="text-center">
                <p className="text-white font-bold">{profile.following?.length || 0}</p>
                <p className="text-white/40 text-xs">following</p>
              </div>
            </div>
          </div>
        </div>
      </div>
 
      {/* Tabs */}
      <div className="flex border-b border-white/10 mb-6">
        <button
          onClick={() => setTab("posts")}
          className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold border-b-2 transition-colors ${
            tab === "posts" ? "border-white text-white" : "border-transparent text-white/40 hover:text-white/60"
          }`}
        >
          <AiOutlineFileImage /> Posts
        </button>
        <button
          onClick={() => setTab("loops")}
          className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold border-b-2 transition-colors ${
            tab === "loops" ? "border-white text-white" : "border-transparent text-white/40 hover:text-white/60"
          }`}
        >
          <MdOutlineVideoLibrary /> Loops
        </button>
      </div>
 
      {/* Content */}
      {tab === "posts" && (
        <>
          {profile.posts?.length === 0 ? (
            <p className="text-center text-white/30 py-12">No posts yet</p>
          ) : (
            <div className="space-y-4">
              {profile.posts?.map((post) => (
                <PostCard key={post._id || post} post={typeof post === "object" ? post : { _id: post }} />
              ))}
            </div>
          )}
        </>
      )}
 
      {tab === "loops" && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {profile.loops?.map((loop) => (
            <div key={loop._id || loop} className="aspect-square bg-white/5 rounded-xl overflow-hidden">
              {typeof loop === "object" && loop.media && (
                <video src={loop.media} className="w-full h-full object-cover" />
              )}
            </div>
          ))}
          {(!profile.loops || profile.loops.length === 0) && (
            <p className="col-span-3 text-center text-white/30 py-12">No loops yet</p>
          )}
        </div>
      )}
    </div>
  )
}

export default Profile
