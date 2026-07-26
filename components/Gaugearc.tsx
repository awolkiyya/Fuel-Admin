"use client"

import React from "react"

export default function GaugeArc({
  percent,
  label,
  sub,
}: {
  percent: number
  label: string
  sub: string
}) {
  const clamped = Math.max(0, Math.min(100, percent))
  const angle = -90 + (clamped / 100) * 180
  const r = 46
  const cx = 60
  const cy = 60
  const describeArc = (startDeg: number, endDeg: number) => {
    const toXY = (deg: number) => {
      const rad = ((deg - 180) * Math.PI) / 180
      return [cx + r * Math.cos(rad), cy + r * Math.sin(rad)]
    }
    const [sx, sy] = toXY(startDeg)
    const [ex, ey] = toXY(endDeg)
    const large = endDeg - startDeg > 180 ? 1 : 0
    return `M ${sx} ${sy} A ${r} ${r} 0 ${large} 1 ${ex} ${ey}`
  }
  return (
    <div className="gauge-wrap">
      <svg viewBox="0 0 120 68" width="120" height="68">
        <path d={describeArc(0, 180)} stroke="#E4E7EC" strokeWidth="10" fill="none" strokeLinecap="round" />
        <path
          d={describeArc(0, (clamped / 100) * 180)}
          stroke="var(--amber)"
          strokeWidth="10"
          fill="none"
          strokeLinecap="round"
        />
        <g transform={`rotate(${angle}, ${cx}, ${cy})`}>
          <line x1={cx} y1={cy} x2={cx} y2={cy - 34} stroke="var(--navy)" strokeWidth="3" strokeLinecap="round" />
        </g>
        <circle cx={cx} cy={cy} r="4.5" fill="var(--navy)" />
      </svg>
      <div className="gauge-label">
        <span className="gauge-value">{label}</span>
        <span className="gauge-sub">{sub}</span>
      </div>
    </div>
  )
}