export interface APIResponse<T = any> {
  success: boolean
  data: T
}

export interface TWAPIHashflag {
  hashtag: string
  starting_timestamp_ms: number
  ending_timestamp_ms: number
  asset_url: string
}

export interface Hashflag {
  campaignName: string
  hashtags: string[]
  assetUrl: string
  starting: number
  ending: number
}

export type HashflagAPIResponse = Record<string, Hashflag>
