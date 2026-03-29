<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import type { Destination } from '@/api/types/travel'
import { loadAmapScript, initAmapSecurityConfig, isAmapConfigured } from '@/utils/amapConfig'

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

interface Props {
  destinations: Destination[]
  height?: string
  zoom?: number
}

const props = withDefaults(defineProps<Props>(), {
  height: '400px',
  zoom: 4
})

const emit = defineEmits<{
  destinationClick: [destination: Destination]
}>()

const mapContainer = ref<HTMLElement | null>(null)
let map: InstanceType<typeof window.AMap.Map> | null = null
let markers: any[] = []
let infoWindows: any[] = []

// 初始化地图
async function initMap() {
  if (!mapContainer.value || typeof window === 'undefined') return

  // 检查高德地图配置
  if (!isAmapConfigured()) {
    console.error('高德地图未配置，请检查环境变量 VITE_AMAP_KEY 和 VITE_AMAP_SECURITY_CODE')
    return
  }

  try {
    // 初始化安全配置
    initAmapSecurityConfig()

    // 加载高德地图API
    await loadAmapScript()

    // 创建地图实例
    if (mapContainer.value) {
      map = new window.AMap.Map(mapContainer.value, {
        zoom: props.zoom,
        center: [104.1954, 35.8617], // 中国中心点
        viewMode: '2D',
        pitch: 0
      })

      // 添加目的地标记
      addMarkers()
    }
  } catch (error) {
    console.error('高德地图初始化失败:', error)
  }
}

// 添加标记
function addMarkers() {
  if (!map || !props.destinations.length) return

  // 清除现有标记
  clearMarkers()

  props.destinations.forEach(dest => {
    if (dest.location.coordinates) {
      // 创建标记
      const marker = new window.AMap.Marker({
        position: [dest.location.coordinates.lng, dest.location.coordinates.lat],
        map: map,
        title: dest.name
      })

      // 创建信息窗口
      const content = `
        <div class="amap-info-window">
          <h3>${dest.name}</h3>
          <p>${dest.description}</p>
          ${dest.rating ? `<p class="rating">评分: ${dest.rating.toFixed(1)}</p>` : ''}
        </div>
      `

      const infoWindow = new window.AMap.InfoWindow({
        content: content,
        offset: new window.AMap.Pixel(0, -30)
      })

      // 添加点击事件
      marker.on('click', () => {
        emit('destinationClick', dest)
        // 地图移动到标记位置
        if (dest.location.coordinates) {
          map.setCenter([dest.location.coordinates.lng, dest.location.coordinates.lat])
          map.setZoom(8)
        }
        // 打开信息窗口
        infoWindow.open(map, marker.getPosition())
      })

      markers.push(marker)
      infoWindows.push(infoWindow)
    }
  })
}

// 清除标记
function clearMarkers() {
  markers.forEach(marker => {
    marker.setMap(null)
  })
  markers = []
  infoWindows = []
}

// 监听目的地变化
watch(() => props.destinations, () => {
  addMarkers()
}, { deep: true })

// 组件挂载时初始化地图
onMounted(() => {
  initMap()
})

// 组件卸载时清理
onUnmounted(() => {
  if (map) {
    map.destroy()
    map = null
  }
  clearMarkers()
})

// 暴露方法给父组件
defineExpose({
  addMarkers,
  clearMarkers
})
</script>

<template>
  <div class="destination-map" :style="{ height }">
    <div ref="mapContainer" class="map-container"></div>
  </div>
</template>

<style scoped>
.destination-map {
  width: 100%;
  border-radius: 8px;
  overflow: hidden;
}

.map-container {
  width: 100%;
  height: 100%;
}

/* 高德地图信息窗口样式 */
:deep(.amap-info-window) {
  padding: 12px;
  min-width: 200px;
}

:deep(.amap-info-window h3) {
  margin: 0 0 8px;
  font-size: 16px;
  color: #222;
}

:deep(.amap-info-window p) {
  margin: 0 0 8px;
  font-size: 14px;
  color: #666;
  line-height: 1.5;
}

:deep(.amap-info-window .rating) {
  margin: 0;
  font-weight: 600;
  color: #f59e0b;
}
</style>
