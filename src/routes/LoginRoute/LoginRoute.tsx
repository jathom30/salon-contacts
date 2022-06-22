import React from "react";
import { Chair } from "assets";
import { Button } from "components";
import { useIdentityContext } from "react-netlify-identity";
import { useNavigate } from "react-router-dom";
import './LoginRoute.scss'

export const LoginRoute = () => {
  const {loginProvider} = useIdentityContext()
  const navigate = useNavigate()
  // const {isMobileWidth} = useContext(WindowDimsContext)

  const handleGoogleAuth = () => {
    loginProvider('google')
    navigate('/')
  }

  return (
    <div className="LoginRoute">
      <div className="LoginRoute__logo">
        <Chair />
      </div>
      <div className="LoginRoute__content">
        <h1>Melody's Recipes</h1>
        <Button kind="primary" onClick={handleGoogleAuth} width="10rem">Login</Button>
      </div>
    </div>
  )
}