<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  direction: { type: String, default: 'diagonal' },
  speed: { type: Number, default: 0.5 },
  borderColor: { type: String, default: '#999' },
  squareSize: { type: Number, default: 40 },
  hoverFillColor: { type: String, default: '#222' },
  shape: { type: String, default: 'square' },
  hoverTrailAmount: { type: Number, default: 0 },
})

const canvasEl = ref(null)

// Cleanup refs — defined in module scope so onUnmounted can reach them
let rafId = null
let resizeHandler = null
let mouseMoveHandler = null
let mouseLeaveHandler = null

onMounted(() => {
  const canvas = canvasEl.value
  if (!canvas) return
  const ctx = canvas.getContext('2d')

  // These shape/size calculations only run once for performance, assuming they won't change
  const isHex = props.shape === 'hexagon'
  const isTri = props.shape === 'triangle'
  const hexHoriz = props.squareSize * 1.5
  const hexVert = props.squareSize * Math.sqrt(3)

  const gridOffset = { x: 0, y: 0 }
  let hoveredSquare = null
  const trailCells = []
  const cellOpacities = new Map()

  const resizeCanvas = () => {
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
  }

  resizeHandler = resizeCanvas
  window.addEventListener('resize', resizeHandler)
  resizeCanvas()

  /* ---- shape drawers ---- */
  const drawHex = (cx, cy, size) => {
    ctx.beginPath()
    for (let i = 0; i < 6; i++) {
      const angle = (Math.PI / 3) * i
      if (i === 0)
        ctx.moveTo(cx + size * Math.cos(angle), cy + size * Math.sin(angle))
      else ctx.lineTo(cx + size * Math.cos(angle), cy + size * Math.sin(angle))
    }
    ctx.closePath()
  }

  const drawCircle = (cx, cy, size) => {
    ctx.beginPath()
    ctx.arc(cx, cy, size / 2, 0, Math.PI * 2)
    ctx.closePath()
  }

  const drawTriangle = (cx, cy, size, flip) => {
    ctx.beginPath()
    if (flip) {
      ctx.moveTo(cx, cy + size / 2)
      ctx.lineTo(cx + size / 2, cy - size / 2)
      ctx.lineTo(cx - size / 2, cy - size / 2)
    } else {
      ctx.moveTo(cx, cy - size / 2)
      ctx.lineTo(cx + size / 2, cy + size / 2)
      ctx.lineTo(cx - size / 2, cy + size / 2)
    }
    ctx.closePath()
  }

  /* ---- grid draw ---- */
  const drawGrid = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    if (isHex) {
      const colShift = Math.floor(gridOffset.x / hexHoriz)
      const offsetX = ((gridOffset.x % hexHoriz) + hexHoriz) % hexHoriz
      const offsetY = ((gridOffset.y % hexVert) + hexVert) % hexVert
      const cols = Math.ceil(canvas.width / hexHoriz) + 3
      const rows = Math.ceil(canvas.height / hexVert) + 3
      for (let col = -2; col < cols; col++) {
        for (let row = -2; row < rows; row++) {
          const cx = col * hexHoriz + offsetX
          const cy =
            row * hexVert +
            ((col + colShift) % 2 !== 0 ? hexVert / 2 : 0) +
            offsetY
          const alpha = cellOpacities.get(`${col},${row}`)
          if (alpha) {
            ctx.globalAlpha = alpha
            drawHex(cx, cy, props.squareSize)
            ctx.fillStyle = props.hoverFillColor
            ctx.fill()
            ctx.globalAlpha = 1
          }
          drawHex(cx, cy, props.squareSize)
          ctx.strokeStyle = props.borderColor
          ctx.stroke()
        }
      }
    } else if (isTri) {
      const halfW = props.squareSize / 2
      const colShift = Math.floor(gridOffset.x / halfW)
      const rowShift = Math.floor(gridOffset.y / props.squareSize)
      const offsetX = ((gridOffset.x % halfW) + halfW) % halfW
      const offsetY =
        ((gridOffset.y % props.squareSize) + props.squareSize) %
        props.squareSize
      const cols = Math.ceil(canvas.width / halfW) + 4
      const rows = Math.ceil(canvas.height / props.squareSize) + 4
      for (let col = -2; col < cols; col++) {
        for (let row = -2; row < rows; row++) {
          const cx = col * halfW + offsetX
          const cy = row * props.squareSize + props.squareSize / 2 + offsetY
          const flip = (((col + colShift + row + rowShift) % 2) + 2) % 2 !== 0
          const alpha = cellOpacities.get(`${col},${row}`)
          if (alpha) {
            ctx.globalAlpha = alpha
            drawTriangle(cx, cy, props.squareSize, flip)
            ctx.fillStyle = props.hoverFillColor
            ctx.fill()
            ctx.globalAlpha = 1
          }
          drawTriangle(cx, cy, props.squareSize, flip)
          ctx.strokeStyle = props.borderColor
          ctx.stroke()
        }
      }
    } else if (props.shape === 'circle') {
      const offsetX =
        ((gridOffset.x % props.squareSize) + props.squareSize) %
        props.squareSize
      const offsetY =
        ((gridOffset.y % props.squareSize) + props.squareSize) %
        props.squareSize
      const cols = Math.ceil(canvas.width / props.squareSize) + 3
      const rows = Math.ceil(canvas.height / props.squareSize) + 3
      for (let col = -2; col < cols; col++) {
        for (let row = -2; row < rows; row++) {
          const cx = col * props.squareSize + props.squareSize / 2 + offsetX
          const cy = row * props.squareSize + props.squareSize / 2 + offsetY
          const alpha = cellOpacities.get(`${col},${row}`)
          if (alpha) {
            ctx.globalAlpha = alpha
            drawCircle(cx, cy, props.squareSize)
            ctx.fillStyle = props.hoverFillColor
            ctx.fill()
            ctx.globalAlpha = 1
          }
          drawCircle(cx, cy, props.squareSize)
          ctx.strokeStyle = props.borderColor
          ctx.stroke()
        }
      }
    } else {
      // square (default)
      const offsetX =
        ((gridOffset.x % props.squareSize) + props.squareSize) %
        props.squareSize
      const offsetY =
        ((gridOffset.y % props.squareSize) + props.squareSize) %
        props.squareSize
      const cols = Math.ceil(canvas.width / props.squareSize) + 3
      const rows = Math.ceil(canvas.height / props.squareSize) + 3
      for (let col = -2; col < cols; col++) {
        for (let row = -2; row < rows; row++) {
          const sx = col * props.squareSize + offsetX
          const sy = row * props.squareSize + offsetY
          const alpha = cellOpacities.get(`${col},${row}`)
          if (alpha) {
            ctx.globalAlpha = alpha
            ctx.fillStyle = props.hoverFillColor
            ctx.fillRect(sx, sy, props.squareSize, props.squareSize)
            ctx.globalAlpha = 1
          }
          ctx.strokeStyle = props.borderColor
          ctx.strokeRect(sx, sy, props.squareSize, props.squareSize)
        }
      }
    }
  }

  /* ---- opacity tracking ---- */
  const updateCellOpacities = () => {
    const targets = new Map()
    if (hoveredSquare) targets.set(`${hoveredSquare.x},${hoveredSquare.y}`, 1)
    if (props.hoverTrailAmount > 0) {
      trailCells.forEach((t, i) => {
        const key = `${t.x},${t.y}`
        if (!targets.has(key))
          targets.set(key, (trailCells.length - i) / (trailCells.length + 1))
      })
    }
    for (const [key] of targets) {
      if (!cellOpacities.has(key)) cellOpacities.set(key, 0)
    }
    for (const [key, opacity] of cellOpacities) {
      const next = opacity + ((targets.get(key) || 0) - opacity) * 0.15
      if (next < 0.005) cellOpacities.delete(key)
      else cellOpacities.set(key, next)
    }
  }

  /* ---- animation loop ---- */
  const tick = () => {
    const s = Math.max(props.speed, 0.1)
    const wrapX = isHex ? hexHoriz * 2 : props.squareSize
    const wrapY = isHex
      ? hexVert
      : isTri
        ? props.squareSize * 2
        : props.squareSize
    switch (props.direction) {
      case 'right':
        gridOffset.x = (gridOffset.x - s + wrapX) % wrapX
        break
      case 'left':
        gridOffset.x = (gridOffset.x + s + wrapX) % wrapX
        break
      case 'up':
        gridOffset.y = (gridOffset.y + s + wrapY) % wrapY
        break
      case 'down':
        gridOffset.y = (gridOffset.y - s + wrapY) % wrapY
        break
      case 'diagonal':
        gridOffset.x = (gridOffset.x - s + wrapX) % wrapX
        gridOffset.y = (gridOffset.y - s + wrapY) % wrapY
        break
    }
    updateCellOpacities()
    drawGrid()
    rafId = requestAnimationFrame(tick)
  }

  /* ---- hit detection ---- */
  const getCell = (mx, my) => {
    if (isHex) {
      const colShift = Math.floor(gridOffset.x / hexHoriz)
      const offsetX = ((gridOffset.x % hexHoriz) + hexHoriz) % hexHoriz
      const offsetY = ((gridOffset.y % hexVert) + hexVert) % hexVert
      const col = Math.round((mx - offsetX) / hexHoriz)
      const rowOffset = (col + colShift) % 2 !== 0 ? hexVert / 2 : 0
      return { x: col, y: Math.round((my - offsetY - rowOffset) / hexVert) }
    } else if (isTri) {
      const halfW = props.squareSize / 2
      const offsetX = ((gridOffset.x % halfW) + halfW) % halfW
      const offsetY =
        ((gridOffset.y % props.squareSize) + props.squareSize) %
        props.squareSize
      return {
        x: Math.round((mx - offsetX) / halfW),
        y: Math.floor((my - offsetY) / props.squareSize),
      }
    } else {
      const offsetX =
        ((gridOffset.x % props.squareSize) + props.squareSize) %
        props.squareSize
      const offsetY =
        ((gridOffset.y % props.squareSize) + props.squareSize) %
        props.squareSize
      const isCirc = props.shape === 'circle'
      return {
        x: isCirc
          ? Math.round((mx - offsetX) / props.squareSize)
          : Math.floor((mx - offsetX) / props.squareSize),
        y: isCirc
          ? Math.round((my - offsetY) / props.squareSize)
          : Math.floor((my - offsetY) / props.squareSize),
      }
    }
  }

  mouseMoveHandler = (e) => {
    const rect = canvas.getBoundingClientRect()
    const cell = getCell(e.clientX - rect.left, e.clientY - rect.top)
    if (
      !hoveredSquare ||
      hoveredSquare.x !== cell.x ||
      hoveredSquare.y !== cell.y
    ) {
      if (hoveredSquare && props.hoverTrailAmount > 0) {
        trailCells.unshift({ ...hoveredSquare })
        if (trailCells.length > props.hoverTrailAmount)
          trailCells.length = props.hoverTrailAmount
      }
      hoveredSquare = cell
    }
  }

  mouseLeaveHandler = () => {
    if (hoveredSquare && props.hoverTrailAmount > 0) {
      trailCells.unshift({ ...hoveredSquare })
      if (trailCells.length > props.hoverTrailAmount)
        trailCells.length = props.hoverTrailAmount
    }
    hoveredSquare = null
  }

  canvas.addEventListener('mousemove', mouseMoveHandler)
  canvas.addEventListener('mouseleave', mouseLeaveHandler)
  rafId = requestAnimationFrame(tick)
})

onUnmounted(() => {
  if (rafId) cancelAnimationFrame(rafId)
  if (resizeHandler) window.removeEventListener('resize', resizeHandler)
  const canvas = canvasEl.value
  if (canvas) {
    if (mouseMoveHandler)
      canvas.removeEventListener('mousemove', mouseMoveHandler)
    if (mouseLeaveHandler)
      canvas.removeEventListener('mouseleave', mouseLeaveHandler)
  }
})
</script>

<template>
  <canvas ref="canvasEl" class="w-full h-full border-none block" />
</template>
