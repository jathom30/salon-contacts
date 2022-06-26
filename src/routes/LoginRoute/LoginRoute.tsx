import React, { MouseEvent, useState } from "react";
import { Chair } from "assets";
import { Button, FlexBox, Input, Loader, SignUpForm } from "components";
import { useIdentityContext } from "react-netlify-identity";
import { useNavigate } from "react-router-dom";
import './LoginRoute.scss'
import { useQuery } from "react-query";

export const LoginRoute = () => {
  const {loginUser, requestPasswordRecovery} = useIdentityContext()

  const navigate = useNavigate()

  const [showSignup, setShowSignup] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loginErr, setLoginErr] = useState('')

  const [passwordResetSent, setPasswordResetSent] = useState(false)

  const loginUserQuery = useQuery(
    ['login', email],
    () => loginUser(email, password),
    {
      enabled: false,
      retry: false,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      onSuccess: () => {
        navigate('/')
      },
      onError: (err: {name: string, status: number, json: {error: string, error_description: string}}) => {
        setLoginErr(err.json.error_description)
      }
    }
  )

  const handleLogin = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    loginUserQuery.refetch()
  }

  const requestPasswordRecoveryQuery = useQuery(
    'passwordRecovery',
    () => requestPasswordRecovery(email),
    {
      enabled: false,
      retry: false,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      onSuccess: () => {
        setPasswordResetSent(true)
      }
    }
  )

  const handlePasswordResetRequest = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    requestPasswordRecoveryQuery.refetch()
  }

  const handleReturnToSignIn = () => {
    setEmail('')
    setPassword('')
    setPasswordResetSent(false)
    setLoginErr('')
  }


  const isDisabledLogin = !(email && password) || loginUserQuery.isLoading

  if (passwordResetSent) {
    return (
      <div className="LoginRoute">
        <FlexBox alignItems="center" justifyContent="center" padding="1rem" flexDirection="column" gap="1rem">
          <p className="LoginRoute__reset-text">A password reset request has been sent to <strong>{email}</strong></p>
          <Button onClick={handleReturnToSignIn}>Return to sign in</Button>
        </FlexBox>
      </div>
    )
  }

  return (
    <div className="LoginRoute">
      <div className="LoginRoute__logo">
        {!showSignup && <Chair />}
      </div>
      <div className="LoginRoute__content">
        <h1>Salon Recipes</h1>
        {showSignup ? (
          <SignUpForm />
        ) : (
          <form action="submit">
            <FlexBox flexDirection="column" gap="1rem">
              <Input label="email" value={email} onChange={setEmail} name="email" />
              <Input type="password" label="password" value={password} onChange={setPassword} name="password" />
              <Button kind="primary" type="submit" onClick={handleLogin} isDisabled={isDisabledLogin}>
                <FlexBox gap=".5rem" alignItems="center">
                  {loginUserQuery.isLoading && <Loader />}
                  Login
                </FlexBox>
              </Button>
              {loginErr && (
                <FlexBox flexDirection="column" gap="1rem" alignItems="center">
                  <span className="LoginRoute__error-message">{loginErr}</span>
                  <FlexBox alignItems="center" gap=".5rem">
                    <span>Forgot your password?</span>
                    <Button kind="secondary" onClick={handlePasswordResetRequest}>Send me a reset link</Button>
                  </FlexBox>
                </FlexBox>
              )}
            </FlexBox>
          </form>
        )}
        <FlexBox gap=".5rem" alignItems="center" paddingTop="2rem">
          <span>{showSignup ? 'Already have an account?' : 'Not signed up?'}</span>
          <Button
            kind="secondary"
            onClick={() => setShowSignup(!showSignup)}
          >
            {showSignup ? 'Login here' : 'Register here'}
          </Button>
        </FlexBox>
      </div>
    </div>
  )
}