export type ScheduleStatus = 'planejada' | 'concluida' | 'cancelada'

export interface Volunteer {
  id: string
  name: string
  phone: string
  ministry: string
}

export interface ClosingSchedule {
  id: string
  date: string
  volunteerId: string
  substituteVolunteerId: string | null
  notes: string
  status: ScheduleStatus
  createdAt: string
}

export interface ScheduleFormValues {
  date: string
  notes: string
}
