import apiClient from './apiClient'

export async function placeOrder() {
  const response = await apiClient.post('/orders')
  return response.data
}

export async function getMyOrders() {
  const response = await apiClient.get('/orders')
  return response.data
}

export async function getOrderById(orderId) {
  const response = await apiClient.get('/orders/' + orderId)
  return response.data
}

export async function cancelOrder(orderId) {
  const response = await apiClient.post('/orders/' + orderId + '/cancel')
  return response.data
}
