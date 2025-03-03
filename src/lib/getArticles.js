const username = '_itsglover'

export async function getArticles() {
  try {
    const response = await fetch(
      `https://dev.to/api/articles?username=${username}&per_page=50`,
      { next: { revalidate: 3600 } }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch articles');
    }

    return response.json();
  } catch (error) {
    console.error('Error fetching articles:', error);
    return [];
  }
}

export async function getArticle(slug) {
  try {
    const response = await fetch(
      `https://dev.to/api/articles/${username}/${slug}`,
      { next: { revalidate: 3600 } }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch article');
    }

    return response.json();
  } catch (error) {
    console.error('Error fetching article:', error);
    return null;
  }
}
