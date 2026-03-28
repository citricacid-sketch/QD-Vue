<script setup lang="ts">
import AppLayout from '@/components/layout/AppLayout.vue'
import { ref } from 'vue'

const searchQuery = ref('')
const destinations = ref([
  { id: 1, name: '上海', description: '国际化大都市，东方巴黎', image: 'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
  { id: 2, name: '北京', description: '中国首都，历史文化名城', image: 'https://images.unsplash.com/photo-1592906209472-a36b1f3782ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
  { id: 3, name: '西安', description: '古都，兵马俑所在地', image: 'https://images.unsplash.com/photo-1528164344705-47542687000d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
  { id: 4, name: '成都', description: '熊猫故乡，美食之都', image: 'https://images.unsplash.com/photo-1537511133960-3c9c3ff5a3a8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
  { id: 5, name: '桂林', description: '山水甲天下', image: 'https://images.unsplash.com/photo-1528164344705-47542687000d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
  { id: 6, name: '杭州', description: '西湖美景，人间天堂', image: 'https://images.unsplash.com/photo-1544984243-ec57ea16fe25?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
])

const filteredDestinations = ref(destinations.value)

function searchDestinations() {
  if (!searchQuery.value.trim()) {
    filteredDestinations.value = destinations.value
    return
  }

  const query = searchQuery.value.toLowerCase()
  filteredDestinations.value = destinations.value.filter(dest =>
    dest.name.toLowerCase().includes(query) ||
    dest.description.toLowerCase().includes(query)
  )
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
        <div class="dest-grid">
          <div
            v-for="dest in filteredDestinations"
            :key="dest.id"
            class="dest-card"
          >
            <div class="dest-image">
              <img :src="dest.image" :alt="dest.name" />
              <div class="dest-overlay">
                <button class="btn btn-small btn-white">查看详情</button>
              </div>
            </div>
            <div class="dest-info">
              <h3>{{ dest.name }}</h3>
              <p>{{ dest.description }}</p>
              <div class="dest-actions">
                <button class="btn btn-outline btn-small">添加到行程</button>
                <button class="btn btn-primary btn-small">查看地图</button>
              </div>
            </div>
          </div>
        </div>

        <!-- 地图占位 -->
        <div class="map-placeholder">
          <div class="map-header">
            <h3>交互式地图</h3>
            <p>点击目的地标记查看详细信息</p>
          </div>
          <div class="map-container">
            <div class="map-content">
              <div class="map-mock">
                <div class="map-point" style="top: 30%; left: 70%;">上海</div>
                <div class="map-point" style="top: 25%; left: 50%;">北京</div>
                <div class="map-point" style="top: 40%; left: 40%;">西安</div>
                <div class="map-point" style="top: 55%; left: 45%;">成都</div>
                <div class="map-point" style="top: 60%; left: 65%;">桂林</div>
                <div class="map-point" style="top: 45%; left: 75%;">杭州</div>
              </div>
            </div>
          </div>
          <p class="map-note">注：实际项目中可集成 Leaflet 或百度地图 API</p>
        </div>
      </div>
    </div>
  </AppLayout>
</template>

<style scoped>
.dest-container {
  padding: 40px 0 60px;
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

.map-placeholder {
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

.map-container {
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid #eee;
}

.map-content {
  position: relative;
  background: #f5f7ff;
  height: 400px;
}

.map-mock {
  position: relative;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #e3e9ff 0%, #d1d9ff 100%);
}

.map-point {
  position: absolute;
  background: white;
  padding: 8px 15px;
  border-radius: 20px;
  font-weight: 500;
  color: #4a6cf7;
  box-shadow: 0 3px 10px rgba(74, 108, 247, 0.2);
  cursor: pointer;
  transition: transform 0.2s;
}

.map-point:hover {
  transform: scale(1.1);
  background: #4a6cf7;
  color: white;
}

.map-note {
  text-align: center;
  color: #999;
  font-size: 14px;
  margin-top: 20px;
  margin-bottom: 0;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .dest-container {
    padding: 20px 0 40px;
  }

  .dest-header h1 {
    font-size: 28px;
  }

  .subtitle {
    font-size: 16px;
  }

  .search-box {
    flex-direction: column;
  }

  .dest-grid {
    grid-template-columns: 1fr;
  }

  .map-content {
    height: 300px;
  }
}
</style>