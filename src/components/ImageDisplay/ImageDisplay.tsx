import { faCamera, faTrash } from "@fortawesome/free-solid-svg-icons";
import { Button, FlexBox, Modal, DeleteWarning } from "components";
import React, { useState } from "react";
import './ImageDisplay.scss'

export const ImageDisplay = ({image, onEdit, onDelete}: {image: string; onEdit: () => void; onDelete: () => void}) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  const handleDelete = () => {
    setShowDeleteModal(false)
    onDelete()
  }

  return (
    <div className="ImageDisplay">
      <img className="ImageDisplay__image" src={image} alt="" />
      <div className="ImageDisplay__photo-options">
        <FlexBox justifyContent="space-between" gap="1rem">
          <Button isRounded icon={faCamera} onClick={onEdit} />
          <Button isRounded icon={faTrash} onClick={() => setShowDeleteModal(true)} kind="danger" />
        </FlexBox>
      </div>
      {showDeleteModal && (
        <Modal offClick={() => setShowDeleteModal(false)}>
          <DeleteWarning
            onClose={() => setShowDeleteModal(false)}
            onDelete={handleDelete}
          >
            This image cannot be recovered once delete.
          </DeleteWarning>
        </Modal>
      )}
    </div>
  )
}