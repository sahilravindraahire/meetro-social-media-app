import Sidebar from "./Sidebar.jsx"
import {useSocket} from "../../hooks/useSocket.js"

function Layout({children}) {

  useSocket()

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <Sidebar/>
      <main className="md:ml-64 pb-20 md:pb-0 min-h-screen">{children}</main>
    </div>
  )
}

export default Layout
