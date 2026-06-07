import {NavLink, useNavigate} from "react-router-dom"
import {useDispatch, useSelector} from "react-redux"
import {signOut} from "../../store/slices/authSlice.js"
import {AiFillHome, AiOutlineHome, AiOutlineSearch, AiFillBell, AiOutlineBell, AiOutlineMessage, AiFillMessage, AiOutlinePlusCircle, AiOutlineUser, AiFillSetting, AiOutlineBackward} from "react-icons/ai"
import {MdOutlineVideoLibrary, MdVideoLibrary} from "react-icons/md"
import {BiLogOut} from "react-icons/bi"

function Sidebar() {

  const {user} = useSelector((s) => s.auth)
  const {unreadCount} = useSelector((s) => s.notifications)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleSignOut = async() => {
    await dispatch(signOut())
    navigate("/signin")
  }

  const links = [
    {to: "/", icon: <AiOutlineHome/>, activeIcon: <AiFillHome/>, label: "Home"},
    {to: "/explore", icon: <AiOutlineSearch/>, activeIcon: <AiOutlineSearch/>, label: "Explore"},
    {to: "/loops", icon: <MdOutlineVideoLibrary/>, activeIcon: <MdVideoLibrary/>, label: "Loops"},
    {to: "/messages", icon: <AiOutlineMessage/>, activeIcon: <AiFillMessage/>, label: "Messages"},
    {to: "/notifications", icon: <AiOutlineBell/>, activeIcon: <AiFillBell/>, label: "Notifications", badge: unreadCount > 0 ? unreadCount : null},
    {to: "/create", icon: <AiOutlinePlusCircle/>, activeIcon: <AiOutlinePlusCircle/>, label: "Create"},
    {to: `/profile/${user?.userName}`, icon: <AiOutlineUser/>, activeIcon: <AiOutlineUser/>, label: "Profile"},
  ]

  return (
    <>
    {/* desktop sidebar */}
    <aside className="hidden md:flex flex-col fixed left-0 top-0 h-full w-64 bg-[#0a0a0a] border-r border-white/5 z-40 py-8 px-4">
    <div className="mb-10 px-3"> 
      <h1 className="text-2xl font-black tracking-tight text-white font-['Clash_Display',sans-serif]">loop<span className="text-[#a855f7]">.</span></h1>
    </div>
    <nav className="flex-1 space-y-1">
      {links.map(({to, icon, activeIcon, label, badge}) => (
        <NavLink
        key={to}
        to={to}
        className={({isActive}) => `flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group relative
                ${isActive
                  ? "bg-white/10 text-white font-semibold"
                  : "text-white/50 hover:text-white hover:bg-white/5"
                }`}
        >
          {({isActive}) => (
            <>
            <span className="text-xl">
              {isActive ? activeIcon : icon}
            </span>
            <span className="text-sm">
              {label}
            </span>
            {badge && (
              <span className="ml-auto bg-[#a855f7] text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {badge > 9 ? "9+" : badge}
              </span>
            )}
            </>
          )}
        </NavLink>
      ))}
    </nav>
    <div className="mt-auto space-y-2">
      <div className="flex items-center gap-3 px-3 py-3 rounded-xl">
        <img src={user?.profileImage || `https://ui-avatars.com/api/?name=${user?.name}&background=a855f7&color=fff`} alt={user?.userName} className="w-8 h-8 rounded-full object-cover ring-2 ring-white/10"/>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-white truncate">
            {user?.name}
          </p>
        </div>
      </div>
      <button onClick={handleSignOut} className="flex items-center gap-3 px-3 py-3 rounded-xl w-full text-white/50 hover:text-red-400 hover:bg-red-400/10 transition-all duration-200">
      <BiLogOut className="text-xl"/>
      <span className="text-sm">Sign Out</span>
      </button>
    </div>
    </aside>

    {/* mobile bottom nav */}
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-[#0a0a0a]/95 backdrop-blur border-t border-white/5 z-40 flex items-center justify-around px-2 py-3">
    {links.slice(0, 7).map(({to, icon, activeIcon, badge}) => (
      <NavLink 
      key={to}
      to={to}
      className={({ isActive }) =>
              `relative flex items-center justify-center w-10 h-10 rounded-xl transition-all ${isActive ? "text-white" : "text-white/40"}`
            }
      >
        {({isActive}) => (
          <>
          <span className="text-2xl">
            {isActive ? activeIcon : icon}
          </span>
          {badge && (
            <span className="absolute top-0 right-0 bg-[#a855f7] text-white text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
              {badge > 9 ? "9+" : badge}
            </span>
          )}
          </>
        )}
      </NavLink>
    ))}
    </nav>
    </>
  )
}

export default Sidebar
