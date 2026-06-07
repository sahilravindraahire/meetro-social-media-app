import {BrowserRouter, Route, Routes, Navigate} from "react-router-dom"
import {Provider} from "react-redux"
import {store} from "./store/store.js"
import {useEffect} from "react"
import {useDispatch, useSelector} from "react-redux"
import {fetchCurrentUser} from "./store/slices/authSlice.js"
import Layout from "./components/layout/Layout.jsx"
import ProtectedRoute from "./components/common/ProtectedRoute.jsx"
import {SignIn, SignUp} from "./pages/auth/Auth.jsx"
import ForgetPassword from "./pages/forgetPassword/ForgetPassword.jsx"
import Home from "./pages/home/Home.jsx"
import Profile from "./pages/profile/Profile.jsx"
import Messages from "./pages/messages/Messages.jsx"
import Notifications from "./pages/notifications/Notifications.jsx"
import Explore from "./pages/explore/Explore.jsx"
import Create from "./pages/create/Create.jsx"
import Loops from "./pages/loops/Loops.jsx"
import Seetings from "./pages/settings/Settings.jsx"
import Settings from "./pages/settings/Settings.jsx"
import {connectSocket, disconnectSocket} from "./socket/socket.js"
import {setOnlineUsers} from "./store/slices/messageSlice.js"

function AppInner() {
  const dispatch = useDispatch()
  const {initialized} = useSelector((state) => state.auth)
  const {user} = useSelector((state) => state.auth)
  useEffect(() => {
    if (!user) return

    const socket = connectSocket(user._id)

    socket.on("getOnlineUsers", (users) => {
        dispatch(setOnlineUsers(users))
    })

    return () => disconnectSocket()
}, [user])

  useEffect(() => {
    dispatch(fetchCurrentUser())
  }, [dispatch])

  if(!initialized){
    return(
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <h1 className="text-3xl font-black text-white tracking-tight">Loop<span className="text-[#a855f7]">.</span></h1>
          <div className="w-6 h-6 border-2 border-[#a855f7] border-t-transparent rounded-full animate-spin"/>
        </div>
      </div>
    )
  }

  return (
    <Routes>
      <Route path="/signin" element={<SignIn/>}/>
      <Route path="/signup" element={<SignUp/>}/>
      <Route path="/forget-password" element={<ForgetPassword/>}/>

      <Route path="/" element={
        <ProtectedRoute>
          <Layout><Home/></Layout>
        </ProtectedRoute>
      }/>
      <Route path="/explore" element={
        <ProtectedRoute>
          <Layout><Explore/></Layout>
        </ProtectedRoute>
      }/>
      <Route path="/loops" element={
        <ProtectedRoute>
          <Layout><Loops/></Layout>
        </ProtectedRoute>
      }/>
      <Route path="/messages" element={
        <ProtectedRoute>
          <Layout><Messages/></Layout>
        </ProtectedRoute>
      }/>
      <Route path="/notifications" element={
        <ProtectedRoute>
          <Layout><Notifications/></Layout>
        </ProtectedRoute>
      }/>
      <Route path="/create" element={
        <ProtectedRoute>
          <Layout><Create/></Layout>
        </ProtectedRoute>
      }/>
      <Route path="/profile/:userName" element={
        <ProtectedRoute>
          <Layout><Profile/></Layout>
        </ProtectedRoute>
      }/>
      <Route path="/settings" element={
        <ProtectedRoute>
          <Layout><Settings/></Layout>
        </ProtectedRoute>
      }/>
      <Route path="*" element={<Navigate to="/" replace/>}/>
    </Routes>
  )
}

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
      <AppInner/>
      </BrowserRouter>
    </Provider>
  )
}

export default App
