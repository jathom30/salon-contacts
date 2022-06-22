import { IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FlexBox } from 'components/Box';
import * as React from 'react';
import './Button.scss'

export const Button: React.FC<{
  buttonRef?: React.RefObject<HTMLButtonElement>
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void,
  isRounded?: boolean,
  isDisabled?: boolean
  type?: 'button' | 'submit' | 'reset'
  kind?: 'default' | 'primary' | 'danger' | 'text' | 'secondary'
  width?: string
  icon?: IconDefinition
  children?: React.ReactNode
}> = ({buttonRef, children, onClick, isRounded = false, kind = 'default', type = 'button', isDisabled = false, width, icon}) => {
  const buttonKindClass = `Button__${kind}`
  return (
    <button
      ref={buttonRef}
      onClick={onClick}
      disabled={isDisabled}
      style={{width}}
      type={type}
      className={`Button ${isRounded ? 'Button--rounded' : ''} ${isDisabled ? 'Button--disabled' : ''} ${buttonKindClass}`}
    >
      <FlexBox gap="0.5rem" padding='0 .5rem' alignItems="center">
        {icon && <FontAwesomeIcon icon={icon} />}
        {children}
      </FlexBox>
    </button>
  )
}