import { useEffect, useRef, useState, useCallback } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import { useAppStore } from '@/hooks/useAppStore'
import { useWeights } from '@/hooks/useWeights'
import PersonSwitcher from '@/components/PersonSwitcher'

// ─── Conair CSV Parser ────────────────────────────────────────────────────────

function parseConairCSV(text: string): { date: string; weight: number; bodyFat?: number }[] {
  const lines = text.trim().split(/\r?\n/)
  if (lines.length < 2) throw new Error('File appears empty')

  let headerIdx = 0
  for (let i = 0; i < Math.min(lines.length, 5); i++) {
    if (/date|weight|time/i.test(lines[i])) { headerIdx = i; break }
  }

  const headers = lines[headerIdx].split(',').map(h => h.trim().toLowerCase())

  function findCol(...candidates: string[]): number {
    for (const c of candidates) {
      const idx = headers.findIndex(h => h.includes(c))
      if (idx !== -1) return idx
    }
    return -1
  }

  const dateCol = findCol('date')
  const wLbsCol = findCol('lbs', 'lb')
  const wKgCol  = findCol('(kg)', 'kg')
  const wCol    = wLbsCol !== -1 ? wLbsCol : wKgCol !== -1 ? wKgCol : findCol('weight')
  const bfCol   = findCol('body fat', 'fat%', 'fat %', 'bodyfat', 'fat(')

  if (dateCol === -1) throw new Error('Could not find a Date column')
  if (wCol === -1) throw new Error('Could not find a Weight column')

  const entries: { date: string; weight: number; bodyFat?: number }[] = []

  for (let i = headerIdx + 1; i < lines.length; i++) {
    const line = lines[i].trim()
    if (!line) continue
    const cols = line.split(',').map(c => c.trim().replace(/^"|"$/g, ''))

    const rawDate = cols[dateCol]
    if (!rawDate) continue

    const rawWeight = parseFloat(cols[wCol])
    if (isNaN(rawWeight) || rawWeight <= 0) continue

    const weight = (wKgCol !== -1 && wLbsCol === -1)
      ? Math.round(rawWeight * 2.20462 * 10) / 10
      : rawWeight

    const bodyFat = bfCol !== -1 ? parseFloat(cols[bfCol]) : undefined
    const date = parseISODate(rawDate)
    if (!date) continue

    entries.push({ date, weight, bodyFat: bodyFat !== undefined && !isNaN(bodyFat) ? bodyFat : undefined })
  }

  if (entries.length === 0) throw new Error('No valid weight rows found')

  // Deduplicate by date (last wins)
  const map = new Map<string, typeof entries[0]>()
  for (const e of entries) map.set(e.date, e)
  return Array.from(map.values()).sort((a, b) => a.date.localeCompare(b.date))
}

function parseISODate(raw: string): string | null {
  if (/^\d{4}-\d{2}-\d{2}/.test(raw)) return raw.slice(0, 10)
  const mdy = raw.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})/)
  if (mdy) return `${mdy[3]}-${mdy[1].padStart(2,'0')}-${mdy[2].padStart(2,'0')}`
  const dmy = raw.match(/^(\d{1,2})-(\d{1,2})-(\d{4})/)
  if (dmy) return `${dmy[3]}-${dmy[2].padStart(2,'0')}-${dmy[1].padStart(2,'0')}`
  return null
}

function formatDisplay(iso: string): string {
  const [y, m, d] = iso.split('-').map(Number)
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
  return `${months[m - 1]} ${d}, ${y}`
}

// ─── Chart ────────────────────────────────────────────────────────────────────

function drawChart(canvas: HTMLCanvasElement, data: { label: string; value: number }[], color: string, goalLine?: number) {
  const ctx = canvas.getContext('2d')
  if (!ctx || data.length === 0) return

  const dpr = window.devicePixelRatio || 1
  const rect = canvas.getBoundingClientRect()
  if (rect.width === 0 || rect.height === 0) return

  canvas.width = rect.width * dpr
  canvas.height = rect.height * dpr
  ctx.scale(dpr, dpr)

  const w = rect.width, h = rect.height
  const pad = { top: 16, right: 16, bottom: 36, left: 44 }
  const chartW = w - pad.left - pad.right
  const chartH = h - pad.top - pad.bottom
  const values = data.map(d => d.value)
  const minV = Math.min(...values, goalLine ?? Infinity) - 2
  const maxV = Math.max(...values) + 2

  function xPos(i: number) {
    return data.length <= 1 ? pad.left + chartW / 2 : pad.left + (i / (data.length - 1)) * chartW
  }
  function yPos(v: number) {
    return pad.top + (1 - (v - minV) / (maxV - minV)) * chartH
  }

  ctx.fillStyle = '#181b21'
  ctx.fillRect(0, 0, w, h)

  ctx.strokeStyle = '#252830'
  ctx.lineWidth = 1
  for (let i = 0; i <= 4; i++) {
    const y = pad.top + (i / 4) * chartH
    ctx.beginPath(); ctx.moveTo(pad.left, y); ctx.lineTo(w - pad.right, y); ctx.stroke()
    ctx.fillStyle = '#5a6172'; ctx.font = '10px DM Mono, monospace'; ctx.textAlign = 'right'
    ctx.fillText(Math.round(maxV - (i / 4) * (maxV - minV)).toString(), pad.left - 6, y + 3)
  }

  if (goalLine !== undefined) {
    const gy = yPos(goalLine)
    ctx.strokeStyle = color + '66'; ctx.lineWidth = 1; ctx.setLineDash([4, 4])
    ctx.beginPath(); ctx.moveTo(pad.left, gy); ctx.lineTo(w - pad.right, gy); ctx.stroke()
    ctx.setLineDash([])
    ctx.fillStyle = color; ctx.font = '10px DM Mono, monospace'; ctx.textAlign = 'left'
    ctx.fillText(`Goal: ${goalLine}`, pad.left + 4, gy - 4)
  }

  const gradient = ctx.createLinearGradient(0, pad.top, 0, pad.top + chartH)
  gradient.addColorStop(0, color + '44'); gradient.addColorStop(1, color + '00')
  ctx.beginPath(); ctx.moveTo(xPos(0), yPos(values[0]))
  for (let i = 1; i < data.length; i++) ctx.lineTo(xPos(i), yPos(values[i]))
  ctx.lineTo(xPos(data.length - 1), pad.top + chartH); ctx.lineTo(xPos(0), pad.top + chartH)
  ctx.closePath(); ctx.fillStyle = gradient; ctx.fill()

  ctx.strokeStyle = color; ctx.lineWidth = 2; ctx.lineJoin = 'round'
  ctx.beginPath(); ctx.moveTo(xPos(0), yPos(values[0]))
  for (let i = 1; i < data.length; i++) ctx.lineTo(xPos(i), yPos(values[i]))
  ctx.stroke()

  if (data.length <= 90) {
    data.forEach((_, i) => {
      ctx.beginPath(); ctx.arc(xPos(i), yPos(values[i]), 3, 0, Math.PI * 2)
      ctx.fillStyle = color; ctx.fill()
    })
  }

  const labelIdxs = Array.from(new Set([0, Math.floor(data.length / 2), data.length - 1]))
  ctx.fillStyle = '#5a6172'; ctx.font = '10px DM Sans, sans-serif'; ctx.textAlign = 'center'
  labelIdxs.forEach(i => {
    const short = data[i].label.replace(/,\s*\d{4}$/, '').replace(/\s+\d{4}$/, '')
    ctx.fillText(short, xPos(i), h - pad.bottom + 14)
  })
}

function Chart({ data, color, goal, label, unit }: { data: { label: string; value: number }[]; color: string; goal?: number; label: string; unit: string }) {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!ref.current || data.length === 0) return
    const id = requestAnimationFrame(() => { if (ref.current) drawChart(ref.current, data, color, goal) })
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

// ─── Add Entry Form ───────────────────────────────────────────────────────────

function AddEntryForm({ onAdd }: { onAdd: (date: string, weight: number) => Promise<void> }) {
  const today = new Date().toISOString().slice(0, 10)
  const [date, setDate] = useState(today)
  const [weight, setWeight] = useState('')
  const [saving, setSaving] = useState(false)
  const [err, setErr] = useState<string | null>(null)

  async function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault()
    const w = parseFloat(weight)
    if (!date || isNaN(w) || w <= 0) return
    setSaving(true)
    setErr(null)
    try {
      await onAdd(date, w)
      setWeight('')
      setDate(today)
    } catch (e) {
      setErr(e instanceof Error ? e.message : 'Failed to save')
    } finally {
      setSaving(false)
    }
  }

  const inputStyle: React.CSSProperties = {
    background: 'var(--card2)',
    border: '1px solid var(--border)',
    borderRadius: 8,
    padding: '9px 12px',
    fontSize: 14,
    color: 'var(--text)',
    fontFamily: 'inherit',
    outline: 'none',
  }

  return (
    <form onSubmit={handleSubmit} style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 14, padding: '14px 16px' }}>
      <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', color: 'var(--muted)', textTransform: 'uppercase', marginBottom: 10 }}>
        Log Weight
      </div>
      <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end' }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 4 }}>Date</div>
          <input type="date" style={{ ...inputStyle, width: '100%', boxSizing: 'border-box' }} value={date} onChange={e => setDate(e.target.value)} required />
        </div>
        <div style={{ width: 90 }}>
          <div style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 4 }}>Weight (lbs)</div>
          <input type="number" step="0.1" min="0" placeholder="185.0" style={{ ...inputStyle, width: '100%', boxSizing: 'border-box' }} value={weight} onChange={e => setWeight(e.target.value)} required />
        </div>
        <button
          type="submit"
          disabled={saving || !weight}
          style={{
            display: 'flex', alignItems: 'center', gap: 4,
            padding: '9px 14px', borderRadius: 8,
            background: 'var(--m)', border: 'none',
            color: '#fff', fontSize: 13, fontWeight: 700,
            cursor: saving || !weight ? 'not-allowed' : 'pointer',
            opacity: saving || !weight ? 0.6 : 1,
            fontFamily: 'inherit', whiteSpace: 'nowrap',
          }}
        >
          <Plus size={14} /> Add
        </button>
      </div>
      {err && <div style={{ marginTop: 8, fontSize: 12, color: 'var(--f)' }}>{err}</div>}
    </form>
  )
}

// ─── Import Button ────────────────────────────────────────────────────────────

function ImportButton({ person, onImport }: { person: string; onImport: (entries: { date: string; weight: number; bodyFat?: number }[]) => Promise<void> }) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [status, setStatus] = useState<{ type: 'ok' | 'err'; msg: string } | null>(null)

  const handleFile = useCallback((file: File) => {
    const reader = new FileReader()
    reader.onload = async (e) => {
      try {
        const entries = parseConairCSV(e.target?.result as string)
        await onImport(entries)
        setStatus({ type: 'ok', msg: `Imported ${entries.length} weigh-ins` })
        setTimeout(() => setStatus(null), 4000)
      } catch (err) {
        setStatus({ type: 'err', msg: err instanceof Error ? err.message : String(err) })
      }
    }
    reader.readAsText(file)
  }, [onImport])

  return (
    <div>
      <input ref={inputRef} type="file" accept=".csv,.txt" onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f); e.target.value = '' }} style={{ display: 'none' }} />
      <button
        onClick={() => inputRef.current?.click()}
        style={{
          background: 'var(--card)', border: '1px solid var(--border2)',
          borderRadius: 10, padding: '8px 14px', color: 'var(--muted)',
          fontSize: 12, fontWeight: 600, cursor: 'pointer',
          display: 'flex', alignItems: 'center', gap: 6, fontFamily: 'inherit',
        }}
      >
        <span style={{ fontSize: 14 }}>⬆</span>
        Import {person === 'him' ? 'His' : 'Her'} Scale CSV
      </button>
      {status && (
        <div style={{
          marginTop: 8, padding: '8px 12px', borderRadius: 8, fontSize: 12,
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

// ─── Recent Entries List ──────────────────────────────────────────────────────

function RecentEntries({ entries, onDelete }: { entries: { id: string; date: string; weight: number }[]; onDelete: (id: string) => void }) {
  const recent = [...entries].reverse().slice(0, 5)
  if (recent.length === 0) return null

  return (
    <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 14, overflow: 'hidden' }}>
      <div style={{ padding: '12px 16px 8px', fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', color: 'var(--muted)', textTransform: 'uppercase' }}>
        Recent Entries
      </div>
      {recent.map(e => (
        <div key={e.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 16px', borderTop: '1px solid var(--border)' }}>
          <span style={{ fontSize: 13, color: 'var(--muted)' }}>{formatDisplay(e.date)}</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: 15, fontWeight: 700, color: 'var(--text)' }}>{e.weight} lbs</span>
            <button
              onClick={() => { if (window.confirm('Delete this entry?')) onDelete(e.id) }}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--muted)', padding: 2, display: 'flex' }}
            >
              <Trash2 size={13} />
            </button>
          </div>
        </div>
      ))}
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

  const { entries, loading, addEntries, deleteEntry, clearAll } = useWeights(person)

  const weightChartData = entries.map(e => ({ label: formatDisplay(e.date), value: e.weight }))
  const bfChartData = entries.filter(e => e.bodyFat !== undefined).map(e => ({ label: formatDisplay(e.date), value: e.bodyFat! }))

  async function handleAddSingle(date: string, weight: number) {
    await addEntries([{ date, weight }])
  }

  async function handleImport(rows: { date: string; weight: number; bodyFat?: number }[]) {
    await addEntries(rows)
  }

  return (
    <div style={{ padding: '24px 16px 16px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div style={{ fontFamily: 'Bebas Neue', fontSize: 26, letterSpacing: '0.05em' }}>PROGRESS</div>
        <PersonSwitcher />
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', color: 'var(--muted)', padding: '40px 0' }}>Loading…</div>
      ) : entries.length === 0 ? (
        <div style={{
          background: 'var(--card)', border: '1px solid var(--border)',
          borderRadius: 16, padding: '36px 24px', textAlign: 'center', marginBottom: 14,
        }}>
          <div style={{ fontSize: 36, marginBottom: 12 }}>⚖️</div>
          <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text)', marginBottom: 6 }}>No data yet</div>
          <div style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.5 }}>
            Log a weight below or import your Conair CSV.
          </div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 14 }}>
          <Chart data={weightChartData} color={accent} goal={weightGoal} label="Weight" unit="lbs" />
          {bfChartData.length >= 2 && (
            <Chart data={bfChartData} color="#a78bfa" goal={bfGoal} label="Body Fat %" unit="%" />
          )}
          <RecentEntries entries={entries} onDelete={deleteEntry} />
          <div style={{
            background: 'var(--card)', border: '1px solid var(--border)',
            borderRadius: 12, padding: '10px 14px', fontSize: 12, color: 'var(--muted)',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          }}>
            <span>{entries.length} weigh-ins · {formatDisplay(entries[0].date)} – {formatDisplay(entries[entries.length - 1].date)}</span>
            <button
              onClick={() => { if (window.confirm('Clear all weight data for this person?')) clearAll() }}
              style={{ background: 'none', border: 'none', color: 'var(--muted)', fontSize: 11, cursor: 'pointer', fontWeight: 600 }}
            >
              CLEAR ALL
            </button>
          </div>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <AddEntryForm onAdd={handleAddSingle} />
        <ImportButton person={person} onImport={handleImport} />
        <div style={{ padding: '4px 2px', fontSize: 12, color: 'var(--muted)', lineHeight: 1.6 }}>
          <strong style={{ color: 'var(--muted)' }}>Conair CSV:</strong>{' '}
          Open the Conair app → History → Export → save to Files → share here.
        </div>
      </div>
    </div>
  )
}
