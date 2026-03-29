/**
 * 高德地图配置工具
 * 用于安全地加载和管理高德地图API密钥
 */

// 从环境变量获取配置
const AMAP_KEY = import.meta.env.VITE_AMAP_KEY || ''
const AMAP_SECURITY_CODE = import.meta.env.VITE_AMAP_SECURITY_CODE || ''

/**
 * 检查高德地图配置是否有效
 */
export function isAmapConfigured(): boolean {
  return !!(AMAP_KEY && AMAP_SECURITY_CODE)
}

/**
 * 获取高德地图API密钥
 */
export function getAmapKey(): string {
  return AMAP_KEY
}

/**
 * 获取高德地图安全密钥
 */
export function getAmapSecurityCode(): string {
  return AMAP_SECURITY_CODE
}

/**
 * 初始化高德地图安全配置
 */
export function initAmapSecurityConfig(): void {
  if (typeof window !== 'undefined' && AMAP_SECURITY_CODE) {
    ;(window as any)._AMapSecurityConfig = {
      securityJsCode: AMAP_SECURITY_CODE,
    }
  }
}

/**
 * 动态加载高德地图API
 */
export function loadAmapScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (!AMAP_KEY) {
      reject(new Error('高德地图API密钥未配置'))
      return
    }

    // 如果已经加载过，直接返回
    if (typeof (window as any).AMap !== 'undefined') {
      resolve()
      return
    }

    // 创建script标签
    const script = document.createElement('script')
    script.type = 'text/javascript'
    script.src = `https://webapi.amap.com/maps?v=2.0&key=${AMAP_KEY}`
    script.async = true

    script.onload = () => {
      resolve()
    }

    script.onerror = () => {
      reject(new Error('高德地图API加载失败'))
    }

    document.head.appendChild(script)
  })
}

/**
 * 显示配置错误提示
 */
export function showConfigError(): void {
  console.error('高德地图未正确配置，请检查环境变量 VITE_AMAP_KEY 和 VITE_AMAP_SECURITY_CODE')
}
