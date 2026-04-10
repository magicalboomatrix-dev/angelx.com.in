import { cva } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const badgeVariants = cva('inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold tracking-wide', {
  variants: {
    variant: {
      default: 'bg-slate-100 text-slate-700',
      success: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100',
      warning: 'bg-amber-50 text-amber-700 ring-1 ring-amber-100',
      danger: 'bg-rose-50 text-rose-700 ring-1 ring-rose-100',
      info: 'bg-sky-50 text-sky-700 ring-1 ring-sky-100',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

export function Badge({ className, variant, ...props }) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}