import { useEffect, useRef, useCallback } from "react"

const DEFAULTS = {
  scrollSpeed: 55,
  pauseAtEndMs: 1800,
  pauseAtStartMs: 900,
  startDelayMs: 600,
}

export function useCarouselAutoScroll({
  trackRef,
  getMaxOffset,
  enabled = true,
  scrollSpeed = DEFAULTS.scrollSpeed,
  pauseAtEndMs = DEFAULTS.pauseAtEndMs,
  pauseAtStartMs = DEFAULTS.pauseAtStartMs,
  startDelayMs = DEFAULTS.startDelayMs,
}) {
  const isHoveredRef = useRef(false)
  const getMaxOffsetStable = useCallback(getMaxOffset, [getMaxOffset])

  useEffect(() => {
    if (!enabled) return

    let animId = null
    let lastTs = null
    let offset = 0
    let phase = "forward"
    let paused = false
    let pauseTimer = null

    const applyOffset = (px) => {
      if (trackRef.current) {
        trackRef.current.style.transform = `translate3d(${-px}px, 0, 0)`
      }
    }

    const scheduleResume = (delayMs, nextPhase) => {
      paused = true
      pauseTimer = setTimeout(() => {
        paused = false
        phase = nextPhase
        lastTs = null
        animId = requestAnimationFrame(tick)
      }, delayMs)
    }

    const tick = (timestamp) => {
      if (lastTs === null) lastTs = timestamp
      const dt = Math.min((timestamp - lastTs) / 1000, 0.05)
      lastTs = timestamp

      if (paused || isHoveredRef.current) {
        animId = requestAnimationFrame(tick)
        return
      }

      const maxOff = getMaxOffsetStable()

      if (maxOff <= 0) {
        animId = requestAnimationFrame(tick)
        return
      }

      if (phase === "forward") {
        offset = Math.min(offset + scrollSpeed * dt, maxOff)
        applyOffset(offset)

        if (offset >= maxOff) {
          cancelAnimationFrame(animId)
          animId = null
          scheduleResume(pauseAtEndMs, "return")
          return
        }
      } else {
        offset = Math.max(offset - scrollSpeed * dt, 0)
        applyOffset(offset)

        if (offset <= 0) {
          cancelAnimationFrame(animId)
          animId = null
          scheduleResume(pauseAtStartMs, "forward")
          return
        }
      }

      animId = requestAnimationFrame(tick)
    }

    pauseTimer = setTimeout(() => {
      animId = requestAnimationFrame(tick)
    }, startDelayMs)

    return () => {
      if (animId) cancelAnimationFrame(animId)
      if (pauseTimer) clearTimeout(pauseTimer)
    }
  }, [enabled, trackRef, getMaxOffsetStable, scrollSpeed, pauseAtEndMs, pauseAtStartMs, startDelayMs])

  return { isHoveredRef }
}
