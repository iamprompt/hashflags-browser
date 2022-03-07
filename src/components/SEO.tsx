import type { NextPage } from 'next'
import Head from 'next/head'
import { useRouter } from 'next/router'

interface SEOProps {
  title?: string
  description?: string
  image?: string
}

export const SEO: NextPage<SEOProps> = ({
  title,
  description = 'Find all Twitter Hashflags in one place!!',
  image = '/og.jpg',
}) => {
  const router = useRouter()
  const transformedTitle = title
    ? `${title} | Hashflags Browser`
    : 'Hashflags Browser'

  return (
    <Head>
      <title>{transformedTitle}</title>
      <meta name="description" content={description} />
      <link rel="icon" href="/favicon.png" type="image/png" />
      <link rel="icon" href="/favicon.svg" type="image/svg+xml" />

      <meta key="og:type" property="og:type" content="website" />
      <meta
        key="og:url"
        property="og:url"
        content={`https://hashflags.iamprompt.me${router.asPath}`}
      />
      <meta key="og:title" property="og:title" content={transformedTitle} />
      <meta
        key="og:description"
        property="og:description"
        content={description}
      />
      <meta
        key="og:image"
        property="og:image"
        content={`https://hashflags.iamprompt.me${image}`}
      />

      <meta
        key="twitter:card"
        property="twitter:card"
        content="summary_large_image"
      />
      <meta
        key="twitter:url"
        property="twitter:url"
        content={`https://hashflags.iamprompt.me/${router.asPath}`}
      />
      <meta
        key="twitter:title"
        property="twitter:title"
        content={transformedTitle}
      />
      <meta
        key="twitter:description"
        property="twitter:description"
        content={description}
      />
      <meta
        key="twitter:image"
        property="twitter:image"
        content={`https://hashflags.iamprompt.me${image}`}
      />
    </Head>
  )
}
