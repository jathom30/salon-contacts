import React, { useRef, useState } from "react";
import { FlexBox, Label, Button, GridBox, NoteBox, Loader } from "components";
import { faPlus, faSave, faTimes } from "@fortawesome/free-solid-svg-icons";
import { Note } from "typings";
import { useOnClickOutside } from "hooks";
import { useUpdateNotes } from "hooks";
import { useParams } from "react-router-dom";

export const Notes = () => {
  const { id } = useParams()
  const [showNewNote, setShowNewNote] = useState(false)
  const [note, setNote] = useState('')
  const newNoteRef = useRef<HTMLTextAreaElement>(null)
  const saveNoteRef = useRef<HTMLButtonElement>(null)

  useOnClickOutside([newNoteRef, saveNoteRef], () => {
    setShowNewNote(false)
    setNote('')
  })

  const {notes, notesLoading, createMutate, updateMutate, deleteMutate, deleteLoading } = useUpdateNotes()

  const handleSaveNew = () => {
    setShowNewNote(false)
    if (!note) { return }
    createMutate({
      hair_formula: [id || ''],
      date: (new Date()).toString(),
      details: note,
    })
    setNote('')
  }

  const handleDelete = (id: string) => {
    deleteMutate(id)
  }

  const handleUpdateNote = (newNote: Note) => {
    updateMutate(newNote)
  }

  if (notesLoading) {
    return (
      <div className="Notes">
        <FlexBox flexDirection="column" gap="1rem">
          <Label>Notes</Label>
          <Loader />
        </FlexBox>
      </div>
    )
  }

  return (
    <div className="Notes">
      <FlexBox flexDirection="column" gap="1rem">
        <FlexBox alignItems="flex-end" justifyContent="space-between">
          <Label>Notes</Label>
          <FlexBox gap=".5rem">
            {showNewNote && <Button isRounded icon={faTimes} onClick={() => {setShowNewNote(false); setNote('')}} />}
            <Button
              buttonRef={saveNoteRef}
              isRounded
              icon={showNewNote ? faSave : faPlus}
              kind={showNewNote ? 'primary' : 'default'}
              onClick={() => showNewNote ? handleSaveNew() : setShowNewNote(true)}
            />
          </FlexBox>
        </FlexBox>
        {showNewNote && (
          <textarea ref={newNoteRef} rows={10} value={note} onChange={e => setNote(e.target.value)} />
        )}
        <GridBox gap="1rem" gridTemplateColumns="repeat(auto-fill, minmax(350px, 1fr))">
          {notes?.map((note) => {
            return (
            <NoteBox
              key={note.id}
              note={note}
              onDelete={handleDelete}
              loadingDelete={deleteLoading}
              onChange={handleUpdateNote}
              canDelete={notes.length > 1}
            />
          )})}
        </GridBox>
      </FlexBox>
    </div>
  )
}