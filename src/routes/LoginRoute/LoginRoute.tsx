import { Button } from "components";
import React from "react";
import { useIdentityContext } from "react-netlify-identity";
import { useNavigate } from "react-router-dom";
import './LoginRoute.scss'

export const LoginRoute = () => {
  const {loginProvider} = useIdentityContext()
  const navigate = useNavigate()

  const handleGoogleAuth = () => {
    loginProvider('google')
    navigate('/')
  }

  return (
    <div className="LoginRoute">
      <Button kind="primary" onClick={handleGoogleAuth}>Login</Button>
    </div>
  )
}