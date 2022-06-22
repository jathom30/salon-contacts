import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { getContacts } from "api";
import { FlexBox, Input, Loader } from "components";
import React, { useState } from "react";
import { useQuery } from "react-query";
import { Link } from "react-router-dom";
import { Contact } from "typings";
import './ContactListRoute.scss'

export const ContactListRoute = () => {
  const [search, setSearch] = useState('')
  const contactsQuery = useQuery('contacts', getContacts)

  const contacts = contactsQuery.data?.map(d => d.fields) as unknown as Contact[] | undefined
  
  const sortedContacts = contacts?.sort((a,b) => {
    if (a.name > b.name) {
      return 1
    }
    return -1
  }).filter(contact => contact.name.toLowerCase().includes(search.toLowerCase()))

  return (
    <div className="ContactListRoute">
      <FlexBox alignItems="center" gap="0.5rem" paddingBottom="1rem">
        <FontAwesomeIcon icon={faMagnifyingGlass} />
        <Input value={search} onChange={setSearch} name="search" placeholder="Search by name..." />
      </FlexBox>
      {contactsQuery.isLoading && <Loader size="l" />}
      {sortedContacts?.map(contact => (
        <Link className="ContactListRoute__contact" key={contact.id} to={contact.id}>{contact.name}</Link>
      ))}
    </div>
  )
}