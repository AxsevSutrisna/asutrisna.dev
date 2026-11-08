import { Link } from "react-router-dom"
import { LayoutDashboard, LogOut, ChevronLeft } from "lucide-react"

/**
 * Sidebar dashboard admin.
 *
 * Dirender dua kali oleh Dashboard.jsx:
 *  - Desktop  : bisa collapse (rail ikon + tooltip) via `onToggleCollapsed`.
 *  - Mobile   : selalu expanded (drawer), tanpa tombol toggle.
 *
 * Semua warna memakai CSS variable tema (kontrak theme) agar ikut berganti
 * saat tema diubah di Theme Manager.
 */
export default function Sidebar({
  navItems = [],
  activePath = "",
  collapsed = false,
  onToggleCollapsed,
  onNavigate,
  onLogout,
}) {
  const showToggle = typeof onToggleCollapsed === "function"

  const activeItemStyle = {
    background:
      "linear-gradient(90deg, color-mix(in srgb, var(--color-primary-dark) 18%, transparent), color-mix(in srgb, var(--color-primary-light) 14%, transparent))",
    borderColor: "color-mix(in srgb, var(--color-primary-light) 30%, transparent)",
    color: "var(--color-primary-light)",
    boxShadow:
      "0 0 15px 0 color-mix(in srgb, var(--color-primary-dark) 20%, transparent)",
  }

  const Tooltip = ({ label }) => (
    <span
      className="pointer-events-none absolute left-full ml-3 z-50 whitespace-nowrap rounded-lg border border-white/10 px-2.5 py-1.5 text-xs font-medium text-white opacity-0 -translate-x-1 shadow-xl transition-all duration-150 group-hover:opacity-100 group-hover:translate-x-0"
      style={{ backgroundColor: "var(--color-backdrop-base)" }}
      role="tooltip"
    >
      {label}
    </span>
  )

  return (
    <div className="relative flex h-full flex-col">
      <div
        className={`flex h-full flex-col gap-5 ${
          collapsed ? "px-2.5 py-5" : "p-5"
        }`}
      >
        {/* Header: logo + tombol collapse/expand */}
        <div
          className={`flex shrink-0 gap-3 ${
            collapsed ? "flex-col items-center" : "items-center px-1"
          }`}
        >
          {/* Logo */}
          <div
            className={`flex items-center gap-3 ${
              collapsed ? "" : "min-w-0 flex-1"
            }`}
          >
            <div className="relative shrink-0">
              <div
                className="absolute -inset-0.5 rounded-xl opacity-50 blur"
                style={{
                  background:
                    "linear-gradient(90deg, var(--color-primary-dark), var(--color-primary-light))",
                }}
              />
              <div
                className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-white/15"
                style={{ backgroundColor: "var(--color-backdrop-base)" }}
              >
                <LayoutDashboard
                  className="h-4 w-4"
                  style={{ color: "var(--color-primary-light)" }}
                />
              </div>
            </div>
            {!collapsed && (
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-white">
                  Dashboard
                </p>
                <p className="truncate text-xs text-gray-500">Admin Panel</p>
              </div>
            )}
          </div>

          {/* Toggle — expanded: di kanan logo (‹); collapsed: di bawah logo (›) */}
          {showToggle && (
            <button
              type="button"
              onClick={onToggleCollapsed}
              aria-label={collapsed ? "Perluas sidebar" : "Ciutkan sidebar"}
              aria-expanded={!collapsed}
              title={collapsed ? "Perluas menu" : "Ciutkan menu"}
              className="cursor-target group/toggle relative flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-white/10 bg-white/5 text-gray-300 shadow-sm outline-none transition-all duration-200 hover:scale-105 hover:border-white/20 hover:text-white focus-visible:ring-2 focus-visible:ring-[var(--color-primary-light)]"
            >
              {/* Isian ber-aksen tema saat hover */}
              <span
                className="absolute inset-0 opacity-0 transition-opacity duration-200 group-hover/toggle:opacity-100"
                style={{
                  background:
                    "linear-gradient(135deg, var(--color-primary-dark), var(--color-primary-light))",
                }}
              />
              <ChevronLeft
                className={`relative h-4 w-4 transition-transform duration-300 ${
                  collapsed ? "rotate-180" : ""
                }`}
              />
            </button>
          )}
        </div>

        {/* Badge status (expanded only) */}
        {!collapsed && (
          <div
            className="flex shrink-0 items-center gap-2 rounded-full border px-3 py-2"
            style={{
              backgroundColor:
                "color-mix(in srgb, var(--color-primary-dark) 10%, transparent)",
              borderColor:
                "color-mix(in srgb, var(--color-primary-dark) 20%, transparent)",
            }}
          >
            <span
              className="h-1.5 w-1.5 animate-pulse rounded-full"
              style={{ backgroundColor: "var(--color-primary-light)" }}
            />
            <span
              className="truncate text-xs font-medium"
              style={{ color: "var(--color-primary-light)" }}
            >
              Portfolio Manager
            </span>
          </div>
        )}

        {/* Navigasi */}
        <nav className="scrollbar-hide flex min-h-0 flex-1 flex-col gap-1 overflow-y-auto">
          {collapsed ? (
            <div className="mx-auto mb-1 h-px w-8 shrink-0 bg-white/10" />
          ) : (
            <p className="mb-1 shrink-0 px-3 text-[10px] uppercase tracking-widest text-gray-600">
              Menu
            </p>
          )}

          {navItems.map(({ to, label, icon: Icon }) => {
            const active = activePath.includes(to)
            return (
              <Link
                key={to}
                to={to}
                onClick={onNavigate}
                aria-current={active ? "page" : undefined}
                className={`group relative flex shrink-0 items-center rounded-xl border text-sm font-medium transition-all duration-200 cursor-target ${
                  collapsed ? "justify-center px-0 py-2.5" : "gap-3 px-3 py-2.5"
                } ${
                  active
                    ? "border-transparent"
                    : "border-transparent text-[color:var(--color-text-muted)] hover:bg-white/5 hover:text-white"
                }`}
                style={active ? activeItemStyle : undefined}
              >
                {/* Aksen aktif di tepi kiri */}
                {active && (
                  <span
                    className="absolute left-0 top-1/2 h-5 w-1 -translate-y-1/2 rounded-r-full"
                    style={{
                      backgroundColor: "var(--color-primary-light)",
                      boxShadow: "0 0 8px var(--color-primary-light)",
                    }}
                  />
                )}
                <Icon
                  className="h-4 w-4 shrink-0 transition-transform group-hover:scale-110"
                  style={active ? { color: "var(--color-primary-light)" } : undefined}
                />
                {!collapsed && <span className="truncate">{label}</span>}
                {!collapsed && active && (
                  <span
                    className="ml-auto h-1.5 w-1.5 rounded-full"
                    style={{
                      backgroundColor: "var(--color-primary-light)",
                      boxShadow: "0 0 8px var(--color-primary-light)",
                    }}
                  />
                )}
                {collapsed && <Tooltip label={label} />}
              </Link>
            )
          })}
        </nav>

        {/* Logout */}
        <div className="shrink-0 border-t border-white/8 pt-3">
          <button
            type="button"
            onClick={onLogout}
            className={`group relative flex w-full items-center rounded-xl border border-transparent text-sm text-gray-500 transition-all duration-200 hover:border-red-500/15 hover:bg-red-500/5 hover:text-red-400 cursor-target ${
              collapsed ? "justify-center px-0 py-2.5" : "gap-3 px-3 py-2.5"
            }`}
          >
            <LogOut className="h-4 w-4 shrink-0" />
            {!collapsed && "Sign Out"}
            {collapsed && <Tooltip label="Sign Out" />}
          </button>
        </div>
      </div>
    </div>
  )
}
