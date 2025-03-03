'use client'

import { domAnimation, LazyMotion, m } from 'framer-motion'
import Link from 'next/link'
import { useMemo } from 'react'

import { cn, dateWithDayAndMonthFormatter, dateWithMonthAndYearFormatter } from '@/lib/utils'

export const WritingList = ({ items }) => {
  // Memoize animation props
  const animationProps = useMemo(
    () => ({
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 },
      transition: { duration: 0.3 }
    }),
    []
  )

  // Group articles by year
  const groupedItems = useMemo(() => {
    const groups = new Map()

    items.forEach((article) => {
      const year = new Date(article.published_timestamp).getFullYear()
      if (!groups.has(year)) {
        groups.set(year, [])
      }
      groups.get(year).push(article)
    })

    return Array.from(groups.entries()).sort((a, b) => b[0] - a[0])
  }, [items])

  // Memoize the items mapping to prevent unnecessary re-renders
  const renderedItems = useMemo(() => {
    return groupedItems.map(([year, articles]) => {
      return (
        <ul className="group/list list-none" key={year}>
          {articles.map((article, itemIndex) => {
            const dateObj = new Date(article.published_timestamp)
            const dateWithDayAndMonth = dateWithDayAndMonthFormatter.format(dateObj)
            const dateWithMonthAndYear = dateWithMonthAndYearFormatter.format(dateObj)
            const formattedReadingTime = `${article.reading_time_minutes} min read`

            return (
              <li key={article.id} className="group/list-item grid grid-cols-6 p-0 group-hover/list-wrapper:text-gray-300">
                <span
                  className={cn(
                    'pointer-events-none col-span-1 hidden items-center tabular-nums transition-colors duration-300 group-hover/list:text-gray-900 md:grid',
                    itemIndex === 0 && 'border-t border-gray-200'
                  )}
                >
                  {itemIndex === 0 ? year : ''}
                </span>
                <Link
                  href={`/writing/${article.slug}`}
                  className="col-span-6 group-hover/list-item:text-gray-900 md:col-span-5"
                >
                  <span className="grid grid-cols-4 items-center gap-2 border-t border-gray-200 py-4 md:grid-cols-8">
                    <span className="col-span-1 text-left tabular-nums">
                      <time dateTime={article.published_timestamp} className="hidden md:block">
                        {dateWithDayAndMonth}
                      </time>
                      <time dateTime={article.published_timestamp} className="md:hidden">
                        {dateWithMonthAndYear}
                      </time>
                    </span>
                    <span className="col-span-2 line-clamp-4 md:col-span-6">{article.title}</span>
                    <span className="col-span-1">
                      <m.span
                        key={`${article.id}-reading-time`}
                        className="flex justify-end tabular-nums"
                        title={`${formattedReadingTime}`}
                        {...animationProps}
                      >
                        {formattedReadingTime}
                      </m.span>
                    </span>
                  </span>
                </Link>
              </li>
            )
          })}
        </ul>
      )
    })
  }, [animationProps, groupedItems])

  return useMemo(
    () => (
      <LazyMotion features={domAnimation}>
        <div className="text-sm">
          <div className="group/list-wrapper">{renderedItems}</div>
        </div>
      </LazyMotion>
    ),
    [renderedItems]
  )
}
