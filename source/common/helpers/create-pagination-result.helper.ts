interface PaginationInterface {
  page: number
  limit: number
}

export interface EntityPaginateInterface {
  items: Readonly<number>
  page: Readonly<number>
  pages: Readonly<number>
  next: Readonly<number | null>
  prev: Readonly<number | null>
}

export function createPaginationResult (
  items: number,
  pagination: PaginationInterface
): EntityPaginateInterface | null {
  let next: number | null = pagination.page + 1
  let prev: number | null = pagination.page - 1

  const pages = Math.ceil(items / pagination.limit)

  if (pagination.page > pages) {
    return null
  }

  if (next > pages) {
    next = null
  }

  if (prev <= 0) {
    prev = null
  }

  return Object.freeze({
    items,
    page: pagination.page,
    pages,
    next,
    prev
  })
}
