import React, { useRef, useEffect } from 'react'
import logo from '../../assets/videos/logo.mp4'
import './style.styl'

function Video () {
  const ref = useRef()

  useEffect(() => {
    if (ref) {
      ref.current.playbackRate = 0.25
      console.log(ref)
    }
  }, [ref])

  return (
    <div className="Video">
      <video ref={ref} muted loop autostart="autostart" autoplay="autoplay" src={logo} type="video/mp4" />
    </div>
  )
}

export default Video
