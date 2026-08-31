import { useEffect, useRef, useState } from 'react'

/**
 * 可拖拽的无限横向跑马灯。
 * - 自动向右对齐内容向左匀速滚动（speed 为每秒像素）
 * - 鼠标/触摸按住可左右拖拽（Pointer Events 兼顾鼠标与触摸）
 * - 悬停时暂停自动滚动；拖拽时同样暂停，且拖拽期间持续暂停
 * - children 需包含“两份相同序列”，循环点无缝衔接
 * - 偏移量始终取模到一份序列宽度内，配合外层 overflow:hidden，内容不会拖出卡片窗口
 *
 * 拖拽使用 window 级 pointermove/pointerup 监听（而非依赖元素上的 setPointerCapture），
 * 这样指针滑出卡片甚至卡片边缘外也能持续拖拽，直到松手才结束。
 */
export default function Marquee({ speed = 70, children }) {
  const trackRef = useRef(null)
  const offsetRef = useRef(0)        // 当前滚动偏移（px），始终限制在 [0, setWidth)
  const setWidthRef = useRef(0)      // 一份序列的宽度 = 轨道宽度 / 2
  const lastRef = useRef(null)
  const hoverRef = useRef(false)     // 鼠标是否悬停在跑马灯上
  const dragRef = useRef({ active: false, startX: 0, startOffset: 0, moved: false })
  const [dragging, setDragging] = useState(false)

  const apply = () => {
    if (trackRef.current) {
      trackRef.current.style.transform = `translate3d(${-offsetRef.current}px,0,0)`
    }
  }

  const wrap = (v) => {
    const sw = setWidthRef.current
    if (sw <= 0) return v
    return ((v % sw) + sw) % sw
  }

  // 测量一份序列宽度（轨道含两份相同序列）
  useEffect(() => {
    const measure = () => {
      const el = trackRef.current
      if (el) {
        setWidthRef.current = el.scrollWidth / 2
        apply()
      }
    }
    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [children])

  // 自动滚动：未悬停、未拖拽时持续推进
  useEffect(() => {
    let raf
    lastRef.current = null
    const tick = (t) => {
      if (lastRef.current == null) lastRef.current = t
      const dt = (t - lastRef.current) / 1000
      lastRef.current = t
      if (!dragRef.current.active && !hoverRef.current && setWidthRef.current > 0) {
        offsetRef.current += speed * dt
        if (offsetRef.current >= setWidthRef.current) offsetRef.current -= setWidthRef.current
        apply()
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [speed])

  // window 级拖拽监听：指针滑出卡片也能持续拖，直到 pointerup/pointercancel
  useEffect(() => {
    const onMove = (e) => {
      const d = dragRef.current
      if (!d.active) return
      const dx = e.clientX - d.startX
      if (!d.moved && Math.abs(dx) < 6) return
      d.moved = true
      if (e.cancelable) e.preventDefault()
      offsetRef.current = wrap(d.startOffset - dx)
      apply()
    }
    const onEnd = () => {
      if (!dragRef.current.active) return
      dragRef.current.active = false
      setDragging(false)
      hoverRef.current = false
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
    dragRef.current = { active: true, startX: e.clientX, startOffset: offsetRef.current, moved: false }
    hoverRef.current = true
    setDragging(true)
  }

  return (
    <div
      className={`project-card__marquee${dragging ? ' is-dragging' : ''}`}
      onPointerDown={onPointerDown}
      onPointerEnter={() => { hoverRef.current = true }}
      onPointerLeave={() => { if (!dragRef.current.active) hoverRef.current = false }}
      onDragStart={(e) => e.preventDefault()}
      onClick={(e) => {
        if (dragRef.current.moved) {
          e.preventDefault()
          e.stopPropagation()
        }
      }}
    >
      <div className="marquee__track" ref={trackRef}>{children}</div>
    </div>
  )
}
