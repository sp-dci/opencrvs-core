export interface ISearchQuery {
  query?: string
  event?: string
  status?: string
  applicationLocationId?: string
  from?: number
  size?: number
}

export interface IFilter {
  event?: string
  status?: string
}
