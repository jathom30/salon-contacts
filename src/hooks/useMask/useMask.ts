import { useState } from 'react'
import { maskingFuncs } from './maskingFuncs'
import { useValidation, ValidationType } from '../useValidation'
import { seperateValidationMask } from './helper'

// either a string that matches a key from the maskingFuncs object or a function that takes in a string and returns a string
export type maskString = keyof typeof maskingFuncs
type maskFunc = (value: string) => string

export type MaskType = maskString | maskFunc

// returns the masked state and a setter (like useState)
export const useMask = (
  initialState: string,
  mask: MaskType,
): [string, (value: string) => void] => {
  const [item, setItem] = useState(initialState)

  const setMask = (value: string) => {
    const maskingFunc = typeof mask === 'function' ? mask : maskingFuncs[mask]
    setItem(maskingFunc(value))
  }

  return [item, setMask]
}

export type ValidationMask = {
  initialState: string
  validation: ValidationType
  mask: MaskType
}

export type ComboMask = {
  initialState: string
  validationMask: Extract<ValidationType, MaskType>
}

export type ValidatedMaskType = ValidationMask | ComboMask

// returns the masked state, a setter (like useState), and a validation boolean
export const useValidatedMask = (
  validatedMask: ValidatedMaskType,
): [string, (value: string) => void, boolean] => {
  const { initialState, mask, validation } =
    seperateValidationMask(validatedMask)

  const [item, setItem] = useMask(initialState, mask)
  const isValid = useValidation(validation)
  const valid = typeof item === 'string' && isValid(item)

  return [item, setItem, valid]
}
