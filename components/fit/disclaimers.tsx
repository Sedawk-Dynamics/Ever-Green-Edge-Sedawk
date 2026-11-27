import { FIT_FULL_DISCLAIMER, FIT_SHORT_DISCLAIMER } from '@/lib/fit'
import { cn } from '@/lib/utils'

/** Brief: shown directly under every Enroll Now button. */
export function ShortDisclaimer({ className }: { className?: string }) {
  return <p className={cn('max-w-xl text-xs leading-relaxed text-mist', className)}>{FIT_SHORT_DISCLAIMER}</p>
}

/** Brief: bottom of /fit and /fit/enroll. */
export function FullDisclaimer() {
  return (
    <section aria-labelledby="fit-disclaimer" className="mx-auto max-w-6xl px-5 pb-20">
      <div className="rounded-lg border border-line bg-surface/60 p-6 md:p-8">
        <h2 id="fit-disclaimer" className="font-mono text-xs tracking-[0.2em] text-lavender uppercase">
          Disclaimer
        </h2>
        <p className="mt-4 text-sm leading-relaxed text-mist">{FIT_FULL_DISCLAIMER}</p>
      </div>
    </section>
  )
}
