import { FieldSet, Records } from "airtable"
import { getContact, updateContact } from "api"
import { useQuery } from "react-query"
import { useParams } from "react-router-dom"
import { Contact } from "typings"
import { useOptimisticMutation } from "./useOptimisticMutation"

export const useUpdateContact = () => {
  const { id } = useParams()
  const CONTACT_QUERY_KEY = ['contact', id]

  const contactQuery = useQuery(
    CONTACT_QUERY_KEY,
    () => getContact(id || ''),
    { enabled: !!id }
  )

  const contact = contactQuery.data?.fields as unknown as Contact | undefined

  const updateContactMutation = useOptimisticMutation<Contact, Records<FieldSet>>(updateContact, CONTACT_QUERY_KEY)
  
  const mutateContact = (newContact: Partial<Contact>) => {
    if (!contact) { return }
    updateContactMutation.mutate({
      ...contact,
      ...newContact,
    })
  }

  return mutateContact

}