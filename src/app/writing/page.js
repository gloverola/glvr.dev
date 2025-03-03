import { Suspense } from 'react'

import { FloatingHeader } from '@/components/floating-header'
import { ScreenLoadingSpinner } from '@/components/screen-loading-spinner'
import { ScrollArea } from '@/components/scroll-area'
import { WritingListLayout } from '@/components/writing/writing-list-layout'
import { getArticles } from '@/lib/getArticles'

async function fetchData() {
  const articles = await getArticles()
  return { articles }
}

export default async function Writing() {
  const { articles } = await fetchData()

  return (
    <ScrollArea className="lg:hidden">
      <FloatingHeader title="Writing" />
      <Suspense fallback={<ScreenLoadingSpinner />}>
        <WritingListLayout list={articles} isMobile />
      </Suspense>
    </ScrollArea>
  )
}

export function generateMetadata() {
  const title = 'Writing - Olaoluwa Glover'
  const description = 'Articles and thoughts on software development, design, and technology.'
  const siteUrl = '/writing'

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: siteUrl
    },
    alternates: {
      canonical: siteUrl
    }
  }
}
