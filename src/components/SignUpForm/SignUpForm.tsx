import { Button, Input, FlexBox } from "components";
import React, { MouseEvent, useState } from "react";
import { useIdentityContext } from "react-netlify-identity";
import { useQuery } from "react-query";
import { useNavigate } from "react-router-dom";
import './SignUpForm.scss'

export const SignUpForm = () => {
  const { signupUser } = useIdentityContext()

  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [verifyPassword, setVerifyPassword] = useState('')

  const [registrationErr, setRegistrationErr] = useState('')

  const navigate = useNavigate()

  const loginUserQuery = useQuery(
    ['register', email],
    () => signupUser(email, password, {firstName, lastName}),
    {
      enabled: false,
      retry: false,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      onError: (err: {name: string, status: number, json: {code: number, msg: string}}) => {
        setRegistrationErr(err.json.msg)
      },
      onSuccess: () => {
          navigate('/')
      }
    }
  )

  const handleRegister = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    loginUserQuery.refetch()
  }

  const isDisabledRegister = !(firstName && lastName && email && password && verifyPassword) || password !== verifyPassword

  return (
    <div className="SignUpForm">
      <FlexBox flexDirection="column" gap="1rem">
        <h3>Register your Account</h3>
        <form
          action="submit"
          netlify-honeypot="bot-field"
          data-netlify="true"
        >
          <FlexBox flexDirection="column" gap="1rem">
            <Input required label="First name" value={firstName} onChange={setFirstName} name="first-name" />
            <Input required label="Last name" value={lastName} onChange={setLastName} name="last-name" />
            <Input required label="Email" value={email} onChange={setEmail} name="email" />
            <Input required type="password" label="Password" value={password} onChange={setPassword} name="password" />
            <Input required type="password" label="Verify Password" value={verifyPassword} onChange={setVerifyPassword} name="verify-password" />
            <p style={{display: "none"}}>
              <label>
                Don’t fill this out if you’re human: <input name="bot-field" />
              </label>
            </p>
            <Button kind="primary" type="submit" onClick={handleRegister} isDisabled={isDisabledRegister}>Login</Button>
            {registrationErr && <span className="SignUpForm__error-message">{registrationErr}</span>}
          </FlexBox>
        </form>
      </FlexBox>
    </div>
  )
}