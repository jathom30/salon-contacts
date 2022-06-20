# useMask

A custom hook designed to mask an input if the user should be restricted or is accustomed to seeing their text formatted in a certain way.

---

## Ins and Outs

### Inputs

- `initialState: string`
- `mask: keyof typeof maskingFuncs | (value: string) => string | undefined`

### Return

- `state: string`
- `setState: (value: string) => string | undefined`

---

## Uses:

useMask should be used the same as useState, but in addition to an initial state, a mask needs to be provided.

The mask can either be a string (matching type requirements specified in **Inputs** above) or a custom masking function.

Basic Example:
```tsx
const [zipCode, setZipCode] = useMask('', 'zip-code')
```

Example with custom mask:
```tsx
const [name, setName] = useMask('', customMaskFunc)
```