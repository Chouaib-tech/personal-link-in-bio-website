'use client'

import { motion } from 'framer-motion'
import {
  FaPhone,
  FaGlobe,
  FaLinkedin,
  FaInstagram,
  FaFacebook,
  FaTelegram,
  FaGithub,
  FaEnvelope,
  FaSnapchat,
  FaShieldAlt,
  FaCode,
  FaMobile,
} from 'react-icons/fa'
import LinkCard from '@/components/LinkCard'
import AnimatedBackground from '@/components/AnimatedBackground'
import CodeRain from '@/components/CodeRain'
import MouseFollower from '@/components/MouseFollower'
import TerminalTyping from '@/components/TerminalTyping'
import GlitchText from '@/components/GlitchText'
import {
  pageVariants,
  containerVariants,
  headerVariants,
} from '@/components/animations'

// Link data configuration
const links = [
  {
    icon: FaPhone,
    label: 'Phone',
    href: 'tel:+213558638939',
  },
  {
    icon: FaEnvelope,
    label: 'Email',
    href: 'mailto:chouaib-takieddine.ramoul@univ-annaba.dz',
  },
  {
    icon: FaGlobe,
    label: 'Personal Website',
    href: 'https://ramoul-chouaib.vercel.app/',
  },
  {
    icon: FaLinkedin,
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/in/chouaib-ramoul25',
  },
  {
    icon: FaGithub,
    label: 'GitHub',
    href: 'https://github.com/Chouaib-tech',
  },
  {
    icon: FaTelegram,
    label: 'Telegram',
    href: 'https://t.me/Chouaibtakieddine',
  },
  {
    icon: FaInstagram,
    label: 'Instagram',
    href: 'https://instagram.com/chouaib._.ramoul',
  },
  {
    icon: FaFacebook,
    label: 'Facebook',
    href: 'https://facebook.com/ChouaibRamoul',
  },
  {
    icon: FaSnapchat,
    label: 'Snapchat',
    href: 'https://snapchat.com/add/taki.eddine25',
  },
]

export default function Home() {
  return (
    <>
      {/* Animated Backgrounds */}
      <AnimatedBackground />
      <CodeRain />
      <MouseFollower />

      <motion.main
        variants={pageVariants}
        initial="initial"
        animate="animate"
        className="relative mx-auto min-h-screen max-w-3xl px-4 py-8 md:px-6 md:py-12"
      >
        {/* Header / Profile Section */}
        <motion.header
          variants={headerVariants}
          initial="initial"
          animate="animate"
          className="mb-12 text-center md:mb-16"
        >
          {/* Terminal-style intro */}
          <div className="mb-6 font-mono text-sm text-cyber-accent/70 md:text-base">
            <TerminalTyping text="whoami" speed={80} />
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="mt-2 text-left"
            >
              <span className="text-cyber-accent">$</span>{' '}
              <span className="text-cyber-text-muted">Initializing profile...</span>
            </motion.div>
          </div>

          {/* Name with glitch effect */}
          <h1 className="mb-4 font-mono text-3xl font-bold text-white md:text-5xl lg:text-6xl">
            <GlitchText text="Ramoul Chouaib" />
            <br />
            <span className="text-cyber-accent">Taki Eddine</span>
          </h1>

          {/* Role badges */}
          <div className="mb-4 flex flex-wrap items-center justify-center gap-3 md:mb-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 }}
              className="flex items-center gap-2 rounded-lg border border-cyber-accent/30 bg-cyber-bg-secondary/50 px-4 py-2 backdrop-blur-sm"
            >
              <FaCode className="h-4 w-4 text-cyber-accent" />
              <span className="font-mono text-sm text-cyber-text md:text-base">Software Engineer</span>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6 }}
              className="flex items-center gap-2 rounded-lg border border-cyber-accent/30 bg-cyber-bg-secondary/50 px-4 py-2 backdrop-blur-sm"
            >
              <FaShieldAlt className="h-4 w-4 text-cyber-accent" />
              <span className="font-mono text-sm text-cyber-text md:text-base">Cybersecurity</span>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.7 }}
              className="flex items-center gap-2 rounded-lg border border-cyber-accent/30 bg-cyber-bg-secondary/50 px-4 py-2 backdrop-blur-sm"
            >
              <FaMobile className="h-4 w-4 text-cyber-accent" />
              <span className="font-mono text-sm text-cyber-text md:text-base">Mobile Dev</span>
            </motion.div>
          </div>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="font-mono text-sm text-cyber-text-muted md:text-base"
          >
            <span className="text-cyber-accent">Secure</span> •{' '}
            <span className="text-cyber-accent">Elegant</span> •{' '}
            <span className="text-cyber-accent">Scalable</span>
          </motion.p>

          {/* Terminal status */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="mt-6 font-mono text-xs text-cyber-accent/50 md:text-sm"
          >
            <span className="text-cyber-accent">[STATUS]</span>{' '}
            <span className="text-green-400">System Online</span> •{' '}
            <span className="text-cyber-accent">[READY]</span>{' '}
            <span className="text-cyber-text-muted">Awaiting connection...</span>
          </motion.div>
        </motion.header>

        {/* Links Section */}
        <motion.section
          variants={containerVariants}
          initial="initial"
          animate="animate"
          className="space-y-4"
          aria-label="Contact and social links"
        >
          {/* Section header */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-6 font-mono text-sm text-cyber-accent/70 md:text-base"
          >
            <span className="text-cyber-accent">$</span>{' '}
            <span className="text-cyber-text-muted">ls -la /connections/</span>
          </motion.div>

          {links.map((link, index) => (
            <LinkCard
              key={link.label}
              icon={link.icon}
              label={link.label}
              href={link.href}
              index={index}
            />
          ))}
        </motion.section>

        {/* Footer */}
        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.5 }}
          className="mt-16 text-center font-mono text-xs text-cyber-text-muted md:mt-20 md:text-sm"
        >
          <p>
            <span className="text-cyber-accent">©</span> {new Date().getFullYear()}{' '}
            <span className="text-cyber-accent">Ramoul Chouaib Taki Eddine</span>
          </p>
          <p className="mt-2 text-cyber-accent/50">
            <span className="text-cyber-accent">$</span> exit
          </p>
        </motion.footer>
      </motion.main>
    </>
  )
}
