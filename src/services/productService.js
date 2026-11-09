import apiClient from './apiClient'

export async function getProducts({
  page = 0,
  size = 12,
  sort = 'price,asc',
  search = '',
  minPrice,
  maxPrice,
  signal,
} = {}) {
  const params = { page, size, sort }
  let endpoint = '/products'

  if (search) {
    endpoint = '/products/search'
    params.name = search
  } else if (minPrice !== undefined && maxPrice !== undefined) {
    endpoint = '/products/filter'
    params.minPrice = minPrice
    params.maxPrice = maxPrice
  }

  const response = await apiClient.get(endpoint, { params, signal })
  return response.data
}

export async function getProductById(productId, { signal } = {}) {
  const response = await apiClient.get(`/products/${productId}`, { signal })
  return response.data
}
