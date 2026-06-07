import {useEffect} from 'react'
import {useDispatch, useSelector} from "react-redux"
import {fetchNotification, markNotificationRead} from "../../store/slices/notificationSlice.js"
import {Link, useFetcher} from "react-router-dom"
import { AiFillHeart, AiOutlineComment, AiOutlineUser } from "react-icons/ai"

const icons = {
  like: <AiFillHeart className="text-red-400" />,
  comment: <AiOutlineComment className="text-[#a855f7]" />,
  follow: <AiOutlineUser className="text-blue-400" />,
}

function Notifications() {

  const dispatch = useDispatch()
  const {notifications} = useSelector((state) => state.notifications)

  useEffect(() => {
    dispatch(fetchNotification())
  }, [dispatch])

  const handleMarkRead = (id) => dispatch(markNotificationRead([id]))

  const handleMarkAllRead = () => {
    const unread = notifications.filter((n) => !n.isRead).map((n) => n._id)
    if(unread.length) dispatch(markNotificationRead(unread))
  }

  return (
    <div className="max-w-xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-white">Notifications</h1>
        <button
          onClick={handleMarkAllRead}
          className="text-xs text-[#a855f7] hover:text-[#9333ea] font-semibold transition-colors"
        >
          Mark all read
        </button>
      </div>
 
      {notifications.length === 0 ? (
        <div className="text-center py-20 text-white/30">
          <p className="text-lg">No notifications yet</p>
        </div>
      ) : (
        <div className="space-y-2">
          {notifications.map((n) => (
            <div
              key={n._id}
              onClick={() => !n.isRead && handleMarkRead(n._id)}
              className={`flex items-start gap-3 p-4 rounded-xl border transition-all cursor-pointer ${
                n.isRead
                  ? "border-white/[0.06] bg-white/[0.02]"
                  : "border-[#a855f7]/20 bg-[#a855f7]/5"
              }`}
            >
              <div className="relative flex-shrink-0">
                <Link to={`/profile/${n.sender?.userName}`}>
                  <img
                    src={n.sender?.profileImage || `https://ui-avatars.com/api/?name=${n.sender?.name}&background=a855f7&color=fff`}
                    alt={n.sender?.name}
                    className="w-11 h-11 rounded-full object-cover"
                  />
                </Link>
                <span className="absolute -bottom-1 -right-1 bg-[#0a0a0a] rounded-full p-0.5 text-base">
                  {icons[n.type]}
                </span>
              </div>
 
              <div className="flex-1 min-w-0">
                <p className="text-sm text-white">
                  <Link to={`/profile/${n.sender?.userName}`} className="font-semibold hover:text-[#a855f7] transition-colors">
                    {n.sender?.name}
                  </Link>{" "}
                  {n.message}
                </p>
                <p className="text-xs text-white/30 mt-0.5">
                  {new Date(n.createdAt).toLocaleDateString("en", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                </p>
              </div>
 
              {!n.isRead && <div className="w-2 h-2 rounded-full bg-[#a855f7] flex-shrink-0 mt-2" />}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Notifications
