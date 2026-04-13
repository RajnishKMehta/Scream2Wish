import { CONFIG } from '@/config'
import type { WishData, SortMode } from '@/types'

let cachedIndex: string[] | null = null
const wishCache = new Map<string, WishData>()

export async function fetchIndex(): Promise<string[]> {
  if (cachedIndex !== null) return cachedIndex
  const res = await fetch(CONFIG.wishes.indexUrl)
  if (!res.ok) throw new Error(`Failed to fetch index: ${res.status}`)
  const data: unknown = await res.json()
  if (!Array.isArray(data)) throw new Error('Invalid index format')
  cachedIndex = data as string[]
  return cachedIndex
}

export async function fetchWish(id: string): Promise<WishData> {
  const cached = wishCache.get(id)
  if (cached !== undefined) return cached
  const res = await fetch(`${CONFIG.wishes.baseUrl}/${id}.json`)
  if (!res.ok) throw new Error(`Failed to fetch wish ${id}: ${res.status}`)
  const data = (await res.json()) as WishData
  wishCache.set(id, data)
  return data
}

export async function fetchBatch(ids: string[]): Promise<WishData[]> {
  return Promise.all(ids.map((id) => fetchWish(id)))
}

export function getPageIds(
  allIds: string[],
  mode: SortMode,
  page: number,
  randomHistory: string[][],
  usedRandomIds: Set<string>,
): { ids: string[]; updatedHistory: string[][]; updatedUsed: Set<string> } {
  const size = CONFIG.wishes.pageSize
  const updatedHistory = [...randomHistory]
  const updatedUsed = new Set(usedRandomIds)

  if (mode === 'latest') {
    const start = page * size
    return { ids: allIds.slice(start, start + size), updatedHistory, updatedUsed }
  }

  if (mode === 'oldest') {
    const reversed = [...allIds].reverse()
    const start = page * size
    return { ids: reversed.slice(start, start + size), updatedHistory, updatedUsed }
  }

  // random
  if (page < updatedHistory.length) {
    return { ids: updatedHistory[page] ?? [], updatedHistory, updatedUsed }
  }

  const remaining = allIds.filter((id) => !updatedUsed.has(id))
  if (remaining.length === 0) {
    updatedUsed.clear()
    const shuffled = shuffle([...allIds])
    const slice = shuffled.slice(0, size)
    slice.forEach((id) => updatedUsed.add(id))
    updatedHistory.push(slice)
    return { ids: slice, updatedHistory, updatedUsed }
  }

  const shuffled = shuffle(remaining)
  const slice = shuffled.slice(0, size)
  slice.forEach((id) => updatedUsed.add(id))
  updatedHistory.push(slice)
  return { ids: slice, updatedHistory, updatedUsed }
}

export function getTotalPages(allIds: string[]): number {
  return Math.ceil(allIds.length / CONFIG.wishes.pageSize)
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j] as T, a[i] as T]
  }
  return a
}
