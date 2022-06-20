import { useState, Dispatch, SetStateAction } from 'react'
import { validationRegEx } from './validationRegex'

// either a string that matches a key from the validationRegEx object, a RegExp, or array of RegExp
export type ValidationType = keyof typeof validationRegEx | RegExp | RegExp[]

// returns a function: (value: string) => boolean;
export const useValidation = (
  validation: ValidationType,
): ((value: string) => boolean) => {
  const isValid = (value: string) => {
    if (value.length === 0) return true
    if (Array.isArray(validation)) {
      return validation.every((regex: RegExp) => regex.test(value))
    }
    return validation instanceof RegExp
      ? validation.test(value)
      : validationRegEx[validation].test(value)
  }
  return isValid
}

export const useValidatedState = (
  initialState: string,
  validation: ValidationType,
): [string, Dispatch<SetStateAction<string>>, boolean] => {
  const [item, setItem] = useState(initialState)
  const isValid = useValidation(validation)

  return [item, setItem, isValid(item)]
}
