import type { NextPage } from 'next'
import Head from 'next/head'
import { useEffect, useState } from 'react'
import useSWRImmutable from 'swr/immutable'
import SearchIcon from '@heroicons/react/outline/SearchIcon'
import { useRouter } from 'next/router'
import { fetcher } from '../utils/fetcher'
import { HashflagDialog } from '../components/HashflagDialog'
import type {
  APIResponse,
  HashflagResponse,
  HashflagWithName,
} from '@/types/hashflag'
import { HashflagIcon } from '@/components/HashflagIcon'

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
    }
  }, [query, AllHashflags, router])

  if (error) return <div>failed to load</div>

  if (!data) return <div>Loading...</div>

  return (
    <>
      <Head>
        <title>Hashflags Browser</title>
        <meta
          name="description"
          content="Find all Twitter Hashflags in one place!!"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="mx-auto max-w-screen-xl p-5 pt-10">
        <h1 className="mb-8 text-center text-4xl font-bold">
          Hashflags Browser
        </h1>
        {/* Search Bar */}
        <div className="mb-10 flex flex-row justify-center gap-3">
          <div className="relative w-full max-w-screen-sm">
            <SearchIcon className="absolute inset-0 h-full w-auto p-3" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="h-10 w-full rounded-lg border-transparent pl-9 shadow ring-2 ring-sky-300 focus:border-transparent focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>
        </div>
        <div className="flex flex-wrap justify-center">
          {queryHashflag
            .sort((a, b) => b.starting_timestamp_ms - a.starting_timestamp_ms)
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
