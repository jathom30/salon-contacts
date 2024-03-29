import { Button, FlexBox, Input, Loader, Modal, PasswordStrength } from "components"
import React, { MouseEvent, useState } from "react"
import { useIdentityContext } from "react-netlify-identity"
import { useMutation } from "react-query"
import { useNavigate } from "react-router-dom"
import { passwordStrength } from "utils"
import { getNotes } from "api";
import { Note } from "typings";
import { RateLimit } from "async-sema";
import './UserRoute.scss'
import { faDownload } from "@fortawesome/free-solid-svg-icons"
import { useContacts } from "hooks"

export const UserRoute = () => {
  const { updateUser, user } = useIdentityContext()

  const [isDownloading, setIsDownloading] = useState(false)

  const [firstName, setFirstName] = useState(user?.user_metadata.firstName)
  const [lastName, setLastName] = useState(user?.user_metadata.lastName)
  const [password, setPassword] = useState('')
  const [verifyPassword, setVerifyPassword] = useState('')
  const [showSuccess, setShowSuccess] = useState(false)

  const navigate = useNavigate()

  const updateUserMetaDataMutation = useMutation(updateUser, {
    onSuccess: () => {
      // navigation forces user update in UI
      navigate('/user-settings')
    }
  })

  const updateUserMutation = useMutation(updateUser, {
    onSuccess: () => {
      setPassword('')
      setVerifyPassword('')
      setShowSuccess(true)
    }
  })

  const handleUpdateMetadata = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    updateUserMetaDataMutation.mutate({
      data: {
        firstName, lastName
      }
    })
  }

  const handlePassword = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    if (password === verifyPassword) {
      updateUserMutation.mutate({ password })
    }
  }

  const { contacts } = useContacts()

  const handleDownloadContacts = async () => {
    if (!contacts) return
    setIsDownloading(true)

    const limit = RateLimit(5) // requests per second

    let contactsWithNotes: { name: string, email?: string, phoneNumber?: string, notes: { createdAt: string, body: string }[] }[] = []

    for (const contact of contacts) {
      await limit()
      const notesQuery = await getNotes(contact.id)
      const notes = notesQuery.map(field => field.fields) as unknown as Note[]
      contactsWithNotes = [
        ...contactsWithNotes,
        {
          name: contact.name,
          ...(contact.email && { email: contact.email }),
          ...(contact.phone_number && { phoneNumber: contact.phone_number }),
          notes: notes.map(note => {
            const date = (new Date(note.date)).toDateString()
            return {
              createdAt: date,
              body: note.details,
            }
          })
        }
      ]
    }

    const jsonContacts = JSON.stringify(contactsWithNotes)
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(jsonContacts)

    const link = document.createElement('a')
    link.setAttribute('href', dataStr)
    link.setAttribute('download', `${user?.user_metadata.firstName}-contacts.json`)
    document.body.appendChild(link)

    link.click()
    setIsDownloading(false)
  }

  const isEnabledDetails = firstName !== user?.user_metadata.firstName || lastName !== user?.user_metadata.lastName
  const isEnabledPassword = !!password && (password === verifyPassword) && passwordStrength(password) > 0

  return (
    <div className="UserRoute">
      <FlexBox flexDirection="column" gap="2rem" padding="1rem">
        <form action="submit">
          <FlexBox flexDirection="column" gap="1rem">
            <h3>Update User Info</h3>
            <Input label="First name" value={firstName} onChange={setFirstName} name="first-name" />
            <Input label="Last name" value={lastName} onChange={setLastName} name="last-name" />
            <Button type="submit" kind="primary" onClick={handleUpdateMetadata} isDisabled={!isEnabledDetails || updateUserMetaDataMutation.isLoading}>
              {updateUserMetaDataMutation.isLoading ? <Loader /> : 'Save'}
            </Button>
          </FlexBox>
        </form>

        <form action="submit">
          <FlexBox flexDirection="column" gap="1rem">
            <h3>Update Password</h3>
            <FlexBox flexDirection="column" gap="0.5rem">
              <Input type="password" label="Password" value={password} onChange={setPassword} name="password" />
              <PasswordStrength password={password} />
            </FlexBox>
            <Input type="password" label="Verify Password" value={verifyPassword} onChange={setVerifyPassword} name="verify-password" />
            <Button type="submit" kind="primary" onClick={handlePassword} isDisabled={!isEnabledPassword || updateUserMutation.isLoading}>
              {updateUserMutation.isLoading ? <Loader /> : 'Update password'}
            </Button>
          </FlexBox>
        </form>
        <p style={{ display: "none" }}>
          <label>
            Don’t fill this out if you’re human: <input name="bot-field" />
          </label>
        </p>
        <FlexBox flexDirection="column" gap="1rem">
          <h3>Download your contacts</h3>
          <p><strong>NOTICE:</strong> This website will go offline as of <strong>February 2024</strong>. At that time users will no longer be able to retrieve client info. We have a new service up at <a href='https://www.salonclients.xyz' target="_blank" rel="noreferrer" className='link'>salonclients.xyz</a>.</p>
          <h4>To transfer your existing clients to the new service:</h4>
          <ol>
            <li>Click the <strong>Download JSON</strong> button below to download your clients file.</li>
            <li>Create a new account at <a href='https://www.salonclients.xyz' target="_blank" rel="noreferrer" className='link'>salonclients.xyz</a></li>
            <li>Upload your saved json file from the User Settings page and that's it!</li>
          </ol>
          <Button
            icon={isDownloading ? undefined : faDownload}
            onClick={handleDownloadContacts}
            isDisabled={isDownloading}
            kind="primary"
          >
            {isDownloading ? <Loader /> : 'Download JSON'}
          </Button>
          <h4>Why are we switching services?</h4>
          <p>There are a variety of reasons we've decided to end this service in favor of the new one. To keep things simple, <strong>speed</strong>. We want to be able to offer our users the fastest experience possible and don't feel we can properly do that without an architectural update. There are a number of more techie reasons, but we wont bore you with the details.</p>
          <p>If you have any questions, reach out to our support team at <a className="link" href="mailto:support@salonclients.xyz">support@salonclients.xyz</a></p>
        </FlexBox>
      </FlexBox>
      {showSuccess && (
        <Modal offClick={() => setShowSuccess(false)}>
          <div className="UserRoute__modal">
            <FlexBox flexDirection="column" gap="1rem" alignItems="center">
              <h1>Update successful!</h1>
              <p>Your password has been successfully updated. Please make note of the change the next time you log in.</p>
              <Button kind="primary" onClick={() => setShowSuccess(false)}>I'm proud of myself</Button>
            </FlexBox>
          </div>
        </Modal>
      )}
    </div>
  )
}