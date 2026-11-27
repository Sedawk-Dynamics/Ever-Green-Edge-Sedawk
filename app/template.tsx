'use client'

import { motion } from 'framer-motion'
import { useEffect, type ReactNode } from 'react'

// The first page a visitor lands on renders visible straight away (no fade), so the hero
// paints as soon as the HTML arrives — most traffic is Instagram on 4G. Later in-site
// navigations re-mount this template and get a soft fade-in.
let firstLoad = true

export default function Template({ children }: { children: ReactNode }) {
  const animate = !firstLoad
  useEffect(() => {
    firstLoad = false
  }, [])

  return (
    <motion.div
      initial={animate ? { opacity: 0, y: 12 } : false}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  )
}
