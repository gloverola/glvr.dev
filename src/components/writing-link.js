import { domAnimation, LazyMotion, m } from 'framer-motion'
import Link from 'next/link'

import { cn, getDateTimeFormat, viewCountFormatter } from '@/lib/utils'

export const WritingLink = ({ article, isMobile, isActive }) => {
  const formattedDate = getDateTimeFormat(article.published_timestamp)
  const formattedReadingTime = `${article.reading_time_minutes} min read`

  return (
    <LazyMotion features={domAnimation}>
      <Link
        key={article.id}
        href={`/writing/${article.slug}`}
        className={cn(
          'flex flex-col gap-2 transition-colors duration-300 mb-2',
          !isMobile && isActive ? 'bg-black text-white' : 'hover:bg-primary',
          isMobile ? 'border-b px-4 py-3 text-sm hover:bg-gray-100' : 'rounded-lg p-2'
        )}
      >
        <span className="font-medium">{article.title}</span>
        <span className={cn('transition-colors duration-300', isActive ? 'text-slate-400' : 'text-slate-500')}>
          <time dateTime={article.published_timestamp}>{formattedDate}</time>{' '}
          <span>
            <m.span
              key={`${article.id}-reading-time`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="tabular-nums"
            >
              &middot; {formattedReadingTime}
            </m.span>
          </span>
        </span>
      </Link>
    </LazyMotion>
  )
}
