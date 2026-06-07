import { NOW, fmtTime } from './data'

export function generateFlowmeterPhoto(readingLiters) {
  const c = document.createElement('canvas')
  c.width = 640; c.height = 420
  const x = c.getContext('2d')
  const g = x.createLinearGradient(0, 0, 0, 420)
  g.addColorStop(0, '#1a2730'); g.addColorStop(1, '#0c1318')
  x.fillStyle = g; x.fillRect(0, 0, 640, 420)
  x.fillStyle = '#2b3a44'; roundRect(x, 70, 80, 500, 260, 18); x.fill()
  x.strokeStyle = '#46606e'; x.lineWidth = 3; roundRect(x, 70, 80, 500, 260, 18); x.stroke()
  x.fillStyle = '#7d97a6'; x.font = 'bold 18px monospace'
  x.fillText('FLOW TOTALIZER  ·  LITER', 110, 130)
  x.fillStyle = '#0b1f12'; roundRect(x, 110, 150, 420, 110, 10); x.fill()
  x.strokeStyle = '#1e5236'; x.lineWidth = 2; roundRect(x, 110, 150, 420, 110, 10); x.stroke()
  const reading = String(Math.round(readingLiters || (8000 + Math.random() * 4000))).padStart(7, '0')
  x.fillStyle = '#39e07a'; x.font = 'bold 64px monospace'; x.textBaseline = 'middle'
  x.shadowColor = '#39e07a'; x.shadowBlur = 14
  x.fillText(reading, 140, 208)
  x.shadowBlur = 0
  x.fillStyle = '#2a7b4d'; x.font = 'bold 22px monospace'
  x.fillText('L', 500, 212)
  x.fillStyle = 'rgba(255,255,255,0.65)'; x.font = '13px monospace'
  const now = new Date(NOW())
  const ts = `${String(now.getDate()).padStart(2,'0')}/${String(now.getMonth()+1).padStart(2,'0')}/${now.getFullYear()} ${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`
  x.fillText(ts, 110, 372)
  x.fillStyle = '#e0922f'; x.font = 'bold 13px monospace'
  x.fillText('● REC', 500, 372)
  return c.toDataURL('image/jpeg', 0.85)
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.arcTo(x + w, y, x + w, y + h, r)
  ctx.arcTo(x + w, y + h, x, y + h, r)
  ctx.arcTo(x, y + h, x, y, r)
  ctx.arcTo(x, y, x + w, y, r)
  ctx.closePath()
}
