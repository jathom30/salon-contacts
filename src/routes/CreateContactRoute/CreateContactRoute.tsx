import React, { FormEvent, useState } from "react";
import { createContact, createNote } from "api";
import { ContactCardsSVG } from "assets";
import { Button, FlexBox, Input, Label } from "components";
import { useValidatedMask, useValidatedState } from "hooks";
import { useMutation, useQueryClient } from "react-query";
import { useNavigate } from "react-router-dom";
import { Contact, Note } from "typings";
import './CreateContactRoute.scss'
import { FieldSet, Record, Records } from "airtable";
import { useIdentityContext } from "react-netlify-identity";

export const CreateContactRoute = () => {
  const { user } = useIdentityContext()
  const [name, setName] = useState('')
  const [phone, setPhone, isValidPhone] = useValidatedMask({
    initialState: '',
    validationMask: 'phone-number'
  })
  const [email, setEmail, isValidEmail] = useValidatedState('', 'email')
  const [note, setNote] = useState('')

  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const CONTACTS_QUERY_KEY = ['contacts', user?.id]

  const createNoteMutation = useMutation((newNote: Omit<Note, 'id'>) => {
    const delayedResponse = new Promise((resolve) => {
      setTimeout(() => {
        resolve(createNote(newNote));
      }, 2000);
    });
    return delayedResponse as Promise<Record<FieldSet>[]>
  }, {
    onSuccess: (data) => {
      // hair_formula is the contact id we should route to
      navigate(`/${data[0].fields.hair_formula}`)
    }
  })

  const createContactMutation = useMutation(createContact, {
    onMutate: async (newContact) => {
      await queryClient.cancelQueries(CONTACTS_QUERY_KEY)

      const prevContacts = queryClient.getQueryData<Records<FieldSet>>(CONTACTS_QUERY_KEY)

      if (prevContacts) {
        queryClient.setQueryData(CONTACTS_QUERY_KEY, [
          ...prevContacts,
          {
            fields: {
              // id will be replaced upon refetch
              id: 'temp_id',
              ...newContact
            }
          }
        ])
      }
      return { prevContacts }
    },
    onSuccess: (data) => {
      createNoteMutation.mutate({
        hair_formula: [data[0].id],
        date: new Date().toString(),
        details: note,
      })
    },
    onSettled: () => {
      queryClient.invalidateQueries(CONTACTS_QUERY_KEY)
    }
  })

  const handleCreateContact = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!user?.id) { return }
    const formData: Omit<Contact, 'id'> = {
      name,
      user_id: user?.id,
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
            <Label required>Note</Label>
            <textarea value={note} onChange={e => setNote(e.target.value)} rows={10} />
          </FlexBox>
          <Button type="submit" kind="primary" isDisabled={disabled}>Submit</Button>
        </FlexBox>
      </form>
    </div>
  )
}