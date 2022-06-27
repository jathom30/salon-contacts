import React, { MouseEvent, useState } from "react";
import { Button, FlexBox, Input, Loader } from "components";
import { useMutation, useQuery } from "react-query";
import GoTrue from 'gotrue-js'
import { useLocation, useNavigate } from "react-router-dom";
import './AccountRecoveryRoute.scss'
import { Chair } from "assets";
import { faSave } from "@fortawesome/free-solid-svg-icons";

const auth = new GoTrue({
  APIUrl: 'https://salon-contacts.netlify.app/.netlify/identity',
  audience: '',
  setCookie: false,
})

export const AccountRecoveryRoute = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  
  const recoveryToken = location.hash.replace(/#recovery_token=/, '')

  useQuery(['recover'], () => auth.recover(recoveryToken), {
    enabled: !!recoveryToken,
    onError: (err) => {
      console.error(err)
    }
  })

  const updatePasswordMutation = useMutation(async () => auth.currentUser()?.update({ password }), {
    onSuccess: () => {
      navigate('/login')
    }
  })

  const handleSavePassword = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    updatePasswordMutation.mutate()
  }

  const isValidPassword = password.length > 0 && (password === confirmPassword)

  return (
    <div className="AccountRecoveryRoute">
      {!auth.currentUser() ? (
        <FlexBox flexDirection="column" gap="1rem" alignItems="center" padding="2rem">
          <h1>Loading your account...</h1>
          <Loader size="l" />
        </FlexBox>
      ) : (
        <>
          <div className="AccountRecoveryRoute__logo">
            <Chair />
          </div>
          <h1>Hey {auth.currentUser()?.user_metadata.firstName},</h1>
          <p>Once you update your password below, you'll be taken to the log in screen to use your fresh credentials.</p>
          <form action="submit">
            <FlexBox flexDirection="column" gap="1rem" padding="1rem">
              {/* <h3>Update your password</h3> */}
              <Input type="password" label="Password" value={password} onChange={setPassword} name="password" />
              <Input type="password" label="Verify Password" value={confirmPassword} onChange={setConfirmPassword} name="verify-password" />
              <Button
                icon={faSave}
                type="submit"
                kind="primary"
                onClick={handleSavePassword}
                isDisabled={!isValidPassword || updatePasswordMutation.isLoading}
              >
                {updatePasswordMutation.isLoading ? <Loader /> : 'Save new password'}
              </Button>
            </FlexBox>
          </form>
        </>
      )}
    </div>
  )
}