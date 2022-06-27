import React, { MouseEvent, useContext, useState } from "react";
import { deleteContact, getContact, updateContact } from "api";
import { AddField, Button, DeleteWarning, FlexBox, Notes, Label, LabelInput, Loader, MaxHeightContainer, Modal, NotFound } from "components";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useNavigate, useParams } from "react-router-dom";
import { Contact } from "typings";
import './ContactRoute.scss'
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { maskingFuncs } from "hooks/useMask/maskingFuncs";
import { FieldSet, Record, Records } from "airtable";
import { WindowDimsContext } from "context";
import { useIdentityContext } from "react-netlify-identity";

export const ContactRoute = () => {
  const { user } = useIdentityContext()
  const { id } = useParams()
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const navigate = useNavigate()

  const queryClient = useQueryClient()
  const {isMobileWidth} = useContext(WindowDimsContext)

    const CONTACT_QUERY_KEY = ['contact', id]
  
  const contactQuery = useQuery(
    CONTACT_QUERY_KEY,
    () => getContact(id || ''),
    { enabled: !!id }
    )
    
  const contact = contactQuery.data?.fields as unknown as Contact | undefined
  
  const updateContactMutation = useMutation(updateContact, {
    onMutate: async (newContact) => {
      await queryClient.cancelQueries(CONTACT_QUERY_KEY)

      const prevContact = queryClient.getQueryData<Record<FieldSet>>(CONTACT_QUERY_KEY)

      if (prevContact) {
        queryClient.setQueryData(CONTACT_QUERY_KEY, {
          ...prevContact,
          fields: {
            ...prevContact?.fields,
            ...newContact
          }
        })
      }
      return { prevContact }
    },
    onSettled: () => {
      queryClient.invalidateQueries(CONTACT_QUERY_KEY)
    }
  })


  const handleUpdateDetails = (detail: string, field: 'name' | 'phone_number' | 'email') => {
    if (!contact) { return }
    const newContact = {
      ...contact,
      [field]: detail
    }
    updateContactMutation.mutate(newContact)
  }

  const deleteContactMutation = useMutation(deleteContact, {
    onMutate: async (deletedId) => {
      await queryClient.cancelQueries(['contacts', user?.id])
      
      const prevContacts = queryClient.getQueryData<Records<FieldSet>>(['contacts', user?.id])

      if (prevContacts) {
        const filteredContacts = prevContacts.filter(prevContact => prevContact.id !== deletedId)
        queryClient.setQueryData(['contacts', user?.id], filteredContacts)
      }
      return { prevContacts }
    },
    onSuccess: () => { 
      queryClient.invalidateQueries('contacts')
      queryClient.prefetchQuery('contacts')
      navigate("/")
    },
    onSettled: () => {
      queryClient.invalidateQueries(['contacts', user?.id])
    }
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

  if (contactQuery.isError) {
    return (
      <div className="ContactRoute">
        <NotFound />
      </div>
    )
  }

  return (
    <div className="ContactRoute">
      <MaxHeightContainer
        header={
          <FlexBox padding={isMobileWidth ? "" : "1rem"} flexDirection="column" gap=".5rem">
            {!isMobileWidth && <Label>Name</Label>}
            <div className="ContactRoute__header">
              <FlexBox alignItems="center" justifyContent="space-between" gap="0.5rem">
                <LabelInput value={contact?.name || ''} onSubmit={val => handleUpdateDetails(val as string, 'name')}>
                  <h1>{contact?.name}</h1>
                </LabelInput>
                <Button isRounded icon={faTrash} onClick={() => setShowDeleteModal(true)} kind="danger" />
              </FlexBox>
            </div>
          </FlexBox>
        }
      >
        <FlexBox padding="1rem" flexDirection="column" gap="1rem">
          <FlexBox flexDirection="column" gap=".5rem">
            <Label>Details</Label>
            <div className="ContactRoute__details">
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
            </div>
          </FlexBox>
          <Notes />
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
