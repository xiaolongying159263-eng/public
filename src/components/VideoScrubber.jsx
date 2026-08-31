import { useEffect, useRef, useState } from 'react'

/**
 * 视频卡片拖拽 scrubber。
 * - 视频自动播放（静音）；暂停时显示中央播放/暂停按钮（60pt、50% 透明）
 * - 鼠标左键点击视频区：切换播放/暂停
 * - 按住左右拖动：横向位移映射为播放时间（前进/后退）；拖拽期间暂停，松手后从当前帧继续播放
 * - 拖拽只在卡片内映射；使用 window 级指针监听，指针滑出卡片边缘也能持续拖
 */
export default function VideoScrubber({ src }) {
  const wrapRef = useRef(null)
  const videoRef = useRef(null)
  const dragRef = useRef({ active: false, startX: 0, startTime: 0, startWidth: 1, moved: false })
  const [dragging, setDragging] = useState(false)
  const [playing, setPlaying] = useState(false)
  const [progress, setProgress] = useState(0)

  const refreshProgress = () => {
    const v = videoRef.current
    if (v && v.duration) setProgress(v.currentTime / v.duration)
  }

  const toggle = () => {
    const v = videoRef.current
    if (!v) return
    if (v.paused) v.play().catch(() => {})
    else v.pause()
  }

  // 监听视频真实播放状态 + 元数据/时间更新
  useEffect(() => {
    const v = videoRef.current
    if (!v) return
    const onMeta = () => { v.play().catch(() => {}); refreshProgress() }
    const onTime = () => refreshProgress()
    const onPlay = () => setPlaying(true)
    const onPause = () => setPlaying(false)
    const onEnded = () => setPlaying(false)
    v.addEventListener('loadedmetadata', onMeta)
    v.addEventListener('timeupdate', onTime)
    v.addEventListener('play', onPlay)
    v.addEventListener('playing', onPlay)
    v.addEventListener('pause', onPause)
    v.addEventListener('ended', onEnded)
    return () => {
      v.removeEventListener('loadedmetadata', onMeta)
      v.removeEventListener('timeupdate', onTime)
      v.removeEventListener('play', onPlay)
      v.removeEventListener('playing', onPlay)
      v.removeEventListener('pause', onPause)
      v.removeEventListener('ended', onEnded)
    }
  }, [])

  // 卡片滑入视口时自动开始播放；离开视口时暂停（避免多视频同时在播、省流量）
  useEffect(() => {
    const wrap = wrapRef.current
    const v = videoRef.current
    if (!wrap || !v) return
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            v.play().catch(() => {})
          } else if (dragRef.current && !dragRef.current.active && !v.paused) {
            v.pause()
          }
        })
      },
      { threshold: 0.15 }
    )
    io.observe(wrap)
    return () => io.disconnect()
  }, [])

  // window 级拖拽监听
  useEffect(() => {
    const onMove = (e) => {
      const d = dragRef.current
      if (!d.active) return
      const dx = e.clientX - d.startX
      if (!d.moved && Math.abs(dx) < 8) return
      d.moved = true
      if (e.cancelable) e.preventDefault()
      const v = videoRef.current
      if (!v || !v.duration) return
      if (!v.paused) v.pause()
      const t = Math.max(0, Math.min(v.duration, d.startTime + (dx / d.startWidth) * v.duration))
      v.currentTime = t
      setProgress(t / v.duration)
    }
    const onEnd = () => {
      const d = dragRef.current
      if (!d.active) return
      d.active = false
      setDragging(false)
      const v = videoRef.current
      if (!v) return
      if (d.moved) {
        v.play().catch(() => {})
      } else {
        toggle()
      }
    }
    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerup', onEnd)
    window.addEventListener('pointercancel', onEnd)
    return () => {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', onEnd)
      window.removeEventListener('pointercancel', onEnd)
    }
  }, [])

  const onPointerDown = (e) => {
    if (e.pointerType === 'mouse' && e.button !== 0) return
    const v = videoRef.current
    const w = wrapRef.current ? wrapRef.current.getBoundingClientRect().width : 800
    dragRef.current = { active: true, startX: e.clientX, startTime: v ? v.currentTime : 0, startWidth: w || 1, moved: false }
    setDragging(true)
  }

  const showToggle = !playing && !dragging

  return (
    <div
      ref={wrapRef}
      className={`video-scrubber${dragging ? ' is-dragging' : ''}`}
      onPointerDown={onPointerDown}
      onDragStart={(e) => e.preventDefault()}
      onClick={(e) => { e.preventDefault(); e.stopPropagation() }}
    >
      <video ref={videoRef} src={src} muted playsInline autoPlay preload="auto" />
      <div className="video-scrubber__bar">
        <div className="video-scrubber__bar-fill" style={{ width: `${(progress || 0) * 100}%` }} />
      </div>
      {showToggle && (
        <button
          type="button"
          className="video-scrubber__toggle"
          aria-label="播放 / 暂停"
          onPointerDown={(e) => e.stopPropagation()}
          onClick={(e) => { e.stopPropagation(); toggle() }}
        >
          <svg viewBox="0 0 24 24" width="34" height="34" fill="#fff" aria-hidden="true">
            <path d="M8 5v14l11-7z" />
          </svg>
        </button>
      )}
      <span className="video-scrubber__hint">按住左右拖动</span>
    </div>
  )
}
