import ReactMarkdown from "react-markdown"
import Moment from "react-moment"
import { fetchAPI } from "../../lib/api"
import Layout from "../../components/layout"
import NextImage from "../../components/image"
import Seo from "../../components/seo"
import { getStrapiMedia } from "../../lib/media"
import useSWR from "swr"
import { Lsat } from "lsat-js"
import { useEffect, useState } from "react"

const parseLSAT = (header) => {
  const regex = /macaroon="(\S*)",\s*invoice="(\S*)"/gm

  let m

  let macaroon, invoice

  while ((m = regex.exec(header)) !== null) {
    // This is necessary to avoid infinite loops with zero-width matches
    if (m.index === regex.lastIndex) {
      regex.lastIndex++
    }

    // The result can be accessed through the `m`-variable.

    if (m.length !== 3) return

    macaroon = m[1]
    invoice = m[2]
  }

  return [macaroon, invoice]
}

const Article = ({ article, categories }) => {
  const [content, setContent] = useState(null)
  const imageUrl = getStrapiMedia(article.attributes.image)

  useEffect(() => {
    ;(async () => {
      const endpoint = process.env.NEXT_PUBLIC_SECRET_API_ENDPOINT

      const path = `/secret/${article.attributes.slug}`
      const url = `${endpoint}${path}.json`

      console.warn(`request: ${url}`)
      const res = await fetch(url)
      console.log(res.status)
      let data = ""

      console.log(res.headers)
      const header = res.headers.get("Www-Authenticate")
      console.log(header)

      const [macaroon, invoice] = parseLSAT(header)
      console.log(`macaroon: ${macaroon}`)
      console.log(`invoice: ${invoice}`)

      const lsat = Lsat.fromMacaroon(macaroon)
      const preimage = prompt(
        "watch invoice in dev console & please payinvoice & fill preimage"
      )
      lsat.setPreimage(preimage)
      const res2 = await fetch(url, {
        headers: {
          Authorization: lsat.toToken(),
        },
      })

      const articles = await res2.json()

      setContent(articles.attributes.content)
    })()
  }, [])

  const seo = {
    metaTitle: article.attributes.title,
    metaDescription: article.attributes.description,
    shareImage: article.attributes.image,
    article: true,
  }

  return (
    <Layout categories={categories.data}>
      <Seo seo={seo} />
      <div
        id="banner"
        className="uk-height-medium uk-flex uk-flex-center uk-flex-middle uk-background-cover uk-light uk-padding uk-margin"
        data-src={imageUrl}
        data-srcset={imageUrl}
        data-uk-img
      >
        <h1>{article.attributes.title}</h1>
      </div>
      <div className="uk-section">
        <div className="uk-container uk-container-small">
          {content && (
            <ReactMarkdown escapeHtml={false}>{content}</ReactMarkdown>
          )}

          <hr className="uk-divider-small" />
          <div className="uk-grid-small uk-flex-left" data-uk-grid="true">
            <div>
              {article.attributes.author.picture && (
                <NextImage image={article.attributes.author.picture} />
              )}
            </div>
            <div className="uk-width-expand">
              <p className="uk-margin-remove-bottom">
                By {article.attributes.author.name}
              </p>
              <p className="uk-text-meta uk-margin-remove-top">
                <Moment format="MMM Do YYYY">
                  {article.attributes.published_at}
                </Moment>
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
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
  const categoriesRes = await fetchAPI("/categories")

  return {
    props: { article: articlesRes.data[0], categories: categoriesRes },
    revalidate: 1,
  }
}

export default Article
