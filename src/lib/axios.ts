import axios, { InternalAxiosRequestConfig } from 'axios'

import { removeLocalStorageTokens } from '@/helpers/remove-local-storage-tokens'
import { setLocalStorageTokens } from '@/helpers/set-local-storage-tokens'
import { LOCAL_STORAGE_ACCESS_TOKEN_KEY, LOCAL_STORAGE_REFRESH_TOKEN_KEY } from '@/variables/local-storage-tokens'

export const protectedApi = axios.create({
  baseURL: 'https://fullstackclub-finance-dashboard-api.onrender.com/api',
})

export const publicApi = axios.create({
  baseURL: 'https://fullstackclub-finance-dashboard-api.onrender.com/api',
})

protectedApi.interceptors.request.use((request) => {
  const accessToken = localStorage.getItem(LOCAL_STORAGE_ACCESS_TOKEN_KEY)

  if (!accessToken) {
    return request
  }
  request.headers.Authorization = `Bearer ${accessToken}`

  return request
})

protectedApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    const refreshToken = localStorage.getItem(LOCAL_STORAGE_REFRESH_TOKEN_KEY)

    if (!refreshToken) {
      return Promise.reject(error)
    }

    if (axios.isAxiosError(error)) {
      const request = error.config as InternalAxiosRequestConfig & {
        _retry: boolean
      }

      const isUnauthorizedErrorResponse = error.response?.status === 401
      const isNotRequestAlreadyBeenRetried = !request._retry
      const isNotRefreshTokenRequestRetry = !request.url?.includes('/users/refresh-token')

      if (isUnauthorizedErrorResponse && isNotRequestAlreadyBeenRetried && isNotRefreshTokenRequestRetry) {
        request._retry = true

        try {
          const response = await protectedApi.post('/users/refresh-token', {
            refreshToken,
          })

          const newAccessToken = response.data.accessToken
          const newRefreshToken = response.data.refreshToken

          setLocalStorageTokens({
            accessToken: newAccessToken,
            refreshToken: newRefreshToken,
          })

          request.headers.Authorization = `Bearer ${newAccessToken}`
          return protectedApi(request)
        } catch (refreshError) {
          if (axios.isAxiosError(refreshError)) {
            removeLocalStorageTokens()
            console.log(refreshError.message)
          }
        }
      }
      return Promise.reject(error)
    }
  }
)
