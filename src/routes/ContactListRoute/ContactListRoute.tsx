import React, { useState } from "react";
import { faMagnifyingGlass, faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { getContacts } from "api";
import { Button, FlexBox, Input, Loader } from "components";
import { useIdentityContext } from "react-netlify-identity";
import { useQuery } from "react-query";
import { Link, useNavigate } from "react-router-dom";
import { Contact } from "typings";
import './ContactListRoute.scss'

export const ContactListRoute = () => {
  const { user } = useIdentityContext()
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
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
  }).filter(contact => contact.name.toLowerCase().includes(search.toLowerCase()))

  const noContacts = Array.isArray(sortedContacts) && sortedContacts.length < 1

  return (
    <div className="ContactListRoute">
      <FlexBox alignItems="center" gap="0.5rem" paddingBottom="1rem">
        <FontAwesomeIcon icon={faMagnifyingGlass} />
        <Input value={search} onChange={setSearch} name="search" placeholder="Search by name..." />
      </FlexBox>
      {
        contactsQuery.isLoading
          ? <Loader size="l" />
          : noContacts
            ? (
              <FlexBox alignItems="center" flexDirection="column" gap="1rem">
                <FontAwesomeIcon size="4x" icon={faMagnifyingGlass} />
                {search ? (
                  <>
                    <span>No contacts found matching that name.</span>
                    <Button kind="secondary" isRounded onClick={() => setSearch('')}>Clear Search</Button>
                  </>
                ): (
                  <>
                    <span>Looks like you don't have any contacts created yet</span>
                    <Button kind="primary" isRounded icon={faPlus} onClick={() => navigate('create-new')}>Create your first here</Button>
                  </>
                )}
              </FlexBox>
            )
            : null
      }
      {sortedContacts?.map(contact => (
        <Link className="ContactListRoute__contact" key={contact.id} to={contact.id}>{contact.name}</Link>
      ))}
    </div>
  )
}