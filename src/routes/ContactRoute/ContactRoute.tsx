import React, { FormEvent, MouseEvent, useRef, useState } from "react";
import { deleteContact, getContact, updateContact } from "api";
import { Button, FlexBox, Input, LabelInput, Loader } from "components";
import { useMutation, useQuery } from "react-query";
import { useNavigate, useParams } from "react-router-dom";
import { Contact, Note } from "typings";
import './ContactRoute.scss'
import { faPencil, faPlus, faSave, faTimes, faTrash } from "@fortawesome/free-solid-svg-icons";
import { useOnClickOutside, useValidatedMask } from "hooks";
import { maskingFuncs } from "hooks/useMask/maskingFuncs";

export const ContactRoute = () => {
  const { id } = useParams()
  const [showNewNote, setShowNewNote] = useState(false)
  const [note, setNote] = useState('')
  const navigate = useNavigate()
  const newNoteRef = useRef<HTMLTextAreaElement>(null)
  const saveNoteRef = useRef<HTMLButtonElement>(null)

  
  useOnClickOutside([newNoteRef, saveNoteRef], () => {
    setShowNewNote(false)
    setNote('')
  })
  
  const contactQuery = useQuery(
    ['contact', id],
    () => getContact(id || ''),
    { enabled: !!id }
    )
    
  const contact = contactQuery.data?.fields as unknown as Contact | undefined
  const notes = contactQuery.data?.fields.notes ? JSON.parse(contactQuery.data?.fields.notes as string) as Note[] | undefined : []
  
  const updateContactMutation = useMutation(updateContact, {
    onSuccess: () => {
      contactQuery.refetch()
    }
  })

  const updateContactNotes = (newNote: Note) => {
    if (!contact) { return }

    const newNotes = [
      newNote,
      ...(notes || [])
    ]

    updateContactMutation.mutate({
      ...contact,
      notes: newNotes
    })
  }


  const handleSave = () => {
    setShowNewNote(false)
    if (!note) { return }
    const today = new Date()
    updateContactNotes({
      date: today.toString(),
      details: note
    })
    setNote('')
  }

  const handleNoteDelete = (index: number) => {
    if (!contact) { return }
    const newNotes = notes ? [...notes?.slice(0, index), ...notes?.slice(index + 1)] : []
    updateContactMutation.mutate({
      ...contact,
      notes: newNotes
    })
  }

  const handleSaveNote = (noteDetail: string, index: number) => {
    if (!contact || !notes) { return }
    const newNote: Note = {
      ...notes[index],
      details: noteDetail
    }
    const newNotes = [...notes?.slice(0, index), newNote, ...notes.slice(index + 1)]
    updateContactMutation.mutate({
      ...contact,
      notes: newNotes
    })
  }

  const handleUpdateDetails = (detail: string, field: 'name' | 'phone_number' | 'email') => {
    if (!contact || !notes) { return }
    const newContact = {
      ...contact,
      notes,
      [field]: detail
    }
    updateContactMutation.mutate(newContact)
  }

  const deleteContactMutation = useMutation(deleteContact, {
    onSuccess: () => { navigate("/") }
  })

  const handleDeleteContact = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation()
    deleteContactMutation.mutate(id || '')
  }

  return (
    <div className="ContactRoute">
      {contactQuery.isLoading ? (
        <Loader size="l" />
      ) : (
        <>
          <FlexBox flexDirection="column" gap=".25rem">
            <FlexBox alignItems="center" justifyContent="space-between" gap="0.5rem">
              <LabelInput value={contact?.name || ''} onSubmit={val => handleUpdateDetails(val as string, 'name')}>
                <h1>{contact?.name}</h1>
              </LabelInput>
              <Button isRounded icon={faTrash} onClick={handleDeleteContact} kind="danger" />
            </FlexBox>
            {contact?.phone_number ? (
              <LabelInput value={contact.phone_number || ''} onChange={maskingFuncs["phone-number"]} onSubmit={val => handleUpdateDetails(val as string, 'phone_number')} placeholder="Add phone number">
                <span>{contact.phone_number}</span>
              </LabelInput>
            ) : (
              <AddField label="Add phone number" onSubmit={(val) => handleUpdateDetails(val, 'phone_number')} validation="phone-number" />
            )}
            {contact?.email ? (
              <LabelInput value={contact?.email || ''} onSubmit={val => handleUpdateDetails(val as string, 'email')} placeholder="Add email">
                <span>{contact?.email}</span>
              </LabelInput>
            ) : (
              <AddField label="Add email" onSubmit={(val) => handleUpdateDetails(val, 'email')} validation="email" />
            )}
          </FlexBox>
          <FlexBox alignItems="center" justifyContent="space-between">
            <h5>Notes</h5>
            <FlexBox gap=".5rem">
              {showNewNote && <Button isRounded icon={faTimes} onClick={() => {setShowNewNote(false); setNote('')}} />}
              <Button buttonRef={saveNoteRef} isRounded icon={showNewNote ? faSave : faPlus} kind={showNewNote ? 'primary' : 'default'} onClick={() => showNewNote ? handleSave() : setShowNewNote(true)} />
            </FlexBox>
          </FlexBox>
          {showNewNote && (
            <textarea ref={newNoteRef} rows={10} value={note} onChange={e => setNote(e.target.value)} />
          )}
          {notes?.map((note, i) => (
            <NoteBox
              key={note.date}
              note={note}
              onDelete={() => handleNoteDelete(i)}
              onChange={detail => handleSaveNote(detail, i)}
              canDelete={notes.length > 1}
            />
          ))}
        </>
      )}
      {(updateContactMutation.isLoading || contactQuery.isRefetching) && <div className="ContactRoute__loader"><Loader size="l" /></div>}
    </div>
  )
}

const NoteBox = ({note, onDelete, onChange, canDelete}: {note: Note, onDelete: () => void, onChange: (noteDetails: string) => void, canDelete: boolean}) => {
  const [edit, setEdit] = useState(false)
  const [details, setDetails] = useState(note.details)
  const noteRef = useRef<HTMLTextAreaElement>(null)
  const cancelButtonRef = useRef<HTMLButtonElement>(null)
  const saveButtonRef = useRef<HTMLButtonElement>(null)

  useOnClickOutside([noteRef, cancelButtonRef, saveButtonRef], () => {
    setEdit(false)
    setDetails(note.details)
  })

  const date = new Date(note.date).toDateString()

  const handleSave = () => {
    setEdit(false)
    onChange(details)
  }

  const handleCancel = () => {
    setDetails(note.details)
    setEdit(false)
  }

  const splitNote = note.details.split('\n')

  return (
    <div className="Note">
      <FlexBox gap="1rem" alignItems="center" justifyContent="space-between">
        <span className="Note__date">{date}</span>
        <FlexBox gap=".25rem" alignSelf="flex-end">
          <Button buttonRef={cancelButtonRef} isRounded kind={edit ? "default" : "secondary"} icon={edit ? faTimes : faPencil} onClick={() => edit ? handleCancel() : setEdit(true)} />
          <Button isDisabled={!canDelete} isRounded kind="danger" icon={faTrash} onClick={onDelete} />
        </FlexBox>
      </FlexBox>
      {edit ? (
        <>
          <textarea ref={noteRef} rows={10} value={details} onChange={e => setDetails(e.target.value)} />
          <Button buttonRef={saveButtonRef} kind="primary" icon={faSave} onClick={handleSave}>Save note</Button>
        </>
      ) : (
        splitNote.map((split, i) => (
          <p key={i}>{split}</p>
        ))
      )}
    </div>
  )
}

const AddField = ({label, onSubmit, validation}: {label: string; onSubmit: (newVal: string) => void; validation: 'phone-number' | 'email'}) => { 
  const [showInput, setShowInput] = useState(false)
  const [value, setValue, isValid] = useValidatedMask({
    initialState: '',
    validation,
    mask: validation === 'phone-number' ? 'phone-number' : (val) => val
  })
  const formRef = useRef<HTMLFormElement>(null)

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    onSubmit(value)
    setShowInput(false)
  }

  useOnClickOutside(formRef, () => setShowInput(false))

  if (showInput) {
    return (
      <div className="AddField">
        <form ref={formRef} onSubmit={handleSubmit}>
          <FlexBox gap="1rem">
            <Input name={label} value={value} onChange={setValue} placeholder={label} hasError={!isValid} />
            <Button type="submit" icon={faSave} isRounded kind="primary" />
          </FlexBox>
        </form>
      </div>

    )
  }
  return (
    <Button icon={faPlus} onClick={() => setShowInput(true)}>{label}</Button>
  )
}