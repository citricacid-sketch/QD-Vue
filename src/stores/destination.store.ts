/**
 * 目的地数据状态管理
 * 管理目的地数据、搜索、筛选等功能
 */

import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import type { Destination, DestinationSearchFilters, Attraction } from '@/api/types/travel'
import httpClient from '@/api/axios'

// localStorage键名
const STORAGE_KEYS = {
  DESTINATIONS: 'travel_platform_destinations',
  FAVORITES: 'travel_platform_destination_favorites'
}

export const useDestinationStore = defineStore('destination', () => {
  // ==================== 状态定义 ====================

  // 目的地列表
  const destinations = ref<Destination[]>([])

  // 当前选中的目的地
  const currentDestination = ref<Destination | null>(null)

  // 收藏的目的地ID列表
  const favoriteIds = ref<string[]>([])

  // 加载状态
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // 当前搜索筛选条件
  const filters = ref<DestinationSearchFilters>({})

  // 分页信息
  const pagination = ref({
    page: 1,
    pageSize: 20,
    total: 0
  })

  // ==================== 计算属性 ====================

  // 收藏的目的地列表
  const favoriteDestinations = computed(() => 
    destinations.value.filter(dest => favoriteIds.value.includes(dest.id))
  )

  // 热门目的地（按评分排序）
  const popularDestinations = computed(() =>
    [...destinations.value]
      .filter(dest => dest.rating && dest.rating >= 4)
      .sort((a, b) => (b.rating || 0) - (a.rating || 0))
      .slice(0, 10)
  )

  // 筛选后的目的地列表
  const filteredDestinations = computed(() => {
    let result = destinations.value

    // 关键词搜索
    if (filters.value.query) {
      const query = filters.value.query.toLowerCase()
      result = result.filter(dest =>
        dest.name.toLowerCase().includes(query) ||
        dest.description.toLowerCase().includes(query) ||
        dest.location.city.toLowerCase().includes(query) ||
        dest.tags?.some(tag => tag.toLowerCase().includes(query))
      )
    }

    // 国家筛选
    if (filters.value.country) {
      result = result.filter(dest => 
        dest.location.country === filters.value.country
      )
    }

    // 标签筛选
    if (filters.value.tags && filters.value.tags.length > 0) {
      result = result.filter(dest =>
        filters.value.tags!.some(tag => dest.tags?.includes(tag))
      )
    }

    // 评分筛选
    if (filters.value.minRating) {
      result = result.filter(dest =>
        (dest.rating || 0) >= filters.value.minRating!
      )
    }

    // 预算筛选
    if (filters.value.maxBudget) {
      result = result.filter(dest =>
        dest.budget?.low && dest.budget.low <= filters.value.maxBudget!
      )
    }

    // 季节筛选
    if (filters.value.season) {
      result = result.filter(dest =>
        dest.bestSeason?.includes(filters.value.season!)
      )
    }

    return result
  })

  // ==================== 初始化 ====================

  /**
   * 从localStorage加载数据
   */
  function loadFromStorage() {
    try {
      // 加载目的地数据
      const destinationsData = localStorage.getItem(STORAGE_KEYS.DESTINATIONS)
      if (destinationsData) {
        destinations.value = JSON.parse(destinationsData)
      }

      // 加载收藏列表
      const favoritesData = localStorage.getItem(STORAGE_KEYS.FAVORITES)
      if (favoritesData) {
        favoriteIds.value = JSON.parse(favoritesData)
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
      localStorage.setItem(STORAGE_KEYS.DESTINATIONS, JSON.stringify(destinations.value))
      localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(favoriteIds.value))
    } catch (err) {
      console.error('保存数据到localStorage失败:', err)
      error.value = '保存本地数据失败'
    }
  }

  // 初始化时加载数据
  loadFromStorage()

  // 监听状态变化，自动保存到localStorage
  watch([destinations, favoriteIds], () => {
    saveToStorage()
  }, { deep: true })

  // ==================== 目的地管理方法 ====================

  /**
   * 获取目的地详情
   */
  function getDestinationById(id: string): Destination | undefined {
    return destinations.value.find(dest => dest.id === id)
  }

  /**
   * 设置当前选中的目的地
   */
  function setCurrentDestination(id: string | null) {
    if (!id) {
      currentDestination.value = null
      return
    }
    const destination = getDestinationById(id)
    currentDestination.value = destination || null
  }

  /**
   * 添加或更新目的地
   */
  function saveDestination(destinationData: Partial<Destination>): Destination {
    const id = destinationData.id || generateId()

    const index = destinations.value.findIndex(d => d.id === id)

    if (index >= 0) {
      // 更新现有目的地
      const existing = destinations.value[index]
      destinations.value[index] = {
        ...existing,
        ...destinationData,
        id,
        name: destinationData.name || existing.name,
        description: destinationData.description || existing.description,
        image: destinationData.image || existing.image,
        location: destinationData.location || existing.location,
        updatedAt: new Date().toISOString()
      }
      return destinations.value[index]
    } else {
      // 添加新目的地
      const newDestination: Destination = {
        id,
        name: destinationData.name || '',
        description: destinationData.description || '',
        image: destinationData.image || '',
        location: destinationData.location || {
          country: '',
          city: ''
        },
        ...destinationData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      destinations.value.push(newDestination)
      return newDestination
    }
  }

  /**
   * 删除目的地
   */
  function deleteDestination(id: string): boolean {
    const index = destinations.value.findIndex(d => d.id === id)
    if (index >= 0) {
      destinations.value.splice(index, 1)
      // 从收藏中移除
      const favIndex = favoriteIds.value.indexOf(id)
      if (favIndex >= 0) {
        favoriteIds.value.splice(favIndex, 1)
      }
      // 如果删除的是当前选中的目的地，清空currentDestination
      if (currentDestination.value?.id === id) {
        currentDestination.value = null
      }
      return true
    }
    return false
  }

  // ==================== 收藏管理方法 ====================

  /**
   * 添加收藏
   */
  function addToFavorites(id: string): boolean {
    if (!favoriteIds.value.includes(id)) {
      favoriteIds.value.push(id)
      return true
    }
    return false
  }

  /**
   * 取消收藏
   */
  function removeFromFavorites(id: string): boolean {
    const index = favoriteIds.value.indexOf(id)
    if (index >= 0) {
      favoriteIds.value.splice(index, 1)
      return true
    }
    return false
  }

  /**
   * 切换收藏状态
   */
  function toggleFavorite(id: string): boolean {
    if (favoriteIds.value.includes(id)) {
      return removeFromFavorites(id)
    } else {
      return addToFavorites(id)
    }
  }

  /**
   * 检查是否已收藏
   */
  function isFavorite(id: string): boolean {
    return favoriteIds.value.includes(id)
  }

  // ==================== 搜索和筛选方法 ====================

  /**
   * 更新搜索筛选条件
   */
  function updateFilters(newFilters: Partial<DestinationSearchFilters>) {
    filters.value = {
      ...filters.value,
      ...newFilters
    }
    // 重置到第一页
    pagination.value.page = 1
  }

  /**
   * 重置筛选条件
   */
  function resetFilters() {
    filters.value = {}
    pagination.value.page = 1
  }

  /**
   * 搜索目的地
   */
  function searchDestinations(query: string) {
    updateFilters({ query })
  }

  // ==================== API集成方法 ====================

  /**
   * 从后端API加载目的地列表
   */
  async function loadDestinationsFromAPI(): Promise<void> {
    isLoading.value = true
    error.value = null

    try {
      // 调用后端API获取目的地列表
      const response = await httpClient.get<any>('/destinations')

      if (response && response.destinations) {
        destinations.value = response.destinations
        pagination.value.total = response.total || 0
      }
    } catch (err) {
      error.value = '加载目的地数据失败'
      console.error('加载目的地数据失败:', err)
    } finally {
      isLoading.value = false
    }
  }

  /**
   * 从后端API加载目的地详情
   */
  async function loadDestinationDetailFromAPI(id: string): Promise<void> {
    isLoading.value = true
    error.value = null

    try {
      const response = await httpClient.get<Destination>(`/destinations/${id}`)

      if (response) {
        currentDestination.value = response
        // 更新列表中的数据
        const index = destinations.value.findIndex(d => d.id === id)
        if (index >= 0) {
          destinations.value[index] = response
        } else {
          destinations.value.push(response)
        }
      }
    } catch (err) {
      error.value = '加载目的地详情失败'
      console.error('加载目的地详情失败:', err)
    } finally {
      isLoading.value = false
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

  // ==================== 导出 ====================

  return {
    // 状态
    destinations,
    currentDestination,
    favoriteIds,
    isLoading,
    error,
    filters,
    pagination,

    // 计算属性
    favoriteDestinations,
    popularDestinations,
    filteredDestinations,

    // 方法
    loadFromStorage,
    saveToStorage,
    getDestinationById,
    setCurrentDestination,
    saveDestination,
    deleteDestination,
    addToFavorites,
    removeFromFavorites,
    toggleFavorite,
    isFavorite,
    updateFilters,
    resetFilters,
    searchDestinations,
    loadDestinationsFromAPI,
    loadDestinationDetailFromAPI,
    clearError
  }
})
