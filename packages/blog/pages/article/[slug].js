import ReactMarkdown from "react-markdown"
import Moment from "react-moment"
import { fetchAPI } from "../../lib/api"
import Layout from "../../components/layout"
import NextImage from "../../components/image"
import Seo from "../../components/seo"
import { getStrapiMedia } from "../../lib/media"
import useSWR from "swr"
import { Lsat } from "lsat-js"

const fetcher = async (...path) => {
  const endpoint = process.env.NEXT_PUBLIC_SECRET_API_ENDPOINT
  console.log(endpoint)
  const p = `${endpoint}${path}.json`
  console.warn(`p: ${p}`)
  const host = process.env.NEXT_PUBLIC_SECRET_API_HOST
  console.warn(`host: ${host}`)
  const res = await fetch(p, {
    headers: {
      host: host,
    },
  })
  console.log(res.status)
  let data = ""

  console.log(res.headers)
  const header = res.headers.get("Www-Authenticate")
  console.log(header)
  const lsat = Lsat.fromHeader(header)
  console.log(`lsat.invoice: ${lsat.invoice}`)
  const preimage = prompt(
    "watch invoice in dev console & please payinvoice & fill preimage"
  )
  lsat.setPreimage(preimage)
  const res2 = await fetch(`${path}.json`, {
    headers: {
      Authorization: lsat.toToken(),
    },
  })

  data = await res2.json()
  // if (res.status === 402) {
  //   console.log(res.headers)
  //   const header = res.headers.get("Www-Authenticate")
  //   console.log(header)
  //   const lsat = Lsat.fromHeader(header)
  //   console.log(`lsat.invoice: ${lsat.invoice}`)
  //   const preimage = prompt(
  //     "watch invoice in dev console & please payinvoice & fill preimage"
  //   )
  //   lsat.setPreimage(preimage)
  //   const res = await fetch(`${path}.json`, {
  //     headers: {
  //       Authorization: lsat.toToken(),
  //     },
  //   })

  //   data = await res.json()
  // } else {
  //   data = await res.json()
  // }

  return {
    data: data.attributes.content,
  }
}

const Article = ({ article, categories }) => {
  const { data, error } = useSWR(`/secret/${article.attributes.slug}`, fetcher)
  const imageUrl = getStrapiMedia(article.attributes.image)

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
          {data && (
            <ReactMarkdown escapeHtml={false}>{data.data}</ReactMarkdown>
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
