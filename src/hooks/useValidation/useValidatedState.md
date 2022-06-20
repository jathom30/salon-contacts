# useValidatedState

A custom hook that combines useState and useValidation.

---

## Ins and Outs

### Inputs

- `initialState: string`
- `validation: keyof typeof validationRegEx | RegExp | RegExp[]`

### Outputs

- `state: string`
- `setState: (value: string) => string`
- `valid: boolean`

---

## Uses

useValidatedState can be used if a stateful string needs validation as the end-user types it.

It is a convenience more than anything else in that it helps organize code.

Example:
```tsx
const [password, setPassword, isValidPassword] = useValidatedState(
  '',
  'password',
)
```

## Notes

If input masking and validation is needed, see the **useValidatedMask** custom hook.