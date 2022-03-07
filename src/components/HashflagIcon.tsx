import type { NextPage } from 'next'
import type { Hashflag } from '@/types/hashflag'

interface Props {
  hashflag: Hashflag
  onClick: (value: Hashflag) => void
}

export const HashflagIcon: NextPage<Props> = ({ hashflag, onClick }) => {
  return (
    <div
      className="m-1 cursor-pointer rounded-md p-3 hover:bg-gray-200/80"
      onClick={() => onClick(hashflag)}
    >
      <img
        src={hashflag.assetUrl}
        alt={hashflag.campaignName}
        className="h-14 w-14"
      />
    </div>
  )
}
