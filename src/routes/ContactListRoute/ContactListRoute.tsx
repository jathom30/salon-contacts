import React, { useState } from "react";
import { faDownload, faMagnifyingGlass, faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { getContacts, getNotes } from "api";
import { Button, FlexBox, Input, Loader, Modal } from "components";
import { useIdentityContext } from "react-netlify-identity";
import { useQuery } from "react-query";
import { Link, useNavigate } from "react-router-dom";
import { Contact, Note } from "typings";
import './ContactListRoute.scss'
import { RateLimit } from "async-sema";

export const ContactListRoute = () => {
  const [showDownloadModal, setShowDownloadModal] = useState(false)
  const [isDownloading, setIsDownloading] = useState(false)
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

  const handleDownloadContacts = async() => {
    if (!sortedContacts) return
    setIsDownloading(true)

    const limit = RateLimit(5) // requests per second

    let contactsWithNotes: {name: string, email?: string, phone_number?: string, notes: string}[] = []

    for (const contact of sortedContacts) {
      await limit()
      const notesQuery = await getNotes(contact.id)
      const notes = notesQuery.map(field => field.fields) as unknown as Note[]
      contactsWithNotes = [
        ...contactsWithNotes,
        {
          name: contact.name,
          ...(contact.email && {email: contact.email}),
          ...(contact.phone_number && {phone_number: contact.phone_number}),
          notes: notes.map(note => {
            const date = (new Date(note.date)).toDateString()
            return `[${date}]: ${note.details}`
          }).join(' // ') 
        }
      ]

    }

    
    let csvContext = 'data:text/csv;charset=utf-8,'
    const headers = ['name', 'email', 'phone_number', 'notes'] as const
    const rows = contactsWithNotes.map(contact => headers.map((fieldName) => contact?.[fieldName] || '').join(','))
    
    const body = [headers.join(','), ...rows].join('\n')
    csvContext += body
    
    const encodedUri = encodeURI(csvContext)
    const link = document.createElement('a')
    link.setAttribute('href', encodedUri)
    link.setAttribute('download', `${user?.user_metadata.firstName}-contacts.csv`)
    document.body.appendChild(link)

    link.click()
    setIsDownloading(false)
    setShowDownloadModal(false)
  }

  const noContacts = Array.isArray(sortedContacts) && sortedContacts.length < 1

  return (
    <div className="ContactListRoute">
      <FlexBox alignItems="center" gap="0.5rem" paddingBottom="1rem">
        <FontAwesomeIcon icon={faMagnifyingGlass} />
        <Input value={search} onChange={setSearch} name="search" placeholder="Search by name..." />
        <Button isRounded kind="secondary" icon={faDownload} onClick={() => setShowDownloadModal(true)} />
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
      {showDownloadModal && (
        <Modal offClick={() => setShowDownloadModal(false)}>
          <div className="ContactListRoute__modal">
            <FlexBox padding="1rem" flexDirection="column">
              <FlexBox flexDirection="column" gap="0.5rem" alignItems="center">
                <FontAwesomeIcon size="2x" icon={faDownload} color="var(--color-secondary)" />
                <h2>Download all contacts?</h2>
              </FlexBox>
              <p>Its never a bad idea to back up your contacts. Click download below to download your contacts as a csv file.</p>
              <FlexBox gap="1rem" justifyContent="flex-end">
                <Button onClick={() => setShowDownloadModal(false)}>Cancel</Button>
                <Button kind="primary" onClick={handleDownloadContacts} isDisabled={isDownloading}>{isDownloading ? <Loader /> : 'Download'}</Button>
              </FlexBox>
            </FlexBox>
          </div>
        </Modal>
      )}
    </div>
  )
}