import { faCamera } from "@fortawesome/free-solid-svg-icons";
import { Button, FlexBox, Modal } from "components";
import React, { RefObject } from "react";
import './ImageCapture.scss'


export const ImageCapture = (
  {videoRef, showModal, setShowModal, image, onRetake, onSave, onPreview}:
  {
    videoRef: RefObject<HTMLVideoElement>
    showModal: boolean
    setShowModal: (show: boolean) => void
    onRetake: () => void
    onSave: () => void
    image?: string
    onPreview: () => void
  }) => {
  return (
    <div className="ImageCapture">
      <Button kind="secondary" isRounded icon={faCamera} onClick={() => {setShowModal(true); onRetake()}} />

      {showModal && (
        <Modal offClick={() => setShowModal(false)}>
          <div className="ImageCapture__modal">
            <FlexBox flexDirection="column" gap="1rem" padding="1rem">
              {image ? (
                <>
                  <img src={image} alt="user" className="ImageCapture__preview-image" />
                  <FlexBox gap="1rem" justifyContent="flex-end">
                    <Button onClick={onRetake}>Retake</Button>
                    <Button onClick={onSave} kind="primary">Save</Button>
                  </FlexBox>
                </>
                ) : (
                <>
                  <video ref={videoRef} className="ImageCapture__video" autoPlay />
                  <Button onClick={onPreview} kind="primary">Take Photo</Button>
                </>
              )}
            </FlexBox>
          </div>
        </Modal>
      )}
    </div>
  )
}
