import apiClient from './apiClient'

export async function login(credentials) {
    const response = await apiClient.post('/auth/login', credentials)
    return response.data
}

export async function register(userData) {
    const response = await apiClient.post('/auth/register', userData)
    return response.data
}

export async function getUserById(userId) {
    const response = await apiClient.get(`/users/${userId}`)
    return response.data
}
