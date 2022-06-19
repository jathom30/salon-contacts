import React, { ReactNode } from "react";
import './Label.scss'

export const Label: React.FC<{required?: boolean; children?: ReactNode}> = ({required = false, children}) => {
  return (
    <span className="Label">
      {children}
      {required && (
        <>
          {' '}
          <span className="Label__required">[Required]</span>
        </>
      )}
    </span>
  )
}