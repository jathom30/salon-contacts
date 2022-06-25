import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { getPhoto } from "api/images";
import { Button, FlexBox, Modal, DeleteWarning, ImageCapture } from "components";
import React, { ChangeEvent, useState } from "react";
import { useQuery } from "react-query";
import './ImageDisplay.scss'

export const ImageDisplay = ({id, onReplace, onDelete}: {id: string; onReplace: (e: ChangeEvent<HTMLInputElement>) => void; onDelete: () => void}) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  const handleDelete = () => {
    setShowDeleteModal(false)
    onDelete()
  }

  const getPhotoQuery = useQuery(['photo', id], () => getPhoto(id), {
    retry: 0,
    onSuccess: (data) => {
      console.log(data)
    }
  })

  return (
    <div className="ImageDisplay">
      {/* <img className="ImageDisplay__image" src={image} alt="" /> */}
      <div className="ImageDisplay__photo-options">
        <FlexBox justifyContent="space-between" gap="1rem">
          <ImageCapture onChange={onReplace} />
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