import { useState, useEffect } from "react"
import {
  Menu,
  Home,
  User,
  Layers,
  Briefcase,
  FolderGit2,
  Award,
  Mail,
} from "lucide-react"
import { Menubar, MenubarMenu, MenubarTrigger } from "./ui/menubar"
import { Link, useLocation } from "react-router-dom"

const navItems = [
  { href: "/", label: "Home", icon: Home },
  { href: "/about", label: "About", icon: User },
  { href: "/stack", label: "Stack", icon: Layers },
  { href: "/experience", label: "Experience", icon: Briefcase },
  { href: "/projects", label: "Projects", icon: FolderGit2 },
  { href: "/certificates", label: "Certificates", icon: Award },
  { href: "/contact", label: "Contact", icon: Mail },
]

/* Tab cepat di bottom bar mobile (sisanya via "More"). */
const QUICK_TABS = ["/", "/about", "/projects", "/contact"]
const bottomTabs = navItems.filter((item) => QUICK_TABS.includes(item.href))

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", handleScroll)
    handleScroll()
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "unset"
    return () => {
      document.body.style.overflow = "unset"
    }
  }, [isOpen])

  // Tutup sheet "More" saat pindah halaman.
  useEffect(() => {
    setIsOpen(false)
  }, [location.pathname])

  const closeMenu = () => setIsOpen(false)
  const primary = "var(--color-primary-light)"

  return (
    <>
      {/* ── Top bar (desktop only) ── */}
      <nav className="hidden lg:block fixed w-full top-0 z-50 transition-all duration-500">
        <div className="mx-auto px-[5%] sm:px-[5%] lg:px-[10%] pt-4">
          <div
            className={`flex items-center justify-between h-16 px-4 sm:px-6 rounded-full border transition-all duration-300 ${
              scrolled
                ? "bg-[#0a0a1a]/90 border-white/10 backdrop-blur-md shadow-lg"
                : "bg-[#0a0a1a] border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.1)]"
            }`}
          >
            <Link
              to="/"
              onClick={closeMenu}
              className="text-lg sm:text-xl font-display font-bold text-white tracking-tight cursor-target"
            >
              asutrisnadev
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:block">
              <Menubar className="ml-4 border-none bg-transparent shadow-none h-auto py-1">
                {navItems.map((item) => {
                  const isActive = location.pathname === item.href
                  return (
                    <MenubarMenu key={item.label}>
                      <MenubarTrigger
                        asChild
                        className={`cursor-pointer rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 cursor-target ${
                          isActive
                            ? "bg-white text-black shadow-[4px_4px_0_var(--color-shadow-primary)]"
                            : "text-[var(--color-text-secondary)] hover:text-white hover:bg-white/5"
                        }`}
                      >
                        <Link to={item.href}>{item.label}</Link>
                      </MenubarTrigger>
                    </MenubarMenu>
                  )
                })}
              </Menubar>
            </div>
          </div>
        </div>
      </nav>

      {/* ── Mobile: "More" bottom sheet ── */}
      <div
        className={`lg:hidden fixed inset-0 z-[55] ${isOpen ? "" : "pointer-events-none"}`}
        aria-hidden={!isOpen}
      >
        <div
          className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${
            isOpen ? "opacity-100" : "opacity-0"
          }`}
          onClick={closeMenu}
        />
        <div
          className={`absolute inset-x-0 bottom-0 rounded-t-3xl border-t border-white/10 bg-[#0a0a1a] px-4 pt-3 transition-transform duration-300 ease-out ${
            isOpen ? "translate-y-0" : "translate-y-full"
          }`}
          style={{ paddingBottom: "calc(env(safe-area-inset-bottom) + 96px)" }}
          role="dialog"
          aria-label="Navigation menu"
        >
          <div className="mx-auto mb-4 h-1 w-12 rounded-full bg-white/20" />
          <p className="mx-auto mb-4 max-w-lg px-1 text-xs font-semibold uppercase tracking-widest text-gray-500">
            Menu
          </p>
          <div className="mx-auto grid max-w-lg grid-cols-3 gap-3">
            {navItems.map((item) => {
              const isActive = location.pathname === item.href
              const Icon = item.icon
              return (
                <Link
                  key={item.label}
                  to={item.href}
                  onClick={closeMenu}
                  aria-current={isActive ? "page" : undefined}
                  className={`flex flex-col items-center gap-2 rounded-2xl border p-4 transition-colors ${
                    isActive
                      ? "border-white/20 bg-white/10 text-white"
                      : "border-white/10 bg-white/[0.03] text-gray-300 hover:bg-white/5"
                  }`}
                >
                  <Icon
                    className="w-6 h-6"
                    style={isActive ? { color: primary } : undefined}
                  />
                  <span className="text-xs font-medium text-center">
                    {item.label}
                  </span>
                </Link>
              )
            })}
          </div>
        </div>
      </div>

      {/* ── Mobile: Bottom tab bar (app-style) ── */}
      <nav
        className="lg:hidden fixed inset-x-0 z-[60] px-4"
        style={{ bottom: "calc(env(safe-area-inset-bottom) + 12px)" }}
        aria-label="Mobile navigation"
      >
        <div className="mx-auto flex max-w-md items-center gap-1 sm:gap-2 rounded-2xl border border-white/10 bg-[#0a0a1a]/95 backdrop-blur-xl px-2 py-2 sm:px-3 shadow-2xl">
          {bottomTabs.map((tab) => {
            const isActive = location.pathname === tab.href
            const Icon = tab.icon
            return (
              <Link
                key={tab.label}
                to={tab.href}
                onClick={closeMenu}
                aria-current={isActive ? "page" : undefined}
                className={`relative flex flex-1 min-w-0 flex-col items-center justify-center gap-1 rounded-xl py-1.5 sm:py-2 transition-colors ${
                  isActive ? "" : "text-gray-400 hover:text-white"
                }`}
                style={isActive ? { color: primary } : undefined}
              >
                {isActive && (
                  <span
                    className="absolute top-0 h-0.5 w-8 rounded-full"
                    style={{ backgroundColor: primary }}
                  />
                )}
                <Icon className="w-5 h-5 shrink-0" />
                <span className="w-full truncate text-center text-xs font-medium">
                  {tab.label}
                </span>
              </Link>
            )
          })}

          {/* More — FAB menonjol (seperti tombol aksi aplikasi) */}
          <button
            type="button"
            onClick={() => setIsOpen((v) => !v)}
            aria-label="More navigation"
            aria-expanded={isOpen}
            className="no-neo flex flex-1 min-w-0 flex-col items-center justify-center gap-1 rounded-xl py-1.5 sm:py-2 text-white shadow-lg transition-transform active:scale-95"
            style={{
              background:
                "linear-gradient(135deg, var(--color-primary-dark), var(--color-primary-light))",
              boxShadow: "0 8px 24px -8px var(--color-primary-light)",
            }}
          >
            <Menu className="w-5 h-5 shrink-0" />
            <span className="w-full truncate text-center text-xs font-semibold">
              More
            </span>
          </button>
        </div>
      </nav>
    </>
  )
}

export default Navbar
