export default function renderDescription(text, primaryColor = "var(--color-primary-light)") {
  if (!text) return null

  const lines = text.split("\n")
  const blocks = []

  lines.forEach((raw) => {
    const line = raw.trim()
    if (!line) return
    const isBullet = /^[-•–]\s+/.test(line)
    if (isBullet)
      blocks.push({ type: "bullet", content: line.replace(/^[-•–]\s+/, "") })
    else blocks.push({ type: "text", content: line })
  })

  if (!blocks.length) return null

  const elements = []
  let i = 0
  while (i < blocks.length) {
    if (blocks[i].type === "bullet") {
      const items = []
      while (i < blocks.length && blocks[i].type === "bullet") {
        items.push(blocks[i].content)
        i++
      }
      elements.push(
        <ul key={`ul-${i}`} className="space-y-2 list-none mt-3">
          {items.map((item, j) => (
            <li
              key={j}
              className="flex items-start gap-3 text-sm sm:text-base text-gray-300 leading-relaxed"
            >
              <span
                className="mt-2 w-1.5 h-1.5 rounded-full shrink-0"
                style={{ backgroundColor: primaryColor }}
                aria-hidden="true"
              />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      )
    } else {
      elements.push(
        <p
          key={`p-${i}`}
          className="text-sm sm:text-base text-gray-300 leading-relaxed mt-3"
        >
          {blocks[i].content}
        </p>
      )
      i++
    }
  }

  return <div className="space-y-1">{elements}</div>
}
