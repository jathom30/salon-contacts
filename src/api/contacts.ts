import { FieldSet } from "airtable";
import { Contact } from "typings";
import { base } from "./setup";

const contactsBase = base(process.env.REACT_APP_AIRTABLE_CONTACTS_TABLE || '')

export const getContacts = () => contactsBase.select().all()

export const getContact = (id: string) => contactsBase.find(id)

export const createContact = (contact: Omit<Contact, 'id'>) => contactsBase.create([{fields: contact}])

export const updateContact = (contact: Contact) => {
  const {id, ...fields} = contact
  return contactsBase.update([{id, fields: fields as unknown as FieldSet}])
}

export const deleteContact = (id: string) => contactsBase.destroy(id)