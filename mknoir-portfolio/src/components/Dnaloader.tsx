// src/components/DnaLoader.tsx

'use client'

import React, { useEffect, useState } from 'react'
import './Dnaloader.css'

const DnaLoader: React.FC = () => {
  const [isVisible, setIsVisible] = useState(true)
  const [isFadingOut, setIsFadingOut] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsFadingOut(true)

      // Delay hide until fade-out finishes
      setTimeout(() => {
        setIsVisible(false)
      }, 500) // Match CSS transition duration
    }, 3000) // How long to show loader

    return () => clearTimeout(timer)
  }, [])

  if (!isVisible) return null

  return (
    <div className={`loader-container ${isFadingOut ? 'fade-out' : ''}`}>
      <div className="loader">
        <div className="dot dot1"><i></i></div>
        <div className="dot dot2"><i></i></div>
        <div className="dot dot3"><i></i></div>
        <div className="dot dot4"><i></i></div>
        <div className="dot dot5"><i></i></div>
        <div className="dot dot6"><i></i></div>
        <div className="dot dot7"><i></i></div>
        <div className="dot dot8"><i></i></div>
        <div className="dot dot9"><i></i></div>
      </div>
    </div>
  )
}

export default DnaLoader
