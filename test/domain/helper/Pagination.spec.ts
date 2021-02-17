import { paginationParams, buildPagination } from "@/domain/helper/Pagination";

describe('Pagination', () => {

  test('should return skip = 0  and take = 20 when page = 1', () => {
    const { skip, take, maxPages, prevPage, nextPage } = paginationParams(1, 20, 100)

    expect(skip).toEqual(0)
    expect(take).toEqual(20)
    expect(maxPages).toBe(5)

    expect(prevPage).toBe(false)
    expect(nextPage).toBe(true)
  })

  test('should return skip = 19 and take = 21 when page = 2', () => {
    const { skip, take, maxPages, prevPage, nextPage } = paginationParams(2, 20, 100)
    expect(skip).toEqual(19)
    expect(take).toEqual(21)
    expect(maxPages).toBe(5)

    expect(prevPage).toBe(true)
    expect(nextPage).toBe(true)
  })

  test('should return skip = 39 and take = 21 when page = 3', () => {
    const { skip, take, maxPages, prevPage, nextPage } = paginationParams(3, 20, 100)
    expect(skip).toEqual(39)
    expect(take).toEqual(21)
    expect(maxPages).toBe(5)

    expect(prevPage).toBe(true)
    expect(nextPage).toBe(true)

  })

  test('should return skip = 59 and take = 21 when page = 4', () => {
    const { skip, take, maxPages, prevPage, nextPage } = paginationParams(4, 20, 100)
    expect(skip).toEqual(59)
    expect(take).toEqual(21)
    expect(maxPages).toBe(5)

    expect(prevPage).toBe(true)
    expect(nextPage).toBe(true)
  })


  test('should return skip = 79 and take = 21 when page = 5', () => {
    const { skip, take, maxPages, prevPage, nextPage } = paginationParams(5, 20, 100)
    expect(skip).toEqual(79)
    expect(take).toEqual(21)
    expect(maxPages).toBe(5)

    expect(prevPage).toBe(true)
    expect(nextPage).toBe(false)
  })

  test('should return skip = 99 and take = 21 when page = 6', () => {
    const { skip, take, maxPages, prevPage, nextPage } = paginationParams(6, 20, 100)

    expect(skip).toEqual(99)
    expect(take).toEqual(21)
    expect(maxPages).toBe(5)

    expect(prevPage).toBe(false)
    expect(nextPage).toBe(false)
  })

  test('should return skip = 0 and take = 0 when received para 0', () => {
    const { skip, take, maxPages, prevPage, nextPage } = paginationParams(0, 0, 100)

    expect(skip).toEqual(0)
    expect(take).toEqual(0)
    expect(maxPages).toBe(10)

    expect(prevPage).toBe(false)
    expect(nextPage).toBe(true)
  })


  test('should return pagination builder with first', () => {
    const items = []
    for (let i = 0; i < 20; i++) { items.push(i) }

    const paginationWithFistPage = buildPagination(1, 5, 100, false, true, items)  
    
    expect(paginationWithFistPage).toEqual({
      from: 1, to: 5, perPage: 20, total: 100,
      currentPage: 1, prevPage: false,
      nextPage: true,
      data: items
    })
  })

  test('should return pagination builder with last', () => {
    const items = []
    for (let i = 0; i < 20; i++) { items.push(i) }
    const paginationWithLastPage = buildPagination(5, 5, 100, true, false, items)

    expect(paginationWithLastPage).toEqual({
      from: 5, to: 5, perPage: 19,
      total: 100, currentPage: 5,
      prevPage: true, nextPage: false,
      data:items
    })
  })


  test('should return data empty when data is undefined', () => {
    const paginationWithDataEmpty = buildPagination(5, 5, 100, true, false, undefined)
    expect(paginationWithDataEmpty).toEqual({
      from: 5, to: 5, perPage: 0,
      total: 100, currentPage: 5,
      prevPage: true, nextPage: false,
      data: []
    })
  })

})