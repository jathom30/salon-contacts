import { ValidatedMaskType, ValidationMask, ComboMask } from './useMask'

// a helper func to seperate the validated mask object into
// initialState, mask, and validation
// used in both useValidatedMask and useLocalValidatedMask currently
export const seperateValidationMask = (validatedMask: ValidatedMaskType) => {
  const { initialState } = validatedMask
  // using type assertions to declare type
  const hasMask = validatedMask as ValidationMask
  const noMask = validatedMask as ComboMask
  // ternary to find if key is available
  const mask = hasMask.mask ? hasMask.mask : noMask.validationMask
  const validation = hasMask.mask ? hasMask.validation : noMask.validationMask

  return { initialState, mask, validation }
}
