import {useEffect, useState} from "react"
import {useSelector} from "react-redux"
import {getAllStoriesApi, viewStoryApi} from "../../api/media.api.js"
import { AiOutlinePlus } from "react-icons/ai"
import { Link } from "react-router-dom"

function StoryBar() {

  const {user} = useSelector((state) => state.auth)
  const [stories, setStories] = useState([])
  const [activeStory, setActiveStory] = useState(null)

  useEffect(() => {
    getAllStoriesApi().then((res) => setStories(res.data.data || [])).catch(() => {})
  }, [])

  const handleView = async (story) => {
    setActiveStory(story)
    await viewStoryApi(story._id).catch(() => {})
  }

  const grouped = stories.reduce((acc, story) => {
    const key = story.author?._id
    if(!acc[key]) acc[key] = {author: story.author, stories: []}
    acc[key].stories.push(story)
    return acc
  }, {})

  return (
    <>
      <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
        {/* Add Story */}
        <Link to="/create?type=story" className="flex flex-col items-center gap-1.5 flex-shrink-0">
          <div className="w-16 h-16 rounded-full bg-white/5 border-2 border-dashed border-white/20 flex items-center justify-center hover:border-[#a855f7]/50 transition-colors">
            <img
              src={user?.profileImage || `https://ui-avatars.com/api/?name=${user?.name}&background=a855f7&color=fff`}
              alt="you"
              className="w-full h-full rounded-full object-cover opacity-50"
            />
          </div>
          <span className="text-[10px] text-white/40 w-16 text-center truncate">Your story</span>
        </Link>
 
        {Object.values(grouped).map(({ author, stories: userStories }) => (
          <button
            key={author?._id}
            onClick={() => handleView(userStories[0])}
            className="flex flex-col items-center gap-1.5 flex-shrink-0"
          >
            <div className="w-16 h-16 rounded-full p-[2px] bg-gradient-to-tr from-[#a855f7] to-[#ec4899]">
              <img
                src={author?.profileImage || `https://ui-avatars.com/api/?name=${author?.name}&background=6366f1&color=fff`}
                alt={author?.name}
                className="w-full h-full rounded-full object-cover ring-2 ring-[#0a0a0a]"
              />
            </div>
            <span className="text-[10px] text-white/50 w-16 text-center truncate">{author?.userName}</span>
          </button>
        ))}
      </div>
 
      {/* Story Viewer Modal */}
      {activeStory && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center"
          onClick={() => setActiveStory(null)}
        >
          <div className="max-w-sm w-full mx-4 rounded-2xl overflow-hidden relative" onClick={(e) => e.stopPropagation()}>
            <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
              <img
                src={activeStory.author?.profileImage || `https://ui-avatars.com/api/?name=${activeStory.author?.name}&background=a855f7&color=fff`}
                alt={activeStory.author?.name}
                className="w-8 h-8 rounded-full object-cover ring-2 ring-white"
              />
              <span className="text-white text-sm font-semibold">{activeStory.author?.name}</span>
            </div>
            <button
              onClick={() => setActiveStory(null)}
              className="absolute top-4 right-4 z-10 text-white text-2xl bg-black/50 rounded-full w-8 h-8 flex items-center justify-center"
            >
              ×
            </button>
            {activeStory.mediaType === "video" ? (
              <video src={activeStory.media} autoPlay controls className="w-full max-h-[80vh] object-contain" />
            ) : (
              <img src={activeStory.media} alt="story" className="w-full max-h-[80vh] object-cover" />
            )}
          </div>
        </div>
      )}
    </>
  )
}

export default StoryBar
