import { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { useAppStore } from '@/hooks/useAppStore'
import PersonSwitcher from '@/components/PersonSwitcher'

interface DayPlan {
  day: string
  focus: string
  exercises: { name: string; sets: string }[]
  cardio?: string
  notes?: string
}

const HIM_WEEK: DayPlan[] = [
  {
    day: 'Monday', focus: 'Push (Chest/Shoulders/Triceps)',
    exercises: [
      { name: 'Bench Press', sets: '4×6–8' },
      { name: 'Incline DB Press', sets: '3×10–12' },
      { name: 'Cable Fly', sets: '3×12–15' },
      { name: 'Overhead Press', sets: '3×8–10' },
      { name: 'Lateral Raise', sets: '3×15' },
      { name: 'Tricep Pushdown', sets: '3×12' },
    ],
    cardio: '15 min incline walk post',
  },
  {
    day: 'Tuesday', focus: 'Pull (Back/Biceps)',
    exercises: [
      { name: 'Pull-Ups', sets: '4×6–8' },
      { name: 'Barbell Row', sets: '4×8' },
      { name: 'Seated Cable Row', sets: '3×12' },
      { name: 'Lat Pulldown', sets: '3×12' },
      { name: 'Face Pull', sets: '3×15' },
      { name: 'Barbell Curl', sets: '3×10' },
    ],
    cardio: '15 min incline walk post',
  },
  {
    day: 'Wednesday', focus: 'Legs (Quad Focus)',
    exercises: [
      { name: 'Squat', sets: '4×6–8' },
      { name: 'Leg Press', sets: '3×12' },
      { name: 'Leg Extension', sets: '3×15' },
      { name: 'Romanian Deadlift', sets: '3×10' },
      { name: 'Leg Curl', sets: '3×12' },
      { name: 'Calf Raise', sets: '4×15' },
    ],
  },
  {
    day: 'Thursday', focus: 'Rest / Active Recovery',
    exercises: [],
    cardio: '20–30 min walk or light bike',
    notes: 'Mobility work, stretch, foam roll',
  },
  {
    day: 'Friday', focus: 'Upper (Strength Focus)',
    exercises: [
      { name: 'Deadlift', sets: '4×5' },
      { name: 'Incline Press', sets: '4×8' },
      { name: 'T-Bar Row', sets: '3×10' },
      { name: 'DB Shoulder Press', sets: '3×10' },
      { name: 'Cable Curl', sets: '3×12' },
      { name: 'Skull Crusher', sets: '3×12' },
    ],
    cardio: '15 min incline walk post',
  },
  {
    day: 'Saturday', focus: 'Legs (Hamstring/Glute Focus)',
    exercises: [
      { name: 'Romanian Deadlift', sets: '4×8' },
      { name: 'Hip Thrust', sets: '4×12' },
      { name: 'Leg Curl', sets: '3×12' },
      { name: 'Walking Lunge', sets: '3×12/leg' },
      { name: 'Adductor Machine', sets: '3×15' },
      { name: 'Calf Raise', sets: '3×15' },
    ],
  },
  {
    day: 'Sunday', focus: 'Full Rest',
    exercises: [],
    notes: 'Meal prep day. Sleep 8+ hrs.',
  },
]

const HER_WEEK: DayPlan[] = [
  {
    day: 'Monday', focus: 'Glutes & Hamstrings',
    exercises: [
      { name: 'Hip Thrust', sets: '4×12' },
      { name: 'Romanian Deadlift', sets: '3×10' },
      { name: 'Cable Kickback', sets: '3×15/side' },
      { name: 'Leg Curl', sets: '3×12' },
      { name: 'Abductor Machine', sets: '3×20' },
    ],
    cardio: '20 min stairmaster',
  },
  {
    day: 'Tuesday', focus: 'Upper Body',
    exercises: [
      { name: 'Lat Pulldown', sets: '3×12' },
      { name: 'Seated Cable Row', sets: '3×12' },
      { name: 'DB Shoulder Press', sets: '3×12' },
      { name: 'Lateral Raise', sets: '3×15' },
      { name: 'Tricep Overhead', sets: '3×12' },
      { name: 'Hammer Curl', sets: '3×12' },
    ],
    cardio: '15 min incline walk',
  },
  {
    day: 'Wednesday', focus: 'Quads & Calves',
    exercises: [
      { name: 'Goblet Squat', sets: '4×12' },
      { name: 'Leg Press', sets: '3×15' },
      { name: 'Leg Extension', sets: '3×15' },
      { name: 'Walking Lunge', sets: '3×12/leg' },
      { name: 'Calf Raise', sets: '4×20' },
    ],
  },
  {
    day: 'Thursday', focus: 'Rest / Active Recovery',
    exercises: [],
    cardio: '30 min walk',
    notes: 'Stretch, yoga, foam roll',
  },
  {
    day: 'Friday', focus: 'Glutes & Legs (Heavy)',
    exercises: [
      { name: 'Sumo Deadlift', sets: '4×8' },
      { name: 'Bulgarian Split Squat', sets: '3×10/leg' },
      { name: 'Hip Thrust', sets: '4×10' },
      { name: 'Leg Press', sets: '3×12' },
      { name: 'Abductor Machine', sets: '3×20' },
    ],
    cardio: '20 min stairmaster',
  },
  {
    day: 'Saturday', focus: 'Full Body Conditioning',
    exercises: [
      { name: 'KB Swing', sets: '4×15' },
      { name: 'DB Romanian Deadlift', sets: '3×12' },
      { name: 'Push-Up', sets: '3×max' },
      { name: 'TRX Row', sets: '3×12' },
      { name: 'Plank', sets: '3×45s' },
    ],
    cardio: '20 min bike',
  },
  {
    day: 'Sunday', focus: 'Full Rest',
    exercises: [],
    notes: 'Meal prep. Rest. Recovery.',
  },
]

function DayCard({ day }: { day: DayPlan }) {
  const [open, setOpen] = useState(false)
  const isRest = day.exercises.length === 0

  return (
    <div style={{
      background: 'var(--card)',
      border: '1px solid var(--border)',
      borderRadius: 14,
      overflow: 'hidden',
    }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          padding: '14px 16px',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          textAlign: 'left',
          gap: 12,
        }}
      >
        <div style={{
          width: 40,
          height: 40,
          borderRadius: 10,
          background: isRest ? 'var(--card2)' : 'var(--m-dim)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 18,
          flexShrink: 0,
        }}>
          {isRest ? '😴' : '💪'}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 700, fontSize: 15, color: 'var(--text)' }}>{day.day}</div>
          <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 2 }}>{day.focus}</div>
        </div>
        <div style={{ color: 'var(--muted)' }}>
          {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </div>
      </button>

      {open && (
        <div style={{ padding: '0 16px 16px', borderTop: '1px solid var(--border)' }}>
          {day.exercises.length > 0 && (
            <div style={{ paddingTop: 12 }}>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', color: 'var(--muted)', textTransform: 'uppercase', marginBottom: 8 }}>
                Exercises
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {day.exercises.map((ex, i) => (
                  <div key={i} style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    background: 'var(--card2)',
                    borderRadius: 8,
                    padding: '8px 12px',
                  }}>
                    <span style={{ fontSize: 14, color: 'var(--text)' }}>{ex.name}</span>
                    <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--m)', fontFamily: 'DM Mono, monospace' }}>{ex.sets}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {day.cardio && (
            <div style={{ marginTop: 12, padding: '8px 12px', background: 'var(--card2)', borderRadius: 8, fontSize: 13, color: 'var(--warm)' }}>
              🏃 {day.cardio}
            </div>
          )}
          {day.notes && (
            <div style={{ marginTop: 8, fontSize: 13, color: 'var(--muted)', fontStyle: 'italic' }}>
              {day.notes}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default function Week() {
  const { person } = useAppStore()
  const week = person === 'him' ? HIM_WEEK : HER_WEEK

  return (
    <div style={{ padding: '24px 16px 16px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div style={{ fontFamily: 'Bebas Neue', fontSize: 26, letterSpacing: '0.05em' }}>TRAINING WEEK</div>
        <PersonSwitcher />
      </div>

      <div style={{
        background: 'var(--card)',
        border: '1px solid var(--border)',
        borderRadius: 12,
        padding: '10px 14px',
        marginBottom: 16,
        fontSize: 13,
        color: 'var(--muted)',
      }}>
        💡 Tap each day to expand the workout
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {week.map(day => <DayCard key={day.day} day={day} />)}
      </div>
    </div>
  )
}
