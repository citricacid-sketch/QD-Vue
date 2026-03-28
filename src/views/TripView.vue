<script setup lang="ts">
import AppLayout from '@/components/layout/AppLayout.vue'
import { useTravelStore } from '@/stores/travel.store'
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'

const travelStore = useTravelStore()
const router = useRouter()
const activeTab = ref('all')

// 从store加载数据
travelStore.loadFromStorage()

// 根据当前标签页过滤行程
const filteredTrips = computed(() => {
  switch (activeTab.value) {
    case 'ongoing':
      return travelStore.ongoingTrips
    case 'completed':
      return travelStore.completedTrips
    case 'draft':
      return travelStore.draftTrips
    default:
      return travelStore.trips
  }
})

// 格式化日期
function formatDate(dateString: string) {
  if (!dateString) return '未设置'
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

// 跳转到行程详情
function viewTripDetail(tripId: string) {
  router.push(`/trip/${tripId}`)
}

// 创建新行程
function createNewTrip() {
  // 创建一个新行程并跳转到详情页面
  const newTrip = travelStore.saveTrip({
    title: '新建行程',
    start: new Date().toISOString().split('T')[0],
    end: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    status: 'draft',
    source: 'manual'
  })

  router.push(`/trip/${newTrip.id}`)
}

// 删除行程
function deleteTrip(tripId: string, event: Event) {
  event.stopPropagation()
  if (confirm('确定要删除这个行程吗？')) {
    travelStore.deleteTrip(tripId)
  }
}

// 状态标签样式
function getStatusBadgeClass(status: string) {
  switch (status) {
    case 'ongoing':
      return 'badge-ongoing'
    case 'completed':
      return 'badge-completed'
    case 'draft':
      return 'badge-draft'
    default:
      return ''
  }
}

function getStatusText(status: string) {
  switch (status) {
    case 'ongoing':
      return '进行中'
    case 'completed':
      return '已完成'
    case 'draft':
      return '草稿'
    default:
      return status
  }
}
</script>

<template>
  <AppLayout>
    <div class="trip-container">
      <div class="container">
        <div class="trip-header">
          <div class="header-content">
            <h1>行程管理</h1>
            <p class="subtitle">查看完成与未完成行程；AI 或手动创建</p>
          </div>
          <button class="btn btn-primary btn-large" @click="createNewTrip">
            <span class="btn-icon">+</span>
            新建行程
          </button>
        </div>

        <!-- 统计卡片 -->
        <div class="stats-cards">
          <div class="stat-card">
            <div class="stat-number">{{ travelStore.tripStats.total }}</div>
            <div class="stat-label">全部行程</div>
          </div>
          <div class="stat-card">
            <div class="stat-number">{{ travelStore.tripStats.ongoing }}</div>
            <div class="stat-label">进行中</div>
          </div>
          <div class="stat-card">
            <div class="stat-number">{{ travelStore.tripStats.completed }}</div>
            <div class="stat-label">已完成</div>
          </div>
          <div class="stat-card">
            <div class="stat-number">{{ travelStore.tripStats.draft }}</div>
            <div class="stat-label">草稿</div>
          </div>
        </div>

        <!-- 标签页 -->
        <div class="trip-tabs">
          <button
            :class="['tab-button', { active: activeTab === 'all' }]"
            @click="activeTab = 'all'"
          >
            全部 ({{ travelStore.tripStats.total }})
          </button>
          <button
            :class="['tab-button', { active: activeTab === 'ongoing' }]"
            @click="activeTab = 'ongoing'"
          >
            进行中 ({{ travelStore.tripStats.ongoing }})
          </button>
          <button
            :class="['tab-button', { active: activeTab === 'completed' }]"
            @click="activeTab = 'completed'"
          >
            已完成 ({{ travelStore.tripStats.completed }})
          </button>
          <button
            :class="['tab-button', { active: activeTab === 'draft' }]"
            @click="activeTab = 'draft'"
          >
            草稿 ({{ travelStore.tripStats.draft }})
          </button>
        </div>

        <!-- 行程列表 -->
        <div class="trip-list">
          <div v-if="filteredTrips.length === 0" class="empty-state">
            <div class="empty-icon">📋</div>
            <h3>暂无行程</h3>
            <p>还没有创建任何行程，点击"新建行程"开始规划您的旅程。</p>
            <button class="btn btn-primary" @click="createNewTrip">
              创建第一个行程
            </button>
          </div>

          <div v-else class="trip-cards">
            <div
              v-for="trip in filteredTrips"
              :key="trip.id"
              class="trip-card"
              @click="viewTripDetail(trip.id)"
            >
              <div class="trip-card-header">
                <h3>{{ trip.title }}</h3>
                <span :class="['status-badge', getStatusBadgeClass(trip.status)]">
                  {{ getStatusText(trip.status) }}
                </span>
              </div>

              <div class="trip-card-content">
                <div class="trip-dates">
                  <div class="date-item">
                    <span class="date-label">开始:</span>
                    <span class="date-value">{{ formatDate(trip.start) }}</span>
                  </div>
                  <div class="date-item">
                    <span class="date-label">结束:</span>
                    <span class="date-value">{{ formatDate(trip.end) }}</span>
                  </div>
                </div>

                <p v-if="trip.note || trip.description" class="trip-note">
                  {{ trip.note || trip.description }}
                </p>

                <div class="trip-meta">
                  <span class="meta-item">
                    <span class="meta-icon">📅</span>
                    {{ trip.days?.length || 0 }} 天
                  </span>
                  <span class="meta-item">
                    <span class="meta-icon">💰</span>
                    {{ trip.budget?.total ? `¥${trip.budget.total}` : '预算未设置' }}
                  </span>
                  <span class="meta-item">
                    <span class="meta-icon">🚗</span>
                    {{ trip.transportation || '交通未设置' }}
                  </span>
                </div>
              </div>

              <div class="trip-card-actions">
                <button
                  class="btn btn-outline btn-small"
                  @click.stop="viewTripDetail(trip.id)"
                >
                  查看详情
                </button>
                <button
                  class="btn btn-danger btn-small"
                  @click.stop="deleteTrip(trip.id, $event)"
                >
                  删除
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- AI生成提示 -->
        <div class="ai-generate-section">
          <div class="ai-generate-content">
            <div class="ai-icon">🤖</div>
            <div class="ai-text">
              <h4>不知道从哪里开始？</h4>
              <p>让AI为您智能规划行程，根据您的需求生成个性化路线。</p>
            </div>
            <router-link to="/ai" class="btn btn-primary">
              前往AI规划
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </AppLayout>
</template>

<style scoped>
.trip-container {
  padding: 40px 0 60px;
  background: linear-gradient(135deg, #f5f7ff 0%, #e3e9ff 100%);
  min-height: calc(100vh - 140px);
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.trip-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 40px;
  flex-wrap: wrap;
  gap: 20px;
}

.header-content {
  background: white;
  padding: 30px;
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(74, 108, 247, 0.15);
  display: inline-block;
  border: 1px solid #e0e7ff;
}

.header-content h1 {
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

.btn {
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
  font-size: 16px;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.btn-large {
  padding: 15px 30px;
  font-size: 18px;
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

.btn-danger {
  background-color: #f87171;
  color: white;
}

.btn-danger:hover {
  background-color: #ef4444;
}

.btn-small {
  padding: 8px 16px;
  font-size: 14px;
}

.btn-icon {
  margin-right: 8px;
  font-size: 20px;
}

.stats-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 40px;
}

.stat-card {
  background: white;
  border-radius: 12px;
  padding: 25px;
  text-align: center;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.05);
  transition: transform 0.3s;
}

.stat-card:hover {
  transform: translateY(-5px);
}

.stat-number {
  font-size: 36px;
  font-weight: 700;
  color: #4a6cf7;
  margin-bottom: 10px;
}

.stat-label {
  font-size: 16px;
  color: #666;
  font-weight: 500;
}

.trip-tabs {
  display: flex;
  gap: 10px;
  margin-bottom: 30px;
  flex-wrap: wrap;
}

.tab-button {
  padding: 10px 20px;
  background: #f8f9fa;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 500;
  color: #666;
  cursor: pointer;
  transition: all 0.2s;
}

.tab-button:hover {
  background: #e9ecef;
}

.tab-button.active {
  background: #4a6cf7;
  color: white;
}

.trip-list {
  margin-bottom: 40px;
}

.empty-state {
  text-align: center;
  padding: 60px 20px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.05);
}

.empty-icon {
  font-size: 64px;
  margin-bottom: 20px;
}

.empty-state h3 {
  font-size: 24px;
  font-weight: 600;
  color: #333;
  margin-bottom: 10px;
}

.empty-state p {
  color: #666;
  margin-bottom: 30px;
  max-width: 400px;
  margin-left: auto;
  margin-right: auto;
}

.trip-cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 25px;
}

.trip-card {
  background: white;
  border-radius: 12px;
  padding: 25px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.05);
  cursor: pointer;
  transition: all 0.3s;
  border: 1px solid #eee;
}

.trip-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
  border-color: #4a6cf7;
}

.trip-card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 20px;
}

.trip-card-header h3 {
  font-size: 20px;
  font-weight: 600;
  color: #222;
  margin: 0;
  flex: 1;
}

.status-badge {
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.badge-ongoing {
  background: #dcfce7;
  color: #16a34a;
}

.badge-completed {
  background: #dbeafe;
  color: #2563eb;
}

.badge-draft {
  background: #f3f4f6;
  color: #6b7280;
}

.trip-card-content {
  margin-bottom: 20px;
}

.trip-dates {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
  margin-bottom: 15px;
}

.date-item {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.date-label {
  font-size: 12px;
  color: #999;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.date-value {
  font-size: 15px;
  font-weight: 500;
  color: #333;
}

.trip-note {
  color: #666;
  font-size: 14px;
  line-height: 1.5;
  margin: 15px 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.trip-meta {
  display: flex;
  gap: 20px;
  margin-top: 15px;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 14px;
  color: #666;
}

.meta-icon {
  font-size: 16px;
}

.trip-card-actions {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
}

.ai-generate-section {
  background: linear-gradient(135deg, #f5f7ff 0%, #e9eeff 100%);
  border-radius: 12px;
  padding: 30px;
  text-align: center;
}

.ai-generate-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: 800px;
  margin: 0 auto;
}

.ai-icon {
  font-size: 48px;
  margin-right: 20px;
}

.ai-text {
  flex: 1;
  text-align: left;
}

.ai-text h4 {
  font-size: 20px;
  font-weight: 600;
  color: #222;
  margin-bottom: 5px;
}

.ai-text p {
  color: #666;
  margin: 0;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .trip-container {
    padding: 20px 0 40px;
  }

  .trip-header {
    flex-direction: column;
    gap: 20px;
    margin-bottom: 30px;
  }

  .header-content h1 {
    font-size: 28px;
  }

  .subtitle {
    font-size: 16px;
  }

  .stats-cards {
    grid-template-columns: repeat(2, 1fr);
  }

  .trip-cards {
    grid-template-columns: 1fr;
  }

  .ai-generate-content {
    flex-direction: column;
    gap: 20px;
    text-align: center;
  }

  .ai-text {
    text-align: center;
  }

  .trip-dates {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 480px) {
  .stats-cards {
    grid-template-columns: 1fr;
  }
}
</style>