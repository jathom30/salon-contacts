import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import './Loader.scss'

export const Loader = ({size = 'm' }: {size?: 's' | 'm' | 'l'}) => {
  const iconSize = () => {
    switch (size) {
      case 's':
        return '1x'
      case 'm':
        return '2x'
      case 'l':
        return '3x'
      default:
        return '1x'
    }
  }
  return (
    <div className="Loader">
      <FontAwesomeIcon size={iconSize()} icon={faSpinner} />
    </div>
  )
}