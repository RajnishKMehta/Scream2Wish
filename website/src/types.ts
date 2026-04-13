export type SortMode = 'latest' | 'oldest' | 'random'
export type DisplayMode = 'wishes' | 'notes'

export interface WishData {
  wish: string
  note: string
  from: string
  at: number
}

export interface PageState {
  sortMode: SortMode
  displayMode: DisplayMode
  currentPage: number
  currentPageIds: string[]
  randomHistory: string[][]
  usedRandomIds: Set<string>
}
