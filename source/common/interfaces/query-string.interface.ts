export interface BaseQueryString {
  [key: string]: string
  page: string
  per_page: string
  sort: 'asc' | 'desc'
}
