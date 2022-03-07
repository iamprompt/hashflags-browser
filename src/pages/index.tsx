import type { NextPage } from 'next'
import { useEffect, useState } from 'react'
import useSWRImmutable from 'swr/immutable'
import { useRouter } from 'next/router'
import { fetcher } from '../utils/fetcher'
import { HashflagDialog } from '../components/HashflagDialog'
import type {
  APIResponse,
  HashflagResponse,
  HashflagWithName,
} from '@/types/hashflag'
import { HashflagIcon } from '@/components/HashflagIcon'
import { SearchBar } from '@/components/SearchBar'
import { SEO } from '@/components/SEO'

const Home: NextPage = () => {
  const router = useRouter()

  const { data, error } = useSWRImmutable<
    APIResponse<HashflagResponse>,
    APIResponse<unknown>
  >('/api/hashflags', fetcher)

  const [AllHashflags, setAllHashflags] = useState<HashflagWithName[]>([])
  const [selectedHashflag, setSelectedHashflag] =
    useState<HashflagWithName | null>(null)
  const [isHashflagModalOpen, setHashflagModalOpen] = useState<boolean>(false)
  const [query, setQuery] = useState('')
  const [queryHashflag, setQueryHashflag] = useState<HashflagWithName[]>([])

  useEffect(() => {
    if (router.query?.q) {
      if (Array.isArray(router.query.q)) setQuery(router.query.q[0])
      else setQuery(router.query.q)
    }
  }, [router.query])

  useEffect(() => {
    if (data) {
      setAllHashflags(
        Object.entries(data.data).map(([hashname, hashflag]) => ({
          hashname,
          ...hashflag,
        }))
      )
    }
  }, [data])

  const normalizeString = (str: string) =>
    str.replace(/[\s_]+/, '').toLowerCase()

  useEffect(() => {
    if (query) {
      try {
        const regEx = new RegExp(normalizeString(query), 'i')
        setQueryHashflag(
          AllHashflags.filter(
            (hashflag) =>
              regEx.test(normalizeString(hashflag.hashname)) ||
              hashflag.hashtags.some((tag) => regEx.test(normalizeString(tag)))
          )
        )
        router.push(`/?q=${encodeURI(query)}`, undefined, { shallow: true })
      } catch (error) {}
    } else {
      setQueryHashflag(AllHashflags)
      router.push(`/`, undefined, { shallow: true })
    }
  }, [query, AllHashflags])

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
            <div className="flex flex-wrap justify-center">
              {queryHashflag
                .sort(
                  (a, b) => b.starting_timestamp_ms - a.starting_timestamp_ms
                )
                .map((hashFields) => {
                  return (
                    <HashflagIcon
                      key={hashFields.hashname}
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
