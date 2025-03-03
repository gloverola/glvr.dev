import Link from 'next/link'
import { Suspense } from 'react'

import { FloatingHeader } from '@/components/floating-header'
import { PageTitle } from '@/components/page-title'
import { ScreenLoadingSpinner } from '@/components/screen-loading-spinner'
import { ScrollArea } from '@/components/scroll-area'
import { Button } from '@/components/ui/button'
import { WritingList } from '@/components/writing-list'
import { getItemsByYear, getSortedPosts } from '@/lib/utils'
import { GradientBg3 } from '@/components/gradient-bg'
import { getArticles } from '@/lib/getArticles'

async function fetchData() {
  const [allPosts, devArticles] = await Promise.all([
    getArticles()
  ])
  return { allPosts, devArticles }
}

export default async function Home() {
  const { allPosts, devArticles } = await fetchData()

  return (
    <ScrollArea useScrollAreaId>
      <GradientBg3 />
      <FloatingHeader scrollTitle="Olaoluwa Glover" />
      <div className="content-wrapper">
        <div className="content">
          <PageTitle title="Home" className="lg:hidden" />
          <p>
            Hi 👋 I'm Glover, a software engineer, dj, technical-writer, and minimalist based in
            Lagos, Nigeria.
          </p>
          <p>
            As a Senior Software Engineer with over 6 years of experience, I approach software development as both an art and a
            science crafting elegant solutions that balance technical excellence with user experience. My expertise focuses on
            building systems with robust protection against vulnerabilities, optimizing for speed and efficiency at every layer,
            and designing architecture that grows seamlessly with demand. Through this approach, I create software that is
            secure, efficient, and adaptable to future needs.
          </p>
          <Button asChild variant="link" className="inline px-0">
            <Link href="/writing">
              <h2 className="mt-8 mb-4">Writing</h2>
            </Link>
          </Button>
          <Suspense fallback={<ScreenLoadingSpinner />}>
            <WritingList items={allPosts} header="Writing" />
            {devArticles?.length > 0 && (
              <div className="mt-8">
                <div className="space-y-4">
                  {devArticles.map((article) => (
                    <Link
                      key={article.id}
                      href={article.url}
                      target="_blank"
                      className="block hover:opacity-70"
                    >
                      <h4>{article.title}</h4>
                      <p className="text-sm text-gray-500">{article.description}</p>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </Suspense>
        </div>
      </div>
    </ScrollArea>
  )
}
