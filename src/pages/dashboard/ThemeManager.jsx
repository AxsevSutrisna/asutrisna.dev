import { useState, useEffect, useCallback } from "react"
import {
  fetchTheme,
  updateTheme,
  resetTheme,
} from "@/entities/theme/api/themeRepository"
import {
  THEME_COLOR_CATEGORIES,
  DEFAULT_THEME,
} from "@/entities/theme/model/constants"
import { RotateCcw } from "lucide-react"
import { useToast } from "@/hooks/useToast"
import { useConfirm } from "@/components/ui/useConfirm"
import ToastStack from "@/components/ToastStack"
import ThemePresetSection from "./components/ThemePresetSection"
import ColorPickerField from "./components/ColorPickerField"
import FloatingSaveButton from "./components/FloatingSaveButton"

export default function ThemeManager() {
  const [colors, setColors] = useState(DEFAULT_THEME)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [invalidFields, setInvalidFields] = useState({})
  const [copiedField, setCopiedField] = useState(null)
  const [pickerOpen, setPickerOpen] = useState(null) // Track which color picker is open
  const { toasts, pushToast, removeToast } = useToast()
  const confirm = useConfirm()

  useEffect(() => {
    fetchThemeData()
  }, [])

  const fetchThemeData = async () => {
    try {
      setLoading(true)
      const theme = await fetchTheme()
      setColors(theme)
    } catch (error) {
      console.error("Error fetching theme:", error)
    } finally {
      setLoading(false)
    }
  }

  const HEX_COLOR_REGEX = /^#[0-9A-Fa-f]{6}$/

  const normalizeHexColor = (value) => {
    if (value.startsWith("#") && value.length === 4) {
      return (
        "#" +
        value
          .slice(1)
          .split("")
          .map((char) => char + char)
          .join("")
      )
    }
    return value
  }

  const validateHexColor = (value) => {
    const normalized = normalizeHexColor(value)
    return HEX_COLOR_REGEX.test(normalized)
  }

  const handleColorChange = (key, value) => {
    const normalized = normalizeHexColor(value)
    setColors({ ...colors, [key]: normalized })

    if (value && !validateHexColor(value)) {
      setInvalidFields({ ...invalidFields, [key]: true })
    } else {
      setInvalidFields({ ...invalidFields, [key]: false })
    }
  }

  const handleResetField = (key) => {
    setColors({ ...colors, [key]: DEFAULT_THEME[key] })
    setInvalidFields({ ...invalidFields, [key]: false })
  }

  const handleCopyToClipboard = (value, key) => {
    navigator.clipboard.writeText(value)
    setCopiedField(key)
    setTimeout(() => setCopiedField(null), 2000)
  }

  const handleSave = async () => {
    if (Object.values(invalidFields).some(Boolean)) {
      pushToast("error", "Please fix invalid hex colors before saving")
      return
    }

    try {
      setSaving(true)
      await updateTheme(colors)
      pushToast("success", "Theme updated successfully!")
    } catch (error) {
      console.error("Error saving theme:", error)
      pushToast("error", error.message || "Failed to save theme")
    } finally {
      setSaving(false)
    }
  }

  const handlePresetApply = useCallback(
    (mappedColors) => {
      // Merge all preset-derived fields into the current colors state.
      // Fields not covered by the preset (e.g. text, border, state colors)
      // keep their existing values so the user doesn't lose manual tweaks.
      setColors((prev) => ({ ...prev, ...mappedColors }))
      // Clear any validation errors on the fields being updated
      setInvalidFields((prev) => {
        const next = { ...prev }
        Object.keys(mappedColors).forEach((k) => {
          next[k] = false
        })
        return next
      })
      pushToast("success", "✓ Preset applied — click Save to persist")
    },
    [pushToast]
  )

  const handleReset = async () => {
    const ok = await confirm({
      title: "Reset all colors?",
      message: "All colors will return to their default values.",
      confirmText: "Reset All",
    })
    if (!ok) return
    try {
      setSaving(true)
      await resetTheme()
      setColors(DEFAULT_THEME)
      setInvalidFields({})
      pushToast("success", "Theme reset successfully!")
    } catch (error) {
      console.error("Error resetting theme:", error)
      pushToast("error", error.message || "Failed to reset theme")
    } finally {
      setSaving(false)
    }
  }

  const buildBackdropPreview = () => {
    const backdropBase = colors.backdrop_base || DEFAULT_THEME.backdrop_base
    const backdropGlow = colors.backdrop_glow || DEFAULT_THEME.backdrop_glow
    const gridLine =
      colors.background_grid_line || DEFAULT_THEME.background_grid_line
    // background blobs are referenced directly in preview elements below

    return {
      background: `
 radial-gradient(circle at top, rgba(${hexToRgb(backdropGlow)}, 0.8) 0%, transparent 68%),
 linear-gradient(45deg, rgba(${hexToRgb(gridLine)}, 0.035) 1px, transparent 1px),
 linear-gradient(-45deg, rgba(${hexToRgb(gridLine)}, 0.035) 1px, transparent 1px),
 ${backdropBase}
 `.trim(),
      backgroundSize: "100% 100%, 28px 28px, 28px 28px, 100% 100%",
    }
  }

  const hexToRgb = (hex) => {
    const r = parseInt(hex.slice(1, 3), 16)
    const g = parseInt(hex.slice(3, 5), 16)
    const b = parseInt(hex.slice(5, 7), 16)
    return `${r}, ${g}, ${b}`
  }

  if (loading)
    return (
      <div className="text-gray-400 text-center py-8">Loading theme...</div>
    )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Theme Manager</h1>
          <p className="text-gray-400 text-sm mt-1">
            Customize your portfolio colors
          </p>
        </div>
        <button
          onClick={handleReset}
          className="relative group shrink-0 cursor-target no-neo"
        >
          {/* Meniru struktur AddNewButton (glow + body pill) agar selaras dengan
              tombol header modul lain, bernuansa merah karena aksi destruktif. */}
          <div
            className="absolute -inset-0.5 rounded-xl opacity-40 blur transition duration-300 group-hover:opacity-80"
            style={{ background: "linear-gradient(90deg, #b91c1c, #ef4444)" }}
          />
          <div
            className="relative flex items-center gap-2 px-4 py-2.5 rounded-xl border border-white/10 transition-colors"
            style={{ backgroundColor: "var(--color-backdrop-base)" }}
          >
            <RotateCcw className="w-4 h-4 text-red-400" />
            <span className="text-sm font-medium text-red-300">Reset All</span>
          </div>
        </button>
      </div>

      {/* ── Quick Palette Presets ── */}
      <div className="p-5 rounded-2xl border border-white/8 bg-white/[0.02]">
        <ThemePresetSection
          currentColors={colors}
          onPresetApply={handlePresetApply}
        />
      </div>

      {/* ── Divider ── */}
      <div className="flex items-center gap-3">
        <div className="flex-1 h-px bg-white/8" />
        <span className="text-xs text-gray-600 uppercase tracking-widest">
          Manual Editor
        </span>
        <div className="flex-1 h-px bg-white/8" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Color Categories */}
        <div className="lg:col-span-2 space-y-6">
          {Object.entries(THEME_COLOR_CATEGORIES).map(
            ([categoryKey, category]) => (
              <div
                key={categoryKey}
                className="space-y-4 p-4 border border-white/10 rounded-lg"
              >
                <div>
                  <h3 className="text-white font-semibold">{category.label}</h3>
                  <p className="text-gray-500 text-xs mt-1">{category.hint}</p>
                </div>

                <div className="space-y-3">
                  {category.fields.map((fieldKey) => (
                    <ColorPickerField
                      key={fieldKey}
                      label={fieldKey.replace(/_/g, " ").toUpperCase()}
                      value={colors[fieldKey] || DEFAULT_THEME[fieldKey]}
                      fieldKey={fieldKey}
                      defaultValue={DEFAULT_THEME[fieldKey]}
                      isInvalid={invalidFields[fieldKey]}
                      isCopied={copiedField === fieldKey}
                      isPickerOpen={pickerOpen === fieldKey}
                      onColorChange={handleColorChange}
                      onCopy={handleCopyToClipboard}
                      onResetField={handleResetField}
                      onOpenPicker={setPickerOpen}
                      onClosePicker={() => setPickerOpen(null)}
                    />
                  ))}
                </div>
              </div>
            )
          )}
        </div>

        {/* Preview */}
        <div className="lg:col-span-1 space-y-4">
          <div className="sticky top-6 space-y-4">
            {/* Main Preview */}
            <div className="p-4 border border-white/10 rounded-lg overflow-hidden">
              <p className="text-white text-sm font-medium mb-3">
                Backdrop Preview
              </p>
              <div
                className="w-full h-40 rounded-lg border border-white/10 relative overflow-hidden"
                style={buildBackdropPreview()}
              >
                {/* Animated blobs */}
                <div
                  className="absolute top-0 left-0 w-40 h-40 rounded-full blur-3xl opacity-40 animate-pulse"
                  style={{
                    backgroundColor:
                      colors.background_blob_one ||
                      DEFAULT_THEME.background_blob_one,
                  }}
                />
                <div
                  className="absolute bottom-0 right-0 w-48 h-48 rounded-full blur-3xl opacity-30 animate-pulse"
                  style={{
                    backgroundColor:
                      colors.background_blob_two ||
                      DEFAULT_THEME.background_blob_two,
                    animationDelay: "1s",
                  }}
                />

                {/* Content preview - Buttons */}
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 p-3">
                  {/* Primary Button */}
                  <button
                    disabled
                    className="px-4 py-1.5 rounded-lg font-medium transition text-white text-xs"
                    style={{
                      background: `linear-gradient(135deg, ${colors.button_primary_from || colors.primary_color_dark} 0%, ${colors.button_primary_to || colors.primary_color_light} 100%)`,
                    }}
                  >
                    Primary
                  </button>

                  {/* Text Examples */}
                  <div className="text-center text-xs space-y-0.5">
                    <p
                      style={{
                        color:
                          colors.text_primary || DEFAULT_THEME.text_primary,
                      }}
                    >
                      Primary Text
                    </p>
                    <p
                      style={{
                        color:
                          colors.text_secondary || DEFAULT_THEME.text_secondary,
                      }}
                    >
                      Secondary Text
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Button Styles Preview */}
            <div className="p-4 border border-white/10 rounded-lg space-y-3">
              <p className="text-white text-sm font-medium">Button Styles</p>

              {/* Primary Button */}
              <div className="space-y-1">
                <p className="text-xs text-gray-400">Primary Button</p>
                <button
                  disabled
                  className="w-full px-3 py-2 rounded-lg font-medium text-white text-xs transition"
                  style={{
                    background: `linear-gradient(135deg, ${colors.button_primary_from || colors.primary_color_dark}, ${colors.button_primary_to || colors.primary_color_light})`,
                  }}
                >
                  Click Me
                </button>
              </div>

              {/* Secondary Button */}
              <div className="space-y-1">
                <p className="text-xs text-gray-400">Secondary Button</p>
                <button
                  disabled
                  className="w-full px-3 py-2 rounded-lg font-medium text-white text-xs transition"
                  style={{
                    background: `linear-gradient(135deg, ${colors.button_secondary_from || colors.secondary_color_dark}, ${colors.secondary_color_light})`,
                  }}
                >
                  Secondary
                </button>
              </div>

              {/* Outline Button */}
              <div className="space-y-1">
                <p className="text-xs text-gray-400">Outline Button</p>
                <button
                  disabled
                  className="w-full px-3 py-2 rounded-lg font-medium text-xs transition border-2"
                  style={{
                    borderColor:
                      colors.button_outline_color || colors.primary_color_light,
                    color:
                      colors.button_outline_color || colors.primary_color_light,
                    backgroundColor: "transparent",
                  }}
                >
                  Outline
                </button>
              </div>
            </div>

            {/* Text Colors Preview */}
            <div className="p-4 border border-white/10 rounded-lg space-y-3">
              <p className="text-white text-sm font-medium">Text Colors</p>

              <div className="space-y-2 text-xs">
                <div
                  style={{
                    color: colors.text_primary || DEFAULT_THEME.text_primary,
                  }}
                >
                  <p>● Primary Text Color</p>
                </div>
                <div
                  style={{
                    color:
                      colors.text_secondary || DEFAULT_THEME.text_secondary,
                  }}
                >
                  <p>● Secondary Text Color</p>
                </div>
                <div
                  style={{
                    color: colors.text_muted || DEFAULT_THEME.text_muted,
                  }}
                >
                  <p>● Muted Text Color</p>
                </div>
              </div>
            </div>

            {/* Color Palette */}
            <div className="p-4 border border-white/10 rounded-lg space-y-3">
              <p className="text-white text-sm font-medium">Main Palette</p>

              <div className="grid grid-cols-4 gap-2">
                <div className="text-center space-y-1">
                  <div
                    className="w-full h-10 rounded-lg border border-white/10 shadow-sm"
                    style={{
                      backgroundColor:
                        colors.button_primary_from || colors.primary_color_dark,
                    }}
                    title="Primary Dark"
                  />
                  <p className="text-xs text-gray-400 truncate">Primary</p>
                </div>
                <div className="text-center space-y-1">
                  <div
                    className="w-full h-10 rounded-lg border border-white/10 shadow-sm"
                    style={{
                      backgroundColor:
                        colors.button_primary_to || colors.primary_color_light,
                    }}
                    title="Primary Light"
                  />
                  <p className="text-xs text-gray-400 truncate">Light</p>
                </div>
                <div className="text-center space-y-1">
                  <div
                    className="w-full h-10 rounded-lg border border-white/10 shadow-sm"
                    style={{
                      backgroundColor:
                        colors.backdrop_base || DEFAULT_THEME.backdrop_base,
                    }}
                    title="Base"
                  />
                  <p className="text-xs text-gray-400 truncate">Base</p>
                </div>
                <div className="text-center space-y-1">
                  <div
                    className="w-full h-10 rounded-lg border border-white/10 shadow-sm"
                    style={{
                      backgroundColor:
                        colors.backdrop_glow || DEFAULT_THEME.backdrop_glow,
                    }}
                    title="Glow"
                  />
                  <p className="text-xs text-gray-400 truncate">Glow</p>
                </div>
              </div>
            </div>

            {/* Card Preview */}
            <div className="p-4 border border-white/10 rounded-lg space-y-3">
              <p className="text-white text-sm font-medium">Card Preview</p>

              <div
                className="p-3 rounded-lg border-2 space-y-2"
                style={{
                  backgroundColor:
                    colors.card_bg_dark || DEFAULT_THEME.card_bg_dark,
                  borderColor: "rgba(255,255,255,0.12)",
                }}
              >
                <p
                  style={{
                    color: colors.text_primary || DEFAULT_THEME.text_primary,
                  }}
                  className="text-xs font-medium"
                >
                  Card Title
                </p>
                <p
                  style={{
                    color:
                      colors.text_secondary || DEFAULT_THEME.text_secondary,
                  }}
                  className="text-xs"
                >
                  Card content with custom colors
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <FloatingSaveButton
        onClick={handleSave}
        saving={saving}
        disabled={Object.values(invalidFields).some(Boolean)}
        label="Save Theme"
        colors={colors}
      />

      <ToastStack toasts={toasts} onDismiss={removeToast} />
    </div>
  )
}
