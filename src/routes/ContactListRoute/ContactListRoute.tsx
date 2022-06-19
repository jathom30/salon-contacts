import { getContacts } from "api";
import React from "react";
import { useQuery } from "react-query";
import { Link } from "react-router-dom";
import { Contact } from "typings";
import './ContactListRoute.scss'

export const ContactListRoute = () => {

  const contactsQuery = useQuery('contacts', getContacts)
  const contacts = contactsQuery.data?.map(d => d.fields) as Contact[] | undefined

  return (
    <div className="ContactListRoute">
      {contacts?.map(contact => (
        <Link className="ContactListRoute__contact" key={contact.id} to={contact.id}>{contact.name}</Link>
      ))}
    </div>
  )
}