import axios from 'axios'

const GUEST_AUTH_TOKEN =
  'Bearer AAAAAAAAAAAAAAAAAAAAANRILgAAAAAAnNwIzUejRCOuH5E6I8xnZz4puTs%3D1Zv7ttfk8LF81IUq16cHjhLTvJu4FA33AGWWjCpTnA'
const ACTIVATE_ENDPOINT = 'https://api.twitter.com/1.1/guest/activate.json'
const HASHFLAGS_ENDPOINT = 'https://twitter.com/i/api/1.1/hashflags.json'

interface GuestTokenResponse {
  guest_token: string
}

export const getGuestToken = () =>
  new Promise<string>((resolve, reject) => {
    axios
      .post<GuestTokenResponse>(
        ACTIVATE_ENDPOINT,
        {},
        {
          headers: {
            Authorization: GUEST_AUTH_TOKEN,
          },
        }
      )
      .then(({ data }) => {
        resolve(data.guest_token)
      })
      .catch(reject)
  })

interface Hashflag {
  hashtag: string
  starting_timestamp_ms: number
  ending_timestamp_ms: number
  asset_url: string
}

export const getHashflags = (guestToken: string) => {
  return new Promise<Hashflag[]>((resolve, reject) => {
    axios
      .get<[]>(HASHFLAGS_ENDPOINT, {
        headers: {
          Authorization: GUEST_AUTH_TOKEN,
          'x-guest-token': guestToken,
        },
      })
      .then(({ data }) => {
        resolve(data)
      })
      .catch((err) => {
        reject(err)
      })
  })
}
