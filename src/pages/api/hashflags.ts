import type { NextApiRequest, NextApiResponse } from 'next'
import { getGuestToken, getHashflags } from '@/utils/twitter'
import type {
  APIResponse,
  HashflagAPIResponse,
  TWAPIHashflag,
} from '@/types/hashflag'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<
    APIResponse<HashflagAPIResponse | unknown | TWAPIHashflag[]>
  >
) {
  try {
    const hashflagsData = await getHashflags(await getGuestToken())
    if (req.query.raw) {
      return res.status(200).json({ success: true, data: hashflagsData })
    }

    const hashFormatted = hashflagsData.reduce((acc, curr) => {
      const hashUrlSplit = curr.asset_url.split('/')
      hashUrlSplit.pop()
      const campaignName = hashUrlSplit.pop()

      if (!campaignName) return acc

      if (!acc[campaignName]) {
        acc[campaignName] = {
          campaignName,
          hashtags: [curr.hashtag],
          starting: curr.starting_timestamp_ms,
          ending: curr.ending_timestamp_ms,
          assetUrl: curr.asset_url,
        }
      } else {
        acc[campaignName].hashtags.push(curr.hashtag)
      }

      return acc
    }, {} as HashflagAPIResponse)

    return res.status(200).json({ success: true, data: hashFormatted })
  } catch (error) {
    return res.status(400).json({ success: false, data: error })
  }
}
