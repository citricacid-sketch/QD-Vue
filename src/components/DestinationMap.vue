<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import type { Destination } from '@/api/types/travel'

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
let map: any = null
let markers: any[] = []

// 初始化地图
function initMap() {
  if (!mapContainer.value || typeof window === 'undefined') return

  // 动态导入Leaflet
  import('leaflet').then((L) => {
    // 动态加载Leaflet CSS
    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
    document.head.appendChild(link)
    // 创建地图实例
    map = L.map(mapContainer.value).setView([35.8617, 104.1954], props.zoom)

    // 添加OpenStreetMap图层
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map)

    // 添加目的地标记
    addMarkers()
  })
}

// 添加标记
function addMarkers() {
  if (!map || !props.destinations.length) return

  // 清除现有标记
  clearMarkers()

  import('leaflet').then((L) => {
    props.destinations.forEach(dest => {
      if (dest.location.coordinates) {
        // 创建自定义图标
        const icon = L.divIcon({
          className: 'custom-marker',
          html: `
            <div class="marker-content">
              <span class="marker-label">${dest.name}</span>
              <div class="marker-dot"></div>
            </div>
          `,
          iconSize: [120, 40],
          iconAnchor: [60, 20]
        })

        // 添加标记
        const marker = L.marker(
          [dest.location.coordinates.lat, dest.location.coordinates.lng],
          { icon }
        ).addTo(map)

        // 添加点击事件
        marker.on('click', () => {
          emit('destinationClick', dest)
          // 地图移动到标记位置
          if (dest.location.coordinates) {
            map.setView([dest.location.coordinates.lat, dest.location.coordinates.lng], 8)
          }
        })

        // 添加弹出窗口
        marker.bindPopup(`
          <div class="popup-content">
            <h3>${dest.name}</h3>
            <p>${dest.description}</p>
            ${dest.rating ? `<p class="rating">评分: ${dest.rating.toFixed(1)}</p>` : ''}
          </div>
        `)

        markers.push(marker)
      }
    })
  })
}

// 清除标记
function clearMarkers() {
  markers.forEach(marker => {
    map.removeLayer(marker)
  })
  markers = []
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
    map.remove()
    map = null
  }
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

/* 自定义标记样式 */
:deep(.custom-marker) {
  background: transparent;
  border: none;
}

:deep(.marker-content) {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
}

:deep(.marker-label) {
  background: white;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
  color: #4a6cf7;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  white-space: nowrap;
  margin-bottom: 4px;
}

:deep(.marker-dot) {
  width: 12px;
  height: 12px;
  background: #4a6cf7;
  border: 2px solid white;
  border-radius: 50%;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

/* 弹出窗口样式 */
:deep(.popup-content) {
  min-width: 200px;
}

:deep(.popup-content h3) {
  margin: 0 0 8px;
  font-size: 16px;
  color: #222;
}

:deep(.popup-content p) {
  margin: 0 0 8px;
  font-size: 14px;
  color: #666;
  line-height: 1.5;
}

:deep(.popup-content .rating) {
  margin: 0;
  font-weight: 600;
  color: #f59e0b;
}
</style>
