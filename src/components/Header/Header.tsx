import { Button } from "components";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import React from "react";
import './Header.scss'
import { Link, useNavigate } from "react-router-dom";

export const Header = () => {
  const navigate = useNavigate()

  const handleCreateNew = () => {
    navigate('create-new')
  }
  
  return (
    <div className="Header">
      <Link to="/">
        <h3>Melody's Recipes</h3>
      </Link>
      <Button icon={faPlus} kind="primary" onClick={handleCreateNew}>New Contact</Button>
    </div>
  )
}