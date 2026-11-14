import { useEffect, useRef } from "react"
import { HexColorPicker } from "react-colorful"
import { RotateCcw, Copy, Check, X, Pipette } from "lucide-react"

/* ── Util warna ── */
const hexToRgbObj = (hex) => {
  const m = /^#?([0-9a-f]{6})$/i.exec(String(hex || ""))
  if (!m) return { r: 0, g: 0, b: 0 }
  const int = parseInt(m[1], 16)
  return { r: (int >> 16) & 255, g: (int >> 8) & 255, b: int & 255 }
}
const clamp255 = (n) => Math.max(0, Math.min(255, Number.isFinite(n) ? n : 0))
const rgbToHex = ({ r, g, b }) => {
  const h = (n) => clamp255(n | 0).toString(16).padStart(2, "0")
  return `#${h(r)}${h(g)}${h(b)}`.toUpperCase()
}

/** Swatch cepat — warna umum untuk pemilihan instan. */
const QUICK_SWATCHES = [
  "#6366f1", "#a855f7", "#8b5cf6", "#ec4899", "#f43f5e",
  "#ef4444", "#f59e0b", "#10b981", "#14b8a6", "#06b6d4",
  "#3b82f6", "#1e1b4b", "#030014", "#64748b", "#ffffff",
]

/**
 * Satu baris editor warna (swatch + hex input + copy + reset) dan modal
 * color-picker-nya. Komponen STABIL (modul-scope) — dulu didefinisikan inline
 * di ThemeManager sehingga ter-remount tiap render & input kehilangan fokus.
 */
export default function ColorPickerField({
  label,
  value,
  fieldKey,
  defaultValue,
  hint,
  isInvalid,
  isCopied,
  isPickerOpen,
  onColorChange,
  onCopy,
  onResetField,
  onOpenPicker,
  onClosePicker,
}) {
  const modalRef = useRef(null)
  const isDefault = value === defaultValue
  const rgb = hexToRgbObj(value)
  const hasEyeDropper =
    typeof window !== "undefined" && "EyeDropper" in window

  // Tutup picker dengan tombol Escape.
  useEffect(() => {
    if (!isPickerOpen) return undefined
    const onKey = (e) => {
      if (e.key === "Escape") onClosePicker()
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [isPickerOpen, onClosePicker])

  const setChannel = (channel) => (e) => {
    const next = { ...rgb, [channel]: clamp255(parseInt(e.target.value, 10)) }
    onColorChange(fieldKey, rgbToHex(next))
  }

  const pickFromScreen = async () => {
    try {
      const eye = new window.EyeDropper()
      const result = await eye.open()
      if (result?.sRGBHex) onColorChange(fieldKey, result.sRGBHex.toUpperCase())
    } catch {
      // dibatalkan pengguna — abaikan
    }
  }

  return (
    <>
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-white text-sm font-medium">{label}</label>
          {isDefault && <span className="text-xs text-gray-500">(default)</span>}
        </div>

        <div className="flex gap-2 items-center">
          {/* Swatch besar untuk membuka picker */}
          <button
            type="button"
            onClick={() => onOpenPicker(fieldKey)}
            className="cursor-target w-14 h-10 rounded-lg border-2 border-white/20 hover:border-indigo-400/50 transition-all hover:scale-105 shrink-0 shadow-lg hover:shadow-indigo-500/20 no-neo"
            style={{ backgroundColor: value }}
            title="Click to open color picker"
            aria-label={`Open color picker for ${label}`}
          />

          {/* Hex input */}
          <input
            type="text"
            value={value}
            onChange={(e) => onColorChange(fieldKey, e.target.value.toUpperCase())}
            placeholder="#000000"
            className={`cursor-target flex-1 px-3 py-2 bg-white/5 border rounded-lg text-white text-sm placeholder-gray-500 focus:outline-none transition font-mono ${
              isInvalid
                ? "border-red-500/50 focus:border-red-500"
                : "border-white/10 focus:border-indigo-500"
            }`}
          />

          {/* Copy */}
          <button
            type="button"
            onClick={() => onCopy(value, fieldKey)}
            className="cursor-target p-2 text-gray-400 hover:text-white transition shrink-0 no-neo"
            title="Copy color code"
            aria-label="Copy color code"
          >
            {isCopied ? (
              <Check className="w-4 h-4 text-green-400" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
          </button>

          {/* Reset */}
          <button
            type="button"
            onClick={() => onResetField(fieldKey)}
            className="cursor-target p-2 text-gray-400 hover:text-white transition shrink-0 no-neo"
            title="Reset to default"
            aria-label="Reset to default"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        {isInvalid && (
          <p className="text-xs text-red-400">
            Use valid hex color format, example: #A1B2C3
          </p>
        )}
        {hint && <p className="text-xs text-gray-500">{hint}</p>}
      </div>

      {/* Modal color picker */}
      {isPickerOpen && (
        <div
          ref={modalRef}
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          onClick={(e) => {
            if (e.target === modalRef.current) onClosePicker()
          }}
        >
          <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-[#0a0a1a] p-5 shadow-2xl">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-white font-semibold">{label}</h3>
              <div className="flex items-center gap-1">
                {hasEyeDropper && (
                  <button
                    type="button"
                    onClick={pickFromScreen}
                    title="Pick a color from your screen"
                    aria-label="Pick color from screen"
                    className="cursor-target p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition no-neo"
                  >
                    <Pipette className="w-4 h-4" />
                  </button>
                )}
                <button
                  type="button"
                  onClick={onClosePicker}
                  aria-label="Close color picker"
                  className="cursor-target p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition no-neo"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="space-y-4">
              {/* Area saturasi + hue */}
              <HexColorPicker
                color={value}
                onChange={(color) => onColorChange(fieldKey, color)}
                style={{ width: "100%", height: "180px" }}
              />

              {/* HEX + preview */}
              <div className="flex gap-3">
                <div className="flex-1">
                  <label className="text-gray-400 text-[11px] font-medium block mb-1.5 uppercase tracking-wider">
                    HEX
                  </label>
                  <input
                    type="text"
                    value={value}
                    onChange={(e) =>
                      onColorChange(fieldKey, e.target.value.toUpperCase())
                    }
                    placeholder="#000000"
                    className="cursor-target w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white font-mono text-sm focus:outline-none focus:border-indigo-500 transition"
                  />
                </div>
                <div>
                  <label className="text-gray-400 text-[11px] font-medium block mb-1.5 uppercase tracking-wider">
                    Preview
                  </label>
                  <div
                    className="w-16 h-[38px] rounded-lg border border-white/10 shadow-lg"
                    style={{ backgroundColor: value }}
                  />
                </div>
              </div>

              {/* RGB editable */}
              <div>
                <label className="text-gray-400 text-[11px] font-medium block mb-1.5 uppercase tracking-wider">
                  RGB
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {["r", "g", "b"].map((ch) => (
                    <div key={ch} className="relative">
                      <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[10px] font-bold uppercase text-gray-500">
                        {ch}
                      </span>
                      <input
                        type="number"
                        min="0"
                        max="255"
                        value={rgb[ch]}
                        onChange={setChannel(ch)}
                        className="cursor-target w-full pl-6 pr-2 py-2 bg-white/5 border border-white/10 rounded-lg text-white font-mono text-sm focus:outline-none focus:border-indigo-500 transition"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Swatch cepat */}
              <div>
                <label className="text-gray-400 text-[11px] font-medium block mb-1.5 uppercase tracking-wider">
                  Quick Picks
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {QUICK_SWATCHES.map((c) => {
                    const active = value?.toLowerCase() === c.toLowerCase()
                    return (
                      <button
                        key={c}
                        type="button"
                        onClick={() => onColorChange(fieldKey, c.toUpperCase())}
                        title={c}
                        aria-label={`Use ${c}`}
                        className={`cursor-target h-7 w-7 rounded-md border transition-transform hover:scale-110 no-neo ${
                          active
                            ? "border-white ring-2 ring-indigo-500/50"
                            : "border-white/15"
                        }`}
                        style={{ backgroundColor: c }}
                      />
                    )
                  })}
                </div>
              </div>

              {/* Aksi */}
              <div className="flex gap-2 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => onResetField(fieldKey)}
                  className="cursor-target flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-sm rounded-lg border border-white/10 text-gray-300 hover:text-white hover:bg-white/5 transition-colors no-neo"
                >
                  <RotateCcw className="w-3.5 h-3.5" /> Reset
                </button>
                <button
                  type="button"
                  onClick={onClosePicker}
                  className="cursor-target flex-1 px-3 py-2 text-sm font-medium rounded-lg border border-indigo-500/40 bg-indigo-500/20 text-indigo-200 hover:bg-indigo-500/30 transition-colors no-neo"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
