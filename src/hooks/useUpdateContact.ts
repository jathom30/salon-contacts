import { FieldSet, Record } from "airtable"
import { getContact, updateContact } from "api"
import { useMutation, useQuery, useQueryClient } from "react-query"
import { useParams } from "react-router-dom"
import { Contact, Note } from "typings"

export const useUpdateContact = () => {
  const { id } = useParams()
  const CONTACT_QUERY_KEY = ['contact', id]
  const queryClient = useQueryClient()

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

  const mutateContact = (newContact: Partial<Contact>) => {
    if (!contact) { return }
    updateContactMutation.mutate({
      ...contact,
      ...{ notes: notes || [] },
      ...newContact,
    })
  }

  return mutateContact

}