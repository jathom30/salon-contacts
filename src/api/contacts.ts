import { FieldSet } from "airtable";
import { Contact } from "typings";
import { base } from "./setup";

const contactsBase = base(process.env.REACT_APP_AIRTABLE_CONTACTS_TABLE || '')

export const getContacts = () => contactsBase.select().firstPage()

export const getContact = (id: string) => contactsBase.find(id)

export const createContact = (contact: Omit<Contact, 'id'>) => {
  const jsonContact = {
    ...contact,
    notes: JSON.stringify(contact.notes)
  }
  return contactsBase.create([{fields: jsonContact}])
}

export const updateContact = (contact: Contact) => {
  const {id, ...fields} = contact
  const jsonFields = {
    ...fields,
    notes: JSON.stringify(fields.notes) || ''
  }
  return contactsBase.update([{id, fields: jsonFields as unknown as FieldSet}])
}

export const deleteContact = (id: string) => contactsBase.destroy(id)