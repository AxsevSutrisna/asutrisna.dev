export default function FeatureItem({ feature }) {
  return (
    <li className="group flex items-start space-x-3 p-2.5 md:p-3.5 rounded-xl hover:bg-white/5 transition-all duration-300 border border-transparent hover:border-[color:var(--color-border-light)]">
      <div className="relative mt-2">
        <div className="absolute -inset-1 rounded-full blur group-hover:opacity-30 opacity-0 transition-opacity duration-300 bg-[color:var(--color-text-secondary)]" />
        <div className="relative w-1.5 h-1.5 md:w-2 md:h-2 rounded-full group-hover:scale-125 transition-transform duration-300 bg-[color:var(--color-text-secondary)]" />
      </div>
      <span
        className="text-sm md:text-base transition-colors group-hover:text-white"
        style={{ color: "var(--color-text-secondary)" }}
      >
        {feature}
      </span>
    </li>
  )
}
