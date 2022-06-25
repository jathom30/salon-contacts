import React, { FormEvent, useState } from "react";
import { createContact, createNote } from "api";
import { ContactCardsSVG } from "assets";
import { Button, FlexBox, Input, Label } from "components";
import { useValidatedMask, useValidatedState } from "hooks";
import { useMutation } from "react-query";
import { useNavigate } from "react-router-dom";
import { Contact } from "typings";
import './CreateContactRoute.scss'

export const CreateContactRoute = () => {
  const [name, setName] = useState('')
  const [phone, setPhone, isValidPhone] = useValidatedMask({
    initialState: '',
    validationMask: 'phone-number'
  })
  const [email, setEmail, isValidEmail] = useValidatedState('', 'email')
  const [note, setNote] = useState('')

  const navigate = useNavigate()

  const createNoteMutation = useMutation(createNote, {
    onSuccess: (data) => {
      // hair_formula is the contact id we should route to
      navigate(`/${data[0].fields.hair_formula}`)
    }
  })

  const createContactMutation = useMutation(createContact, {
    onSuccess: (data) => {
      createNoteMutation.mutate({
        hair_formula: [data[0].id],
        date: new Date().toString(),
        details: note,
      })
    }
  })

  const handleCreateContact = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const formData: Omit<Contact, 'id'> = {
      name,
      ...(!!phone && {phone_number: phone}),
      ...(!!email && {email}),
    }
    createContactMutation.mutate(formData)
  }

  const disabled = !!(!name || !note)

  if (createContactMutation.isLoading || createNoteMutation.isLoading) {
    return (
      <div className="CreateContactRoute">
        <div className="CreateContactRoute__loader">
          <div className="CreateContactRoute__loader-svg">
            <ContactCardsSVG />
          </div>
          <h1 className="CreateContactRoute__loader-label">Creating <span>{name}</span>'s contact</h1>
        </div>
      </div>
    )
  }

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
            hasError={!isValidPhone}
          />

          <Input
            name="email"
            label="Email"
            value={email}
            onChange={setEmail}
            hasError={!isValidEmail}
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
    </div>
  )
}