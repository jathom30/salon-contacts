import React, { useState } from "react";
import { getContact } from "api";
import { Button, FlexBox } from "components";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import { Contact, Note } from "typings";
import './ContactRoute.scss'
import { faPencil, faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";

export const ContactRoute = () => {
  const { id } = useParams()
  const [showAllNotes, setShowAllNotes] = useState(false)
  const [contact, setContact] = useState<Contact>()

  const contactQuery = useQuery(
    ['contact', id],
    () => getContact(id || ''),
    { 
      enabled: !!id,
      onSuccess(data) {
        const tempContact = data.fields as unknown as Contact
        const parsedNotes = JSON.parse(data.fields.notes as string)
        setContact({
          ...tempContact,
          notes: parsedNotes
        })
      },
    }
  )

  return (
    <div className="ContactRoute">
      {contactQuery.isLoading ? (
        <div>Loading...</div>
      ) : (
        <>
          <FlexBox flexDirection="column">
            <h1>{contact?.name}</h1>
            <span>{contact?.phone_number}</span>
            <span>{contact?.email}</span>
          </FlexBox>
          <h5>Notes</h5>
          {contact?.notes?.map((note, i) => (
            <NoteBox key={i} note={note} />
          ))}
          {/* <div className="ContactRoute__notes">
            <FlexBox alignItems="center" justifyContent="space-between">
              <h3>Most recent</h3>
              <Button kind="secondary" icon={faPlus}>New Note</Button>
            </FlexBox>
            <Button onClick={() => setShowAllNotes(!showAllNotes)}>{showAllNotes ? 'Collapse' : 'View All'}</Button>
          </div> */}
        </>
      )}
    </div>
  )
}

const NoteBox = ({note}: {note: Note}) => {

  const date = new Date(note.date).toDateString()

  return (
    <div className="Note">
      <FlexBox gap="1rem" alignItems="center" justifyContent="space-between">
        <span className="Note__date">{date}</span>
        <FlexBox gap=".25rem" alignSelf="flex-end">
          <Button isRounded kind="secondary" icon={faPencil} />
          <Button isRounded kind="danger" icon={faTrash} />
        </FlexBox>
      </FlexBox>
      <p>{note.details}</p>
    </div>
  )
}