import axios from 'axios'

const apiClient = axios.create({
  baseURL: '/api',
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
})

apiClient.interceptors.response.use(
  (res) => res,
  (err) => {
    const message = err.response?.data?.message ?? '요청 처리 중 오류가 발생했습니다.'
    return Promise.reject(new Error(message))
  }
)

export default apiClient
