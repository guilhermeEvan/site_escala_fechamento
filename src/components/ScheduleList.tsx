import type { ClosingSchedule, ScheduleStatus, Volunteer } from '../types'
import { isPastDate, toPtBrDate } from '../utils/date'

interface ScheduleListProps {
  schedules: ClosingSchedule[]
  volunteers: Volunteer[]
  onDeleteSchedule: (id: string) => void
  onChangeStatus: (id: string, status: ScheduleStatus) => void
}

function getVolunteerName(volunteers: Volunteer[], id: string): string {
  return volunteers.find((volunteer) => volunteer.id === id)?.name ?? 'Nao encontrado'
}

export function ScheduleList({
  schedules,
  volunteers,
  onDeleteSchedule,
  onChangeStatus,
}: ScheduleListProps) {
  return (
    <section className="card">
      <header className="section-header">
        <h2>Escalas cadastradas</h2>
        <p>Acompanhe status e detalhes de cada fechamento.</p>
      </header>

      <ul className="schedule-list">
        {schedules.length === 0 ? (
          <li className="empty-state">Nenhuma escala criada.</li>
        ) : (
          schedules.map((schedule) => (
            <li key={schedule.id} className="schedule-item">
              <div className="schedule-head">
                <strong>{toPtBrDate(schedule.date)}</strong>
                <span className={isPastDate(schedule.date) ? 'badge late' : 'badge'}>
                  {isPastDate(schedule.date) ? 'Data passada' : 'Futuro'}
                </span>
              </div>

              <p className="volunteer-primary">
                Voluntario sorteado: {getVolunteerName(volunteers, schedule.volunteerId)}
              </p>
              <p className="volunteer-substitute">
                Substituto:{' '}
                {schedule.substituteVolunteerId
                  ? getVolunteerName(volunteers, schedule.substituteVolunteerId)
                  : 'Nao definido'}
              </p>
              {schedule.notes ? <p>Obs: {schedule.notes}</p> : null}

              <div className="schedule-actions">
                <select
                  value={schedule.status}
                  onChange={(event) =>
                    onChangeStatus(schedule.id, event.target.value as ScheduleStatus)
                  }
                >
                  <option value="planejada">Planejada</option>
                  <option value="concluida">Concluida</option>
                  <option value="cancelada">Cancelada</option>
                </select>

                <button
                  type="button"
                  className="ghost-btn"
                  onClick={() => onDeleteSchedule(schedule.id)}
                >
                  Excluir
                </button>
              </div>
            </li>
          ))
        )}
      </ul>
    </section>
  )
}
