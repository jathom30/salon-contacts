import { Button, FlexBox, Input, Loader, Modal } from "components"
import React, { MouseEvent, useState } from "react"
import { useIdentityContext } from "react-netlify-identity"
import { useMutation } from "react-query"
import { useNavigate } from "react-router-dom"
import './UserRoute.scss'

export const UserRoute = () => {
  const { updateUser, user } = useIdentityContext()

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
    updateUserMetaDataMutation.mutate({data: {
      firstName, lastName
    }})
  }

  const handlePassword = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    if (password === verifyPassword) {
      updateUserMutation.mutate({ password })
    }
  }

  const isEnabledDetails = firstName !== user?.user_metadata.firstName || lastName !== user?.user_metadata.lastName
  const isEnabledPassword = !!password && (password === verifyPassword)

  return (
    <div className="UserRoute">
      <FlexBox flexDirection="column" gap="1rem" padding="1rem">
        <FlexBox flexDirection="column" gap="2rem">
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
              <Input type="password" label="Password" value={password} onChange={setPassword} name="password" />
              <Input type="password" label="Verify Password" value={verifyPassword} onChange={setVerifyPassword} name="verify-password" />
              <Button type="submit" kind="primary" onClick={handlePassword} isDisabled={!isEnabledPassword || updateUserMutation.isLoading}>
                {updateUserMutation.isLoading ? <Loader /> : 'Update password'}
              </Button>
            </FlexBox>
          </form>
          <p style={{display: "none"}}>
            <label>
              Don’t fill this out if you’re human: <input name="bot-field" />
            </label>
          </p>
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