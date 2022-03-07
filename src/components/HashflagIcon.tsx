import type { NextPage } from 'next'
import type { HashflagWithName } from '@/types/hashflag'

interface Props {
  hashflag: HashflagWithName
  onClick: (value: HashflagWithName) => void
}

export const HashflagIcon: NextPage<Props> = ({ hashflag, onClick }) => {
  return (
    <div
      className="m-1 cursor-pointer rounded-md p-3 hover:bg-gray-200/80"
      onClick={() => onClick(hashflag)}
    >
      <img
        src={hashflag.asset_url}
        alt={hashflag.hashname}
        className="h-14 w-14"
      />
    </div>
  )
}
