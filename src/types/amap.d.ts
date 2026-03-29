/**
 * 高德地图全局类型定义
 */

interface AMap {
  Map: any
  Marker: any
  InfoWindow: any
  TileLayer: any
  Pixel: any
}

declare global {
  interface Window {
    AMap: AMap
  }
}

export {}
