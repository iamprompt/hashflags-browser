import { Dialog } from '@headlessui/react'
import dayjs from 'dayjs'
import type { NextPage } from 'next'
import type { Hashflag } from '@/types/hashflag'

interface Props {
  isOpen: boolean
  setIsOpen: (value: boolean) => void
  setHashflag: (value: Hashflag | null) => void
  hashflag: Hashflag | null
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

  const startDate = dayjs(hashflag.starting)
  const endDate = dayjs(hashflag.ending)

  const displayDateFormat = 'DD MMM YYYY HH:mm'

  return (
    <Dialog
      open={isOpen}
      onClose={() => {
        setIsOpen(false)
        setHashflag(null)
      }}
      className="fixed inset-0 z-50 overflow-y-auto sm:p-4 sm:pb-10 sm:pt-20"
    >
      <Dialog.Overlay className="fixed inset-0 bg-black/75" />

      <div className="relative mx-auto flex min-h-full w-full flex-col space-y-5 bg-white p-5 sm:h-auto sm:min-h-min sm:w-2/3 sm:max-w-xl sm:rounded-xl">
        <Dialog.Title className="break-words text-center text-xl font-bold">
          {hashflag.campaignName}
        </Dialog.Title>
        <div className="break-words text-center">
          {`${startDate.format(displayDateFormat)} - ${endDate.format(
            displayDateFormat
          )} (${endDate.diff(startDate, 'days')} Days)`}
        </div>
        <img
          src={hashflag.assetUrl}
          alt={hashflag.campaignName}
          className="mx-auto h-[72px] w-[72px]"
        />

        <div className="flex flex-wrap items-center justify-center gap-2 text-center">
          {hashflag.hashtags.map((tag) => (
            <a
              className="flex items-center gap-1 break-words text-sky-500 outline-none hover:text-sky-300 hover:underline"
              key={tag}
              href={`https://twitter.com/hashtag/${tag}`}
              target="_blank"
              rel="noreferrer"
            >
              {`#${tag}`}
              <img
                src={hashflag.assetUrl}
                alt={hashflag.campaignName}
                className="inline h-4 w-4"
              />
            </a>
          ))}
        </div>
        <button
          className="w-full rounded-lg bg-sky-400 py-3 font-bold text-white sm:hidden"
          onClick={() => {
            setIsOpen(false)
            setHashflag(null)
          }}
        >
          Close
        </button>
      </div>
    </Dialog>
  )
}
