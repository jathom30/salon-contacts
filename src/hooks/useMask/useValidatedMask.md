# useValidatedMask

A custom hook built on top of **useMask** and **useValidation** designed to mask and validate an input.

---

## Ins and Outs

### Inputs

useValidatedMask can take in an object with one of two configurations.

Option One:
- `intialState: string`
- `validationMask: Extract<ValidationType, MaskType>`

Option Two:
- `initialState: string`
- `validation: (keyof typeof validationRegEx | RegExp | RegExp[])`
- `mask: keyof typeof maskingFuncs | (value: string) => string | undefined`

If the user wants the validation and mask type to be the *same*, they should use **option one**.

If the user needs to pass a *different* validation and mask type or if the user wishes to pass a custom validation RegExp or mask function, they will have to use **option two**.


### Return

- `item: string`
- `setItem: (value: string) => string | undefined`
- `valid: boolean`

---

## Uses

useValidatedMask functions similarly to useMask, its distinction is returning the added benefit of a validation boolean.

Basic Example:
```tsx
const [zipCode, setZipCode, isValidZip] = useValidatedMask({
  initialState: '', 
  validationMask: 'zip-code',
})
```

Example with custom validation:
```tsx
const [name, setName, isValidName] = useValidatedMask({
  initialState: '', 
  validation: RegExp, 
  mask: 'name-mask',
})
```

Example with custom mask:
```tsx
const [name, setName, isValidName] = useValidatedMask({
  initialState: '', 
  validation: 'name-validation', 
  mask: customMaskFunc,
})
```

---

## Notes

In cases where the masked value and the validated value formatting do not align it may **not** be ideal to use useValidatedMask.

For example: the default credit card mask adds spaces every four characters. However, the default credit card validation RegExp only validates credit card numbers with no added spaces or characters.

In this case, useMask and useValidation should be used separately.

Always False Example:
```tsx
const [creditCard, setCreditCard, isValidCard] = useValidatedMask({
  initialState: '', 
  validationMask: 'credit-card'
})

// isValidCard will always return false because it is receiving the masked value: xxxx xxxx xxxx xxxx
// instead of the cleaned value:  xxxxxxxxxxxxxxxx
```

Fully Functioning Example:
```tsx
const [creditCard, setCreditCard] = useMask('', 'credit-card')
const isValidCard = useValidation('credit-card')

// regex removes any non-numeric characters
const cleanedCreditCard = creditCard.replace(/[^0-9]+/g, '')
isValidCard(cleanedCreditCard) 
// isValidCard now receives the value in the expected format and will validate as intended
```