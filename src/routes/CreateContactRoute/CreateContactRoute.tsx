import { createContact } from "api";
import { Button, FlexBox, Input, Label, Loader } from "components";
import React, { FormEvent, useState } from "react";
import { useMutation } from "react-query";
import { useNavigate } from "react-router-dom";
import { Contact, Note } from "typings";
import './CreateContactRoute.scss'

export const CreateContactRoute = () => {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [note, setNote] = useState('')

  const navigate = useNavigate()

  const createContactMutation = useMutation(createContact, {
    onSuccess: () => {
      navigate('/')
    }
  })

  const handleCreateContact = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const noteWithDate: Note = {
      date: new Date().toString(),
      details: note
    }
    const formData: Omit<Contact, 'id'> = {
      name,
      ...(!!phone && {phone_number: phone}),
      ...(!!email && {email}),
      notes: [noteWithDate]
    }
    createContactMutation.mutate(formData)
  }

  const disabled = !!(!name || !note)

  return (
    <div className="CreateContactRoute">
      <form onSubmit={handleCreateContact}>
        <FlexBox flexDirection="column" gap="1rem">
          <Input
            name="name"
            label="Name"
            required
            value={name}
            onChange={setName}
          />
          <Input
            name="phone"
            label="Phone nunber"
            value={phone}
            onChange={setPhone}
          />
          <Input
            name="email"
            label="Email"
            value={email}
            onChange={setEmail}
          />
          <FlexBox flexDirection="column" gap=".25rem" flexGrow={1}>
            <Label required>
              <span>Note</span>
            </Label>
            <textarea value={note} onChange={e => setNote(e.target.value)} rows={10} />
          </FlexBox>
          <Button type="submit" kind="primary" isDisabled={disabled}>Submit</Button>
        </FlexBox>
      </form>
      {createContactMutation.isLoading && (
        <div className="CreateContactRoute__loader"><Loader size="l" /></div>
      )}
    </div>
  )
}