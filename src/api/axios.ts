/**
 * Axios HTTP客户端封装
 * 统一API调用，处理错误和认证
 */

import axios, {
  type AxiosInstance,
  type AxiosRequestConfig,
  type AxiosResponse,
  type InternalAxiosRequestConfig
} from 'axios'
import type { ApiResponse } from '@/api/types/travel'
import { ElMessage } from 'element-plus'

// 从环境变量获取API基础URL
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api'

/**
 * 创建Axios实例
 */
const http: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 120000, // 120秒超时（AI响应可能需要更长时间）
  headers: {
    'Content-Type': 'application/json'
  }
})

/**
 * 请求拦截器
 * 添加认证token等
 */
http.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // 从localStorage获取token
    const token = localStorage.getItem('auth_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    // 添加请求时间戳（防止缓存）
    if (config.method?.toLowerCase() === 'get') {
      config.params = {
        ...config.params,
        _t: Date.now()
      }
    }

    return config
  },
  (error) => {
    console.error('请求拦截器错误:', error)
    return Promise.reject(error)
  }
)

/**
 * 响应拦截器
 * 统一处理响应格式和错误
 */
http.interceptors.response.use(
  (response: AxiosResponse<ApiResponse>) => {
    const { data } = response

    // 检查后端API响应格式
    if (data && typeof data === 'object' && 'success' in data) {
      // 后端返回了统一格式的ApiResponse
      if (!data.success) {
        // 业务逻辑错误
        const errorMessage = data.message || '请求失败'
        ElMessage.error(errorMessage)
        return Promise.reject(new Error(errorMessage))
      }

      // 返回数据部分
      // 如果data.data存在，返回data.data
      // 否则返回整个data对象（包含success、message等字段）
      const result = data.data !== undefined ? data.data : data

      // 如果result是字符串且包含success字段，说明是原始响应，需要解析
      if (typeof result === 'string' && result.includes('success')) {
        try {
          const parsed = JSON.parse(result)
          return parsed.data !== undefined ? parsed.data : parsed
        } catch (e) {
          // 如果解析失败，直接返回原始字符串
          return result
        }
      }

      return result
    }

    // 如果后端没有返回统一格式，直接返回整个响应数据
    return data
  },
  (error) => {
    console.error('API请求错误:', error)

    let errorMessage = '网络请求失败'

    if (error.response) {
      // 服务器返回了错误状态码
      const { status, data } = error.response

      switch (status) {
        case 400:
          errorMessage = data?.message || '请求参数错误'
          break
        case 401:
          errorMessage = '未授权，请重新登录'
          // 清除本地认证信息
          localStorage.removeItem('auth_token')
          localStorage.removeItem('user_info')
          // 跳转到登录页面（需要在路由中处理）
          window.location.href = '/login'
          break
        case 403:
          errorMessage = '权限不足，无法访问'
          break
        case 404:
          errorMessage = '请求的资源不存在'
          break
        case 500:
          errorMessage = data?.message || '服务器内部错误'
          break
        case 502:
        case 503:
        case 504:
          errorMessage = '服务器暂时不可用，请稍后重试'
          break
        default:
          errorMessage = data?.message || `服务器错误 (${status})`
      }
    } else if (error.request) {
      // 请求已发送但没有收到响应
      if (error.code === 'ECONNABORTED') {
        errorMessage = '请求超时，请检查网络连接'
      } else {
        errorMessage = '网络连接失败，请检查网络设置'
      }
    } else {
      // 请求配置错误
      errorMessage = error.message || '请求配置错误'
    }

    // 显示错误提示
    ElMessage.error(errorMessage)

    return Promise.reject(new Error(errorMessage))
  }
)

/**
 * 封装HTTP方法
 */
export const httpClient = {
  /**
   * GET请求
   */
  get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return http.get<T, T>(url, config)
  },

  /**
   * POST请求
   */
  post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return http.post<T, T>(url, data, config)
  },

  /**
   * PUT请求
   */
  put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return http.put<T, T>(url, data, config)
  },

  /**
   * DELETE请求
   */
  delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return http.delete<T, T>(url, config)
  },

  /**
   * PATCH请求
   */
  patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return http.patch<T, T>(url, data, config)
  },

  /**
   * 上传文件
   */
  upload<T = any>(url: string, file: File, fieldName = 'file', extraData?: any): Promise<T> {
    const formData = new FormData()
    formData.append(fieldName, file)

    if (extraData) {
      Object.keys(extraData).forEach(key => {
        formData.append(key, extraData[key])
      })
    }

    return http.post<T, T>(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  }
}

/**
 * API服务基类
 */
export class ApiService {
  protected http = httpClient

  protected handleError(error: any): never {
    console.error('API服务错误:', error)
    throw error
  }

  protected async request<T = any>(config: AxiosRequestConfig): Promise<T> {
    try {
      return await http.request<T, T>(config)
    } catch (error) {
      return this.handleError(error)
    }
  }
}

export default httpClient