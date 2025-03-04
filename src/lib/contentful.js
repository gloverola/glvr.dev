import 'server-only'

import { cache } from 'react'

import { isDevelopment } from '@/lib/utils'

const fetchGraphQL = cache(async (query, preview = isDevelopment) => {
  try {
    const res = await fetch(`https://graphql.contentful.com/content/v1/spaces/${process.env.CONTENTFUL_SPACE_ID}`, {
      cache: 'force-cache',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${preview ? process.env.CONTENTFUL_PREVIEW_ACCESS_TOKEN : process.env.CONTENTFUL_ACCESS_TOKEN
          }`
      },
      body: JSON.stringify({ query })
    })

    if (!res.ok) {
      console.error(res.statusText)
      return null
    }

    return res.json()
  } catch (error) {
    console.log(error)
    return null
  }
})

// https://nextjs.org/docs/app/building-your-application/data-fetching/patterns#preloading-data
export const preloadGetAllPosts = (preview = isDevelopment) => {
  void getAllPosts(preview)
}

export const getAllPosts = cache(async (preview = isDevelopment) => {

})

export const getPost = cache(async (slug, preview = isDevelopment) => {

})

export const getWritingSeo = cache(async (slug, preview = isDevelopment) => {

})

export const getPageSeo = cache(async (slug, preview = isDevelopment) => {

})

export const getAllPageSlugs = cache(async (preview = isDevelopment) => {

})

export const getAllPostSlugs = cache(async (preview = isDevelopment) => {

})

export const getPage = cache(async (slug, preview = isDevelopment) => {

})

export const getAllLogbook = cache(async (preview = isDevelopment) => {
  try {
    const entries = await fetchGraphQL(
      `query {
           journeyCollection(order: date_DESC, preview: ${preview}) {
    items {
      title
      date
      description
      image {
        url
        title
        description
        width
        height
      }
    }
  }
}`,
      preview
    )

    if (!entries) {
      console.warn("No entries found.");
      return [];
    }

    return entries.data.journeyCollection.items ?? []
  } catch (error) {
    console.info(error)
    return []
  }
})
