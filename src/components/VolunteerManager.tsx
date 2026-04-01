import { useState } from 'react'
import type { FormEvent } from 'react'
import type { Volunteer } from '../types'

interface VolunteerManagerProps {
  volunteers: Volunteer[]
  onAddVolunteer: (newVolunteer: Omit<Volunteer, 'id'>) => void
  onRemoveVolunteer: (id: string) => void
}

export function VolunteerManager({
  volunteers,
  onAddVolunteer,
  onRemoveVolunteer,
}: VolunteerManagerProps) {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [ministry, setMinistry] = useState('')

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!name.trim()) {
      return
    }

    onAddVolunteer({
      name: name.trim(),
      phone: phone.trim(),
      ministry: ministry.trim(),
    })

    setName('')
    setPhone('')
    setMinistry('')
  }

  return (
    <section className="card">
      <header className="section-header">
        <h2>Voluntarios</h2>
        <p>Cadastre as pessoas que podem participar do fechamento.</p>
      </header>

      <form className="grid-form" onSubmit={handleSubmit}>
        <label>
          Nome
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Ex.: Maria Silva"
          />
        </label>

        <label>
          Telefone <span className="optional-label"></span>
          <input
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
            placeholder="(11) 99999-9999"
          />
        </label>

        <label>
          Ministerio <span className="optional-label"></span>
          <input
            value={ministry}
            onChange={(event) => setMinistry(event.target.value)}
            placeholder="Ex.: Acolhimento"
          />
        </label>

        <button type="submit" className="primary-btn">
          Adicionar voluntario
        </button>
      </form>

      <ul className="volunteer-list">
        {volunteers.length === 0 ? (
          <li className="empty-state">Nenhum voluntario cadastrado.</li>
        ) : (
          volunteers.map((volunteer) => (
            <li key={volunteer.id}>
              <div>
                <strong>{volunteer.name}</strong>
                {(volunteer.ministry || volunteer.phone) && (
                  <small>
                    {[volunteer.ministry, volunteer.phone].filter(Boolean).join(' • ')}
                  </small>
                )}
              </div>
              <button
                type="button"
                className="ghost-btn"
                onClick={() => onRemoveVolunteer(volunteer.id)}
              >
                Remover
              </button>
            </li>
          ))
        )}
      </ul>
    </section>
  )
}
