import { Chair } from "assets";
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
      <Chair />
      <h1>Melody's Recipes</h1>
      <Button kind="primary" onClick={handleGoogleAuth} width="10rem">Login</Button>
    </div>
  )
}