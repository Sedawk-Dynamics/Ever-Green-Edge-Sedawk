import { EnrollLink } from './enroll-link'

/**
 * Brief: sticky Enroll Now on /fit — bottom bar on mobile.
 * (On desktop the sticky header's top-right button becomes Enroll Now on FIT pages.)
 */
export function StickyEnrollBar() {
  return (
    <>
      {/* Keep the footer clear of the bar on small screens. */}
      <style>{'@media (max-width: 1023px) { body { padding-bottom: 7rem; } }'}</style>
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-charcoal/95 px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur-md lg:hidden">
        <EnrollLink location="fit-sticky-mobile" className="h-11 w-full" />
        <p className="mt-2 text-center text-[10.5px] leading-snug text-mist">
          Selection is merit-based. The seminar fee is for training only and does not guarantee a trader role or capital.
        </p>
      </div>
    </>
  )
}
