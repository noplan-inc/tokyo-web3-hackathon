import { fetchAPI } from "../../lib/api"

const Article = ({ article }) => {
  return JSON.stringify(article.attributes.content)
}

export async function getStaticPaths() {
  const articlesRes = await fetchAPI("/articles", { fields: ["slug"] })

  return {
    paths: articlesRes.data.map((article) => ({
      params: {
        slug: article.attributes.slug,
      },
    })),
    fallback: false,
  }
}

export async function getStaticProps({ params }) {
  const articlesRes = await fetchAPI("/articles", {
    filters: {
      slug: params.slug,
    },
    populate: "*",
  })

  const fs = await import("fs/promises")
  const j = articlesRes.data[0]

  await fs.writeFile(
    `${process.cwd()}/public/secret/${params.slug}.json`,
    JSON.stringify(j)
  )

  return {
    props: { article: articlesRes.data[0] },
    revalidate: 1,
  }
}
export default Article
