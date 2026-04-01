import { useEffect, useMemo } from 'react'
import { ScheduleForm } from './components/ScheduleForm'
import { ScheduleList } from './components/ScheduleList'
import { VolunteerManager } from './components/VolunteerManager'
import { useLocalStorage } from './hooks/useLocalStorage'
import type { ClosingSchedule, ScheduleFormValues, Volunteer } from './types'
import './App.css'

function App() {
  const [volunteers, setVolunteers] = useLocalStorage<Volunteer[]>(
    'church-volunteers',
    [],
  )
  const [schedules, setSchedules] = useLocalStorage<ClosingSchedule[]>(
    'church-closing-schedules',
    [],
  )

  const [theme, setTheme] = useLocalStorage<'light' | 'dark'>('church-theme', 'light')

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  function toggleTheme() {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'))
  }

  const kpis = useMemo(() => {
    const total = schedules.length
    const planned = schedules.filter((item) => item.status === 'planejada').length
    const done = schedules.filter((item) => item.status === 'concluida').length
    return { total, planned, done }
  }, [schedules])

  function addVolunteer(newVolunteer: Omit<Volunteer, 'id'>) {
    setVolunteers((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        ...newVolunteer,
      },
    ])
  }

  function removeVolunteer(id: string) {
    setVolunteers((prev) => prev.filter((volunteer) => volunteer.id !== id))
    setSchedules((prev) =>
      prev
        .filter((schedule) => schedule.volunteerId !== id)
        .map((schedule) =>
          schedule.substituteVolunteerId === id
            ? { ...schedule, substituteVolunteerId: null }
            : schedule,
        ),
    )
  }

  function createSchedule(values: ScheduleFormValues) {
    if (volunteers.length === 0) {
      return
    }

    const randomIndex = Math.floor(Math.random() * volunteers.length)
    const selectedVolunteer = volunteers[randomIndex]

    const remainingVolunteers = volunteers.filter(
      (volunteer) => volunteer.id !== selectedVolunteer.id,
    )
    const substituteVolunteer =
      remainingVolunteers.length > 0
        ? remainingVolunteers[Math.floor(Math.random() * remainingVolunteers.length)]
        : null

    setSchedules((prev) => [
      {
        id: crypto.randomUUID(),
        date: values.date,
        volunteerId: selectedVolunteer.id,
        substituteVolunteerId: substituteVolunteer?.id ?? null,
        notes: values.notes.trim(),
        status: 'planejada',
        createdAt: new Date().toISOString(),
      },
      ...prev,
    ])
  }

  function deleteSchedule(id: string) {
    setSchedules((prev) => prev.filter((schedule) => schedule.id !== id))
  }

  function changeScheduleStatus(id: string, status: ClosingSchedule['status']) {
    setSchedules((prev) =>
      prev.map((schedule) =>
        schedule.id === id ? { ...schedule, status } : schedule,
      ),
    )
  }

  return (
    <main className="layout">
      <header className="hero">
        <div className="hero-top">
          <p className="eyebrow">Igreja • Operação de fechamento</p>
          <button type="button" className="theme-toggle" onClick={toggleTheme}>
            {theme === 'light' ? '🌙 Modo noturno' : '☀️ Modo claro'}
          </button>
        </div>
        <h1>Escala de Fechamento</h1>
        <p>
          Cadastre voluntários e gere principal + substituto aleatórios por data.
        </p>

        <div className="kpi-grid">
          <article>
            <strong>{kpis.total}</strong>
            <span>Total de escalas</span>
          </article>
          <article>
            <strong>{kpis.planned}</strong>
            <span>Planejadas</span>
          </article>
          <article>
            <strong>{kpis.done}</strong>
            <span>Concluidas</span>
          </article>
        </div>
      </header>

      <div className="content-grid">
        <VolunteerManager
          volunteers={volunteers}
          onAddVolunteer={addVolunteer}
          onRemoveVolunteer={removeVolunteer}
        />
        <ScheduleForm volunteers={volunteers} onCreateSchedule={createSchedule} />
      </div>

      <ScheduleList
        schedules={schedules}
        volunteers={volunteers}
        onDeleteSchedule={deleteSchedule}
        onChangeStatus={changeScheduleStatus}
      />
    </main>
  )
}

export default App
