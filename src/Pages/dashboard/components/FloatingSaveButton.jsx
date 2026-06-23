import { Check } from 'lucide-react'

export default function FloatingSaveButton({ 
  onClick, 
  disabled, 
  saving, 
  label = "Save", 
  savingLabel = "Saving...", 
  icon: Icon = Check,
  colors = null
}) {
  const primaryFrom = colors?.button_primary_from || colors?.primary_color_dark || 'var(--color-primary-dark)'
  const primaryTo = colors?.button_primary_to || colors?.primary_color_light || 'var(--color-primary-light)'
  const backgroundGradient = `linear-gradient(135deg, ${primaryFrom}, ${primaryTo})`

  return (
    <div className="fixed z-50 bottom-6 right-6 lg:right-12">
      <button
        onClick={onClick}
        disabled={disabled || saving}
        className="relative group flex items-center justify-center focus:outline-none transition-all hover:scale-105 active:scale-95"
        style={{
          opacity: disabled || saving ? 0.5 : 1,
          cursor: disabled || saving ? 'not-allowed' : 'pointer'
        }}
      >
        <div
          className="absolute -inset-1.5 rounded-full blur-md opacity-60 group-hover:opacity-100 transition duration-500"
          style={{ background: backgroundGradient }}
        />
        <div
          className="relative flex items-center gap-2 px-8 py-4 rounded-full shadow-2xl border border-white/20 transition-all duration-300"
          style={{ background: backgroundGradient }}
        >
          {saving ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span className="text-sm font-bold text-white tracking-wide drop-shadow-md">{savingLabel}</span>
            </>
          ) : (
            <>
              <Icon className="w-5 h-5 text-white drop-shadow-md" strokeWidth={3} />
              <span className="text-sm font-bold text-white tracking-wide drop-shadow-md">{label}</span>
            </>
          )}
        </div>
      </button>
    </div>
  )
}
