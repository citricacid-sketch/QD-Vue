/**
 * 数据转换工具
 * 解决前后端字段名不匹配问题
 */

import type {
  FrontendTrip,
  BackendTravelPlan,
  Trip
} from '@/api/types/travel'

/**
 * 将前端行程数据转换为后端API所需格式
 * 关键转换：start -> startDate, end -> endDate, note -> description
 */
export function frontendToBackend(frontendTrip: FrontendTrip): BackendTravelPlan {
  const backendPlan: BackendTravelPlan = {
    id: frontendTrip.id,
    title: frontendTrip.title,
    startDate: frontendTrip.start,  // 关键转换：start -> startDate
    endDate: frontendTrip.end,      // 关键转换：end -> endDate
    status: frontendTrip.status,
    source: frontendTrip.source,
    description: frontendTrip.note || frontendTrip.description || '', // note -> description
    days: frontendTrip.days,
    budget: frontendTrip.budget,
    transportation: frontendTrip.transportation
  }

  // 清理undefined字段
  Object.keys(backendPlan).forEach(key => {
    if (backendPlan[key as keyof BackendTravelPlan] === undefined) {
      delete backendPlan[key as keyof BackendTravelPlan]
    }
  })

  return backendPlan
}

/**
 * 将后端API返回的数据转换为前端格式
 * 关键转换：startDate -> start, endDate -> end, description -> note
 */
export function backendToFrontend(backendPlan: BackendTravelPlan): FrontendTrip {
  const frontendTrip: FrontendTrip = {
    id: backendPlan.id,
    title: backendPlan.title,
    start: backendPlan.startDate,  // 关键转换：startDate -> start
    end: backendPlan.endDate,      // 关键转换：endDate -> end
    status: backendPlan.status,
    source: backendPlan.source,
    note: backendPlan.description, // description -> note
    description: backendPlan.description, // 同时保留description字段
    days: backendPlan.days,
    budget: backendPlan.budget,
    transportation: backendPlan.transportation
  }

  // 清理undefined字段
  Object.keys(frontendTrip).forEach(key => {
    if (frontendTrip[key as keyof FrontendTrip] === undefined) {
      delete frontendTrip[key as keyof FrontendTrip]
    }
  })

  return frontendTrip
}

/**
 * 统一转换函数：将任何格式的行程数据转换为应用内部使用的Trip格式
 */
export function normalizeTrip(tripData: any): Trip {
  if (isBackendTravelPlan(tripData)) {
    // 如果数据来自后端，先转换为前端格式
    const frontendTrip = backendToFrontend(tripData)
    return {
      ...frontendTrip,
      startDate: tripData.startDate, // 保留后端字段
      endDate: tripData.endDate      // 保留后端字段
    }
  } else if (isFrontendTrip(tripData)) {
    // 如果数据来自前端，已经是正确格式
    return {
      ...tripData,
      startDate: tripData.start, // 添加后端字段
      endDate: tripData.end      // 添加后端字段
    }
  } else {
    // 未知格式，尝试转换
    const trip: Trip = {
      id: tripData.id || '',
      title: tripData.title || '',
      start: tripData.start || tripData.startDate || '',
      end: tripData.end || tripData.endDate || '',
      status: tripData.status || 'draft',
      source: tripData.source || 'manual',
      note: tripData.note || tripData.description || '',
      description: tripData.description || tripData.note || ''
    }

    if (tripData.days) trip.days = tripData.days
    if (tripData.budget) trip.budget = tripData.budget
    if (tripData.transportation) trip.transportation = tripData.transportation

    // 确保字段映射
    trip.startDate = tripData.startDate || trip.start
    trip.endDate = tripData.endDate || trip.end

    return trip
  }
}

/**
 * 类型守卫：检查是否为后端数据格式
 */
function isBackendTravelPlan(data: any): data is BackendTravelPlan {
  return data &&
    typeof data.startDate === 'string' &&
    typeof data.endDate === 'string' &&
    !data.start // 后端数据没有start字段
}

/**
 * 类型守卫：检查是否为前端数据格式
 */
function isFrontendTrip(data: any): data is FrontendTrip {
  return data &&
    typeof data.start === 'string' &&
    typeof data.end === 'string'
}

/**
 * 转换行程列表
 */
export function normalizeTripList(tripList: any[]): Trip[] {
  return tripList.map(normalizeTrip)
}

/**
 * 准备API请求数据
 */
export function prepareApiRequest(data: any): any {
  // 如果是行程数据，转换为后端格式
  if (data && (data.start || data.startDate)) {
    const frontendTrip = normalizeTrip(data)
    return frontendToBackend(frontendTrip)
  }
  return data
}

/**
 * 处理API响应数据
 */
export function processApiResponse<T = any>(responseData: any): T {
  // 如果响应包含行程数据，转换为前端格式
  if (responseData && (responseData.startDate || responseData.start)) {
    return normalizeTrip(responseData) as T
  }
  return responseData
}