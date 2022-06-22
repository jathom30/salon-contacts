import { Button, FlexBox } from "components";
import { faPlus, faSignOut } from "@fortawesome/free-solid-svg-icons";
import { useIdentityContext } from 'react-netlify-identity'
import React, { useContext } from "react";
import './Header.scss'
import { Link, useNavigate } from "react-router-dom";
import { Chair } from "assets";
import { WindowDimsContext } from "context";

export const Header = () => {
  const {logoutUser} = useIdentityContext()
  const {isMobileWidth} = useContext(WindowDimsContext)
  const navigate = useNavigate()

  const handleCreateNew = () => {
    navigate('create-new')
  }
  
  return (
    <div className="Header">
      <div className="Header__content">
        <Link to="/">
          <FlexBox gap="0.5rem" alignItems="center">
            <div className="Header__icon">
              <Chair />
            </div>
            <h3>Melody's Recipes</h3>
          </FlexBox>
        </Link>
        <FlexBox gap=".25rem">
          <Button icon={faPlus} kind="primary" isRounded onClick={handleCreateNew}>{isMobileWidth ? '' : 'New Contact'}</Button>
          <Button icon={faSignOut} kind="secondary" isRounded onClick={logoutUser}>{isMobileWidth ? '' : 'Sign out'}</Button>
        </FlexBox>
      </div>
    </div>
  )
}