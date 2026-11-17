import { cva, type VariantProps } from 'class-variance-authority'

export const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 rounded-md font-medium whitespace-nowrap transition-colors outline-none focus-visible:ring-2 focus-visible:ring-lavender focus-visible:ring-offset-2 focus-visible:ring-offset-charcoal disabled:opacity-50',
  {
    variants: {
      variant: {
        primary: 'bg-lavender text-charcoal hover:bg-lavender/85',
        outline: 'border border-paper/25 text-paper hover:border-lavender hover:text-lavender',
        ghost: 'text-paper hover:bg-surface',
      },
      size: {
        default: 'h-11 px-5 text-sm',
        lg: 'h-13 px-7 text-base',
      },
    },
    defaultVariants: { variant: 'primary', size: 'default' },
  },
)

export type ButtonVariantProps = VariantProps<typeof buttonVariants>
