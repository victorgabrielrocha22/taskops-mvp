
import React from 'react';
import clsx from 'clsx';

export function Card(props: React.PropsWithChildren<{ className?: string }>) {
  return <div className={clsx('card', props.className)}>{props.children}</div>;
}

export function Pill({ children, tone='zinc', className='' }: { children: React.ReactNode; tone?: 'zinc'|'red'|'blue'|'amber'|'emerald'; className?: string }) {
  const tones: Record<string,string> = {
    zinc: 'ring-black/10 text-zinc-700 bg-white/60 dark:text-zinc-200 dark:ring-white/10 dark:bg-zinc-800',
    red: 'ring-red-500/20 text-red-700 bg-red-500/10',
    blue: 'ring-blue-500/20 text-blue-700 bg-blue-500/10',
    amber: 'ring-amber-500/20 text-amber-700 bg-amber-500/10',
    emerald: 'ring-emerald-500/20 text-emerald-700 bg-emerald-500/10',
  };
  return <span className={clsx('pill', tones[tone], className)}>{children}</span>;
}

export function Button({ children, kind='secondary', ...rest }: any) {
  const base = 'rounded-lg px-3 py-1.5 text-xs font-medium active:translate-y-px transition-colors';
  const map: Record<string,string> = {
    primary: 'bg-black text-white hover:opacity-90 dark:bg-white dark:text-black',
    secondary: 'border border-black/10 hover:bg-black/5 dark:border-white/10 dark:hover:bg-white/5',
  };
  return <button className={clsx(base, map[kind])} {...rest}>{children}</button>;
}
