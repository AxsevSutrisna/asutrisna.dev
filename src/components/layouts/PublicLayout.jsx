import { Outlet } from "react-router-dom"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"

export default function PublicLayout() {
  return (
    <div className="flex flex-col min-h-screen pb-24 lg:pb-0 overflow-x-clip">
      <Navbar />
      <main className="flex-1 pt-8 lg:pt-32 pb-20">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
