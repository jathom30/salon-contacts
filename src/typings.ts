// future state
export type Note = {
  date: string
  details: string
  image?: string
}

export type Contact = {
  id: string
  name: string
  phone_number?: string
  email?: string
  notes: Note[]
}