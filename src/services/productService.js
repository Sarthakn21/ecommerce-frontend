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

export async function getSellerProducts() {
  const response = await apiClient.get('/seller/products')
  return response.data
}

export async function createProduct(productData) {
  const response = await apiClient.post('/products', productData)
  return response.data
}

export async function updateProduct(productId, productData) {
  const response = await apiClient.put(`/products/${productId}`, productData)
  return response.data
}

export async function deactivateProduct(productId) {
  const response = await apiClient.patch(`/seller/products/${productId}/deactivate`)
  return response.data
}
