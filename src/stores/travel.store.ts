/**
 * 行程数据状态管理
 * 管理用户行程、与localStorage同步、API集成
 */

import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import type { Trip, FrontendTrip, User, ChatMessage, TripImportResponse } from '@/api/types/travel'
import { normalizeTrip, normalizeTripList, frontendToBackend } from '@/utils/transform'
import httpClient from '@/api/axios'

// localStorage键名
const STORAGE_KEYS = {
  TRIPS: 'travel_platform_trips',
  USER: 'travel_platform_user',
  AI_CONVERSATIONS: 'travel_platform_ai_conversations'
}

export const useTravelStore = defineStore('travel', () => {
  // ==================== 状态定义 ====================

  // 行程列表
  const trips = ref<Trip[]>([])

  // 当前选中的行程
  const currentTrip = ref<Trip | null>(null)

  // 用户信息
  const user = ref<User>({
    isAuthenticated: false
  })

  // AI聊天对话列表
  const aiConversations = ref<ChatMessage[]>([])

  // 会话ID
  const sessionId = ref<string | null>(null)

  // 加载状态
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // ==================== 计算属性 ====================

  // 按状态过滤的行程
  const ongoingTrips = computed(() => trips.value.filter(trip => trip.status === 'ongoing'))
  const completedTrips = computed(() => trips.value.filter(trip => trip.status === 'completed'))
  const draftTrips = computed(() => trips.value.filter(trip => trip.status === 'draft'))

  // 行程统计
  const tripStats = computed(() => ({
    total: trips.value.length,
    ongoing: ongoingTrips.value.length,
    completed: completedTrips.value.length,
    draft: draftTrips.value.length
  }))

  // 当前用户是否已认证
  const isAuthenticated = computed(() => user.value.isAuthenticated)

  // ==================== 初始化 ====================

  /**
   * 从localStorage加载数据
   */
  function loadFromStorage() {
    try {
      // 加载行程
      const tripsData = localStorage.getItem(STORAGE_KEYS.TRIPS)
      if (tripsData) {
        const parsed = JSON.parse(tripsData)
        trips.value = normalizeTripList(parsed)
      }

      // 加载用户信息
      const userData = localStorage.getItem(STORAGE_KEYS.USER)
      if (userData) {
        user.value = { ...JSON.parse(userData), isAuthenticated: true }
      }

      // 加载AI对话
      const conversationsData = localStorage.getItem(STORAGE_KEYS.AI_CONVERSATIONS)
      if (conversationsData) {
        aiConversations.value = JSON.parse(conversationsData)
      }
    } catch (err) {
      console.error('从localStorage加载数据失败:', err)
      error.value = '加载本地数据失败'
    }
  }

  /**
   * 保存数据到localStorage
   */
  function saveToStorage() {
    try {
      localStorage.setItem(STORAGE_KEYS.TRIPS, JSON.stringify(trips.value))
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user.value))
      localStorage.setItem(STORAGE_KEYS.AI_CONVERSATIONS, JSON.stringify(aiConversations.value))
    } catch (err) {
      console.error('保存数据到localStorage失败:', err)
      error.value = '保存本地数据失败'
    }
  }

  // 初始化时加载数据
  loadFromStorage()

  // 监听状态变化，自动保存到localStorage
  watch([trips, user, aiConversations], () => {
    saveToStorage()
  }, { deep: true })

  // ==================== 行程管理方法 ====================

  /**
   * 添加或更新行程
   */
  function saveTrip(tripData: Partial<Trip>): Trip {
    const normalizedTrip = normalizeTrip(tripData)

    if (!normalizedTrip.id) {
      // 新建行程
      const newTrip: Trip = {
        ...normalizedTrip,
        id: generateId(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      trips.value.push(newTrip)
      return newTrip
    } else {
      // 更新现有行程
      const index = trips.value.findIndex(t => t.id === normalizedTrip.id)
      if (index >= 0) {
        const updatedTrip: Trip = {
          ...trips.value[index],
          ...normalizedTrip,
          updatedAt: new Date().toISOString()
        }
        trips.value[index] = updatedTrip
        return updatedTrip
      } else {
        // 行程不存在，作为新行程添加
        const newTrip: Trip = {
          ...normalizedTrip,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
        trips.value.push(newTrip)
        return newTrip
      }
    }
  }

  /**
   * 删除行程
   */
  function deleteTrip(tripId: string): boolean {
    const index = trips.value.findIndex(t => t.id === tripId)
    if (index >= 0) {
      trips.value.splice(index, 1)
      // 如果删除的是当前选中的行程，清空currentTrip
      if (currentTrip.value?.id === tripId) {
        currentTrip.value = null
      }
      return true
    }
    return false
  }

  /**
   * 设置当前选中的行程
   */
  function setCurrentTrip(tripId: string | null) {
    if (!tripId) {
      currentTrip.value = null
      return
    }
    const trip = trips.value.find(t => t.id === tripId)
    currentTrip.value = trip || null
  }

  /**
   * 清空所有行程（仅用于测试）
   */
  function clearAllTrips() {
    trips.value = []
    currentTrip.value = null
  }

  // ==================== API集成方法 ====================

  /**
   * 从后端API同步行程数据
   */
  async function syncTripsFromAPI(): Promise<void> {
    isLoading.value = true
    error.value = null

    try {
      // TODO: 实现实际的API调用
      // 临时模拟数据
      const mockTrips: Trip[] = [
        {
          id: '1',
          title: '上海三日游',
          start: '2024-05-01',
          end: '2024-05-03',
          status: 'completed',
          source: 'ai',
          note: 'AI生成的行程',
          days: []
        },
        {
          id: '2',
          title: '北京五日游',
          start: '2024-06-10',
          end: '2024-06-14',
          status: 'ongoing',
          source: 'manual',
          note: '自定义行程'
        }
      ]

      trips.value = mockTrips
    } catch (err) {
      error.value = '同步行程数据失败'
      console.error('同步行程数据失败:', err)
    } finally {
      isLoading.value = false
    }
  }

  /**
   * 保存行程到后端
   */
  async function saveTripToAPI(tripData: Trip): Promise<Trip | null> {
    isLoading.value = true
    error.value = null

    try {
      // 转换为后端格式
      const backendData = frontendToBackend(tripData)

      // 调用后端API导入行程
      const response = await httpClient.post<TripImportResponse>('/trip/import', {
        travelPlan: backendData,
        userId: user.value.id || 'anonymous',
        mergeWithExisting: false,
        targetTripId: null
      })

      if (response && response.success) {
        // 后端返回的行程数据可能已更新，重新转换
        const savedTrip = normalizeTrip(response.trip || backendData)

        // 更新本地存储
        saveTrip(savedTrip)

        return savedTrip
      } else {
        error.value = response?.message || '保存行程到服务器失败'
        return null
      }
    } catch (err) {
      error.value = '保存行程到服务器失败'
      console.error('保存行程到服务器失败:', err)
      return null
    } finally {
      isLoading.value = false
    }
  }

  /**
   * 调用AI生成行程
   */
  async function generateAITrip(prompt: string): Promise<Trip | null> {
    isLoading.value = true
    error.value = null

    try {
      // 调用后端AI API
      const response = await httpClient.post('/plan/generate', {
        enhancedPrompt: prompt
      })

      if (response) {
        const aiTrip = normalizeTrip(response)
        return saveTrip(aiTrip)
      }

      return null
    } catch (err) {
      error.value = 'AI生成行程失败'
      console.error('AI生成行程失败:', err)
      return null
    } finally {
      isLoading.value = false
    }
  }

  /**
   * AI聊天对话
   */
  async function chatWithAI(message: string): Promise<string> {
    isLoading.value = true
    error.value = null

    try {
      // 如果没有sessionId，创建一个新的
      if (!sessionId.value) {
        sessionId.value = generateId()
      }

      console.log('发送消息到AI:', message)
      console.log('使用会话ID:', sessionId.value)

      const response = await httpClient.post<string>('/rag/chat', {
        message,
        sessionId: sessionId.value
      })

      console.log('AI响应:', response)
      console.log('响应类型:', typeof response)

      // axios拦截器已经处理了ApiResponse格式，直接返回data部分
      // 如果响应是字符串，直接返回
      if (typeof response === 'string') {
        return response
      }

      // 如果响应是对象，尝试获取data字段
      if (response && typeof response === 'object') {
        const responseData = (response as { data?: string }).data
        if (typeof responseData === 'string') {
          return responseData
        }
      }

      // 其他情况返回默认消息
      console.error('意外的响应格式:', response)
      return 'AI暂时无法响应，请稍后再试。'
    } catch (err) {
      error.value = 'AI聊天失败'
      console.error('AI聊天失败:', err)
      console.error('错误详情:', JSON.stringify(err, null, 2))
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // ==================== 用户认证方法 ====================

  /**
   * 用户登录（模拟）
   */
  function login(username: string, password: string): boolean {
    // TODO: 实现实际的登录API调用
    if (username && password) {
      user.value = {
        id: '1',
        name: username,
        email: `${username}@example.com`,
        isAuthenticated: true
      }
      return true
    }
    return false
  }

  /**
   * 用户登出
   */
  function logout(): void {
    user.value = {
      isAuthenticated: false
    }
    // 清除本地存储的认证信息
    localStorage.removeItem('auth_token')
  }

  /**
   * 更新用户信息
   */
  function updateUserInfo(userInfo: Partial<User>): void {
    user.value = {
      ...user.value,
      ...userInfo
    }
  }

  // ==================== 工具函数 ====================

  /**
   * 生成唯一ID
   */
  function generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substring(2)
  }

  /**
   * 重置错误状态
   */
  function clearError(): void {
    error.value = null
  }

  /**
   * 重置会话
   */
  function resetSession(): void {
    sessionId.value = null
  }

  // ==================== 导出 ====================

  return {
    // 状态
    trips,
    currentTrip,
    user,
    aiConversations,
    sessionId,
    isLoading,
    error,

    // 计算属性
    ongoingTrips,
    completedTrips,
    draftTrips,
    tripStats,
    isAuthenticated,

    // 方法
    loadFromStorage,
    saveToStorage,
    saveTrip,
    deleteTrip,
    setCurrentTrip,
    clearAllTrips,
    syncTripsFromAPI,
    saveTripToAPI,
    generateAITrip,
    chatWithAI,
    resetSession,
    login,
    logout,
    updateUserInfo,
    clearError
  }
})