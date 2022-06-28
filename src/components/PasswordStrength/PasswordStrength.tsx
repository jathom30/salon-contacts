import React from "react";
import { passwordStrength } from "utils";
import './PasswordStrength.scss'

const strengthLevels = ['Weak. Sad really.', 'I mean for you, its fine.', 'Very strong, but also: are you trying too hard?']

export const PasswordStrength = ({password}: {password: string}) => {
  const strength = passwordStrength(password)
  return (
    <div className="PasswordStrength">
      {strengthLevels.map((s, i) => (
          <div key={s} className={`PasswordStrength__bar ${strength > i ? `PasswordStrength__bar--is-active-${strength}` : ''}`} />
      ))}
      <span className={`PasswordStrength__label PasswordStrength__label--${strength}`}>Strength: {strengthLevels[strength - 1] || 'Password must be at least 6 characters long'}</span>
    </div>
  )
}