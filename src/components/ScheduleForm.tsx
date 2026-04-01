import { useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import type { ScheduleFormValues, Volunteer } from '../types'

interface ScheduleFormProps {
  volunteers: Volunteer[]
  onCreateSchedule: (values: ScheduleFormValues) => void
}

const initialState: ScheduleFormValues = {
  date: '',
  notes: '',
}

export function ScheduleForm({ volunteers, onCreateSchedule }: ScheduleFormProps) {
  const [values, setValues] = useState<ScheduleFormValues>(initialState)

  const sortedVolunteers = useMemo(
    () => [...volunteers].sort((a, b) => a.name.localeCompare(b.name)),
    [volunteers],
  )

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!values.date) {
      return
    }

    onCreateSchedule(values)
    setValues(initialState)
  }

  return (
    <section className="card">
      <header className="section-header">
        <h2>Nova escala de fechamento</h2>
        <p>Escolha a data, sorteie o principal e um substituto automatico.</p>
      </header>

      <form className="grid-form" onSubmit={handleSubmit}>
        <label>
          Data
          <input
            type="date"
            value={values.date}
            onChange={(event) =>
              setValues((prev) => ({ ...prev, date: event.target.value }))
            }
          />
        </label>

        <label className="full-width">
          Observação (opicional)
          <textarea
            rows={3}
            value={values.notes}
            onChange={(event) =>
              setValues((prev) => ({ ...prev, notes: event.target.value }))
            }
            placeholder="Ex.: conferir portas laterais"
          />
        </label>

        <fieldset className="full-width support-grid">
          <legend>Voluntarios disponiveis para sorteio</legend>
          {sortedVolunteers.length === 0 ? (
            <p>Cadastre voluntarios antes de criar uma escala.</p>
          ) : (
            sortedVolunteers.map((volunteer) => (
              <label key={volunteer.id} className="check-row">
                <input type="checkbox" checked readOnly />
                <span>{volunteer.name}</span>
              </label>
            ))
          )}
        </fieldset>

        <button type="submit" className="primary-btn" disabled={volunteers.length === 0}>
          Gerar escala aleatoria
        </button>
      </form>
    </section>
  )
}
