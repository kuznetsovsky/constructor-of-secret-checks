import {
  MAX_PER_PAGE
} from '../../../config'

interface Paginate {
  limit: number
  offset: number
}

export function paginate (page: number, perPage: number): Paginate {
  if (perPage > MAX_PER_PAGE) {
    perPage = MAX_PER_PAGE
  }

  if (page < 1) {
    page = 1
  }

  if (perPage < 1) {
    perPage = 1
  }

  const limit = perPage
  const offset = (page - 1) * perPage

  return { limit, offset }
}
