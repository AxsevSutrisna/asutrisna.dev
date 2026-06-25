import React, { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "./ui/button";
import { Menubar, MenubarMenu, MenubarTrigger } from "./ui/menubar";
import { Link, useLocation } from "react-router-dom";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/stack", label: "Stack" },
  { href: "/experience", label: "Experience" },
  { href: "/projects", label: "Projects" },
  // { href: "/courses", label: "Courses" },
  { href: "/certificates", label: "Certificates" },
  { href: "/contact", label: "Contact" },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isOpen]);

  const closeMenu = () => {
    setIsOpen(false);
  };

  return (
    <nav
      className="fixed w-full top-0 z-50 transition-all duration-500"
    >
      <div className="mx-auto px-[5%] sm:px-[5%] lg:px-[10%] pt-4">
        <div className={`flex items-center justify-between h-16 px-4 sm:px-6 rounded-full border transition-all duration-300 ${scrolled || isOpen ? "bg-[#0a0a1a]/90 border-white/10 backdrop-blur-md shadow-lg" : "bg-[#0a0a1a] border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.1)]"}`}>
          <div className="flex-shrink-0">
            <Link
              to="/"
              onClick={closeMenu}
              className="text-lg sm:text-xl font-display font-bold text-white tracking-tight cursor-target"
            >
              asutrisnadev
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <Menubar className="ml-4 border-none bg-transparent shadow-none h-auto py-1">
              {navItems.map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <MenubarMenu key={item.label}>
                    <MenubarTrigger
                      asChild
                      className={`cursor-pointer rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 cursor-target ${isActive
                        ? "bg-white text-black shadow-[4px_4px_0_var(--color-shadow-primary)]"
                        : "text-[var(--color-text-secondary)] hover:text-white hover:bg-white/5"
                      }`}
                    >
                      <Link to={item.href}>
                        {item.label}
                      </Link>
                    </MenubarTrigger>
                  </MenubarMenu>
                );
              })}
            </Menubar>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button
              onClick={() => setIsOpen(!isOpen)}
              variant="ghost"
              size="icon"
              className={`relative transition-transform duration-300 ease-in-out transform rounded-lg border border-white/10 bg-transparent text-white shadow-[2px_2px_0_rgba(255,255,255,0.1)] cursor-target ${isOpen ? "rotate-90 scale-105" : "rotate-0 scale-100"}`}
            >
              {isOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden transition-all duration-300 ease-in-out ${isOpen
          ? "max-h-screen opacity-100"
          : "max-h-0 opacity-0 overflow-hidden"
        }`}
      >
        <div className="mx-[5%] mt-3 rounded-2xl border border-white/10 bg-[#0a0a1a] p-4 space-y-3 shadow-2xl">
          {navItems.map((item, index) => {
            const isActive = location.pathname === item.href;
            return (
              <Button
                key={item.label}
                asChild
                variant="ghost"
                className={`w-full justify-start rounded-xl px-4 py-4 text-base font-medium transition-all duration-300 ease border cursor-target ${isActive
                  ? "bg-white/10 text-white border-white/20 shadow-[4px_4px_0_var(--color-shadow-primary)]"
                  : "bg-transparent text-[var(--color-text-secondary)] border-white/10 shadow-[4px_4px_0_rgba(0,0,0,0.4)] hover:bg-white/5 hover:text-white"
                }`}
                style={{
                  transitionDelay: `${index * 40}ms`,
                  transform: isOpen ? "translateX(0)" : "translateX(30px)",
                  opacity: isOpen ? 1 : 0,
                }}
              >
                <Link to={item.href} onClick={closeMenu}>
                  {item.label}
                </Link>
              </Button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;