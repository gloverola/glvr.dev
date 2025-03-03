'use client'

import { RadioIcon } from 'lucide-react'
import dynamic from 'next/dynamic'
import { usePathname, useRouter } from 'next/navigation'
import { useMemo } from 'react'

import { LoadingSpinner } from '@/components/loading-spinner'
import { ScrollArea } from '@/components/scroll-area'

const SubmitBookmarkDialog = dynamic(
  () => import('@/components/submit-bookmark/dialog').then((mod) => mod.SubmitBookmarkDialog),
  {
    loading: () => <LoadingSpinner />,
    ssr: false
  }
)

import { useKeyPress } from '@/hooks/useKeyPress'
import { cn } from '@/lib/utils'

const keyCodePathnameMapping = {
  Digit1: '/',
  Digit2: '/writing',
  Digit3: '/journey',
  Digit4: '/work',
  Digit5: '/workspace',
  Digit6: '/bookmarks'
}

export const SideMenu = ({ children, title, isInner }) => {
  const router = useRouter()
  const pathname = usePathname()
  useKeyPress(onKeyPress, Object.keys(keyCodePathnameMapping))

  function onKeyPress(event) {
    const key = event.code
    const targetPathname = keyCodePathnameMapping[key]
    if (targetPathname && targetPathname !== pathname) router.push(targetPathname)
  }

  const memoizedScrollArea = useMemo(
    () => (
      <ScrollArea
        className={cn(
          'hidden lg:flex lg:flex-col lg:border-r border-border-line bg-accent-foreground',
          isInner ? 'lg:w-80 xl:w-96' : 'lg:w-60 xl:w-72'
        )}
      >
        {title && (
          <div className="sticky top-0 z-10 border-b border-border-line px-5 py-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold tracking-tight">{title}</span>
            </div>
          </div>
        )}
        <div className="p-3">{children}</div>
      </ScrollArea>
    ),
    [isInner, title, children]
  )

  return memoizedScrollArea
}
