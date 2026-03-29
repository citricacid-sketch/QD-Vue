<script setup lang="ts">
import AppLayout from '@/components/layout/AppLayout.vue'
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useDestinationStore } from '@/stores/destination.store'
import type { Destination, Attraction } from '@/api/types/travel'
import { loadAmapScript, initAmapSecurityConfig, isAmapConfigured } from '@/utils/amapConfig'

const route = useRoute()
const router = useRouter()
const destinationStore = useDestinationStore()

const destinationId = computed(() => route.params.id as string)
const destination = computed(() => destinationStore.currentDestination)
const isLoading = computed(() => destinationStore.isLoading)

// 加载目的地详情
onMounted(async () => {
  await loadDestination()
})

async function loadDestination() {
  // 先从本地store查找
  const localDest = destinationStore.getDestinationById(destinationId.value)

  if (localDest) {
    destinationStore.setCurrentDestination(destinationId.value)
  } else {
    // 从API加载
    await destinationStore.loadDestinationDetailFromAPI(destinationId.value)
  }

  // 如果还是没有数据，返回列表页
  if (!destination.value) {
    router.push({ name: 'Destinations' })
  }
}

// 收藏/取消收藏
function toggleFavorite() {
  if (destination.value) {
    destinationStore.toggleFavorite(destination.value.id)
  }
}

// 检查是否已收藏
const isFavorite = computed(() => 
  destination.value ? destinationStore.isFavorite(destination.value.id) : false
)

// 查看景点详情
function viewAttractionDetail(attraction: Attraction) {
  console.log('查看景点:', attraction.name)
  // TODO: 实现景点详情功能
}

// 添加到行程
function addToTrip() {
  if (destination.value) {
    console.log('添加到行程:', destination.value.name)
    // TODO: 实现添加到行程的功能
  }
}

// 返回列表
function goBack() {
  router.push({ name: 'Destinations' })
}

// 地图相关
const mapContainer = ref<HTMLElement | null>(null)
let map: InstanceType<typeof window.AMap.Map> | null = null
let marker: any = null

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
    if (mapContainer.value && destination.value?.location.coordinates) {
      const { lat, lng } = destination.value.location.coordinates
      map = new window.AMap.Map(mapContainer.value, {
        zoom: 12,
        center: [lng, lat],
        viewMode: '2D',
        pitch: 0
      })

      // 添加标记
      marker = new window.AMap.Marker({
        position: [lng, lat],
        title: destination.value.name
      })
      map.add(marker)

      // 添加信息窗口
      const infoWindow = new window.AMap.InfoWindow({
        content: `
          <div class="amap-info-window">
            <h3>${destination.value.name}</h3>
            <p>${destination.value.location.city}, ${destination.value.location.country}</p>
          </div>
        `,
        offset: new window.AMap.Pixel(0, -30)
      })
      
      marker.on('click', () => {
        infoWindow.open(map, marker.getPosition())
      })
    }
  } catch (error) {
    console.error('高德地图初始化失败:', error)
  }
}

// 监听目的地变化，重新初始化地图
watch(() => destination.value, () => {
  if (destination.value) {
    initMap()
  }
})

// 组件卸载时清理
onUnmounted(() => {
  if (map) {
    map.destroy()
    map = null
  }
  if (marker) {
    marker.setMap(null)
    marker = null
  }
})
</script>

<template>
  <AppLayout>
    <div v-if="isLoading" class="loading-state">
      <p>加载中...</p>
    </div>
    <div v-else-if="destination" class="destination-detail">
      <!-- 封面图片 -->
      <div class="hero-section">
        <img :src="destination.image" :alt="destination.name" class="hero-image" />
        <div class="hero-overlay">
          <div class="container">
            <button class="back-button" @click="goBack">
              ← 返回
            </button>
            <div class="hero-content">
              <h1>{{ destination.name }}</h1>
              <p v-if="destination.nameEn" class="subtitle">{{ destination.nameEn }}</p>
              <div class="hero-meta">
                <div v-if="destination.rating" class="rating">
                  <span class="stars">★★★★★</span>
                  <span class="score">{{ destination.rating.toFixed(1) }}</span>
                  <span v-if="destination.reviewCount" class="review-count">
                    ({{ destination.reviewCount }} 条评论)
                  </span>
                </div>
                <div class="location">
                  {{ destination.location.country }}
                  <span v-if="destination.location.province">
                    · {{ destination.location.province }}
                  </span>
                  · {{ destination.location.city }}
                </div>
              </div>
              <div class="hero-actions">
                <button class="btn btn-primary" @click="addToTrip">
                  添加到行程
                </button>
                <button 
                  class="btn" 
                  :class="isFavorite ? 'btn-favorite active' : 'btn-favorite'"
                  @click="toggleFavorite"
                >
                  {{ isFavorite ? '已收藏' : '收藏' }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="container">
        <div class="detail-content">
          <!-- 左侧主要内容 -->
          <div class="main-content">
            <!-- 描述 -->
            <section class="section">
              <h2>关于目的地</h2>
              <p>{{ destination.description }}</p>
            </section>

            <!-- 亮点 -->
            <section v-if="destination.highlights && destination.highlights.length" class="section">
              <h2>亮点特色</h2>
              <div class="highlights">
                <div v-for="highlight in destination.highlights" :key="highlight" class="highlight-item">
                  <span class="highlight-icon">✨</span>
                  {{ highlight }}
                </div>
              </div>
            </section>

            <!-- 标签 -->
            <section v-if="destination.tags && destination.tags.length" class="section">
              <h2>特色标签</h2>
              <div class="tags">
                <span v-for="tag in destination.tags" :key="tag" class="tag">
                  {{ tag }}
                </span>
              </div>
            </section>

            <!-- 景点列表 -->
            <section v-if="destination.attractions && destination.attractions.length" class="section">
              <h2>热门景点</h2>
              <div class="attractions">
                <div 
                  v-for="attraction in destination.attractions" 
                  :key="attraction.id" 
                  class="attraction-card"
                  @click="viewAttractionDetail(attraction)"
                >
                  <div v-if="attraction.image" class="attraction-image">
                    <img :src="attraction.image" :alt="attraction.name" />
                  </div>
                  <div class="attraction-info">
                    <h3>{{ attraction.name }}</h3>
                    <p>{{ attraction.description }}</p>
                    <div class="attraction-meta">
                      <span v-if="attraction.rating" class="rating">
                        ★ {{ attraction.rating.toFixed(1) }}
                      </span>
                      <span v-if="attraction.recommendedDuration" class="duration">
                        建议游玩 {{ attraction.recommendedDuration }} 小时
                      </span>
                      <span v-if="attraction.ticketPrice" class="price">
                        ¥{{ attraction.ticketPrice.adult }} 起
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <!-- 更多图片 -->
            <section v-if="destination.images && destination.images.length" class="section">
              <h2>更多图片</h2>
              <div class="gallery">
                <img 
                  v-for="(image, index) in destination.images" 
                  :key="index"
                  :src="image" 
                  :alt="`${destination.name} 图片 ${index + 1}`"
                  class="gallery-image"
                />
              </div>
            </section>
          </div>

          <!-- 右侧侧边栏 -->
          <div class="sidebar">
            <!-- 基本信息 -->
            <div class="sidebar-card">
              <h3>基本信息</h3>
              <div class="info-item">
                <span class="label">最佳旅游季节</span>
                <span class="value">{{ destination.bestSeason || '全年适宜' }}</span>
              </div>
              <div v-if="destination.recommendedDuration" class="info-item">
                <span class="label">推荐游玩天数</span>
                <span class="value">{{ destination.recommendedDuration }} 天</span>
              </div>
              <div v-if="destination.transportation && destination.transportation.length" class="info-item">
                <span class="label">交通方式</span>
                <div class="value">
                  <span v-for="transport in destination.transportation" :key="transport" class="transport-tag">
                    {{ transport }}
                  </span>
                </div>
              </div>
            </div>

            <!-- 预算参考 -->
            <div v-if="destination.budget" class="sidebar-card">
              <h3>预算参考</h3>
              <div class="budget-info">
                <div class="budget-item">
                  <span class="budget-label">经济型</span>
                  <span class="budget-value">¥{{ destination.budget.low }}起</span>
                </div>
                <div class="budget-item">
                  <span class="budget-label">舒适型</span>
                  <span class="budget-value">¥{{ destination.budget.medium }}起</span>
                </div>
                <div class="budget-item">
                  <span class="budget-label">豪华型</span>
                  <span class="budget-value">¥{{ destination.budget.high }}起</span>
                </div>
              </div>
            </div>

            <!-- 地图位置 -->
            <div class="sidebar-card map-card">
              <h3>位置</h3>
              <div class="map-info">
                <p>{{ destination.location.country }}</p>
                <p v-if="destination.location.province">{{ destination.location.province }}</p>
                <p>{{ destination.location.city }}</p>
                <p v-if="destination.location.coordinates" class="coordinates">
                  {{ destination.location.coordinates.lat.toFixed(4) }}, {{ destination.location.coordinates.lng.toFixed(4) }}
                </p>
              </div>
              <div ref="mapContainer" class="map-container"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </AppLayout>
</template>

<style scoped>
.loading-state {
  text-align: center;
  padding: 60px 20px;
  color: #666;
  font-size: 18px;
}

.destination-detail {
  padding-bottom: 60px;
}

/* Hero Section */
.hero-section {
  position: relative;
  height: 500px;
  overflow: hidden;
}

.hero-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.hero-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.6) 100%);
  display: flex;
  align-items: flex-end;
  padding-bottom: 60px;
}

.back-button {
  position: absolute;
  top: 20px;
  left: 20px;
  background: rgba(255, 255, 255, 0.9);
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 500;
  transition: all 0.2s;
}

.back-button:hover {
  background: white;
  transform: translateX(-5px);
}

.hero-content {
  color: white;
}

.hero-content h1 {
  font-size: 48px;
  font-weight: 700;
  margin-bottom: 8px;
}

.subtitle {
  font-size: 24px;
  opacity: 0.9;
  margin-bottom: 20px;
}

.hero-meta {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 24px;
}

.rating {
  display: flex;
  align-items: center;
  gap: 8px;
}

.rating .stars {
  color: #f59e0b;
  font-size: 20px;
}

.rating .score {
  font-size: 24px;
  font-weight: 600;
}

.review-count {
  font-size: 14px;
  opacity: 0.8;
}

.location {
  font-size: 16px;
  opacity: 0.9;
}

.hero-actions {
  display: flex;
  gap: 12px;
}

.btn {
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
  font-size: 16px;
}

.btn-primary {
  background: #4a6cf7;
  color: white;
}

.btn-primary:hover {
  background: #3a5ce5;
}

.btn-favorite {
  background: rgba(255, 255, 255, 0.9);
  color: #333;
}

.btn-favorite:hover {
  background: white;
}

.btn-favorite.active {
  background: #f59e0b;
  color: white;
}

/* Detail Content */
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.detail-content {
  display: grid;
  grid-template-columns: 1fr 350px;
  gap: 40px;
  margin-top: 40px;
}

.main-content {
  min-width: 0;
}

.section {
  margin-bottom: 40px;
}

.section h2 {
  font-size: 28px;
  font-weight: 600;
  color: #222;
  margin-bottom: 20px;
}

.section p {
  color: #666;
  line-height: 1.8;
  font-size: 16px;
}

/* Highlights */
.highlights {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 16px;
}

.highlight-item {
  background: #f8f9fa;
  padding: 16px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.highlight-icon {
  font-size: 20px;
}

/* Tags */
.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.tag {
  padding: 8px 16px;
  background: #f0f4ff;
  color: #4a6cf7;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 500;
}

/* Attractions */
.attractions {
  display: grid;
  gap: 20px;
}

.attraction-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}

.attraction-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}

.attraction-image {
  height: 200px;
  overflow: hidden;
}

.attraction-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.attraction-info {
  padding: 20px;
}

.attraction-info h3 {
  font-size: 20px;
  font-weight: 600;
  color: #222;
  margin-bottom: 8px;
}

.attraction-info p {
  color: #666;
  line-height: 1.6;
  margin-bottom: 12px;
}

.attraction-meta {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}

.attraction-meta span {
  font-size: 14px;
  color: #888;
}

/* Gallery */
.gallery {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 16px;
}

.gallery-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-radius: 8px;
  cursor: pointer;
  transition: transform 0.2s;
}

.gallery-image:hover {
  transform: scale(1.02);
}

/* Sidebar */
.sidebar {
  min-width: 0;
}

.sidebar-card {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  margin-bottom: 24px;
}

.sidebar-card h3 {
  font-size: 20px;
  font-weight: 600;
  color: #222;
  margin-bottom: 20px;
}

.info-item {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
  padding-bottom: 16px;
  border-bottom: 1px solid #eee;
}

.info-item:last-child {
  margin-bottom: 0;
  padding-bottom: 0;
  border-bottom: none;
}

.label {
  color: #666;
  font-size: 14px;
}

.value {
  color: #222;
  font-size: 14px;
  text-align: right;
  flex: 1;
  margin-left: 20px;
}

.transport-tag {
  display: inline-block;
  background: #f0f4ff;
  color: #4a6cf7;
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 12px;
  margin-left: 6px;
}

/* Budget */
.budget-info {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.budget-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.budget-label {
  color: #666;
  font-size: 14px;
}

.budget-value {
  color: #222;
  font-size: 16px;
  font-weight: 600;
}

/* Map */
.map-placeholder {
  background: #f5f7ff;
  border-radius: 8px;
  padding: 20px;
  text-align: center;
}

.map-placeholder p {
  color: #666;
  margin: 4px 0;
}

.coordinates {
  font-size: 12px;
  color: #999;
  margin-top: 12px !important;
}

/* Responsive */
@media (max-width: 968px) {
  .detail-content {
    grid-template-columns: 1fr;
  }

  .hero-content h1 {
    font-size: 36px;
  }

  .subtitle {
    font-size: 20px;
  }
}

@media (max-width: 768px) {
  .hero-section {
    height: 400px;
  }

  .hero-content h1 {
    font-size: 28px;
  }

  .subtitle {
    font-size: 16px;
  }

  .hero-meta {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }

  .hero-actions {
    flex-direction: column;
    width: 100%;
  }

  .hero-actions .btn {
    width: 100%;
  }

  .highlights {
    grid-template-columns: 1fr;
  }

  .gallery {
    grid-template-columns: 1fr;
  }
}

/* 地图样式 */
.map-info {
  padding: 12px 0;
  border-bottom: 1px solid #eee;
  margin-bottom: 12px;
}

.map-info p {
  margin: 4px 0;
  color: #666;
  font-size: 14px;
}

.map-info .coordinates {
  font-family: monospace;
  color: #999;
  font-size: 12px;
}

.map-container {
  width: 100%;
  height: 300px;
  border-radius: 8px;
  overflow: hidden;
}

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
  margin: 0;
  font-size: 14px;
  color: #666;
  line-height: 1.5;
}
</style>
