'use client'

import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'

interface GlitchTextProps {
  text: string
  className?: string
}

/**
 * Glitch effect text component
 * Creates a cybersecurity/hacker aesthetic
 */
export default function GlitchText({ text, className = '' }: GlitchTextProps) {
  const [glitch, setGlitch] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setGlitch(true)
      setTimeout(() => setGlitch(false), 100)
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  return (
    <motion.span
      className={`relative inline-block ${className}`}
      animate={glitch ? {
        x: [0, -2, 2, -2, 2, 0],
        y: [0, 2, -2, 2, -2, 0],
      } : {}}
      transition={{ duration: 0.1 }}
    >
      {text}
      {glitch && (
        <>
          <motion.span
            className="absolute inset-0 text-red-500 opacity-80 blur-sm"
            animate={{ x: [0, -2, 2], y: [0, 2, -2] }}
            transition={{ duration: 0.1 }}
          >
            {text}
          </motion.span>
          <motion.span
            className="absolute inset-0 text-cyber-accent opacity-80 blur-sm"
            animate={{ x: [0, 2, -2], y: [0, -2, 2] }}
            transition={{ duration: 0.1 }}
          >
            {text}
          </motion.span>
        </>
      )}
    </motion.span>
  )
}

