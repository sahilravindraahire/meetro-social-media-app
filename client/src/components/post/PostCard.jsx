import {useState} from "react"
import {useDispatch, useSelector} from "react-redux"
import {Link} from "react-router-dom"
import {AiOutlineHeart, AiFillHeart, AiOutlineComment, AiOutlineDelete} from "react-icons/ai"
import {BsBookmark, BsBookmarkFill} from "react-icons/bs"
import {likePost, commentPost, savePost, deletePost} from "../../store/slices/postSlice.js"

function PostCard({post}) {

  const dispatch = useDispatch()
  const {user} = useSelector((s) => s.auth)
  const [showComments, setShowComments] = useState(false)
  const [commentText, setCommentText] = useState("")

  const isLiked = post.likes?.some((id) => id === user?._id || id?._id === user?._id)
  const isSaved = user?.saved?.some((id) => id === post._id || id?._id === post._id)
  // const isOwner = post.author?._id === user?._id
  const isOwner = String(post.author?._id) === String(user?._id)

  const handleLike = () => dispatch(likePost(post._id))
  const handleSave = () => dispatch(savePost(post._id))
  const handleDelete = () => { if (window.confirm("Delete this post?")) dispatch(deletePost(post._id)) }

  const handleComment = (e) => {
    e.preventDefault()
    if (!commentText.trim()) return
    dispatch(commentPost({ postId: post._id, message: commentText.trim() }))
    setCommentText("")
  }

  return (
    <article className="bg-white/[0.03] border border-white/[0.06] rounded-2xl overflow-hidden hover:border-white/10 transition-all duration-300">
      {/* Header */}
      <div className="flex items-center justify-between p-4">
        <Link to={`/profile/${post.author?.userName}`} className="flex items-center gap-3 group">
          <img
            src={post.author?.profileImage || `https://ui-avatars.com/api/?name=${post.author?.name}&background=a855f7&color=fff`}
            alt={post.author?.name}
            className="w-10 h-10 rounded-full object-cover ring-2 ring-white/10 group-hover:ring-[#a855f7]/50 transition-all"
          />
          <div>
            <p className="text-sm font-semibold text-white group-hover:text-[#a855f7] transition-colors">{post.author?.name}</p>
            <p className="text-xs text-white/40">@{post.author?.userName}</p>
          </div>
        </Link>
        {isOwner && (
          <button onClick={handleDelete} className="text-white/30 hover:text-red-400 transition-colors p-2">
            <AiOutlineDelete className="text-lg" />
          </button>
        )}
      </div>
 
      {/* Media */}
      {post.media && (
        <div className="relative bg-black/20">
          {post.mediaType === "video" ? (
            <video src={post.media} controls className="w-full max-h-[600px] object-contain" />
          ) : (
            <img src={post.media} alt={post.caption} className="w-full max-h-[600px] object-cover" />
          )}
        </div>
      )}
 
      {/* Actions */}
      <div className="p-4 space-y-3">
        <div className="flex items-center gap-4">
          <button onClick={handleLike} className="flex items-center gap-1.5 group">
            {isLiked
              ? <AiFillHeart className="text-2xl text-red-500" />
              : <AiOutlineHeart className="text-2xl text-white/50 group-hover:text-red-400 transition-colors" />
            }
            <span className="text-sm text-white/50">{post.likes?.length || 0}</span>
          </button>
 
          <button onClick={() => setShowComments(!showComments)} className="flex items-center gap-1.5 group">
            <AiOutlineComment className="text-2xl text-white/50 group-hover:text-[#a855f7] transition-colors" />
            <span className="text-sm text-white/50">{post.comments?.length || 0}</span>
          </button>
 
          <button onClick={handleSave} className="ml-auto">
            {isSaved
              ? <BsBookmarkFill className="text-xl text-[#a855f7]" />
              : <BsBookmark className="text-xl text-white/50 hover:text-[#a855f7] transition-colors" />
            }
          </button>
        </div>
 
        {post.caption && (
          <p className="text-sm text-white/80">
            <Link to={`/profile/${post.author?.userName}`} className="font-semibold text-white mr-2">
              {post.author?.userName}
            </Link>
            {post.caption}
          </p>
        )}
 
        {/* Comments */}
        {showComments && (
          <div className="space-y-3 pt-2 border-t border-white/5">
            <div className="max-h-48 overflow-y-auto space-y-2">
              {post.comments?.map((c, i) => (
                <div key={i} className="flex gap-2 items-start">
                  <img
                    src={c.author?.profileImage || `https://ui-avatars.com/api/?name=${c.author?.name}&background=6366f1&color=fff`}
                    alt={c.author?.name}
                    className="w-7 h-7 rounded-full object-cover flex-shrink-0"
                  />
                  <div className="bg-white/5 rounded-xl px-3 py-2">
                    <p className="text-xs font-semibold text-white/80">{c.author?.userName}</p>
                    <p className="text-xs text-white/60">{c.message}</p>
                  </div>
                </div>
              ))}
            </div>
 
            <form onSubmit={handleComment} className="flex gap-2">
              <input
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Add a comment..."
                className="flex-1 bg-white/5 text-white text-sm placeholder-white/30 rounded-xl px-3 py-2 border border-white/10 focus:outline-none focus:border-[#a855f7]/50"
              />
              <button
                type="submit"
                disabled={!commentText.trim()}
                className="px-4 py-2 bg-[#a855f7] text-white text-sm font-semibold rounded-xl disabled:opacity-40 hover:bg-[#9333ea] transition-colors"
              >
                Post
              </button>
            </form>
          </div>
        )}
      </div>
    </article>
  )
}

export default PostCard
