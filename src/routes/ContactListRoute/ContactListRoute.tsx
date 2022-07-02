import React, { useState } from "react";
import { faMagnifyingGlass, faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, FlexBox, Input, Loader } from "components";
import { Link, useNavigate } from "react-router-dom";
import './ContactListRoute.scss'
import { useContacts } from "hooks";

export const ContactListRoute = () => {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')

  const { contacts, isLoading } = useContacts()
  const filteredContacts = contacts?.filter(contact => contact.name.toLowerCase().includes(search.toLowerCase()))
  const noContacts = Array.isArray(filteredContacts) && filteredContacts.length < 1

  return (
    <div className="ContactListRoute">
      <FlexBox alignItems="center" gap="0.5rem" paddingBottom="1rem">
        <FontAwesomeIcon icon={faMagnifyingGlass} />
        <Input value={search} onChange={setSearch} name="search" placeholder="Search by name..." />
      </FlexBox>
      {
        isLoading
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
                ) : (
                  <>
                    <span>Looks like you don't have any contacts created yet</span>
                    <Button kind="primary" isRounded icon={faPlus} onClick={() => navigate('create-new')}>Create your first here</Button>
                  </>
                )}
              </FlexBox>
            )
            : null
      }
      {filteredContacts?.map(contact => (
        <Link className="ContactListRoute__contact" key={contact.id} to={contact.id}>{contact.name}</Link>
      ))}
    </div>
  )
}