/**
 * 旅行平台数据模型定义
 * 统一前后端数据接口，解决字段名不匹配问题
 */

// ==================== 基础接口 ====================

export interface Slot {
  time: string;          // 开始时间，格式: "HH:mm"
  end: string;           // 结束时间，格式: "HH:mm"
  text: string;          // 活动内容
  note?: string;         // 备注（前端使用）
}

export interface Day {
  label: string;         // 天标签，如"第1天 · 上海"
  date: string;          // 日期，格式: "YYYY-MM-DD"
  slots: Slot[];         // 时间段列表
}

export interface BudgetBreakdown {
  accommodation?: number;  // 住宿
  transportation?: number; // 交通
  food?: number;          // 餐饮
  activities?: number;    // 活动
  shopping?: number;      // 购物
  other?: number;         // 其他
}

export interface Budget {
  total: number;         // 总预算
  currency: string;      // 货币单位，默认"CNY"
  breakdown?: BudgetBreakdown; // 预算细分
}

// ==================== 前后端数据模型 ====================

/**
 * 前端使用的行程数据模型
 * 字段名与现有前端保持一致
 */
export interface FrontendTrip {
  id: string;            // 行程ID
  title: string;         // 行程标题
  start: string;         // 开始日期，格式: "YYYY-MM-DD"（前端字段名）
  end: string;           // 结束日期，格式: "YYYY-MM-DD"（前端字段名）
  status: string;        // 状态: "ongoing", "completed", "draft"
  source: string;        // 来源: "ai", "manual"
  note?: string;         // 备注（前端字段名）
  description?: string;  // 描述（后端字段名，前端也支持）
  days?: Day[];          // 天数列表
  budget?: Budget;       // 预算信息
  transportation?: string; // 交通信息
  createdAt?: string;    // 创建时间
  updatedAt?: string;    // 更新时间
}

/**
 * 后端API接收的数据模型 (TravelPlan DTO)
 * 字段名与后端Java DTO保持一致
 */
export interface BackendTravelPlan {
  id: string;            // 行程ID
  title: string;         // 行程标题
  startDate: string;     // 开始日期（后端字段名）
  endDate: string;       // 结束日期（后端字段名）
  status: string;        // 状态
  source: string;        // 来源
  description?: string;  // 描述（后端字段名）
  days?: Day[];          // 天数列表
  budget?: Budget;       // 预算信息
  transportation?: string; // 交通信息
}

/**
 * 统一的行程数据模型
 * 在应用内部使用，包含所有字段的映射
 */
export interface Trip extends FrontendTrip {
  // 扩展字段用于转换
  startDate?: string;    // 后端字段名（可选）
  endDate?: string;      // 后端字段名（可选）
}

// ==================== API请求/响应类型 ====================

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
}

export interface RagChatRequest {
  message: string;
}

export interface PlanGenerateRequest {
  enhancedPrompt: string;
}

export interface TripImportRequest {
  travelPlan: BackendTravelPlan;
  userId?: string;
  mergeWithExisting?: boolean;
  targetTripId?: string | null;
}

export interface TripImportResponse {
  trip?: BackendTravelPlan;
  tripId?: string;
  message: string;
  success: boolean;
}

export interface TripPrepareRequest {
  travelPlan: BackendTravelPlan;
}

// ==================== 用户相关类型 ====================

export interface User {
  id?: string;
  name?: string;
  email?: string;
  avatar?: string;
  isAuthenticated: boolean;
}

// ==================== AI聊天相关类型 ====================

export interface ChatMessage {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  status: 'sending' | 'sent' | 'error';
}

export interface AIConversation {
  id: string;
  title: string;
  messages: ChatMessage[];
  createdAt: Date;
  updatedAt: Date;
}