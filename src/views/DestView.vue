<script setup lang="ts">
import AppLayout from '@/components/layout/AppLayout.vue'
import DestinationMap from '@/components/DestinationMap.vue'
import { ref, computed, onMounted } from 'vue'
import { useDestinationStore } from '@/stores/destination.store'
import type { Destination } from '@/api/types/travel'
import { useRouter } from 'vue-router'

const router = useRouter()
const destinationStore = useDestinationStore()
const searchQuery = ref('')

// 使用store中的目的地数据
const destinations = computed(() => destinationStore.destinations)
const filteredDestinations = computed(() => destinationStore.filteredDestinations)
const isLoading = computed(() => destinationStore.isLoading)

// 初始化时加载目的地数据
onMounted(async () => {
  // 如果本地没有数据，则从API加载
  if (destinations.value.length === 0) {
    await destinationStore.loadDestinationsFromAPI()
  }
  
  // 如果API加载失败或没有数据，使用默认数据
  if (destinations.value.length === 0) {
    initializeDefaultDestinations()
  }
})

// 初始化默认目的地数据
function initializeDefaultDestinations() {
  const defaultDestinations: Destination[] = [
    {
      id: 'shanghai',
      name: '上海',
      nameEn: 'Shanghai',
      description: '国际化大都市，东方巴黎，融合了传统与现代的魅力',
      image: 'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      location: {
        country: '中国',
        province: '上海',
        city: '上海',
        coordinates: {
          lat: 31.2304,
          lng: 121.4737
        }
      },
      tags: ['购物', '美食', '历史文化', '现代都市'],
      rating: 4.8,
      reviewCount: 12580,
      highlights: ['外滩', '东方明珠', '豫园', '南京路'],
      bestSeason: '春秋两季',
      recommendedDuration: 3,
      budget: {
        low: 2000,
        medium: 4000,
        high: 8000
      },
      transportation: ['飞机', '高铁', '地铁']
    },
    {
      id: 'beijing',
      name: '北京',
      nameEn: 'Beijing',
      description: '中国首都，历史文化名城，拥有丰富的文化遗产',
      image: 'https://images.unsplash.com/photo-1592906209472-a36b1f3782ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      location: {
        country: '中国',
        province: '北京',
        city: '北京',
        coordinates: {
          lat: 39.9042,
          lng: 116.4074
        }
      },
      tags: ['历史文化', '古建筑', '博物馆', '皇家园林'],
      rating: 4.9,
      reviewCount: 15230,
      highlights: ['故宫', '长城', '天坛', '颐和园'],
      bestSeason: '春秋两季',
      recommendedDuration: 5,
      budget: {
        low: 3000,
        medium: 6000,
        high: 12000
      },
      transportation: ['飞机', '高铁', '地铁']
    },
    {
      id: 'xian',
      name: '西安',
      nameEn: 'Xi'an',
      description: '古都，兵马俑所在地，十三朝古都',
      image: 'https://images.unsplash.com/photo-1528164344705-47542687000d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      location: {
        country: '中国',
        province: '陕西',
        city: '西安',
        coordinates: {
          lat: 34.3416,
          lng: 108.9398
        }
      },
      tags: ['历史文化', '古建筑', '博物馆', '美食'],
      rating: 4.7,
      reviewCount: 9870,
      highlights: ['兵马俑', '大雁塔', '古城墙', '回民街'],
      bestSeason: '春秋两季',
      recommendedDuration: 4,
      budget: {
        low: 2500,
        medium: 5000,
        high: 10000
      },
      transportation: ['飞机', '高铁']
    },
    {
      id: 'chengdu',
      name: '成都',
      nameEn: 'Chengdu',
      description: '熊猫故乡，美食之都，悠闲的生活节奏',
      image: 'https://images.unsplash.com/photo-1537511133960-3c9c3ff5a3a8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      location: {
        country: '中国',
        province: '四川',
        city: '成都',
        coordinates: {
          lat: 30.5728,
          lng: 104.0668
        }
      },
      tags: ['美食', '熊猫', '休闲', '文化'],
      rating: 4.8,
      reviewCount: 11200,
      highlights: ['大熊猫基地', '宽窄巷子', '锦里', '春熙路'],
      bestSeason: '全年',
      recommendedDuration: 3,
      budget: {
        low: 2000,
        medium: 4000,
        high: 8000
      },
      transportation: ['飞机', '高铁', '地铁']
    },
    {
      id: 'guilin',
      name: '桂林',
      nameEn: 'Guilin',
      description: '山水甲天下，典型的喀斯特地貌',
      image: 'https://images.unsplash.com/photo-1528164344705-47542687000d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      location: {
        country: '中国',
        province: '广西',
        city: '桂林',
        coordinates: {
          lat: 25.2742,
          lng: 110.2901
        }
      },
      tags: ['自然风光', '山水', '摄影', '休闲'],
      rating: 4.6,
      reviewCount: 8900,
      highlights: ['漓江', '阳朔', '象鼻山', '龙脊梯田'],
      bestSeason: '4-10月',
      recommendedDuration: 4,
      budget: {
        low: 1800,
        medium: 3500,
        high: 7000
      },
      transportation: ['飞机', '高铁']
    },
    {
      id: 'hangzhou',
      name: '杭州',
      nameEn: 'Hangzhou',
      description: '西湖美景，人间天堂，江南水乡的代表',
      image: 'https://images.unsplash.com/photo-1544984243-ec57ea16fe25?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      location: {
        country: '中国',
        province: '浙江',
        city: '杭州',
        coordinates: {
          lat: 30.2741,
          lng: 120.1551
        }
      },
      tags: ['自然风光', '历史文化', '园林', '美食'],
      rating: 4.7,
      reviewCount: 10500,
      highlights: ['西湖', '灵隐寺', '西溪湿地', '宋城'],
      bestSeason: '春秋两季',
      recommendedDuration: 3,
      budget: {
        low: 2000,
        medium: 4000,
        high: 8000
      },
      transportation: ['飞机', '高铁', '地铁']
    }
  ]
  
  // 保存到store
  defaultDestinations.forEach(dest => {
    destinationStore.saveDestination(dest)
  })
}

// 搜索目的地
function searchDestinations() {
  destinationStore.searchDestinations(searchQuery.value)
}

// 查看目的地详情
function viewDestinationDetail(destination: Destination) {
  router.push({
    name: 'DestinationDetail',
    params: { id: destination.id }
  })
}

// 添加到行程
function addToTrip(destination: Destination) {
  // TODO: 实现添加到行程的功能
  console.log('添加到行程:', destination.name)
}

// 处理地图上目的地点击
function handleMapDestinationClick(destination: Destination) {
  viewDestinationDetail(destination)
}
</script>

<template>
  <AppLayout>
    <div class="dest-container">
      <div class="container">
        <div class="dest-header">
          <h1>目的地管理</h1>
          <p class="subtitle">地图搜索与展示，目的地查询与管理</p>
        </div>

        <!-- 搜索栏 -->
        <div class="search-section">
          <div class="search-box">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="搜索目的地..."
              @input="searchDestinations"
              @keyup.enter="searchDestinations"
            />
            <button class="btn btn-primary" @click="searchDestinations">
              搜索
            </button>
          </div>
          <p class="search-hint">
            已收录 {{ destinations.length }} 个热门目的地
          </p>
        </div>

        <!-- 目的地网格 -->
        <div v-if="isLoading" class="loading-state">
          <p>加载中...</p>
        </div>
        <div v-else-if="filteredDestinations.length === 0" class="empty-state">
          <p>没有找到匹配的目的地</p>
        </div>
        <div v-else class="dest-grid">
          <div
            v-for="dest in filteredDestinations"
            :key="dest.id"
            class="dest-card"
          >
            <div class="dest-image">
              <img :src="dest.image" :alt="dest.name" />
              <div class="dest-overlay">
                <button class="btn btn-small btn-white" @click="viewDestinationDetail(dest)">
                  查看详情
                </button>
              </div>
              <div v-if="dest.rating" class="dest-rating">
                <span class="stars">★</span>
                {{ dest.rating.toFixed(1) }}
              </div>
            </div>
            <div class="dest-info">
              <h3>{{ dest.name }}</h3>
              <p>{{ dest.description }}</p>
              <div v-if="dest.tags && dest.tags.length" class="dest-tags">
                <span v-for="tag in dest.tags" :key="tag" class="tag">
                  {{ tag }}
                </span>
              </div>
              <div class="dest-actions">
                <button class="btn btn-outline btn-small" @click="addToTrip(dest)">
                  添加到行程
                </button>
                <button class="btn btn-primary btn-small" @click="viewDestinationDetail(dest)">
                  查看详情
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- 交互式地图 -->
        <div class="map-section">
          <div class="map-header">
            <h3>交互式地图</h3>
            <p>点击目的地标记查看详细信息</p>
          </div>
          <DestinationMap
            :destinations="filteredDestinations"
            height="500px"
            @destination-click="handleMapDestinationClick"
          />
        </div>
      </div>
    </div>
  </AppLayout>
</template>

<style scoped>
.dest-container {
  padding: 40px 0 60px;
  transition: padding 0.3s ease;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.dest-header {
  text-align: center;
  margin-bottom: 40px;
}

.dest-header h1 {
  font-size: 36px;
  font-weight: 700;
  color: #222;
  margin-bottom: 10px;
}

.subtitle {
  font-size: 18px;
  color: #666;
  margin: 0;
}

.search-section {
  margin-bottom: 40px;
}

.search-box {
  display: flex;
  gap: 10px;
  max-width: 600px;
  margin: 0 auto 15px;
}

.search-box input {
  flex: 1;
  padding: 12px 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 16px;
  transition: border-color 0.2s;
}

.search-box input:focus {
  outline: none;
  border-color: #4a6cf7;
}

.btn {
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
  font-size: 16px;
  min-height: 44px;
}

.btn-primary {
  background-color: #4a6cf7;
  color: white;
}

.btn-primary:hover {
  background-color: #3a5ce5;
}

.btn-outline {
  background-color: transparent;
  color: #4a6cf7;
  border: 1px solid #4a6cf7;
}

.btn-outline:hover {
  background-color: #4a6cf7;
  color: white;
}

.btn-small {
  padding: 6px 12px;
  font-size: 14px;
}

.btn-white {
  background-color: white;
  color: #333;
}

.btn-white:hover {
  background-color: #f8f9fa;
}

.search-hint {
  text-align: center;
  color: #999;
  font-size: 14px;
  margin: 0;
}

.dest-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 30px;
  margin-bottom: 60px;
  transition: grid-template-columns 0.3s ease;
}

.dest-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.05);
  transition: transform 0.3s, box-shadow 0.3s;
}

.dest-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
}

.dest-image {
  position: relative;
  height: 200px;
  overflow: hidden;
}

.dest-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.dest-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s;
}

.dest-card:hover .dest-overlay {
  opacity: 1;
}

.dest-info {
  padding: 20px;
}

.dest-info h3 {
  font-size: 20px;
  font-weight: 600;
  color: #222;
  margin-bottom: 10px;
}

.dest-info p {
  color: #666;
  line-height: 1.5;
  margin-bottom: 15px;
}

.dest-actions {
  display: flex;
  gap: 10px;
}

.map-section {
  background: white;
  border-radius: 12px;
  padding: 30px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.05);
}

.map-header {
  text-align: center;
  margin-bottom: 30px;
}

.map-header h3 {
  font-size: 24px;
  font-weight: 600;
  color: #222;
  margin-bottom: 10px;
}

.map-header p {
  color: #666;
  margin: 0;
}

.loading-state,
.empty-state {
  text-align: center;
  padding: 40px;
  color: #666;
}

.dest-rating {
  position: absolute;
  top: 10px;
  right: 10px;
  background: rgba(255, 255, 255, 0.95);
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 600;
  color: #f59e0b;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.dest-rating .stars {
  margin-right: 4px;
}

.dest-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 12px;
}

.dest-tags .tag {
  padding: 4px 10px;
  background: #f0f4ff;
  color: #4a6cf7;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .dest-container {
    padding: 20px 0 40px;
  }

  .container {
    padding: 0 15px;
  }

  .dest-header h1 {
    font-size: 28px;
  }

  .subtitle {
    font-size: 16px;
  }

  .search-box {
    flex-direction: column;
    gap: 10px;
  }

  .search-box input {
    width: 100%;
  }

  .search-box .btn {
    width: 100%;
  }

  .dest-grid {
    grid-template-columns: 1fr;
    gap: 20px;
  }

  .dest-card {
    border-radius: 10px;
  }

  .dest-image {
    height: 180px;
  }

  .dest-info {
    padding: 15px;
  }

  .dest-info h3 {
    font-size: 18px;
  }

  .dest-info p {
    font-size: 14px;
  }

  .dest-actions {
    flex-direction: column;
    gap: 8px;
  }

  .dest-actions .btn {
    width: 100%;
  }

  .map-placeholder {
    padding: 20px 15px;
  }

  .map-header h3 {
    font-size: 20px;
  }

  .map-content {
    height: 300px;
  }

  .map-point {
    padding: 6px 12px;
    font-size: 14px;
  }
}
</style>