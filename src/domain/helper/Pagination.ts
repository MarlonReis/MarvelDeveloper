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
