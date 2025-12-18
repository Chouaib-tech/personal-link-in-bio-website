'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

interface TerminalTypingProps {
  text: string
  speed?: number
  className?: string
}

/**
 * Terminal-style typing effect
 * Creates a hacker/developer aesthetic
 */
export default function TerminalTyping({ text, speed = 50, className = '' }: TerminalTypingProps) {
  const [displayedText, setDisplayedText] = useState('')
  const [isTyping, setIsTyping] = useState(true)

  useEffect(() => {
    if (displayedText.length < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText(text.slice(0, displayedText.length + 1))
      }, speed)
      return () => clearTimeout(timeout)
    } else {
      setIsTyping(false)
    }
  }, [displayedText, text, speed])

  return (
    <div className={`font-mono ${className}`}>
      <span className="text-cyber-accent">$</span>{' '}
      <span className="text-cyber-text">{displayedText}</span>
      {isTyping && (
        <motion.span
          animate={{ opacity: [1, 0] }}
          transition={{ duration: 0.8, repeat: Infinity }}
          className="ml-1 text-cyber-accent"
        >
          ▊
        </motion.span>
      )}
    </div>
  )
}

