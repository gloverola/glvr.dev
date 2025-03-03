import Image from 'next/image'
import { notFound } from 'next/navigation'

import { ClientOnly } from '@/components/client-only'
import { FloatingHeader } from '@/components/floating-header'
import { MarkdownRenderer } from '@/components/markdown-renderer'
import { PageTitle } from '@/components/page-title'
import { ScrollArea } from '@/components/scroll-area'
import { getArticle } from '@/lib/getArticles'
import { getDateTimeFormat } from '@/lib/utils'
import { GradientBg3 } from '@/components/gradient-bg'

async function fetchData(slug) {
  const article = await getArticle(slug)
  if (!article) notFound()

  return { article }
}

export default async function WritingSlug(props) {
  const params = await props.params
  const { slug } = params
  const { article } = await fetchData(slug)

  const dateString = getDateTimeFormat(article.published_timestamp)
  const datePublished = new Date(article.published_timestamp).toISOString()

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: article.title,
    description: article.description,
    datePublished,
    author: {
      '@type': 'Person',
      name: 'Olaoluwa Glover'
    },
    url: article.url
  }

  return (
    <>
      <ScrollArea className="bg-primary" useScrollAreaId>
        <GradientBg3 />
        <FloatingHeader scrollTitle={article.title} goBackLink="/writing" />
        <div className="content-wrapper @container/writing">
          <article className="content">
            <PageTitle
              title={article.title}
              subtitle={
                <div className="flex gap-2 text-gray-400">
                  <time dateTime={article.published_timestamp}>{dateString}</time>
                  <span>&middot;</span>
                  <span>{article.reading_time_minutes} min read</span>
                </div>
              }
              className="mb-6 flex flex-col gap-3"
            />
            {article.cover_image && (
              <div className="mb-8 overflow-hidden rounded-xl border">
                <Image
                  src={article.cover_image}
                  alt={article.title}
                  width={1200}
                  height={630}
                  className="w-full object-cover"
                  priority
                />
              </div>
            )}
            <div className="prose max-w-none dark:prose-invert prose-pre:my-4 prose-code:text-sm prose-code:font-mono prose-code:before:content-none prose-code:after:content-none prose-pre:shadow-lg prose-code:bg-gray-100 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md dark:prose-code:bg-gray-800">
              <MarkdownRenderer children={article.body_markdown} />
            </div>
          </article>
        </div>
      </ScrollArea>
      <ClientOnly>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd, null, 2) }} />
      </ClientOnly>
    </>
  )
}

export async function generateMetadata(props) {
  const params = await props.params
  const { slug } = params
  const article = await getArticle(slug)
  if (!article) return null

  const publishedTime = new Date(article.published_timestamp).toISOString()

  return {
    title: article.title,
    description: article.description,
    openGraph: {
      title: article.title,
      description: article.description,
      type: 'article',
      publishedTime,
      url: article.url,
      images: article.social_image || article.cover_image
    },
    alternates: {
      canonical: article.url
    }
  }
}
