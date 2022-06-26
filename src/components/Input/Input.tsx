import { FlexBox } from 'components/Box';
import { Label } from 'components/Label';
import React, { KeyboardEvent, ReactNode } from 'react';
import './Input.scss'

export const Input: React.FC<{
  label?: ReactNode;
  value: string | number;
  onChange: (val: string) => void;
  placeholder?: string;
  type?: 'number' | 'password' | 'string'
  name: string;
  step?: number
  required?: boolean
  hasError?: boolean
}> = ({label, value, type, onChange, name, step, required = false, placeholder, hasError = false}) => {
  const inputType = type ? type : typeof value === 'string' ? 'string' : 'number'

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (inputType !== 'number') return
    const numberValue = value as number
    if (e.key === '.' && isNaN(numberValue)) {
      onChange('0.')
    }
  }
  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    if (inputType !== 'number') return
    const numberValue = value as number
    if (isNaN(numberValue)) {
      onChange('0')
    }
  }

  return (
    <label className="Input" htmlFor={name}>
      <FlexBox alignItems="center" justifyContent="space-between" gap="1rem">
        {label && <Label required={required}>{label}</Label>}
        {hasError && <span className='Input__error'>Invalid {label}</span>}
      </FlexBox>
      <div className="Input__container">
        <input
          className='Input__input'
          placeholder={placeholder}
          type={inputType}
          name={name}
          value={value}
          onChange={e => onChange(e.target.value)}
          onKeyPress={handleKeyPress}
          onBlur={handleBlur}
          step={step}
        />
      </div>
    </label>
  )
}