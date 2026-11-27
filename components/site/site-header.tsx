'use client'

import { AnimatePresence, motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Menu, X } from 'lucide-react'
import { ease, ScrollProgress } from '@/components/motion/primitives'
import { EnrollLink } from '@/components/fit/enroll-link'
import { cn } from '@/lib/utils'

const links = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/fit', label: 'FIT Program' },
  { href: '/tdp', label: 'TDP' },
  { href: '/courses', label: 'Courses' },
  { href: '/contact', label: 'Contact' },
]

export function SiteHeader() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const [hovered, setHovered] = useState<string | null>(null)

  useEffect(() => setOpen(false), [pathname])

  const isActive = (href: string) => (href === '/' ? pathname === '/' : pathname.startsWith(href))

  // Header CTA on every page: "Apply For FIT" → enrollment (Google Doc). Hidden on the enrollment page itself.
  const onEnrollPage = pathname.startsWith('/fit/enroll')

  return (
    <>
      <ScrollProgress />
      {/* Sticky, in the page flow (sits right under the market strip), so pages need no
          extra top padding to clear it — no leftover gap below the header. */}
      <header className="sticky top-0 z-50 border-b border-line bg-charcoal/90 backdrop-blur-md">
        <nav aria-label="Primary" className="mx-auto flex h-20 max-w-6xl items-center justify-between gap-6 px-5">
          <Link href="/" aria-label="The Trader Foundry home" className="flex items-center">
            <motion.span whileHover={{ scale: 1.04 }} transition={{ duration: 0.2 }} className="block">
              <Image src="/images/logo-tf-light.png" alt="" width={110} height={61} priority className="h-14 w-auto lg:h-[3.75rem]" />
            </motion.span>
          </Link>

          <ul className="hidden items-center gap-1 lg:flex" onMouseLeave={() => setHovered(null)}>
            {links.map((l) => (
              <li key={l.href} className="relative" onMouseEnter={() => setHovered(l.href)}>
                {hovered === l.href && (
                  <motion.span layoutId="nav-hover" className="absolute inset-0 rounded-md bg-surface" transition={{ type: 'spring', stiffness: 400, damping: 34 }} />
                )}
                <Link
                  href={l.href}
                  aria-current={isActive(l.href) ? 'page' : undefined}
                  className={cn(
                    'relative block px-4 py-2 text-sm transition-colors',
                    isActive(l.href) ? 'text-lavender' : 'text-paper/80 hover:text-paper',
                  )}
                >
                  {l.label}
                  {isActive(l.href) && (
                    <motion.span layoutId="nav-active" className="absolute inset-x-3 -bottom-0.5 h-0.5 rounded-full bg-lavender" transition={{ type: 'spring', stiffness: 400, damping: 34 }} />
                  )}
                </Link>
              </li>
            ))}
          </ul>

          <div className="hidden min-w-[10rem] justify-end lg:flex">
            {!onEnrollPage && <EnrollLink location="header">Apply For FIT</EnrollLink>}
          </div>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-label={open ? 'Close menu' : 'Open menu'}
            className="flex size-10 items-center justify-center rounded-md text-paper lg:hidden"
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={open ? 'x' : 'menu'}
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                {open ? <X className="size-5" /> : <Menu className="size-5" />}
              </motion.span>
            </AnimatePresence>
          </button>
        </nav>

        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.4, ease }}
              className="overflow-hidden border-t border-line bg-charcoal lg:hidden"
            >
              <motion.ul
                initial="hidden"
                animate="show"
                variants={{ hidden: {}, show: { transition: { staggerChildren: 0.05, delayChildren: 0.1 } } }}
                className="flex flex-col px-5 py-3"
              >
                {links.map((l) => (
                  <motion.li key={l.href} variants={{ hidden: { opacity: 0, x: -16 }, show: { opacity: 1, x: 0 } }}>
                    <Link
                      href={l.href}
                      className={cn('flex border-b border-line py-3.5 text-base', isActive(l.href) ? 'text-lavender' : 'text-paper')}
                    >
                      {l.label}
                    </Link>
                  </motion.li>
                ))}
                {!onEnrollPage && (
                  <motion.li variants={{ hidden: { opacity: 0, y: 8 }, show: { opacity: 1, y: 0 } }} className="py-5">
                    <EnrollLink location="header-mobile" className="h-12 w-full">
                      Apply For FIT
                    </EnrollLink>
                  </motion.li>
                )}
              </motion.ul>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  )
}
