import { Dialog } from '@headlessui/react'
import dayjs from 'dayjs'
import type { NextPage } from 'next'
import type { HashflagWithName } from '@/types/hashflag'

interface Props {
  isOpen: boolean
  setIsOpen: (value: boolean) => void
  setHashflag: (value: HashflagWithName | null) => void
  hashflag: HashflagWithName | null
}

export const HashflagDialog: NextPage<Props> = ({
  isOpen,
  setIsOpen,
  setHashflag,
  hashflag,
}) => {
  if (!hashflag) {
    return <></>
  }

  const startDate = dayjs(hashflag.starting_timestamp_ms)
  const endDate = dayjs(hashflag.ending_timestamp_ms)

  const displayDateFormat = 'DD MMM YYYY HH:mm:ss A'

  return (
    <Dialog
      open={isOpen}
      onClose={() => {
        setIsOpen(false)
        setHashflag(null)
      }}
      className="fixed inset-0 z-50 overflow-y-auto p-4 pt-20 pb-10"
    >
      <Dialog.Overlay className="fixed inset-0 bg-black/75" />

      <div className="relative mx-auto flex w-2/3 max-w-xl flex-col space-y-5 rounded-xl bg-white p-5">
        <Dialog.Title className="break-words text-center text-xl font-bold">
          {hashflag.hashname}
        </Dialog.Title>
        <div className="break-words text-center">
          {`${startDate.format(displayDateFormat)} - ${endDate.format(
            displayDateFormat
          )} (${endDate.diff(startDate, 'days')} Days)`}
        </div>
        <img
          src={hashflag.asset_url}
          alt={hashflag.hashname}
          className="mx-auto h-[72px] w-[72px]"
        />

        <div className="flex flex-wrap justify-center gap-2 text-center">
          {hashflag.hashtags.map((tag) => (
            <a
              className="break-words text-sky-500 outline-none hover:text-sky-300 hover:underline"
              key={tag}
              href={`https://twitter.com/hashtag/${tag}`}
              target="_blank"
              rel="noreferrer"
            >
              {`#${tag}`}{' '}
              <img
                src={hashflag.asset_url}
                alt={hashflag.hashname}
                className="inline h-4 w-4"
              />
            </a>
          ))}
        </div>
      </div>
    </Dialog>
  )
}
