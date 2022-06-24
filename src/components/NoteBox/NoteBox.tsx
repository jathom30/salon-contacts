import React, { useRef, useState } from "react";
import { Button, DeleteWarning, FlexBox, Modal, ImageCapture, ImageDisplay } from "components";
import { useImageCapture, useOnClickOutside } from "hooks";
import { faSave, faTrash } from "@fortawesome/free-solid-svg-icons";
import { Note } from "typings";
import './NoteBox.scss'

export const NoteBox = ({note, onDelete, onChange, canDelete}: {note: Note, onDelete: () => void, onChange: (newNote: Note) => void, canDelete: boolean}) => {
  const [edit, setEdit] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [details, setDetails] = useState(note.details)
  const noteRef = useRef<HTMLTextAreaElement>(null)
  const cancelButtonRef = useRef<HTMLButtonElement>(null)
  const saveButtonRef = useRef<HTMLButtonElement>(null)
  const {
    videoRef,
    showCaptureModal,
    setShowCaptureModal,
    dataUrl,
    handleOpenCapture,
    handleTakePhoto,
    handleRetake,
    handleSavePhoto,
  } = useImageCapture()

  useOnClickOutside([noteRef, cancelButtonRef, saveButtonRef], () => {
    setEdit(false)
    setDetails(note.details)
  })

  const date = new Date(note.date).toDateString()

  const handleSave = () => {
    setEdit(false)
    onChange({
      ...note,
      details
    })
  }

  const handleSaveImage = () => {
    const dataUrl = handleSavePhoto()
    onChange({
      ...note,
      image: dataUrl
    })
  }

  const handleDeleteImage = () => {
    onChange({
      ...note,
      image: ''
    })
  }

  const splitNote = note.details.split('\n')

  return (
    <div className="NoteBox">
      <FlexBox gap="1rem" alignItems="center" justifyContent="space-between" padding="0 .5rem">
        <span className="NoteBox__date">{date}</span>
        <FlexBox gap=".25rem">
          {(!note.image || showCaptureModal) && (
            <ImageCapture
              videoRef={videoRef}  
              showModal={showCaptureModal}
              setShowModal={setShowCaptureModal}
              onRetake={handleRetake}
              image={dataUrl}
              onPreview={handleTakePhoto}
              onSave={handleSaveImage}
            />
          )}
          <Button isDisabled={!canDelete} isRounded kind="danger" icon={faTrash} onClick={() => setShowDeleteModal(true)} />
        </FlexBox>
      </FlexBox>
      {note.image && <ImageDisplay image={note.image} onEdit={handleOpenCapture} onDelete={handleDeleteImage} />}
      {edit ? (
        <>
          <textarea ref={noteRef} rows={10} value={details} onChange={e => setDetails(e.target.value)} />
          <Button buttonRef={saveButtonRef} kind="primary" icon={faSave} onClick={handleSave}>Save note</Button>
        </>
      ) : (
        <button className="NoteBox__text-btn" onClick={() => setEdit(true)}>
          {splitNote.map((split, i) => (
            <p className="NoteBox__note-strand" key={i}>{split}</p>
          ))}
        </button>
      )}
      {showDeleteModal && (
        <Modal offClick={() => setShowDeleteModal(false)}>
          <DeleteWarning
            onClose={() => setShowDeleteModal(false)}
            onDelete={onDelete}
          >
            This note cannot be recovered once delete.
          </DeleteWarning>
        </Modal>
      )}
    </div>
  )
}