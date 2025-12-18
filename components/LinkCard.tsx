'use client'

import { motion } from 'framer-motion'
import { IconType } from 'react-icons'
import { linkCardVariants } from './animations'
import { useState } from 'react'

interface LinkCardProps {
  icon: IconType
  label: string
  href: string
  index?: number
}

/**
 * Advanced link card with terminal/cybersecurity aesthetic
 * Features glitch effects, terminal borders, and interactive animations
 */
export default function LinkCard({ icon: Icon, label, href, index = 0 }: LinkCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      variants={linkCardVariants}
      initial="initial"
      animate="animate"
      whileHover="hover"
      whileTap="tap"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="group relative w-full"
      aria-label={`Visit ${label}`}
    >
      {/* Terminal-style border */}
      <div className="relative overflow-hidden rounded-lg border-2 border-cyber-accent/30 bg-cyber-bg-secondary/80 p-5 backdrop-blur-md transition-all duration-500 hover:border-cyber-accent hover:bg-cyber-bg-secondary/90 hover:shadow-[0_0_30px_rgba(0,217,255,0.5)] md:p-6">
        {/* Animated corner brackets */}
        <div className="absolute left-2 top-2 text-cyber-accent opacity-50">
          <motion.span
            animate={isHovered ? { opacity: [0.5, 1, 0.5] } : {}}
            transition={{ duration: 1, repeat: Infinity }}
          >
            {'<'}
          </motion.span>
        </div>
        <div className="absolute right-2 top-2 text-cyber-accent opacity-50">
          <motion.span
            animate={isHovered ? { opacity: [0.5, 1, 0.5] } : {}}
            transition={{ duration: 1, repeat: Infinity, delay: 0.5 }}
          >
            {'>'}
          </motion.span>
        </div>

        {/* Terminal prompt line */}
        <div className="mb-3 flex items-center gap-2 font-mono text-xs text-cyber-accent/60">
          <span className="text-cyber-accent">$</span>
          <span className="text-cyber-text-muted">connect --{label.toLowerCase().replace(/\s+/g, '-')}</span>
          <motion.span
            animate={isHovered ? { opacity: [0, 1] } : { opacity: 0 }}
            className="text-cyber-accent"
          >
            {'[OK]'}
          </motion.span>
        </div>

        {/* Main content */}
        <div className="flex items-center gap-4">
          {/* Icon with glow effect */}
          <div className="relative flex-shrink-0">
            <motion.div
              animate={isHovered ? { scale: [1, 1.2, 1] } : {}}
              transition={{ duration: 0.5 }}
              className="absolute inset-0 rounded-full bg-cyber-accent/30 blur-xl"
            />
            <Icon
              className="relative h-7 w-7 text-cyber-accent transition-all duration-300 group-hover:text-cyber-accent-hover md:h-8 md:w-8"
              aria-hidden="true"
            />
          </div>

          {/* Label with typing effect */}
          <div className="flex-1 font-mono">
            <span className="text-base font-semibold text-cyber-text transition-colors duration-300 group-hover:text-white md:text-lg">
              {label}
            </span>
            <motion.div
              initial={{ width: 0 }}
              animate={isHovered ? { width: '100%' } : { width: 0 }}
              className="mt-1 h-0.5 bg-cyber-accent"
            />
          </div>

          {/* Status indicator */}
          <div className="flex items-center gap-2">
            <motion.div
              animate={isHovered ? { scale: [1, 1.5, 1] } : {}}
              className="h-2 w-2 rounded-full bg-cyber-accent"
            />
            <svg
              className="h-5 w-5 flex-shrink-0 text-cyber-text-muted opacity-0 transition-all duration-300 group-hover:translate-x-1 group-hover:opacity-100"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
              />
            </svg>
          </div>
        </div>

        {/* Scan line effect on hover */}
        <motion.div
          initial={{ y: '-100%' }}
          animate={isHovered ? { y: '100%' } : { y: '-100%' }}
          transition={{ duration: 0.6, ease: 'easeInOut' }}
          className="absolute inset-0 bg-gradient-to-b from-transparent via-cyber-accent/20 to-transparent"
        />

        {/* Glow effect */}
        <div className="absolute inset-0 -z-10 rounded-lg bg-cyber-accent/0 blur-2xl transition-all duration-500 group-hover:bg-cyber-accent/30" />
      </div>
    </motion.a>
  )
}
