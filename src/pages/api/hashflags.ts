import type { NextApiRequest, NextApiResponse } from 'next'
import { getGuestToken, getHashflags } from '@/utils/twitter'
import type { APIResponse, HashflagResponse } from '@/types/hashflag'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<APIResponse<HashflagResponse | unknown>>
) {
  try {
    const hashflagsData = await getHashflags(await getGuestToken())
    const hashFormatted = hashflagsData.reduce((acc, curr) => {
      const hashUrlSplit = curr.asset_url.split('/')
      hashUrlSplit.pop()
      const hashFile = hashUrlSplit.pop()

      if (!hashFile) return acc

      if (!acc[hashFile]) {
        acc[hashFile] = {
          hashtags: [curr.hashtag],
          starting_timestamp_ms: curr.starting_timestamp_ms,
          ending_timestamp_ms: curr.ending_timestamp_ms,
          asset_url: curr.asset_url,
        }
      } else {
        acc[hashFile].hashtags.push(curr.hashtag)
      }

      return acc
    }, {} as HashflagResponse)

    res.status(200).json({ success: true, data: hashFormatted })
  } catch (error) {
    res.status(400).json({ success: false, data: error })
  }
}
