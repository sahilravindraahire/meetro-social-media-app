// import {useEffect, useState, useRef} from 'react'
// import {getAllLoopsApi, likeLoopApi, commentLoopApi, deleteLoopApi} from "../../api/media.api.js"
// import {useSelector} from "react-redux"
// import {AiFillHeart, AiOutlineHeart, AiOutlineComment, AiOutlineDelete} from "react-icons/ai"
// import {Link} from "react-router-dom"

// function Loops() {

//   const {user} = useSelector((state) => state.auth)
//   const [loops, setLoops] = useState([])
//   const [loading, setLoading] = useState(true)
//   const [activeIdx, setActiveIdx] = useState(0)
//   const [commentMap, setCommentMap] = useState({})
//   const [showComment, setShowComment] = useState(null)
//   const videoRefs = useRef({})

//   useEffect(() => {
//     getAllLoopsApi()
//     .then((res) => setLoops(res.data.data || []))
//     .catch(() => {})
//     .finally(() => setLoading(false))
//   }, [])

//   useEffect(() => {
//     Object.entries(videoRefs.current).forEach(([idx, ref]) => {
//       if(ref){
//         if(parseInt(idx) === activeIdx) ref.play?.().catch(() => {})
//           else ref.pause?.()
//       }
//     })
//   }, [activeIdx])

//   const handleLike = async (loopId, idx) => {
//     try {
//       const res = await likeLoopApi(loopId)
//       setLoops((prev) => prev.map((l, i) => i === idx ? res.data.data : l))
//     } catch {}
//   }

//   const handleComment = async (loopId, idx) => {
//     const text = commentMap[loopId]
//     if(!text?.trim()) return
//     try {
//       const res = await commentLoopApi(loopId, text)
//       setLoops((prev) => prev.map((l, i) => i === idx ? res.data.data : l))
//       setCommentMap((prev) => ({...prev, [loopId] : ""}))
//     } catch {}
//   }

//   const handleDelete = async (loopId) => {
//     await deleteLoopApi(loopId).catch(() => {})
//     setLoops((prev) => prev.filter((l) => l._id !== loopId))
//   }

//   if(loading) return (
//     <div className="flex items-center justify-center h-screen">
//       <div className="w-8 h-8 border-2 border-[#a855f7] border-t-transparent rounded-full animate-spin" />
//     </div>
//   )

//   if(loops.length === 0) return (
//     <div className="flex flex-col items-center justify-center h-screen text-white/30 gap-3">
//       <p className="text-xl">No loops yet</p>
//       <Link to="/create?type=loop" className="text-[#a855f7] text-sm">Create the first one</Link>
//     </div>
//   )

//   const loop = loops[activeIdx]
//   const isLiked = loop?.likes?.some((id) => id === user?._id || id?._id === user?._id)
//   const isOwner = loop?.author?._id === user?._id

//   return (
//     <div className="flex h-screen overflow-hidden">
//       {/* Loop viewer */}
//       <div className="flex-1 flex flex-col items-center justify-center bg-black relative overflow-hidden">
//         <video
//           ref={(el) => { videoRefs.current[activeIdx] = el }}
//           src={loop?.media}
//           loop
//           playsInline
//           className="h-full max-h-screen object-contain w-full"
//         />
 
//         {/* Overlay info */}
//         <div className="absolute bottom-8 left-4 right-20">
//           <Link to={`/profile/${loop?.author?.userName}`} className="flex items-center gap-2 mb-2">
//             <img
//               src={loop?.author?.profileImage || `https://ui-avatars.com/api/?name=${loop?.author?.name}&background=a855f7&color=fff`}
//               alt={loop?.author?.name}
//               className="w-9 h-9 rounded-full object-cover ring-2 ring-white/30"
//             />
//             <div>
//               <p className="text-white font-semibold text-sm">{loop?.author?.name}</p>
//               <p className="text-white/60 text-xs">@{loop?.author?.userName}</p>
//             </div>
//           </Link>
//           {loop?.caption && <p className="text-white/80 text-sm">{loop.caption}</p>}
//         </div>
 
//         {/* Side actions */}
//         <div className="absolute right-4 bottom-8 flex flex-col gap-6 items-center">
//           <button onClick={() => handleLike(loop._id, activeIdx)} className="flex flex-col items-center gap-1">
//             {isLiked
//               ? <AiFillHeart className="text-3xl text-red-500" />
//               : <AiOutlineHeart className="text-3xl text-white" />
//             }
//             <span className="text-white text-xs">{loop?.likes?.length || 0}</span>
//           </button>
 
//           <button onClick={() => setShowComment(showComment === loop._id ? null : loop._id)} className="flex flex-col items-center gap-1">
//             <AiOutlineComment className="text-3xl text-white" />
//             <span className="text-white text-xs">{loop?.comments?.length || 0}</span>
//           </button>
 
//           {isOwner && (
//             <button onClick={() => handleDelete(loop._id)}>
//               <AiOutlineDelete className="text-3xl text-white/70 hover:text-red-400 transition-colors" />
//             </button>
//           )}
//         </div>
 
//         {/* Navigation arrows */}
//         <button
//           onClick={() => setActiveIdx(Math.max(0, activeIdx - 1))}
//           disabled={activeIdx === 0}
//           className="absolute top-1/2 left-2 -translate-y-1/2 text-white/50 hover:text-white disabled:opacity-20 text-3xl transition-colors"
//         >
//           ‹
//         </button>
//         <button
//           onClick={() => setActiveIdx(Math.min(loops.length - 1, activeIdx + 1))}
//           disabled={activeIdx === loops.length - 1}
//           className="absolute top-1/2 right-16 -translate-y-1/2 text-white/50 hover:text-white disabled:opacity-20 text-3xl transition-colors"
//         >
//           ›
//         </button>
 
//         {/* Comment panel */}
//         {showComment === loop._id && (
//           <div className="absolute bottom-0 left-0 right-0 bg-[#0a0a0a]/95 backdrop-blur p-4 rounded-t-2xl max-h-72 flex flex-col gap-3">
//             <div className="flex-1 overflow-y-auto space-y-2">
//               {loop.comments?.map((c, i) => (
//                 <div key={i} className="flex gap-2 items-start">
//                   <img
//                     src={c.author?.profileImage || `https://ui-avatars.com/api/?name=${c.author?.name}&background=6366f1&color=fff`}
//                     alt={c.author?.name}
//                     className="w-7 h-7 rounded-full object-cover flex-shrink-0"
//                   />
//                   <div>
//                     <span className="text-xs font-semibold text-white/80 mr-2">{c.author?.userName}</span>
//                     <span className="text-xs text-white/60">{c.message}</span>
//                   </div>
//                 </div>
//               ))}
//             </div>
//             <div className="flex gap-2">
//               <input
//                 value={commentMap[loop._id] || ""}
//                 onChange={(e) => setCommentMap((prev) => ({ ...prev, [loop._id]: e.target.value }))}
//                 placeholder="Add a comment..."
//                 className="flex-1 bg-white/5 text-white placeholder-white/30 text-sm rounded-xl px-3 py-2 border border-white/10 focus:outline-none"
//               />
//               <button
//                 onClick={() => handleComment(loop._id, activeIdx)}
//                 className="px-4 py-2 bg-[#a855f7] text-white text-sm font-semibold rounded-xl hover:bg-[#9333ea] transition-colors"
//               >
//                 Post
//               </button>
//             </div>
//           </div>
//         )}
//       </div>
 
//       {/* Loop list sidebar (desktop) */}
//       <div className="hidden lg:flex flex-col w-64 border-l border-white/[0.06] overflow-y-auto py-4 gap-2 px-3">
//         <h3 className="text-sm font-semibold text-white/40 px-1 mb-1">Loops</h3>
//         {loops.map((l, i) => (
//           <button
//             key={l._id}
//             onClick={() => setActiveIdx(i)}
//             className={`flex items-center gap-3 p-2 rounded-xl transition-all ${i === activeIdx ? "bg-white/10" : "hover:bg-white/5"}`}
//           >
//             <div className="w-14 h-14 rounded-lg overflow-hidden flex-shrink-0 bg-black/40">
//               <video src={l.media} className="w-full h-full object-cover" muted />
//             </div>
//             <div className="text-left min-w-0">
//               <p className="text-xs font-semibold text-white truncate">{l.author?.userName}</p>
//               {l.caption && <p className="text-[10px] text-white/40 truncate">{l.caption}</p>}
//             </div>
//           </button>
//         ))}
//       </div>
//     </div>
//   )
// }

// export default Loops


import {useEffect, useState, useRef} from 'react'
import {getAllLoopsApi, likeLoopApi, commentLoopApi, deleteLoopApi} from "../../api/media.api.js"
import {useSelector} from "react-redux"
import {AiFillHeart, AiOutlineHeart, AiOutlineComment, AiOutlineDelete} from "react-icons/ai"
import {Link} from "react-router-dom"

function Loops() {

  const {user} = useSelector((state) => state.auth)
  const [loops, setLoops] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeIdx, setActiveIdx] = useState(0)
  const [commentMap, setCommentMap] = useState({})
  const [showComment, setShowComment] = useState(null)
  const videoRefs = useRef({})
  const itemRefs = useRef([])
  const observerRef = useRef(null)

  useEffect(() => {
    getAllLoopsApi()
    .then((res) => setLoops(res.data.data || []))
    .catch(() => {})
    .finally(() => setLoading(false))
  }, [])

  // Replace the old activeIdx-based play/pause with observer-driven one
  useEffect(() => {
    if (!loops.length) return

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const idx = parseInt(entry.target.dataset.idx)
          const video = videoRefs.current[idx]
          if (entry.isIntersecting) {
            setActiveIdx(idx)
            setShowComment(null)
            video?.play().catch(() => {})
          } else {
            video?.pause()
            if (video) video.currentTime = 0
          }
        })
      },
      { threshold: 0.6 }
    )

    itemRefs.current.forEach((el) => {
      if (el) observerRef.current.observe(el)
    })

    return () => observerRef.current?.disconnect()
  }, [loops])

  const handleLike = async (loopId, idx) => {
    try {
      const res = await likeLoopApi(loopId)
      setLoops((prev) => prev.map((l, i) => i === idx ? res.data.data : l))
    } catch {}
  }

  const handleComment = async (loopId, idx) => {
    const text = commentMap[loopId]
    if(!text?.trim()) return
    try {
      const res = await commentLoopApi(loopId, text)
      setLoops((prev) => prev.map((l, i) => i === idx ? res.data.data : l))
      setCommentMap((prev) => ({...prev, [loopId] : ""}))
    } catch {}
  }

  const handleDelete = async (loopId) => {
    await deleteLoopApi(loopId).catch(() => {})
    setLoops((prev) => prev.filter((l) => l._id !== loopId))
  }

  if(loading) return (
    <div className="flex items-center justify-center h-screen">
      <div className="w-8 h-8 border-2 border-[#a855f7] border-t-transparent rounded-full animate-spin" />
    </div>
  )

  if(loops.length === 0) return (
    <div className="flex flex-col items-center justify-center h-screen text-white/30 gap-3">
      <p className="text-xl">No loops yet</p>
      <Link to="/create?type=loop" className="text-[#a855f7] text-sm">Create the first one</Link>
    </div>
  )

  const loop = loops[activeIdx]
  const isLiked = loop?.likes?.some((id) => id === user?._id || id?._id === user?._id)
  const isOwner = loop?.author?._id === user?._id

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Loop viewer — vertical scroll snap */}
      <div
        className="flex-1 overflow-y-scroll snap-y snap-mandatory bg-black"
        style={{ scrollbarWidth: "none" }}
      >
        {loops.map((l, idx) => (
          <div
            key={l._id}
            ref={(el) => (itemRefs.current[idx] = el)}
            data-idx={idx}
            className="relative w-full h-screen snap-start snap-always flex items-center justify-center overflow-hidden"
          >
            <video
              ref={(el) => { videoRefs.current[idx] = el }}
              src={l?.media}
              loop
              playsInline
              className="h-full w-full object-cover"
            />

            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent pointer-events-none" />

            {/* Overlay info */}
            <div className="absolute bottom-8 left-4 right-20">
              <Link to={`/profile/${l?.author?.userName}`} className="flex items-center gap-2 mb-2">
                <img
                  src={l?.author?.profileImage || `https://ui-avatars.com/api/?name=${l?.author?.name}&background=a855f7&color=fff`}
                  alt={l?.author?.name}
                  className="w-9 h-9 rounded-full object-cover ring-2 ring-white/30"
                />
                <div>
                  <p className="text-white font-semibold text-sm">{l?.author?.name}</p>
                  <p className="text-white/60 text-xs">@{l?.author?.userName}</p>
                </div>
              </Link>
              {l?.caption && <p className="text-white/80 text-sm">{l.caption}</p>}
            </div>

            {/* Side actions */}
            <div className="absolute right-4 bottom-8 flex flex-col gap-6 items-center">
              <button onClick={() => handleLike(l._id, idx)} className="flex flex-col items-center gap-1">
                {l.likes?.some((id) => id === user?._id || id?._id === user?._id)
                  ? <AiFillHeart className="text-3xl text-red-500" />
                  : <AiOutlineHeart className="text-3xl text-white" />
                }
                <span className="text-white text-xs">{l?.likes?.length || 0}</span>
              </button>

              <button onClick={() => setShowComment(showComment === l._id ? null : l._id)} className="flex flex-col items-center gap-1">
                <AiOutlineComment className="text-3xl text-white" />
                <span className="text-white text-xs">{l?.comments?.length || 0}</span>
              </button>

              {l?.author?._id === user?._id && (
                <button onClick={() => handleDelete(l._id)}>
                  <AiOutlineDelete className="text-3xl text-white/70 hover:text-red-400 transition-colors" />
                </button>
              )}
            </div>

            {/* Comment panel */}
            {showComment === l._id && (
              <div className="absolute bottom-0 left-0 right-0 bg-[#0a0a0a]/95 backdrop-blur p-4 rounded-t-2xl max-h-72 flex flex-col gap-3">
                <div className="flex-1 overflow-y-auto space-y-2">
                  {l.comments?.map((c, i) => (
                    <div key={i} className="flex gap-2 items-start">
                      <img
                        src={c.author?.profileImage || `https://ui-avatars.com/api/?name=${c.author?.name}&background=6366f1&color=fff`}
                        alt={c.author?.name}
                        className="w-7 h-7 rounded-full object-cover flex-shrink-0"
                      />
                      <div>
                        <span className="text-xs font-semibold text-white/80 mr-2">{c.author?.userName}</span>
                        <span className="text-xs text-white/60">{c.message}</span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    value={commentMap[l._id] || ""}
                    onChange={(e) => setCommentMap((prev) => ({ ...prev, [l._id]: e.target.value }))}
                    placeholder="Add a comment..."
                    className="flex-1 bg-white/5 text-white placeholder-white/30 text-sm rounded-xl px-3 py-2 border border-white/10 focus:outline-none"
                  />
                  <button
                    onClick={() => handleComment(l._id, idx)}
                    className="px-4 py-2 bg-[#a855f7] text-white text-sm font-semibold rounded-xl hover:bg-[#9333ea] transition-colors"
                  >
                    Post
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Loop list sidebar (desktop) */}
      <div className="hidden lg:flex flex-col w-64 border-l border-white/[0.06] overflow-y-auto py-4 gap-2 px-3">
        <h3 className="text-sm font-semibold text-white/40 px-1 mb-1">Loops</h3>
        {loops.map((l, i) => (
          <button
            key={l._id}
            onClick={() => {
              itemRefs.current[i]?.scrollIntoView({ behavior: "smooth" })
            }}
            className={`flex items-center gap-3 p-2 rounded-xl transition-all ${i === activeIdx ? "bg-white/10" : "hover:bg-white/5"}`}
          >
            <div className="w-14 h-14 rounded-lg overflow-hidden flex-shrink-0 bg-black/40">
              <video src={l.media} className="w-full h-full object-cover" muted />
            </div>
            <div className="text-left min-w-0">
              <p className="text-xs font-semibold text-white truncate">{l.author?.userName}</p>
              {l.caption && <p className="text-[10px] text-white/40 truncate">{l.caption}</p>}
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}

export default Loops