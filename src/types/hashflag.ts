export interface APIResponse<T = any> {
  success: boolean
  data: T
}

export interface Hashflag {
  hashtags: string[]
  starting_timestamp_ms: number
  ending_timestamp_ms: number
  asset_url: string
}

export interface HashflagWithName extends Hashflag {
  hashname: string
}

export type HashflagResponse = Record<string, Hashflag>
