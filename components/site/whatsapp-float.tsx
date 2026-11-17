'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import { SITE } from '@/lib/site'
import { WhatsAppIcon } from './whatsapp-icon'

const WA_GREEN = '#25D366'

/** Floating WhatsApp button on every page — opens a direct chat with the business number. */
export function WhatsAppFloat() {
  const [hover, setHover] = useState(false)

  return (
    <motion.a
      href={SITE.whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with The Trader Foundry on WhatsApp"
      onHoverStart={() => setHover(true)}
      onHoverEnd={() => setHover(false)}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 1.2, type: 'spring', stiffness: 260, damping: 18 }}
      whileTap={{ scale: 0.94 }}
      className="fixed right-5 bottom-5 z-50 flex items-center focus-visible:outline-none"
    >
      {/* Slide-out label (desktop hover). Absolutely positioned so it never adds an
          invisible clickable area over page content when hidden. */}
      <motion.span
        aria-hidden
        initial={false}
        animate={{ opacity: hover ? 1 : 0, x: hover ? 0 : 12 }}
        transition={{ duration: 0.25 }}
        className="pointer-events-none absolute top-1/2 right-full mr-3 hidden -translate-y-1/2 rounded-full bg-white px-4 py-2 text-sm font-medium whitespace-nowrap text-[#111b21] shadow-lg shadow-black/30 sm:block"
      >
        Chat with us
      </motion.span>

      <span className="relative flex size-14 items-center justify-center rounded-full text-white shadow-lg shadow-black/40" style={{ backgroundColor: WA_GREEN }}>
        {/* Soft pulse ring */}
        <motion.span
          aria-hidden
          className="absolute inset-0 rounded-full"
          style={{ backgroundColor: WA_GREEN }}
          animate={{ scale: [1, 1.5], opacity: [0.5, 0] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: 'easeOut' }}
        />
        <motion.span animate={{ scale: hover ? 1.1 : 1 }} transition={{ duration: 0.2 }} className="relative">
          <WhatsAppIcon className="size-7" />
        </motion.span>
      </span>
    </motion.a>
  )
}
