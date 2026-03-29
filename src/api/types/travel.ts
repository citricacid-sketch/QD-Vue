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
  breakdown: BudgetBreakdown; // 预算细分
}

export interface Transportation {
  primary?: string;      // 主要交通方式
  secondary?: string;    // 次要交通方式
  notes?: string;        // 交通备注
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
  transportation?: Transportation; // 交通信息
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
  transportation?: Transportation; // 交通信息
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

// ==================== 目的地相关类型 ====================

export interface Destination {
  id: string;                    // 目的地ID
  name: string;                   // 目的地名称
  nameEn?: string;                // 英文名称
  description: string;            // 描述
  image: string;                  // 封面图片URL
  images?: string[];              // 更多图片URL数组
  location: {
    country: string;              // 国家
    province?: string;            // 省份/州
    city: string;                 // 城市
    coordinates?: {
      lat: number;                // 纬度
      lng: number;                // 经度
    }
  };
  tags?: string[];                // 标签（如：['美食', '购物', '历史文化']）
  rating?: number;                // 评分（0-5）
  reviewCount?: number;            // 评论数
  highlights?: string[];          // 亮点/特色
  bestSeason?: string;            // 最佳旅游季节
  recommendedDuration?: number;   // 推荐游玩天数
  budget?: {
    low: number;                  // 低预算
    medium: number;               // 中等预算
    high: number;                 // 高预算
  };
  transportation?: string[];      // 交通方式
  attractions?: Attraction[];    // 景点列表
  createdAt?: string;             // 创建时间
  updatedAt?: string;             // 更新时间
}

export interface Attraction {
  id: string;                     // 景点ID
  name: string;                   // 景点名称
  description: string;            // 描述
  image?: string;                 // 景点图片
  rating?: number;                // 评分
  recommendedDuration?: number;   // 推荐游玩时长（小时）
  ticketPrice?: {
    adult: number;                // 成人票
    child?: number;               // 儿童票
    currency?: string;            // 货币
  };
  openingHours?: string;          // 开放时间
  address?: string;               // 地址
  coordinates?: {
    lat: number;
    lng: number;
  };
}

export interface DestinationSearchFilters {
  query?: string;                 // 搜索关键词
  country?: string;               // 国家
  tags?: string[];                // 标签筛选
  minRating?: number;             // 最低评分
  maxBudget?: number;             // 最高预算
  season?: string;                // 季节
}

export interface DestinationApiResponse {
  destinations: Destination[];
  total: number;
  page: number;
  pageSize: number;
}