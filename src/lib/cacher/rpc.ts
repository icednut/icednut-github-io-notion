import fetch, { Response } from 'node-fetch'
import {
  API_ENDPOINT,
  CACHER_API_KEY,
  CACHER_API_TOKEN,
} from './server-constants'

export default async function rpc(fnName: string, body: any) {
  if (!CACHER_API_KEY) {
    throw new Error('CACHER_API_KEY is not set in env')
  }
  if (!CACHER_API_TOKEN) {
    throw new Error('CACHER_API_TOKEN is not set in env')
  }
  const res = await fetch(`${API_ENDPOINT}/${fnName}`, {
    method: 'GET',
    headers: {
      'cache-control': 'no-cache',
      'x-api-key': CACHER_API_KEY,
      'x-api-token': CACHER_API_TOKEN,
    },
  })

  if (res.ok) {
    return res.json()
  } else {
    throw new Error(await getError(res))
  }
}

export async function getError(res: Response) {
  return `Notion API error (${res.status}) \n${getJSONHeaders(
    res
  )}\n ${await getBodyOrNull(res)}`
}

export function getJSONHeaders(res: Response) {
  return JSON.stringify(res.headers.raw())
}

export function getBodyOrNull(res: Response) {
  try {
    return res.text()
  } catch (err) {
    return null
  }
}

export function values(obj: any) {
  const vals: any = []

  Object.keys(obj).forEach(key => {
    vals.push(obj[key])
  })
  return vals
}
