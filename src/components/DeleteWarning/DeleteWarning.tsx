import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, FlexBox, Loader } from "components";
import React, { MouseEvent, ReactNode } from "react";
import './DeleteWarning.scss'

export const DeleteWarning = ({children, onClose, onDelete, isLoading = false}: {children?: ReactNode, onClose: () => void, onDelete: (e: MouseEvent<HTMLButtonElement>) => void, isLoading?: boolean}) => {
  return (
    <div className="DeleteWarning">
      <FlexBox padding="1rem" paddingTop="2rem" flexDirection="column" gap="1rem">
        <FlexBox flexDirection="column" gap="0.5rem" alignItems="center">
          <FontAwesomeIcon size="2x" icon={faTrash} color="var(--color-danger)" />
          <h2>Are you sure?</h2>
        </FlexBox>
        {children}
        <FlexBox justifyContent="flex-end" gap=".5rem">
          {!isLoading && <Button kind="text" onClick={onClose}>Cancel</Button>}
          <Button kind="danger" onClick={onDelete} isDisabled={isLoading}>{!isLoading ? 'Delete' : <Loader />}</Button>
        </FlexBox>
      </FlexBox>
    </div>
  )
}