import { useEffect, useState } from "react"
import { useContactInfo } from "./hooks/useContactInfo"
import { contactService } from "../../services/contactService"
import AOS from "aos"
import "aos/dist/aos.css"
import {
  ExternalLink,
  Mail,
  Linkedin,
  Github,
  Instagram,
  Youtube,
  Send,
  Sparkles,
} from "lucide-react"
import { useLocation } from "react-router-dom"
import axios from "axios"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/useToast"
import ToastStack from "@/components/ToastStack"
import { FORM_SUBMIT_ENDPOINT } from "@/constants/urls"

const ICONS = {
  Linkedin,
  Instagram,
  Youtube,
  Github,
  GitHub: Github,
  Email: Mail,
  Gmail: Mail,
  ExternalLink,
}

const ContactPage = () => {
  const { socialLinks } = useContactInfo()
  const location = useLocation()
  const isSubpage = location.pathname === "/contact"

  const { toasts, pushToast, removeToast } = useToast()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const roles = [
    "Software Engineer",
    "Workshop Mentor",
    "UI/UX Designer",
    "Project Lead",
  ]

  useEffect(() => {
    AOS.init({ once: false })
  }, [])

  const getIconComponent = (iconName, platformName) => {
    const nameToUse = iconName || platformName || ""
    const matchedKey = Object.keys(ICONS).find(
      (key) => key.toLowerCase() === nameToUse.toLowerCase()
    )
    return matchedKey ? ICONS[matchedKey] : ExternalLink
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.name || !formData.email || !formData.message) {
      pushToast("error", "Please fill in all required fields!")
      return
    }

    setIsSubmitting(true)
    try {
      await contactService.sendMessage(formData)

      const formSubmitUrl = FORM_SUBMIT_ENDPOINT
      const submitData = {
        name: formData.name,
        email: formData.email,
        message: formData.message,
        _subject: formData.subject || "Pesan Baru dari Website Portfolio",
        _captcha: "false",
        _template: "table",
      }

      await axios.post(formSubmitUrl, submitData, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      })

      pushToast(
        "success",
        "Pesan Anda telah berhasil dikirim langsung ke email."
      )
      setFormData({ name: "", email: "", subject: "", message: "" })
    } catch (error) {
      console.error("Error sending message:", error)
      pushToast("error", "Failed to send message. Please try again later.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <ToastStack toasts={toasts} onDismiss={removeToast} />
      <div
        className={`px-[5%] sm:px-[5%] lg:px-[10%] overflow-hidden ${isSubpage ? "pb-12 md:pb-24" : "py-12 md:py-24"}`}
        id="Contact"
      >
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-12 lg:gap-16 items-start">
          {/* Left Column: Info & Socials */}
          <div
            className="flex flex-col gap-6 lg:sticky lg:top-32 w-full max-w-xl mx-auto lg:mx-0"
            data-aos="fade-right"
            data-aos-duration="1000"
          >
            <div>
              <div className="inline-block animate-float mb-6">
                <div className="relative group">
                  <div
                    className="absolute -inset-0.5 rounded-full blur opacity-30 group-hover:opacity-60 transition duration-1000"
                    style={{
                      background:
                        "linear-gradient(90deg, var(--color-primary-dark), var(--color-primary-light))",
                    }}
                  ></div>
                  <Badge
                    variant="default"
                    className="relative px-4 sm:px-5 py-2.5 sm:text-sm text-xs bg-white/5 border border-white/10"
                  >
                    <Sparkles
                      className="sm:w-4 sm:h-4 w-3.5 h-3.5"
                      style={{ color: "var(--color-primary-light)" }}
                    />
                    Currently active for opportunities
                  </Badge>
                </div>
              </div>

              <h2
                className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 font-display"
                style={{
                  color: "var(--color-text-primary)",
                  lineHeight: "1.1",
                }}
              >
                Lets build something <br className="hidden md:block" />
                <span style={{ color: "var(--color-primary-light)" }}>
                  great together.
                </span>
              </h2>

              <p
                className="text-base md:text-lg max-w-lg mb-8"
                style={{ color: "var(--color-text-muted)" }}
              >
                Im currently available for freelance projects, technical
                consulting, and full-time opportunities. Drop me a line if you
                are looking for a developer who productizes code.
              </p>

              <div className="flex flex-wrap gap-4 mb-10">
                {socialLinks.map((link, index) => {
                  const IconComponent = getIconComponent(
                    link.icon,
                    link.platform
                  )
                  return (
                    <Button
                      key={link.id || index}
                      asChild
                      variant="neutral"
                      size="icon"
                      className="rounded-xl cursor-target w-12 h-12 md:w-14 md:h-14"
                    >
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={link.display_name}
                      >
                        <IconComponent className="w-5 h-5" />
                      </a>
                    </Button>
                  )
                })}
              </div>

              <div className="w-full pt-8 border-t border-white/10">
                <h3
                  className="text-xs font-bold uppercase tracking-widest mb-4"
                  style={{ color: "var(--color-text-muted)" }}
                >
                  Available Roles for Collaboration
                </h3>
                <div className="flex flex-wrap gap-3">
                  {roles.map((role) => (
                    <Badge
                      key={role}
                      variant="default"
                      className="inline-flex text-xs sm:text-sm px-3 py-1.5 bg-[#0f172a] border border-white/10 text-white/80 rounded-md"
                    >
                      <span
                        className="w-1.5 h-1.5 rounded-full"
                        style={{
                          backgroundColor: "var(--color-primary-light)",
                        }}
                      />
                      {role}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Form */}
          <div
            data-aos="fade-left"
            data-aos-duration="1000"
            className="w-full max-w-xl mx-auto lg:mx-0 lg:max-w-none"
          >
            <div className="relative z-10 rounded-xl border-2 border-white/10 bg-white/5 p-6 sm:p-8 md:p-10 w-full shadow-[6px_6px_0_rgba(255,255,255,0.15)] transition-all duration-200">
              <div
                className="absolute -z-10 inset-0 opacity-10 rounded-xl pointer-events-none"
                style={{
                  background:
                    "linear-gradient(to bottom right, var(--color-primary-dark), var(--color-primary-light))",
                }}
              />

              <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                <div className="space-y-2">
                  <label
                    htmlFor="name"
                    className="text-xs font-bold uppercase tracking-wider"
                    style={{ color: "var(--color-text-secondary)" }}
                  >
                    Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="Your Name"
                    className="w-full px-4 py-3 bg-black/20 border border-white/10 rounded-lg outline-none focus:border-[var(--color-primary-light)] focus:ring-1 focus:ring-[var(--color-primary-light)] transition-all cursor-target"
                    style={{ color: "var(--color-text-primary)" }}
                  />
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="email"
                    className="text-xs font-bold uppercase tracking-wider"
                    style={{ color: "var(--color-text-secondary)" }}
                  >
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="you@email.com"
                    className="w-full px-4 py-3 bg-black/20 border border-white/10 rounded-lg outline-none focus:border-[var(--color-primary-light)] focus:ring-1 focus:ring-[var(--color-primary-light)] transition-all cursor-target"
                    style={{ color: "var(--color-text-primary)" }}
                  />
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="subject"
                    className="text-xs font-bold uppercase tracking-wider"
                    style={{ color: "var(--color-text-secondary)" }}
                  >
                    Subject
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="Project Title or Inquiry"
                    className="w-full px-4 py-3 bg-black/20 border border-white/10 rounded-lg outline-none focus:border-[var(--color-primary-light)] focus:ring-1 focus:ring-[var(--color-primary-light)] transition-all cursor-target"
                    style={{ color: "var(--color-text-primary)" }}
                  />
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="message"
                    className="text-xs font-bold uppercase tracking-wider"
                    style={{ color: "var(--color-text-secondary)" }}
                  >
                    Message <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows="5"
                    placeholder="Tell me about your project, needs, or timeline..."
                    className="w-full px-4 py-3 bg-black/20 border border-white/10 rounded-lg outline-none focus:border-[var(--color-primary-light)] focus:ring-1 focus:ring-[var(--color-primary-light)] transition-all resize-none cursor-target"
                    style={{ color: "var(--color-text-primary)" }}
                  ></textarea>
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  variant="neutral"
                  className="w-full px-8 h-12 flex items-center justify-center gap-2 font-bold cursor-target"
                >
                  {isSubmitting ? (
                    <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <>
                      Send via Email <Send className="w-4 h-4" />
                    </>
                  )}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default ContactPage
