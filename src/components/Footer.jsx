import { Heart } from "lucide-react"

const Footer = () => {
  return (
    <footer className="w-full px-[5%] sm:px-[5%] lg:px-[10%] py-10">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex flex-col items-center md:items-start text-center md:text-left">
          <span
            className="text-sm font-bold mb-1"
            style={{ color: "var(--color-text-muted)" }}
          >
            © 2026
          </span>
          <h3 className="text-white font-bold text-lg">
            Asep Sutrisna Suhada Putra
            <span style={{ color: "var(--color-primary-light)" }}>.</span>
          </h3>
        </div>

        <div className="flex items-center gap-3">
          <div
            className="flex items-center justify-center w-10 h-10 rounded-full"
            style={{
              backgroundColor:
                "color-mix(in srgb, var(--color-primary-light) 15%, transparent)",
            }}
          >
            <Heart
              className="w-5 h-5"
              style={{
                color: "var(--color-primary-light)",
                fill: "var(--color-primary-light)",
              }}
            />
          </div>
          <span
            className="text-sm font-bold"
            style={{ color: "var(--color-text-muted)" }}
          >
            Made with passion in Indonesia
          </span>
        </div>
      </div>
    </footer>
  )
}

export default Footer
