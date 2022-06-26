import { FieldSet } from "airtable";
import { Note } from "typings";
import { base } from "./setup";

const notesBase = base(process.env.REACT_APP_AIRTABLE_NOTES_TABLE || '')

export const getNotes = (hairFormulaId: string) => notesBase.select({filterByFormula: `SEARCH("${hairFormulaId}", {hair_formula})`}).all()

export const createNote = (note: Omit<Note, 'id'>) => notesBase.create([{fields: note}])

export const updateNote = (note: Note) => {
  const {id, ...fields} = note
  return notesBase.update([{id, fields: fields as unknown as FieldSet}])
}

export const deleteNote = (id: string) => notesBase.destroy(id)
