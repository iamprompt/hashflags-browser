import SearchIcon from '@heroicons/react/outline/SearchIcon'
import type { NextPage } from 'next'
import clsx from 'clsx'

interface QueryProps {
  query: string
  setQuery: (value: string) => void
}

export const SearchBox: NextPage<QueryProps> = ({ query, setQuery }) => {
  return (
    <div className="relative w-full max-w-screen-sm">
      <SearchIcon className="absolute inset-0 h-full w-auto p-3" />
      <input
        type="text"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value)
        }}
        className="h-10 w-full rounded-lg border-transparent pl-9 shadow ring-2 ring-sky-300 focus:border-transparent focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
      />
    </div>
  )
}

type SearchBarProps = QueryProps & {
  className?: string
}

export const SearchBar: NextPage<SearchBarProps> = ({
  query,
  setQuery,
  className,
}) => {
  return (
    <div className={clsx('flex flex-row justify-center gap-3', className)}>
      <SearchBox query={query} setQuery={setQuery} />
    </div>
  )
}
