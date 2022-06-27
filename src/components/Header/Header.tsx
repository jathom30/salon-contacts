import { Button, FlexBox } from "components";
import { faPlus, faSignOut, faUser } from "@fortawesome/free-solid-svg-icons";
import { useIdentityContext } from 'react-netlify-identity'
import React, { MouseEvent, useContext } from "react";
import './Header.scss'
import { Link, useNavigate } from "react-router-dom";
import { Chair } from "assets";
import { WindowDimsContext } from "context";
import { useQuery } from "react-query";

export const Header = () => {
  const {logoutUser, user} = useIdentityContext()
  const {isMobileWidth} = useContext(WindowDimsContext)
  const navigate = useNavigate()

  const handleCreateNew = () => {
    navigate('create-new')
  }

  const logoutUserQuery = useQuery(
    ['logout', user?.email],
    logoutUser,
    {
      enabled: false,
      retry: false,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      onSettled: () => {
        navigate('/')
      }
    }
  )

  const handleLogout = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    logoutUserQuery.refetch()
  }
  
  return (
    <div className="Header">
      <div className="Header__content">
        <Link to="/">
          <FlexBox gap="0.5rem" alignItems="center">
            <div className="Header__icon">
              <Chair />
            </div>
            <h3>{user?.user_metadata.firstName || 'Melody'}'s Recipes</h3>
          </FlexBox>
        </Link>
        <FlexBox gap=".25rem">
          <Button icon={faPlus} kind="primary" isRounded onClick={handleCreateNew}>{isMobileWidth ? '' : 'New Contact'}</Button>
          <Button icon={faUser} kind="secondary" isRounded onClick={() => navigate('user-settings')}>{isMobileWidth ? '' : 'User Details'}</Button>
          <Button icon={faSignOut} isRounded onClick={handleLogout}>{isMobileWidth ? '' : 'Sign out'}</Button>
        </FlexBox>
      </div>
    </div>
  )
}