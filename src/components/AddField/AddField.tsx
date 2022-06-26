import React, { FormEvent, useRef, useState } from "react";
import { faPlus, faSave } from "@fortawesome/free-solid-svg-icons";
import { FlexBox, Input, Button } from "components";
import { useOnClickOutside, useValidatedMask } from "hooks";
import './AddField.scss'

export const AddField = ({label, onSubmit, validation}: {label: string; onSubmit: (newVal: string) => void; validation: 'phone-number' | 'email'}) => { 
  const [showInput, setShowInput] = useState(false)
  const [value, setValue, isValid] = useValidatedMask({
    initialState: '',
    validation,
    mask: validation === 'phone-number' ? 'phone-number' : (val) => val
  })
  const formRef = useRef<HTMLFormElement>(null)

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    onSubmit(value)
    setShowInput(false)
  }

  useOnClickOutside(formRef, () => setShowInput(false))

  if (showInput) {
    return (
      <div className="AddField">
        <form ref={formRef} onSubmit={handleSubmit}>
          <FlexBox gap="1rem" alignItems="center">
            <Input name={label} value={value} onChange={setValue} placeholder={label} hasError={!isValid} />
            <Button type="submit" icon={faSave} isRounded kind="primary" />
          </FlexBox>
        </form>
      </div>

    )
  }
  return (
    <Button icon={faPlus} onClick={() => setShowInput(true)}>{label}</Button>
  )
}