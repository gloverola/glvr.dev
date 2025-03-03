'use client'

import { usePathname } from 'next/navigation'
import { useMemo } from 'react'

import { WritingLink } from '@/components/writing-link'
import { cn } from '@/lib/utils'

export const WritingListLayout = ({ list, isMobile }) => {
  const pathname = usePathname()

  const memoizedList = useMemo(() => {
    return list.map((article) => {
      const isActive = pathname === `/writing/${article.slug}`
      return <WritingLink key={article.id} article={article} isMobile={isMobile} isActive={isActive} />
    })
  }, [list, pathname, isMobile])

  return <div className={cn(!isMobile && 'flex flex-col gap-1 text-sm')}>{memoizedList}</div>
}
