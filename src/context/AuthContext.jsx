import {useEffect, useState} from 'react'
import {getUserById, login as loginRequest, register as registerRequest} from '../services/authService'
import {AuthContext} from './authContext.js'

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const restoreUser = async () => {
            const userId = localStorage.getItem('userId')

            if (!userId) {
                setLoading(false)
                return
            }

            try {
                const currentUser = await getUserById(userId)
                setUser(currentUser)
            } catch {
                localStorage.removeItem('userId')
                setUser(null)
            } finally {
                setLoading(false)
            }
        }

        restoreUser()
    }, [])

    const login = async (credentials) => {
        const response = await loginRequest(credentials)

        localStorage.setItem('userId', response.userId)

        const currentUser = await getUserById(response.userId)
        setUser(currentUser)

        return currentUser
    }

    const register = async (userData) => {
        return await registerRequest(userData)
    }

    const logout = () => {
        // Backend cookie-clearing endpoint will be added later.
        localStorage.removeItem('userId')
        setUser(null)
    }

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    )
}

