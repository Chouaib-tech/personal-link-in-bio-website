'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

/**
 * Interactive mouse follower with glow effect
 * Adds interactivity and visual interest
 */
export default function MouseFollower() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isHovering, setIsHovering] = useState(false)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }

    const handleMouseEnter = () => setIsHovering(true)
    const handleMouseLeave = () => setIsHovering(false)

    window.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseenter', handleMouseEnter)
    document.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseenter', handleMouseEnter)
      document.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [])

  return (
    <motion.div
      className="pointer-events-none fixed z-50"
      animate={{
        x: mousePosition.x - 15,
        y: mousePosition.y - 15,
        opacity: isHovering ? 0.3 : 0,
      }}
      transition={{
        type: 'spring',
        stiffness: 500,
        damping: 28,
      }}
    >
      <div className="h-8 w-8 rounded-full border-2 border-cyber-accent bg-cyber-accent/10 blur-sm" />
    </motion.div>
  )
}

