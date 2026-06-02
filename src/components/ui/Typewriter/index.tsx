'use client'
import { motion } from 'framer-motion'

interface TypewriterProps {
  text: string
  className?: string
  delay?: number
}

export function Typewriter({ text, className = '', delay = 0 }: TypewriterProps) {
  return (
    <motion.span
      className={`inline-block ${className}`}
      initial="hidden"
      animate="visible"
      variants={{
        visible: { transition: { staggerChildren: 0.04, delayChildren: delay } },
        hidden: {},
      }}
    >
      {text.split('').map((char, i) => (
        <motion.span
          key={i}
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1 },
          }}
        >
          {char === ' ' ? ' ' : char}
        </motion.span>
      ))}
    </motion.span>
  )
}
