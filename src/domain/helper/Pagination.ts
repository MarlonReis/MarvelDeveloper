
interface PaginationParamQuery {
  skip: number
  take: number
  maxPages: number
  prevPage: boolean
  nextPage: boolean
}

export const paginationParams = (page: number, limitPerPage: number, count: number): PaginationParamQuery => {
  const maxPages = Math.ceil(count / (limitPerPage <= 0 ? 10 : limitPerPage))

  const limit = limitPerPage * (page < 1 ? 1 : page)

  const skip = (limit - limitPerPage) - (page <= 1 ? 0 : 1)
  const take = Math.floor(limitPerPage)

  const prevPage = page > 1 && page <= maxPages
  const nextPage = page < maxPages

  return { skip, take, maxPages, prevPage, nextPage }
}

export const buildPagination = (page: number, maxPages: number, count: number,
  prevPage: boolean, nextPage: boolean,
  data: any[] = []
): Pagination<any> => {
  const perPage = data.length
  return ({
    from: page,
    to: maxPages,
    perPage,
    total: count,
    currentPage: page,
    prevPage,
    nextPage,
    data
  })
}

export interface Pagination<T> {
  from: number
  to: number
  perPage: number
  total: number
  currentPage: number
  prevPage: boolean
  nextPage: boolean
  data: T[]
}
