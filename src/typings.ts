export type Note = {
  id: string
  hair_formula: string[]
  date: string
  details: string
  image?: string
}

export type Contact = {
  id: string
  name: string
  phone_number?: string
  email?: string
  note_ids?: string[]
}
