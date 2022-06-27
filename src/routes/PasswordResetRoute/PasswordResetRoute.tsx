import { Button, FlexBox, Input } from "components";
import React, { MouseEvent, useState } from "react";
import { useIdentityContext } from "react-netlify-identity";
import { useMutation } from "react-query";

export const PasswordResetRoute = () => {
  const {updateUser, param} = useIdentityContext()
  const {token} = param


  const [password, setPassword] = useState('')
  const [verifyPassword, setVerifyPassword] = useState('')

  const resetPasswordMutation = useMutation(updateUser, {
    onSettled(data, error) {
      console.log({data, error})
    },
  })

  const handlePasswordReset = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    resetPasswordMutation.mutate({password})
  }

  const isDisabledPassword = !(password && verifyPassword) || password !== verifyPassword

  return (
    <div className="PasswordResetRoute">
      <FlexBox flexDirection="column" gap="1rem" alignItems="center" padding="2rem">
        <h1>Reset your password</h1>
        <form action="submit">
          <FlexBox flexDirection="column" gap="1rem" padding="1rem" alignItems="center">
            <Input required type="password" label="Password" value={password} onChange={setPassword} name="password" />
            <Input required type="password" label="Verify Password" value={verifyPassword} onChange={setVerifyPassword} name="verify-password" />
            <Button type="submit" isDisabled={isDisabledPassword} onClick={handlePasswordReset}>Reset</Button>
          </FlexBox>
        </form>
      </FlexBox>
    </div>
  )
}