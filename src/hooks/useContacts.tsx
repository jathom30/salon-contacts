import { getContacts } from "api"
import { useIdentityContext } from "react-netlify-identity"
import { useQuery } from "react-query"
import { Contact } from "typings"

export const useContacts = () => {
  const { user } = useIdentityContext()

  const contactsQuery = useQuery(
    ['contacts', user?.id],
    () => getContacts(user?.id || ''),
    {
      enabled: !!user?.id,
    }
  )

  const contacts = contactsQuery.data?.map(d => d.fields) as unknown as Contact[] | undefined
  const sortedContacts = contacts?.sort((a,b) => {
    if (a.name.toLowerCase() > b.name.toLowerCase()) {
      return 1
    }
    return -1
  })

  return {
    contacts: sortedContacts,
    isLoading: contactsQuery.isLoading,
  }
}