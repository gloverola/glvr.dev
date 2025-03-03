import { Suspense } from 'react'

import { ScreenLoadingSpinner } from '@/components/screen-loading-spinner'
import { SideMenu } from '@/components/side-menu'
import { WritingListLayout } from '@/components/writing/writing-list-layout'
import { getAllPosts } from '@/lib/contentful'
import { getArticles } from '@/lib/getArticles'

async function fetchData() {
  const articles = await getArticles()
  return { articles }
}

export default async function WritingLayout({ children }) {
  const { articles } = await fetchData()

  return (
    <>
      <SideMenu title="Writing" isInner>
        <Suspense fallback={<ScreenLoadingSpinner />}>
          <WritingListLayout list={articles} />
        </Suspense>
      </SideMenu>
      <div className="lg:bg-dots flex-1">{children}</div>
    </>
  )
}
