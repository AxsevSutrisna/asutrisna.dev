import { useState, useEffect } from "react"
import {
  Routes,
  Route,
  Navigate,
  useLocation,
  useNavigate,
} from "react-router-dom"
import { Helmet } from "react-helmet-async"
import { sessionRepository } from "@/entities/session/api/sessionRepository"
import Projects from "./dashboard/Projects"
import Certificates from "./dashboard/Certificates"
import About from "./dashboard/About"
import TechStacks from "./dashboard/TechStacks"
import WorkExperience from "./dashboard/WorkExperience"
import Educations from "./dashboard/Educations"
import HeroContent from "./dashboard/HeroContent"
import SocialLinks from "./dashboard/SocialLinks"
import ThemeManager from "./dashboard/ThemeManager"

import Achievements from "./dashboard/Achievements"
import Messages from "./dashboard/Messages"
import Sidebar from "./dashboard/components/Sidebar"
import {
  FolderGit2,
  Award,
  Menu,
  Sparkles,
  Boxes,
  Briefcase,
  Zap,
  Share2,
  Palette,
  GraduationCap,
  Trophy,
  MessageSquare,
} from "lucide-react"

const NAV_ITEMS = [
  { to: "projects", label: "Projects", icon: FolderGit2 },
  { to: "work-experience", label: "Work Experience", icon: Briefcase },
  { to: "educations", label: "Educations", icon: GraduationCap },
  // { to: 'courses', label: 'Courses', icon: BookOpen },
  { to: "hero-content", label: "Hero Content", icon: Zap },
  { to: "about", label: "About", icon: Sparkles },
  { to: "tech-stacks", label: "Tech Stack", icon: Boxes },
  { to: "social-links", label: "Social Media", icon: Share2 },
  { to: "certificates", label: "Certificates", icon: Award },
  { to: "achievements", label: "Achievements", icon: Trophy },
  { to: "messages", label: "Messages", icon: MessageSquare },
  { to: "theme-manager", label: "Theme Manager", icon: Palette },
]

export default function Dashboard() {
  const location = useLocation()
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [collapsed, setCollapsed] = useState(() => {
    try {
      return localStorage.getItem("dashboard_sidebar_collapsed") === "1"
    } catch {
      return false
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem(
        "dashboard_sidebar_collapsed",
        collapsed ? "1" : "0"
      )
    } catch {
      // abaikan error storage (private mode / blocked)
    }
  }, [collapsed])

  const handleLogout = async () => {
    await sessionRepository.signOut()
    navigate("/login")
  }

  return (
    <>
      <Helmet>
        <title>Dashboard Admin | asutrisnadev</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      {/* Kunci: TIDAK pakai overflow-hidden di sini supaya scrollbar main bisa diklik */}
      <div
        className="dashboard-admin flex text-white"
        style={{ height: "100dvh" }}
      >
        {/* Mobile overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-20 bg-black/60 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar - desktop: sticky, tinggi 100dvh, bisa collapse */}
        <aside
          className={`hidden lg:flex shrink-0 flex-col border-r border-white/8 bg-white/3 backdrop-blur-xl transition-[width] duration-300 ${
            collapsed ? "w-[76px]" : "w-60"
          }`}
          style={{ height: "100dvh", position: "sticky", top: 0 }}
        >
          <Sidebar
            navItems={NAV_ITEMS}
            activePath={location.pathname}
            collapsed={collapsed}
            onToggleCollapsed={() => setCollapsed((c) => !c)}
            onLogout={handleLogout}
          />
        </aside>

        {/* Sidebar - mobile drawer (selalu expanded) */}
        <aside
          className={`fixed inset-y-0 left-0 z-30 w-60 flex flex-col border-r border-white/8 bg-[#0a0a1a] backdrop-blur-xl transition-transform duration-300 lg:hidden ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <Sidebar
            navItems={NAV_ITEMS}
            activePath={location.pathname}
            collapsed={false}
            onNavigate={() => setSidebarOpen(false)}
            onLogout={handleLogout}
          />
        </aside>

        {/* Main area */}
        <div className="flex-1 flex flex-col min-w-0 min-h-0">
          {/* Mobile topbar */}
          <div className="lg:hidden flex items-center gap-3 px-4 py-3 border-b border-white/8 bg-white/3 backdrop-blur-xl shrink-0">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-lg border border-white/10 text-gray-400 hover:text-white transition-colors"
            >
              <Menu className="w-4 h-4" />
            </button>
            <span className="text-sm font-medium text-white">Dashboard</span>
          </div>

          {/* Hanya main yang overflow-y-auto — scrollbar bisa diklik normal */}
          <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
            <Routes>
              <Route index element={<Navigate to="projects" replace />} />
              <Route path="projects" element={<Projects />} />
              <Route path="work-experience" element={<WorkExperience />} />
              <Route path="educations" element={<Educations />} />
              {/* <Route path="courses" element={<Courses />} /> */}
              <Route path="hero-content" element={<HeroContent />} />
              <Route path="about" element={<About />} />
              <Route path="tech-stacks" element={<TechStacks />} />
              <Route path="social-links" element={<SocialLinks />} />
              <Route path="certificates" element={<Certificates />} />
              <Route path="achievements" element={<Achievements />} />
              <Route path="messages" element={<Messages />} />
              <Route path="theme-manager" element={<ThemeManager />} />
            </Routes>
          </main>
        </div>
      </div>
    </>
  )
}
