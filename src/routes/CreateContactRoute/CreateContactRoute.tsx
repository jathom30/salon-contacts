import React, { FormEvent, useState } from "react";
import { createContact } from "api";
import { ContactCardsSVG } from "assets";
import { Button, FlexBox, Input, Label } from "components";
import { useValidatedMask, useValidatedState } from "hooks";
import { useMutation } from "react-query";
import { useNavigate } from "react-router-dom";
import { Contact, Note } from "typings";
import './CreateContactRoute.scss'
import { FieldSet, Record } from "airtable";

export const CreateContactRoute = () => {
  const [name, setName] = useState('')
  const [phone, setPhone, isValidPhone] = useValidatedMask({
    initialState: '',
    validationMask: 'phone-number'
  })
  const [email, setEmail, isValidEmail] = useValidatedState('', 'email')
  const [note, setNote] = useState('')

  const navigate = useNavigate()

  const createContactMutation = useMutation((newContact: Omit<Contact, 'id'>) => {
    const delayedResponse = new Promise((resolve) => {
      setTimeout(() => {
        resolve(createContact(newContact));
      }, 2000);
    });
    return delayedResponse as Promise<Record<FieldSet>[]>
  }, {
    onSuccess: (data: Record<FieldSet>[]) => {
      navigate(`/${data[0].id}`)
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

  if (createContactMutation.isLoading) {
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