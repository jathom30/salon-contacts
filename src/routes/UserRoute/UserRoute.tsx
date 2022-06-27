import { FlexBox, GridBox, Input, Label, LabelInput } from "components"
import React, { useState } from "react"
import { useIdentityContext } from "react-netlify-identity"
import { useMutation } from "react-query"
import './UserRoute.scss'

export const UserRoute = () => {
  const { updateUser, user } = useIdentityContext()

  const [password, setPassword] = useState('')
  const [verifyPassword, setVerifyPassword] = useState('')

  const updateUserMutation = useMutation(updateUser)

  const handleUpdate = (field: {[key: string]: any}) => {
    updateUserMutation.mutate(field)
  }

  return (
    <div className="UserRoute">
      <FlexBox flexDirection="column" gap="1rem" padding="1rem">
        <h3>User Details</h3>
        <FlexBox flexDirection="column" gap=".5rem">
          <GridBox gap=".25rem" gridTemplateColumns="repeat(auto-fit, minmax(250px, 1fr))">
            <LabelInput value={user?.user_metadata.firstName} onSubmit={(val) => handleUpdate({firstName: val})}>
              <Label>First name</Label>
              <span>{user?.user_metadata.firstName}</span>
            </LabelInput>
            <LabelInput value={user?.user_metadata.lastName} onSubmit={() => {}}>
              <Label>Last name</Label>
              <span>{user?.user_metadata.lastName}</span>
            </LabelInput>
          </GridBox>
            <LabelInput value={user?.email || ''} onSubmit={() => {}}>
              <Label>Email</Label>
              <span>{user?.email}</span>
            </LabelInput>
          
          {/* <Input required type="password" label="Password" value={password} onChange={setPassword} name="password" />
          <Input required type="password" label="Verify Password" value={verifyPassword} onChange={setVerifyPassword} name="verify-password" /> */}
          <p style={{display: "none"}}>
            <label>
              Don’t fill this out if you’re human: <input name="bot-field" />
            </label>
          </p>
        </FlexBox>
      </FlexBox>
    </div>
  )
}