// import {useEffect, useState, useRef} from 'react'
// import {useDispatch, useSelector} from "react-redux"
// import {fetchConversations, fetchMessages, sendMessage, deleteMessage, editMessage, setActiveConversation} from "../../store/slices/messageSlice.js"
// import { AiOutlineSend, AiOutlineEdit, AiOutlineDelete, AiOutlinePicture } from "react-icons/ai"
// import { IoCheckmarkDoneOutline } from "react-icons/io5"

// function Messages() {

//   const dispatch = useDispatch()
//   const {conversations, messages, activeConversation, loading, onlineUsers} = useSelector((state) => state.messages)
//   const {user} = useSelector((state) => state.auth)
//   const [text, setText] = useState("")
//   const [editingId, setEditingId] = useState(null)
//   const [editText, setEditText] = useState("")
//   const [imageFile, setImageFile] = useState(null)
//   const messagesEndRef = useRef(null)
//   const fileInputRef = useRef(null)

//   useEffect(() => {
//     dispatch(fetchConversations())
//   }, [dispatch])

//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({behavior: "smooth"})
//   }, [messages])

//   const handleSelectConversation = (conv) => {
//     dispatch(setActiveConversation(conv))
//     dispatch(fetchMessages(conv.partner._id))
//   }

//   const handleSend = async () => {
//     if(!text.trim() && !imageFile) return
//     const formData = new FormData()
//     if(text.trim()) formData.append("message", text)
//     if(imageFile) formData.append("image", imageFile)
//     await dispatch(sendMessage({receiverId: activeConversation.partner._id, data: formData})) 
//   setText("")
//   setImageFile(null) 
//   }

//   const handleEdit = async (msg) => {
//     if(!editText.trim()) return
//     await dispatch(editMessage({messageId: msg._id, message: editText}))
//     setEditingId(null)
//     setEditText("")
//   }

//   const handleDelete = async (msgId) => {
//     await dispatch(deleteMessage(msgId))
//   }

//   const isOnline = (userId) => onlineUsers.includes(userId?.toString())

//   return (
//     <div className="flex h-screen md:h-[calc(100vh-0px)] overflow-hidden">
//       {/* Conversations List */}
//       <div className={`${activeConversation ? "hidden md:flex" : "flex"} flex-col w-full md:w-80 border-r border-white/[0.06] flex-shrink-0`}>
//         <div className="px-4 py-5 border-b border-white/[0.06]">
//           <h2 className="text-lg font-bold text-white">Messages</h2>
//         </div>
 
//         <div className="flex-1 overflow-y-auto">
//           {conversations.length === 0 ? (
//             <p className="text-center text-white/30 text-sm py-12">No conversations yet</p>
//           ) : (
//             conversations.map((conv) => (
//               <button
//                 key={conv.conversationId}
//                 onClick={() => handleSelectConversation(conv)}
//                 className={`w-full flex items-center gap-3 px-4 py-4 hover:bg-white/5 transition-colors ${
//                   activeConversation?.conversationId === conv.conversationId ? "bg-white/5" : ""
//                 }`}
//               >
//                 <div className="relative flex-shrink-0">
//                   <img
//                     src={conv.partner?.profileImage || `https://ui-avatars.com/api/?name=${conv.partner?.name}&background=6366f1&color=fff`}
//                     alt={conv.partner?.name}
//                     className="w-12 h-12 rounded-full object-cover"
//                   />
//                   {isOnline(conv.partner?._id) && (
//                     <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full ring-2 ring-[#0a0a0a]" />
//                   )}
//                 </div>
//                 <div className="flex-1 min-w-0 text-left">
//                   <div className="flex items-center justify-between">
//                     <p className="text-sm font-semibold text-white truncate">{conv.partner?.name}</p>
//                     {conv.unreadCount > 0 && (
//                       <span className="bg-[#a855f7] text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0">
//                         {conv.unreadCount}
//                       </span>
//                     )}
//                   </div>
//                   <p className="text-xs text-white/40 truncate">@{conv.partner?.userName}</p>
//                 </div>
//               </button>
//             ))
//           )}
//         </div>
//       </div>
 
//       {/* Chat Panel */}
//       {activeConversation ? (
//         <div className="flex flex-col flex-1 min-w-0">
//           {/* Chat Header */}
//           <div className="flex items-center gap-3 px-4 py-4 border-b border-white/[0.06]">
//             <button
//               className="md:hidden text-white/60 mr-1"
//               onClick={() => dispatch(setActiveConversation(null))}
//             >
//               ←
//             </button>
//             <div className="relative">
//               <img
//                 src={activeConversation.partner?.profileImage || `https://ui-avatars.com/api/?name=${activeConversation.partner?.name}&background=6366f1&color=fff`}
//                 alt={activeConversation.partner?.name}
//                 className="w-10 h-10 rounded-full object-cover"
//               />
//               {isOnline(activeConversation.partner?._id) && (
//                 <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-400 rounded-full ring-2 ring-[#0a0a0a]" />
//               )}
//             </div>
//             <div>
//               <p className="font-semibold text-white">{activeConversation.partner?.name}</p>
//               <p className="text-xs text-white/40">
//                 {isOnline(activeConversation.partner?._id) ? "Online" : "Offline"}
//               </p>
//             </div>
//           </div>
 
//           {/* Messages */}
//           <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
//             {loading ? (
//               <div className="flex items-center justify-center h-full">
//                 <div className="w-6 h-6 border-2 border-[#a855f7] border-t-transparent rounded-full animate-spin" />
//               </div>
//             ) : messages.map((msg) => {
//               const isMine = msg.sender === user._id || msg.sender?._id === user._id
//               return (
//                 <div key={msg._id} className={`flex ${isMine ? "justify-end" : "justify-start"} group`}>
//                   <div className={`max-w-xs lg:max-w-md ${isMine ? "items-end" : "items-start"} flex flex-col gap-1`}>
//                     {editingId === msg._id ? (
//                       <div className="flex gap-2">
//                         <input
//                           value={editText}
//                           onChange={(e) => setEditText(e.target.value)}
//                           onKeyDown={(e) => { if (e.key === "Enter") handleEdit(msg) }}
//                           className="bg-white/10 text-white text-sm rounded-xl px-3 py-2 border border-white/20 focus:outline-none focus:border-[#a855f7]/50 w-48"
//                           autoFocus
//                         />
//                         <button onClick={() => handleEdit(msg)} className="text-[#a855f7] text-xs font-semibold">Save</button>
//                         <button onClick={() => setEditingId(null)} className="text-white/40 text-xs">Cancel</button>
//                       </div>
//                     ) : (
//                       <div className={`rounded-2xl px-4 py-2.5 ${isMine ? "bg-[#a855f7] text-white rounded-br-sm" : "bg-white/[0.07] text-white rounded-bl-sm"}`}>
//                         {msg.image && <img src={msg.image} alt="img" className="max-w-[200px] rounded-xl mb-2" />}
//                         {msg.message && <p className="text-sm">{msg.message}</p>}
//                         {msg.isEdited && <p className="text-[10px] opacity-60 mt-0.5">edited</p>}
//                       </div>
//                     )}
 
//                     {isMine && (
//                       <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
//                         {msg.message && (
//                           <button
//                             onClick={() => { setEditingId(msg._id); setEditText(msg.message) }}
//                             className="text-white/40 hover:text-white transition-colors"
//                           >
//                             <AiOutlineEdit className="text-sm" />
//                           </button>
//                         )}
//                         <button onClick={() => handleDelete(msg._id)} className="text-white/40 hover:text-red-400 transition-colors">
//                           <AiOutlineDelete className="text-sm" />
//                         </button>
//                         {msg.isRead && <IoCheckmarkDoneOutline className="text-xs text-[#a855f7]" />}
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               )
//             })}
//             <div ref={messagesEndRef} />
//           </div>
 
//           {/* Input */}
//           <div className="px-4 py-4 border-t border-white/[0.06]">
//             {imageFile && (
//               <div className="mb-2 flex items-center gap-2">
//                 <img src={URL.createObjectURL(imageFile)} alt="preview" className="w-12 h-12 rounded-lg object-cover" />
//                 <button onClick={() => setImageFile(null)} className="text-white/40 text-xs">Remove</button>
//               </div>
//             )}
//             <div className="flex items-center gap-2">
//               <button onClick={() => fileInputRef.current?.click()} className="text-white/40 hover:text-white transition-colors p-2">
//                 <AiOutlinePicture className="text-xl" />
//               </button>
//               <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => setImageFile(e.target.files[0])} />
//               <input
//                 value={text}
//                 onChange={(e) => setText(e.target.value)}
//                 onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend() } }}
//                 placeholder="Message..."
//                 className="flex-1 bg-white/5 text-white placeholder-white/30 rounded-xl px-4 py-3 border border-white/10 focus:outline-none focus:border-[#a855f7]/50 transition-colors text-sm"
//               />
//               <button
//                 onClick={handleSend}
//                 disabled={!text.trim() && !imageFile}
//                 className="bg-[#a855f7] hover:bg-[#9333ea] disabled:opacity-40 text-white rounded-xl p-3 transition-colors"
//               >
//                 <AiOutlineSend className="text-lg" />
//               </button>
//             </div>
//           </div>
//         </div>
//       ) : (
//         <div className="hidden md:flex flex-1 items-center justify-center text-white/20">
//           <div className="text-center">
//             <p className="text-xl mb-2">Select a conversation</p>
//             <p className="text-sm">Choose from your existing conversations or start a new one</p>
//           </div>
//         </div>
//       )}
//     </div>
//   )
// }

// export default Messages


import {useEffect, useState, useRef} from 'react'
import {useDispatch, useSelector} from "react-redux"
import {fetchConversations, fetchMessages, sendMessage, deleteMessage, editMessage, setActiveConversation} from "../../store/slices/messageSlice.js"
import {searchUsersApi} from "../../api/user.api.js"   
import {AiOutlineSend, AiOutlineEdit, AiOutlineDelete, AiOutlinePicture} from "react-icons/ai"
import {IoCheckmarkDoneOutline} from "react-icons/io5"
import {AiOutlineEdit as AiOutlineCompose} from "react-icons/ai"

function Messages() {
  const dispatch = useDispatch()
  const {conversations, messages, activeConversation, loading, onlineUsers} = useSelector((state) => state.messages)
  const {user} = useSelector((state) => state.auth)
  const [text, setText] = useState("")
  const [editingId, setEditingId] = useState(null)
  const [editText, setEditText] = useState("")
  const [imageFile, setImageFile] = useState(null)
  const [showSearch, setShowSearch] = useState(false)      // ✅ new
  const [searchQuery, setSearchQuery] = useState("")       // ✅ new
  const [searchResults, setSearchResults] = useState([])  // ✅ new
  const messagesEndRef = useRef(null)
  const fileInputRef = useRef(null)

  useEffect(() => {
    dispatch(fetchConversations())
  }, [dispatch])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({behavior: "smooth"})
  }, [messages])

  useEffect(() => {
    if (!searchQuery.trim()) return setSearchResults([])
    const timeout = setTimeout(() => {
      searchUsersApi(searchQuery)
        .then((res) => setSearchResults(res.data.data || []))
        .catch(() => {})
    }, 400)
    return () => clearTimeout(timeout)
  }, [searchQuery])

  const handleStartConversation = (selectedUser) => {
    dispatch(setActiveConversation({
      conversationId: null,
      partner: selectedUser
    }))
    setShowSearch(false)
    setSearchQuery("")
    setSearchResults([])
  }

  const handleSelectConversation = (conv) => {
    dispatch(setActiveConversation(conv))
    dispatch(fetchMessages(conv.partner._id))
  }

  const handleSend = async () => {
    if (!text.trim() && !imageFile) return
    const formData = new FormData()
    if (text.trim()) formData.append("message", text)
    if (imageFile) formData.append("image", imageFile)
    await dispatch(sendMessage({receiverId: activeConversation.partner._id, data: formData}))
    setText("")
    setImageFile(null)
    dispatch(fetchConversations())
  }

  const handleEdit = async (msg) => {
    if (!editText.trim()) return
    await dispatch(editMessage({messageId: msg._id, message: editText}))
    setEditingId(null)
    setEditText("")
  }

  const handleDelete = async (msgId) => {
    await dispatch(deleteMessage(msgId))
  }

  const isOnline = (userId) => onlineUsers.includes(userId?.toString())

  return (
    <div className="flex h-screen md:h-[calc(100vh-0px)] overflow-hidden">
     {/* Conversations List */}
      <div className={`${activeConversation ? "hidden md:flex" : "flex"} flex-col w-full md:w-80 border-r border-white/[0.06] flex-shrink-0`}>
         <div className="px-4 py-5 border-b border-white/[0.06] flex items-center justify-between">
  <h2 className="text-lg font-bold text-white">Messages</h2>
  <button
    onClick={() => setShowSearch(true)}
    className="text-white/40 hover:text-[#a855f7] transition-colors p-1"
  >
    <AiOutlineCompose className="text-xl" />
  </button>
</div>

{showSearch && (
  <div className="p-3 border-b border-white/[0.06] space-y-2">
    <div className="flex items-center gap-2">
      <input
        autoFocus
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search users..."
        className="flex-1 bg-white/5 text-white text-sm placeholder-white/30 rounded-xl px-3 py-2 border border-white/10 focus:outline-none focus:border-[#a855f7]/50"
      />
      <button
        onClick={() => { setShowSearch(false); setSearchQuery(""); setSearchResults([]) }}
        className="text-white/40 text-xs hover:text-white"
      >
        Cancel
      </button>
    </div>
    {searchResults.map((u) => (
      <button
        key={u._id}
        onClick={() => handleStartConversation(u)}
        className="w-full flex items-center gap-3 px-2 py-2 rounded-xl hover:bg-white/5 transition-colors"
      >
        <img
          src={u.profileImage || `https://ui-avatars.com/api/?name=${u.name}&background=6366f1&color=fff`}
          alt={u.name}
          className="w-9 h-9 rounded-full object-cover"
        />
        <div className="text-left">
          <p className="text-sm font-semibold text-white">{u.name}</p>
          <p className="text-xs text-white/40">@{u.userName}</p>
        </div>
      </button>
    ))}
    {searchQuery && searchResults.length === 0 && (
      <p className="text-xs text-white/30 text-center py-2">No users found</p>
    )}
  </div>
)}
        <div className="flex-1 overflow-y-auto">
         {conversations.length === 0 ? (
            <p className="text-center text-white/30 text-sm py-12">No conversations yet</p>
          ) : (
            conversations.map((conv) => (
              <button
                key={conv.conversationId}
                onClick={() => handleSelectConversation(conv)}
                className={`w-full flex items-center gap-3 px-4 py-4 hover:bg-white/5 transition-colors ${
                  activeConversation?.conversationId === conv.conversationId ? "bg-white/5" : ""
                }`}
              >
                <div className="relative flex-shrink-0">
                  <img
                    src={conv.partner?.profileImage || `https://ui-avatars.com/api/?name=${conv.partner?.name}&background=6366f1&color=fff`}
                    alt={conv.partner?.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  {isOnline(conv.partner?._id) && (
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full ring-2 ring-[#0a0a0a]" />
                  )}
                </div>
                <div className="flex-1 min-w-0 text-left">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-white truncate">{conv.partner?.name}</p>
                    {conv.unreadCount > 0 && (
                      <span className="bg-[#a855f7] text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0">
                        {conv.unreadCount}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-white/40 truncate">@{conv.partner?.userName}</p>
                </div>
              </button>
            ))
          )}
        </div>
      </div>
 
      {/* Chat Panel */}
      {activeConversation ? (
        <div className="flex flex-col flex-1 min-w-0">
          {/* Chat Header */}
          <div className="flex items-center gap-3 px-4 py-4 border-b border-white/[0.06]">
            <button
              className="md:hidden text-white/60 mr-1"
              onClick={() => dispatch(setActiveConversation(null))}
            >
              ←
            </button>
            <div className="relative">
              <img
                src={activeConversation.partner?.profileImage || `https://ui-avatars.com/api/?name=${activeConversation.partner?.name}&background=6366f1&color=fff`}
                alt={activeConversation.partner?.name}
                className="w-10 h-10 rounded-full object-cover"
              />
              {isOnline(activeConversation.partner?._id) && (
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-400 rounded-full ring-2 ring-[#0a0a0a]" />
              )}
            </div>
            <div>
              <p className="font-semibold text-white">{activeConversation.partner?.name}</p>
              <p className="text-xs text-white/40">
                {isOnline(activeConversation.partner?._id) ? "Online" : "Offline"}
              </p>
            </div>
          </div>
 
          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <div className="w-6 h-6 border-2 border-[#a855f7] border-t-transparent rounded-full animate-spin" />
              </div>
            ) : messages.map((msg) => {
              const isMine = msg.sender === user._id || msg.sender?._id === user._id
              return (
                <div key={msg._id} className={`flex ${isMine ? "justify-end" : "justify-start"} group`}>
                  <div className={`max-w-xs lg:max-w-md ${isMine ? "items-end" : "items-start"} flex flex-col gap-1`}>
                    {editingId === msg._id ? (
                      <div className="flex gap-2">
                        <input
                          value={editText}
                          onChange={(e) => setEditText(e.target.value)}
                          onKeyDown={(e) => { if (e.key === "Enter") handleEdit(msg) }}
                          className="bg-white/10 text-white text-sm rounded-xl px-3 py-2 border border-white/20 focus:outline-none focus:border-[#a855f7]/50 w-48"
                          autoFocus
                        />
                        <button onClick={() => handleEdit(msg)} className="text-[#a855f7] text-xs font-semibold">Save</button>
                        <button onClick={() => setEditingId(null)} className="text-white/40 text-xs">Cancel</button>
                      </div>
                    ) : (
                      <div className={`rounded-2xl px-4 py-2.5 ${isMine ? "bg-[#a855f7] text-white rounded-br-sm" : "bg-white/[0.07] text-white rounded-bl-sm"}`}>
                        {msg.image && <img src={msg.image} alt="img" className="max-w-[200px] rounded-xl mb-2" />}
                        {msg.message && <p className="text-sm">{msg.message}</p>}
                        {msg.isEdited && <p className="text-[10px] opacity-60 mt-0.5">edited</p>}
                      </div>
                    )}
 
                    {isMine && (
                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        {msg.message && (
                          <button
                            onClick={() => { setEditingId(msg._id); setEditText(msg.message) }}
                            className="text-white/40 hover:text-white transition-colors"
                          >
                            <AiOutlineEdit className="text-sm" />
                          </button>
                        )}
                        <button onClick={() => handleDelete(msg._id)} className="text-white/40 hover:text-red-400 transition-colors">
                          <AiOutlineDelete className="text-sm" />
                        </button>
                        {msg.isRead && <IoCheckmarkDoneOutline className="text-xs text-[#a855f7]" />}
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
            <div ref={messagesEndRef} />
          </div>
 
          {/* Input */}
          <div className="px-4 py-4 border-t border-white/[0.06]">
            {imageFile && (
              <div className="mb-2 flex items-center gap-2">
                <img src={URL.createObjectURL(imageFile)} alt="preview" className="w-12 h-12 rounded-lg object-cover" />
                <button onClick={() => setImageFile(null)} className="text-white/40 text-xs">Remove</button>
              </div>
            )}
            <div className="flex items-center gap-2">
              <button onClick={() => fileInputRef.current?.click()} className="text-white/40 hover:text-white transition-colors p-2">
                <AiOutlinePicture className="text-xl" />
              </button>
              <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => setImageFile(e.target.files[0])} />
              <input
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend() } }}
                placeholder="Message..."
                className="flex-1 bg-white/5 text-white placeholder-white/30 rounded-xl px-4 py-3 border border-white/10 focus:outline-none focus:border-[#a855f7]/50 transition-colors text-sm"
              />
              <button
                onClick={handleSend}
                disabled={!text.trim() && !imageFile}
                className="bg-[#a855f7] hover:bg-[#9333ea] disabled:opacity-40 text-white rounded-xl p-3 transition-colors"
              >
                <AiOutlineSend className="text-lg" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="hidden md:flex flex-1 items-center justify-center text-white/20">
          <div className="text-center">
            <p className="text-xl mb-2">Select a conversation</p>
            <p className="text-sm">Choose from your existing conversations or start a new one</p>
          </div>
        </div>
      )}
    </div>
  )
}

export default Messages