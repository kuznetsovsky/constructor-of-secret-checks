import {
  DEFAULT_PAGE,
  DEFAULT_PER_PAGE,
  MAX_PER_PAGE
} from '../../../config'

interface Paginate {
  limit: number
  offset: number
}

export function paginate (
  page: number = DEFAULT_PAGE,
  perPage: number = DEFAULT_PER_PAGE
): Paginate {
  if (perPage > MAX_PER_PAGE) {
    perPage = MAX_PER_PAGE
  }

  if (page < 1) {
    page = 1
  }

  const limit = perPage
  const offset = (page - 1) * perPage

  return { limit, offset }
}
