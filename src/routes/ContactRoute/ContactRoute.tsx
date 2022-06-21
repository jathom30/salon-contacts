import React, { MouseEvent, useRef, useState } from "react";
import { deleteContact, getContact, updateContact } from "api";
import { AddField, Button, DeleteWarning, FlexBox, Label, LabelInput, Loader, MaxHeightContainer, Modal, NoteBox } from "components";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useNavigate, useParams } from "react-router-dom";
import { Contact, Note } from "typings";
import './ContactRoute.scss'
import { faPlus, faSave, faTimes, faTrash } from "@fortawesome/free-solid-svg-icons";
import { useOnClickOutside } from "hooks";
import { maskingFuncs } from "hooks/useMask/maskingFuncs";
import { FieldSet, Record } from "airtable";

export const ContactRoute = () => {
  const { id } = useParams()
  const [showNewNote, setShowNewNote] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [note, setNote] = useState('')
  const navigate = useNavigate()
  const newNoteRef = useRef<HTMLTextAreaElement>(null)
  const saveNoteRef = useRef<HTMLButtonElement>(null)

  const queryClient = useQueryClient()

  
  useOnClickOutside([newNoteRef, saveNoteRef], () => {
    setShowNewNote(false)
    setNote('')
  })

  const CONTACT_QUERY_KEY = ['contact', id]
  
  const contactQuery = useQuery(
    CONTACT_QUERY_KEY,
    () => getContact(id || ''),
    { enabled: !!id }
    )
    
  const contact = contactQuery.data?.fields as unknown as Contact | undefined
  const notes = contactQuery.data?.fields.notes ? JSON.parse(contactQuery.data?.fields.notes as string) as Note[] | undefined : []
  
  const updateContactMutation = useMutation(updateContact, {
    onMutate: async (newContact) => {
      await queryClient.cancelQueries(CONTACT_QUERY_KEY)

      const prevContact = queryClient.getQueryData<Record<FieldSet>>(CONTACT_QUERY_KEY)

      if (prevContact) {
        const parsedNewContact = {
          ...newContact,
          notes: JSON.stringify(newContact.notes)
        }
        queryClient.setQueryData(CONTACT_QUERY_KEY, {
          ...prevContact,
          fields: {
            ...prevContact?.fields,
            ...parsedNewContact
          }
        })
      }
      return { prevContact }
    },
    onSettled: () => {
      queryClient.invalidateQueries(CONTACT_QUERY_KEY)
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

  if (contactQuery.isLoading) {
    return (
      <div className="ContactRoute">
        <div className="ContactRoute__loader">
          <Loader />
        </div>
      </div>
    )
  }

  return (
    <div className="ContactRoute">
      <MaxHeightContainer
        header={
          <div className="ContactRoute__header">
            <FlexBox alignItems="center" justifyContent="space-between" gap="0.5rem" padding="1rem">
              <LabelInput value={contact?.name || ''} onSubmit={val => handleUpdateDetails(val as string, 'name')}>
                <h1>{contact?.name}</h1>
              </LabelInput>
              <Button isRounded icon={faTrash} onClick={() => setShowDeleteModal(true)} kind="danger" />
            </FlexBox>
          </div>
        }
      >
        <FlexBox padding="1rem" flexDirection="column" gap="1rem">
          <FlexBox flexDirection="column" gap=".5rem">
            <Label>Details</Label>
            <FlexBox flexDirection="column" gap="0.25rem">
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
          </FlexBox>
          <FlexBox flexDirection="column" gap="1rem">
            <FlexBox alignItems="flex-end" justifyContent="space-between">
              <Label>Notes</Label>
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
          </FlexBox>
        </FlexBox>
      </MaxHeightContainer>
      {showDeleteModal && (
        <Modal offClick={() => setShowDeleteModal(false)}>
          <DeleteWarning
            onClose={() => setShowDeleteModal(false)}
            onDelete={handleDeleteContact}
            isLoading={deleteContactMutation.isLoading}
          >
            <span>
              Contact information for <strong>{contact?.name}</strong> cannot be recovered once deleted.
            </span>
          </DeleteWarning>
        </Modal>
      )}
    </div>
  )
}
