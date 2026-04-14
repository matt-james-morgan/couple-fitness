import { useEffect, useRef, useState, useCallback } from 'react'
import { useAppStore } from '@/hooks/useAppStore'
import PersonSwitcher from '@/components/PersonSwitcher'

// ─── Types ────────────────────────────────────────────────────────────────────

interface WeightEntry {
  date: string   // display label e.g. "Apr 14"
  iso: string    // YYYY-MM-DD for sorting
  weight: number
  bodyFat?: number
}

// ─── Storage ──────────────────────────────────────────────────────────────────

function storageKey(person: string) {
  return `weight_data_${person}`
}

function loadData(person: string): WeightEntry[] {
  try {
    const raw = localStorage.getItem(storageKey(person))
    if (raw) return JSON.parse(raw) as WeightEntry[]
  } catch {}
  return []
}

function saveData(person: string, data: WeightEntry[]) {
  localStorage.setItem(storageKey(person), JSON.stringify(data))
}

// ─── Conair CSV Parser ────────────────────────────────────────────────────────
// Handles Conair Body Composition Scale CSV exports from the Conair app.
// Typical columns (order varies): Date, Time, Weight (lbs), Body Fat (%), BMI,
// Hydration (%), Bone Mass (lbs), Muscle Mass (%), Visceral Fat, Calories
//
// Also handles Conair exports in metric (kg) – converts to lbs automatically.

function parseConairCSV(text: string): WeightEntry[] {
  const lines = text.trim().split(/\r?\n/)
  if (lines.length < 2) throw new Error('File appears empty')

  // Find header line (first line with recognizable columns)
  let headerIdx = 0
  for (let i = 0; i < Math.min(lines.length, 5); i++) {
    if (/date|weight|time/i.test(lines[i])) { headerIdx = i; break }
  }

  const headers = lines[headerIdx].split(',').map(h => h.trim().toLowerCase())

  // Flexible column detection
  function findCol(...candidates: string[]): number {
    for (const c of candidates) {
      const idx = headers.findIndex(h => h.includes(c))
      if (idx !== -1) return idx
    }
    return -1
  }

  const dateCol  = findCol('date')
  const timeCol  = findCol('time')
  const wLbsCol  = findCol('lbs', 'lb')
  const wKgCol   = findCol('(kg)', 'kg')
  const wCol     = wLbsCol !== -1 ? wLbsCol : wKgCol !== -1 ? wKgCol : findCol('weight')
  const bfCol    = findCol('body fat', 'fat%', 'fat %', 'bodyfat', 'fat(')

  if (dateCol === -1) throw new Error('Could not find a Date column. Is this a Conair export?')
  if (wCol === -1) throw new Error('Could not find a Weight column. Is this a Conair export?')

  const entries: WeightEntry[] = []

  for (let i = headerIdx + 1; i < lines.length; i++) {
    const line = lines[i].trim()
    if (!line) continue
    const cols = line.split(',').map(c => c.trim().replace(/^"|"$/g, ''))

    const rawDate = cols[dateCol]
    if (!rawDate) continue

    // Parse weight
    const rawWeight = parseFloat(cols[wCol])
    if (isNaN(rawWeight) || rawWeight <= 0) continue

    // Convert kg → lbs if weight column was kg
    const weight = (wKgCol !== -1 && wLbsCol === -1)
      ? Math.round(rawWeight * 2.20462 * 10) / 10
      : rawWeight

    // Parse body fat (optional)
    const bodyFat = bfCol !== -1 ? parseFloat(cols[bfCol]) : undefined

    // Parse date – handle MM/DD/YYYY, YYYY-MM-DD, M/D/YYYY, DD-MM-YYYY
    const iso = parseISODate(rawDate, cols[timeCol])
    if (!iso) continue

    const display = formatDisplayDate(iso)
    entries.push({
      date: display,
      iso,
      weight,
      bodyFat: bodyFat !== undefined && !isNaN(bodyFat) ? bodyFat : undefined,
    })
  }

  if (entries.length === 0) throw new Error('No valid weight rows found in the file')

  // Sort by date ascending, deduplicate by day (keep last)
  entries.sort((a, b) => a.iso.localeCompare(b.iso))
  const deduped = new Map<string, WeightEntry>()
  for (const e of entries) deduped.set(e.iso, e)

  return Array.from(deduped.values())
}

function parseISODate(raw: string, _time?: string): string | null {
  // YYYY-MM-DD
  if (/^\d{4}-\d{2}-\d{2}/.test(raw)) return raw.slice(0, 10)

  // MM/DD/YYYY or M/D/YYYY
  const mdy = raw.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})/)
  if (mdy) {
    const [, m, d, y] = mdy
    return `${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`
  }

  // DD-MM-YYYY
  const dmy = raw.match(/^(\d{1,2})-(\d{1,2})-(\d{4})/)
  if (dmy) {
    const [, d, m, y] = dmy
    return `${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`
  }

  return null
}

function formatDisplayDate(iso: string): string {
  // iso: YYYY-MM-DD
  const [y, m, d] = iso.split('-').map(Number)
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
  return `${months[m - 1]} ${d}, ${y}`
}

// ─── Chart ────────────────────────────────────────────────────────────────────

function drawChart(
  canvas: HTMLCanvasElement,
  data: { label: string; value: number }[],
  color: string,
  goalLine?: number
) {
  const ctx = canvas.getContext('2d')
  if (!ctx || data.length === 0) return

  const dpr = window.devicePixelRatio || 1
  const rect = canvas.getBoundingClientRect()
  if (rect.width === 0 || rect.height === 0) return

  canvas.width = rect.width * dpr
  canvas.height = rect.height * dpr
  ctx.scale(dpr, dpr)

  const w = rect.width
  const h = rect.height
  const pad = { top: 16, right: 16, bottom: 36, left: 44 }
  const chartW = w - pad.left - pad.right
  const chartH = h - pad.top - pad.bottom

  const values = data.map(d => d.value)
  const minV = Math.min(...values, goalLine ?? Infinity) - 2
  const maxV = Math.max(...values) + 2

  function xPos(i: number) {
    if (data.length <= 1) return pad.left + chartW / 2
    return pad.left + (i / (data.length - 1)) * chartW
  }
  function yPos(v: number) {
    return pad.top + (1 - (v - minV) / (maxV - minV)) * chartH
  }

  // Background
  ctx.fillStyle = '#181b21'
  ctx.fillRect(0, 0, w, h)

  // Grid lines
  ctx.strokeStyle = '#252830'
  ctx.lineWidth = 1
  for (let i = 0; i <= 4; i++) {
    const y = pad.top + (i / 4) * chartH
    ctx.beginPath()
    ctx.moveTo(pad.left, y)
    ctx.lineTo(w - pad.right, y)
    ctx.stroke()
    const val = maxV - (i / 4) * (maxV - minV)
    ctx.fillStyle = '#5a6172'
    ctx.font = '10px DM Mono, monospace'
    ctx.textAlign = 'right'
    ctx.fillText(Math.round(val).toString(), pad.left - 6, y + 3)
  }

  // Goal line
  if (goalLine !== undefined) {
    const gy = yPos(goalLine)
    ctx.strokeStyle = color + '66'
    ctx.lineWidth = 1
    ctx.setLineDash([4, 4])
    ctx.beginPath()
    ctx.moveTo(pad.left, gy)
    ctx.lineTo(w - pad.right, gy)
    ctx.stroke()
    ctx.setLineDash([])
    ctx.fillStyle = color
    ctx.font = '10px DM Mono, monospace'
    ctx.textAlign = 'left'
    ctx.fillText(`Goal: ${goalLine}`, pad.left + 4, gy - 4)
  }

  // Area fill
  const gradient = ctx.createLinearGradient(0, pad.top, 0, pad.top + chartH)
  gradient.addColorStop(0, color + '44')
  gradient.addColorStop(1, color + '00')
  ctx.beginPath()
  ctx.moveTo(xPos(0), yPos(values[0]))
  for (let i = 1; i < data.length; i++) ctx.lineTo(xPos(i), yPos(values[i]))
  ctx.lineTo(xPos(data.length - 1), pad.top + chartH)
  ctx.lineTo(xPos(0), pad.top + chartH)
  ctx.closePath()
  ctx.fillStyle = gradient
  ctx.fill()

  // Line
  ctx.strokeStyle = color
  ctx.lineWidth = 2
  ctx.lineJoin = 'round'
  ctx.beginPath()
  ctx.moveTo(xPos(0), yPos(values[0]))
  for (let i = 1; i < data.length; i++) ctx.lineTo(xPos(i), yPos(values[i]))
  ctx.stroke()

  // Points – only draw dots if not too dense
  const showDots = data.length <= 90
  if (showDots) {
    data.forEach((_, i) => {
      ctx.beginPath()
      ctx.arc(xPos(i), yPos(values[i]), 3, 0, Math.PI * 2)
      ctx.fillStyle = color
      ctx.fill()
    })
  }

  // X labels — show first, middle, last
  const labelIdxs = Array.from(new Set([0, Math.floor(data.length / 2), data.length - 1]))
  ctx.fillStyle = '#5a6172'
  ctx.font = '10px DM Sans, sans-serif'
  ctx.textAlign = 'center'
  labelIdxs.forEach(i => {
    // Shorten labels to "Mon DD" or "MMM YY"
    const lbl = data[i].label
    const short = lbl.replace(/,\s*\d{4}$/, '').replace(/\s+\d{4}$/, '')
    ctx.fillText(short, xPos(i), h - pad.bottom + 14)
  })
}

interface ChartProps {
  data: { label: string; value: number }[]
  color: string
  goal?: number
  label: string
  unit: string
}

function Chart({ data, color, goal, label, unit }: ChartProps) {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!ref.current || data.length === 0) return
    // Use rAF to ensure layout is complete
    const id = requestAnimationFrame(() => {
      if (ref.current) drawChart(ref.current, data, color, goal)
    })
    return () => cancelAnimationFrame(id)
  }, [data, color, goal])

  if (data.length === 0) return null

  const current = data[data.length - 1].value
  const start = data[0].value
  const change = +(current - start).toFixed(1)

  return (
    <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 16, overflow: 'hidden' }}>
      <div style={{ padding: '14px 16px 10px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', color: 'var(--muted)', textTransform: 'uppercase' }}>{label}</div>
          <div style={{ fontSize: 28, fontWeight: 900, color, lineHeight: 1.1, marginTop: 2 }}>
            {current} <span style={{ fontSize: 14, fontWeight: 400 }}>{unit}</span>
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: 12, color: 'var(--muted)' }}>Started</div>
          <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--text)' }}>{start} {unit}</div>
          <div style={{ fontSize: 13, color: change < 0 ? 'var(--green)' : 'var(--red)', fontWeight: 600 }}>
            {change < 0 ? '▼' : '▲'} {Math.abs(change)} {unit}
          </div>
        </div>
      </div>
      <canvas ref={ref} style={{ width: '100%', height: 160, display: 'block' }} />
    </div>
  )
}

// ─── Import Button ─────────────────────────────────────────────────────────────

interface ImportButtonProps {
  person: string
  onImport: (entries: WeightEntry[]) => void
}

function ImportButton({ person, onImport }: ImportButtonProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [status, setStatus] = useState<{ type: 'ok' | 'err'; msg: string } | null>(null)

  const handleFile = useCallback((file: File) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string
        const entries = parseConairCSV(text)
        onImport(entries)
        setStatus({ type: 'ok', msg: `Imported ${entries.length} weigh-ins` })
        setTimeout(() => setStatus(null), 4000)
      } catch (err) {
        setStatus({ type: 'err', msg: String(err instanceof Error ? err.message : err) })
      }
    }
    reader.readAsText(file)
  }, [onImport])

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) handleFile(file)
    e.target.value = ''
  }, [handleFile])

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        accept=".csv,.txt"
        onChange={handleChange}
        style={{ display: 'none' }}
      />
      <button
        onClick={() => inputRef.current?.click()}
        style={{
          background: 'var(--card)',
          border: '1px solid var(--border2)',
          borderRadius: 10,
          padding: '8px 14px',
          color: 'var(--muted)',
          fontSize: 12,
          fontWeight: 600,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          letterSpacing: '0.04em',
        }}
      >
        <span style={{ fontSize: 14 }}>⬆</span>
        Import {person === 'him' ? 'His' : 'Her'} Scale CSV
      </button>
      {status && (
        <div style={{
          marginTop: 8,
          padding: '8px 12px',
          borderRadius: 8,
          fontSize: 12,
          background: status.type === 'ok' ? 'rgba(74,222,128,0.1)' : 'rgba(255,82,82,0.1)',
          color: status.type === 'ok' ? 'var(--green)' : 'var(--red)',
          border: `1px solid ${status.type === 'ok' ? 'rgba(74,222,128,0.2)' : 'rgba(255,82,82,0.2)'}`,
        }}>
          {status.type === 'ok' ? '✓ ' : '✕ '}{status.msg}
        </div>
      )}
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function Progress() {
  const { person } = useAppStore()
  const isHim = person === 'him'
  const accent = isHim ? 'var(--m)' : 'var(--f)'
  const weightGoal = isHim ? 180 : 135
  const bfGoal = isHim ? 12 : 20

  const [entries, setEntries] = useState<WeightEntry[]>(() => loadData(person))

  // Reload when person switches
  useEffect(() => {
    setEntries(loadData(person))
  }, [person])

  const handleImport = useCallback((newEntries: WeightEntry[]) => {
    // Merge with existing, deduplicate by iso date (new wins)
    const merged = new Map<string, WeightEntry>()
    for (const e of [...entries, ...newEntries]) merged.set(e.iso, e)
    const sorted = Array.from(merged.values()).sort((a, b) => a.iso.localeCompare(b.iso))
    saveData(person, sorted)
    setEntries(sorted)
  }, [entries, person])

  const handleClear = useCallback(() => {
    if (!confirm('Clear all weight data for this person?')) return
    saveData(person, [])
    setEntries([])
  }, [person])

  const weightChartData = entries.map(e => ({ label: e.date, value: e.weight }))
  const bfEntries = entries.filter(e => e.bodyFat !== undefined)
  const bfChartData = bfEntries.map(e => ({ label: e.date, value: e.bodyFat! }))

  return (
    <div style={{ padding: '24px 16px 16px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div style={{ fontFamily: 'Bebas Neue', fontSize: 26, letterSpacing: '0.05em' }}>PROGRESS</div>
        <PersonSwitcher />
      </div>

      {/* Charts or empty state */}
      {entries.length === 0 ? (
        <div style={{
          background: 'var(--card)',
          border: '1px solid var(--border)',
          borderRadius: 16,
          padding: '36px 24px',
          textAlign: 'center',
          marginBottom: 14,
        }}>
          <div style={{ fontSize: 36, marginBottom: 12 }}>⚖️</div>
          <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text)', marginBottom: 6 }}>No data yet</div>
          <div style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.5 }}>
            Export your weigh-in history from the Conair app,<br />
            then tap Import below to load it.
          </div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 14 }}>
          <Chart
            data={weightChartData}
            color={accent}
            goal={weightGoal}
            label="Weight"
            unit="lbs"
          />
          {bfChartData.length >= 2 && (
            <Chart
              data={bfChartData}
              color="#a78bfa"
              goal={bfGoal}
              label="Body Fat %"
              unit="%"
            />
          )}
          {entries.length > 0 && (
            <div style={{
              background: 'var(--card)',
              border: '1px solid var(--border)',
              borderRadius: 12,
              padding: '10px 14px',
              fontSize: 12,
              color: 'var(--muted)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
              <span>{entries.length} weigh-ins · {entries[0].date} – {entries[entries.length - 1].date}</span>
              <button
                onClick={handleClear}
                style={{ background: 'none', border: 'none', color: 'var(--muted2)', fontSize: 11, cursor: 'pointer', fontWeight: 600 }}
              >
                CLEAR
              </button>
            </div>
          )}
        </div>
      )}

      {/* Import */}
      <ImportButton person={person} onImport={handleImport} />

      {/* Help */}
      <div style={{
        marginTop: 12,
        padding: '10px 14px',
        borderRadius: 10,
        fontSize: 12,
        color: 'var(--muted)',
        lineHeight: 1.6,
      }}>
        <strong style={{ color: 'var(--muted)' }}>How to export from Conair:</strong>{' '}
        Open the Conair app → History → Export → save to Files → share the CSV here.
      </div>
    </div>
  )
}
