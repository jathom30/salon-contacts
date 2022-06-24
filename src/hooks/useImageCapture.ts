import { useEffect, useRef, useState } from "react"

export const useImageCapture = () => {
  const [showCaptureModal, setShowCaptureModal] = useState(false)
  const [dataUrl, setDataUrl] = useState<string>()
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const enableStream = async () => {
      if (!showCaptureModal) { return }
      let stream: MediaStream
      try {
        stream = await navigator.mediaDevices.getUserMedia({video: {width: 1000, height: 1000}, audio: false})
        if (videoRef.current) {
          videoRef.current.srcObject = stream
          videoRef.current.setAttribute('autoplay', '')
          videoRef.current.setAttribute('muted', '')
          videoRef.current.setAttribute('playsinline', '')
        }
      } catch (err) {
        console.error(err)
      }
    }
    enableStream()
  }, [showCaptureModal, videoRef.current?.srcObject, dataUrl])

  const handleOpenCapture = () => {
    setShowCaptureModal(true)
    setDataUrl(undefined)
  }

  const handleTakePhoto = () => {
    const dims = videoRef.current?.getBoundingClientRect()
    if (!dims || !videoRef.current) { return }
    const {height, width} = dims
    const canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = height
    canvas.getContext('2d')?.drawImage(videoRef.current, 0, 0, width, height)
    const imageDataUrl = canvas.toDataURL('image/jpeg')
    setDataUrl(imageDataUrl)
  }

  const handleRetake = () => {
    setDataUrl('')
  }

  const handleSavePhoto = () => {
    setShowCaptureModal(false)
    return dataUrl
  }

return {
  videoRef,
  showCaptureModal,
  dataUrl,
  setShowCaptureModal,
  handleOpenCapture,
  handleTakePhoto,
  handleRetake,
  handleSavePhoto,
}
}