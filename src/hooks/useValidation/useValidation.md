# useValidation

A basic validation hook used to provide a boolean check for a user input.

---

## Ins and Outs

### Inputs

- `validation: keyof typeof validationRegEx | RegExp | RegExp[]`

### Outputs

- `(value: string) => boolean`

---

## Uses

useValidation should be used if an input needs to be validated. Ex: credit card number, phone number, email, password, etc

useValidation can take in a string (matching the requirements specified in **Inputs**), a Regular Expression, or an array of Regular Expressions.

Basic Example:
```tsx
const isValidEmail = useValidation('email')

isValidEmail('my@email.com') // true
```

Custom RegExp Example:
```tsx
const isValidEmail = useValidation(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/)

isValidEmail('my@email.com') // true
```

Array of custom RegExp Example:
```tsx
const isValidEmail = useValidation([
  /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/,
  /(^\d{5}$)|(^\d{5}-\d{4}$)/,
  /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/,
])

// each item of array must return true for isValidEmail to return true
isValidEmail('my@email.com') // false
```