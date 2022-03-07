import type { NextPage } from 'next'
import { useEffect, useState } from 'react'
import useSWRImmutable from 'swr/immutable'
import { useRouter } from 'next/router'
import { fetcher } from '../utils/fetcher'
import { HashflagDialog } from '../components/HashflagDialog'
import type {
  APIResponse,
  Hashflag,
  HashflagAPIResponse,
} from '@/types/hashflag'
import { HashflagIcon } from '@/components/HashflagIcon'
import { SearchBar } from '@/components/SearchBar'
import { SEO } from '@/components/SEO'

const Home: NextPage = () => {
  const router = useRouter()

  const { data, error } = useSWRImmutable<
    APIResponse<HashflagAPIResponse>,
    APIResponse<unknown>
  >('/api/hashflags', fetcher)

  const [hashflagCollection, setHashflagCollection] = useState<Hashflag[]>([])
  const [selectedHashflag, setSelectedHashflag] = useState<Hashflag | null>(
    null
  )
  const [isHashflagModalOpen, setHashflagModalOpen] = useState<boolean>(false)
  const [query, setQuery] = useState('')
  const [queryHashflag, setQueryHashflag] = useState<Hashflag[]>([])

  useEffect(() => {
    if (router.query?.q) {
      if (Array.isArray(router.query.q)) setQuery(router.query.q[0])
      else setQuery(router.query.q)
    }
  }, [router.query])

  useEffect(() => {
    if (data) {
      setHashflagCollection(Object.values(data.data))
    }
  }, [data])

  const normalizeString = (str: string) =>
    str.replace(/[\s_]+/, '').toLowerCase()

  useEffect(() => {
    if (query) {
      try {
        const regEx = new RegExp(normalizeString(query), 'i')
        setQueryHashflag(
          hashflagCollection.filter(
            (hashflag) =>
              regEx.test(normalizeString(hashflag.campaignName)) ||
              hashflag.hashtags.some((tag) => regEx.test(normalizeString(tag)))
          )
        )
        router.push(`/?q=${encodeURI(query)}`, undefined, { shallow: true })
      } catch (error) {}
    } else {
      setQueryHashflag(hashflagCollection)
      router.push(`/`, undefined, { shallow: true })
    }
  }, [query, hashflagCollection])

  return (
    <>
      <SEO />
      <main className="mx-auto max-w-screen-xl p-5 pt-10">
        <h1 className="mb-8 text-center text-4xl font-bold">
          Hashflags Browser
        </h1>
        {error ? (
          <>
            <div className="text-center text-xl font-bold text-red-700">
              Failed to load the hashflags data
            </div>
          </>
        ) : !data ? (
          <>
            <div className="text-center text-xl font-bold">Loading...</div>
          </>
        ) : (
          <>
            <SearchBar className="mb-10" query={query} setQuery={setQuery} />
            <div className="mx-auto flex max-w-screen-lg flex-wrap justify-between">
              {queryHashflag
                .sort((a, b) =>
                  a.starting !== b.starting
                    ? b.starting - a.starting
                    : a.campaignName.localeCompare(b.campaignName)
                )
                .map((hashFields) => {
                  return (
                    <HashflagIcon
                      key={hashFields.campaignName}
                      hashflag={hashFields}
                      onClick={(v) => {
                        setSelectedHashflag(v)
                        setHashflagModalOpen(true)
                      }}
                    />
                  )
                })}
            </div>
          </>
        )}
      </main>

      <HashflagDialog
        isOpen={isHashflagModalOpen}
        setIsOpen={(v) => setHashflagModalOpen(v)}
        setHashflag={(v) => setSelectedHashflag(v)}
        hashflag={selectedHashflag}
      />
    </>
  )
}

export default Home
