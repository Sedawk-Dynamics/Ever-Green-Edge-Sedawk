import Image from 'next/image'

type Photo = { src: string; alt: string }

/**
 * Office photos scrolling continuously in an endless loop. The set is rendered twice so the
 * loop is seamless; the copy is hidden from screen readers. Pauses while hovered or focused.
 * With "reduce motion" switched on it stops and becomes a normal swipeable row.
 */
export function PhotoMarquee({ slides, label }: { slides: Photo[]; label: string }) {
  return (
    <div
      role="region"
      aria-label={label}
      className="gallery -mx-5 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_4%,black_96%,transparent)] sm:mx-0"
    >
      <ul className="animate-gallery flex w-max">
        {[...slides, ...slides].map((s, i) => (
          // Spacing is padding (not gap) so both halves are exactly equal and the loop never jumps.
          <li key={`${s.src}-${i}`} aria-hidden={i >= slides.length} className="w-[78vw] shrink-0 pr-4 sm:w-[44vw] lg:w-[376px]">
            <div className="group relative aspect-[4/5] overflow-hidden rounded-lg border border-line bg-surface">
              <Image
                src={s.src}
                alt={i >= slides.length ? '' : s.alt}
                fill
                sizes="(min-width:1024px) 360px, (min-width:640px) 44vw, 78vw"
                className="object-cover transition-transform duration-700 select-none group-hover:scale-105"
                draggable={false}
              />
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
