import { faCamera } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { ChangeEvent } from "react";
import './ImageCapture.scss'


export const ImageCapture = ({ onChange }: { onChange: (e: ChangeEvent<HTMLInputElement>) => void}) => {
  return (
    <div className="ImageCapture">
      <label htmlFor="image" className="ImageCapture__select-container">
        <FontAwesomeIcon icon={faCamera} />
        <input onChange={onChange} id="image" className="ImageCapture__input" type="file" accept="image/*" capture />
      </label>
    </div>
  )
}
