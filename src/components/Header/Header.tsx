import { Button, FlexBox } from "components";
import { faPlus, faSignOut } from "@fortawesome/free-solid-svg-icons";
import { useIdentityContext } from 'react-netlify-identity'
import React from "react";
import './Header.scss'
import { Link, useNavigate } from "react-router-dom";

export const Header = () => {
  const {logoutUser} = useIdentityContext()
  const navigate = useNavigate()

  const handleCreateNew = () => {
    navigate('create-new')
  }
  
  return (
    <div className="Header">
      <Link to="/">
        <h3>Melody's Recipes</h3>
      </Link>
      <FlexBox gap="1rem">
        <Button icon={faPlus} kind="primary" isRounded onClick={handleCreateNew} />
        <Button icon={faSignOut} kind="secondary" isRounded onClick={logoutUser} />
      </FlexBox>
    </div>
  )
}