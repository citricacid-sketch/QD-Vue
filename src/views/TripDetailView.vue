<script setup lang="ts">
import AppLayout from '@/components/layout/AppLayout.vue'
import { useTravelStore } from '@/stores/travel.store'
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const travelStore = useTravelStore()
const route = useRoute()
const router = useRouter()

const tripId = route.params.id as string
const trip = ref(travelStore.currentTrip)
const isEditing = ref(false)
const editedTrip = ref({ ...travelStore.currentTrip })

// 加载行程数据
watch(
  () => travelStore.currentTrip,
  (newTrip) => {
    if (newTrip) {
      trip.value = newTrip
      editedTrip.value = { ...newTrip }
    }
  },
  { immediate: true }
)

// 如果没有当前行程，尝试从trips中查找
if (!trip.value && tripId) {
  const foundTrip = travelStore.trips.find(t => t.id === tripId)
  if (foundTrip) {
    travelStore.setCurrentTrip(tripId)
  }
}

// 计算行程天数
const tripDays = computed(() => {
  if (!trip.value?.start || !trip.value?.end) return 0
  const start = new Date(trip.value.start)
  const end = new Date(trip.value.end)
  const diffTime = Math.abs(end.getTime() - start.getTime())
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1
})

// 格式化日期
function formatDate(dateString: string) {
  if (!dateString) return '未设置'
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long'
  })
}

// 开始编辑
function startEditing() {
  isEditing.value = true
}

// 取消编辑
function cancelEditing() {
  isEditing.value = false
  if (trip.value) {
    editedTrip.value = { ...trip.value }
  }
}

// 保存编辑
function saveEditing() {
  if (editedTrip.value && trip.value) {
    travelStore.saveTrip(editedTrip.value)
    trip.value = editedTrip.value
  }
  isEditing.value = false
}

// 删除行程
function deleteTrip() {
  if (trip.value && confirm('确定要删除这个行程吗？此操作不可恢复。')) {
    travelStore.deleteTrip(tripId)
    router.push('/trip')
  }
}

// 状态选项
const statusOptions = [
  { value: 'draft', label: '草稿' },
  { value: 'ongoing', label: '进行中' },
  { value: 'completed', label: '已完成' }
]

// 来源选项
const sourceOptions = [
  { value: 'manual', label: '手动创建' },
  { value: 'ai', label: 'AI生成' }
]
</script>

<template>
  <AppLayout>
    <div v-if="trip" class="trip-detail-container">
      <div class="container">
        <!-- 头部操作栏 -->
        <div class="detail-header">
          <button class="btn btn-back" @click="router.push('/trip')">
            ← 返回列表
          </button>
          <div class="header-actions">
            <button v-if="!isEditing" class="btn btn-outline" @click="startEditing">
              编辑
            </button>
            <button v-if="!isEditing" class="btn btn-danger" @click="deleteTrip">
              删除
            </button>
            <button v-if="isEditing" class="btn btn-secondary" @click="cancelEditing">
              取消
            </button>
            <button v-if="isEditing" class="btn btn-primary" @click="saveEditing">
              保存
            </button>
          </div>
        </div>

        <!-- 行程标题和状态 -->
        <div class="trip-title-section">
          <div v-if="!isEditing" class="title-display">
            <h1>{{ trip.title }}</h1>
            <span :class="['status-badge', `status-${trip.status}`]">
              {{ trip.status === 'ongoing' ? '进行中' :
                 trip.status === 'completed' ? '已完成' : '草稿' }}
            </span>
          </div>
          <div v-else class="title-edit">
            <input
              v-model="editedTrip.title"
              type="text"
              class="title-input"
              placeholder="行程标题"
            />
            <div class="edit-selects">
              <select v-model="editedTrip.status" class="status-select">
                <option v-for="option in statusOptions" :key="option.value" :value="option.value">
                  {{ option.label }}
                </option>
              </select>
              <select v-model="editedTrip.source" class="source-select">
                <option v-for="option in sourceOptions" :key="option.value" :value="option.value">
                  {{ option.label }}
                </option>
              </select>
            </div>
          </div>
          <p class="trip-subtitle">
            {{ trip.source === 'ai' ? 'AI智能生成' : '手动创建' }} · 共 {{ tripDays }} 天
          </p>
        </div>

        <!-- 行程信息卡片 -->
        <div class="trip-info-cards">
          <div class="info-card">
            <div class="info-card-header">
              <span class="info-icon">📅</span>
              <h3>行程日期</h3>
            </div>
            <div class="info-card-content">
              <div v-if="!isEditing" class="date-display">
                <div class="date-range">
                  <span class="date-label">开始:</span>
                  <span class="date-value">{{ formatDate(trip.start) }}</span>
                </div>
                <div class="date-range">
                  <span class="date-label">结束:</span>
                  <span class="date-value">{{ formatDate(trip.end) }}</span>
                </div>
              </div>
              <div v-else class="date-edit">
                <div class="date-input-group">
                  <label>开始日期</label>
                  <input
                    v-model="editedTrip.start"
                    type="date"
                    class="date-input"
                  />
                </div>
                <div class="date-input-group">
                  <label>结束日期</label>
                  <input
                    v-model="editedTrip.end"
                    type="date"
                    class="date-input"
                  />
                </div>
              </div>
            </div>
          </div>

          <div class="info-card">
            <div class="info-card-header">
              <span class="info-icon">💰</span>
              <h3>预算信息</h3>
            </div>
            <div class="info-card-content">
              <div v-if="trip.budget" class="budget-display">
                <div class="budget-total">
                  总预算: <strong>¥{{ trip.budget.total }}</strong> {{ trip.budget.currency || 'CNY' }}
                </div>
                <div v-if="trip.budget.breakdown" class="budget-breakdown">
                  <div v-for="(amount, category) in trip.budget.breakdown" :key="category"
                       class="budget-item">
                    <span class="budget-category">{{
                      category === 'accommodation' ? '住宿' :
                      category === 'transportation' ? '交通' :
                      category === 'food' ? '餐饮' :
                      category === 'activities' ? '活动' :
                      category === 'shopping' ? '购物' : '其他'
                    }}</span>
                    <span class="budget-amount">¥{{ amount }}</span>
                  </div>
                </div>
              </div>
              <p v-else class="no-data">未设置预算</p>
            </div>
          </div>

          <div class="info-card">
            <div class="info-card-header">
              <span class="info-icon">🚗</span>
              <h3>交通方式</h3>
            </div>
            <div class="info-card-content">
              <p v-if="trip.transportation">{{ trip.transportation }}</p>
              <p v-else class="no-data">未设置交通方式</p>
            </div>
          </div>
        </div>

        <!-- 行程描述/备注 -->
        <div class="trip-description-section">
          <h2>行程描述</h2>
          <div v-if="!isEditing" class="description-display">
            <p v-if="trip.note || trip.description">{{ trip.note || trip.description }}</p>
            <p v-else class="no-data">暂无描述</p>
          </div>
          <div v-else class="description-edit">
            <textarea
              v-model="editedTrip.note"
              placeholder="请输入行程描述..."
              rows="4"
              class="description-textarea"
            ></textarea>
          </div>
        </div>

        <!-- 每日行程 -->
        <div class="daily-schedule-section">
          <div class="section-header">
            <h2>每日安排</h2>
            <button class="btn btn-primary btn-small">
              + 添加日程
            </button>
          </div>

          <div v-if="trip.days && trip.days.length > 0" class="days-list">
            <div v-for="day in trip.days" :key="day.label" class="day-card">
              <div class="day-header">
                <h3>{{ day.label }}</h3>
                <span class="day-date">{{ formatDate(day.date) }}</span>
              </div>
              <div v-if="day.slots && day.slots.length > 0" class="day-slots">
                <div v-for="slot in day.slots" :key="slot.time" class="slot-item">
                  <div class="slot-time">
                    {{ slot.time }} - {{ slot.end }}
                  </div>
                  <div class="slot-content">
                    <div class="slot-text">{{ slot.text }}</div>
                    <div v-if="slot.note" class="slot-note">{{ slot.note }}</div>
                  </div>
                </div>
              </div>
              <p v-else class="no-data">暂无安排</p>
            </div>
          </div>
          <div v-else class="empty-schedule">
            <div class="empty-icon">📅</div>
            <h3>暂无每日安排</h3>
            <p>点击"添加日程"开始规划您的每日行程。</p>
          </div>
        </div>

        <!-- 创建时间和更新时间 -->
        <div class="trip-meta-info">
          <p v-if="trip.createdAt">创建时间: {{ new Date(trip.createdAt).toLocaleString('zh-CN') }}</p>
          <p v-if="trip.updatedAt">更新时间: {{ new Date(trip.updatedAt).toLocaleString('zh-CN') }}</p>
        </div>
      </div>
    </div>

    <!-- 行程不存在的情况 -->
    <div v-else class="trip-not-found">
      <div class="container">
        <div class="not-found-content">
          <div class="not-found-icon">❌</div>
          <h2>行程不存在</h2>
          <p>您访问的行程可能已被删除或不存在。</p>
          <button class="btn btn-primary" @click="router.push('/trip')">
            返回行程列表
          </button>
        </div>
      </div>
    </div>
  </AppLayout>
</template>

<style scoped>
.trip-detail-container,
.trip-not-found {
  padding: 40px 0 60px;
}

.container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 0 20px;
}

.detail-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

.btn {
  padding: 10px 20px;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
  font-size: 14px;
}

.btn-back {
  background: none;
  color: #4a6cf7;
  padding: 10px 0;
}

.btn-back:hover {
  color: #3a5ce5;
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

.btn-primary {
  background-color: #4a6cf7;
  color: white;
}

.btn-primary:hover {
  background-color: #3a5ce5;
}

.btn-secondary {
  background-color: #6b7280;
  color: white;
}

.btn-secondary:hover {
  background-color: #4b5563;
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

.header-actions {
  display: flex;
  gap: 10px;
}

.trip-title-section {
  margin-bottom: 40px;
}

.title-display {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 10px;
}

.title-display h1 {
  font-size: 36px;
  font-weight: 700;
  color: #222;
  margin: 0;
}

.status-badge {
  padding: 6px 15px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 600;
}

.status-draft {
  background: #f3f4f6;
  color: #6b7280;
}

.status-ongoing {
  background: #dcfce7;
  color: #16a34a;
}

.status-completed {
  background: #dbeafe;
  color: #2563eb;
}

.title-edit {
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-bottom: 10px;
}

.title-input {
  padding: 15px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 24px;
  font-weight: 600;
  color: #222;
  font-family: inherit;
}

.title-input:focus {
  outline: none;
  border-color: #4a6cf7;
}

.edit-selects {
  display: flex;
  gap: 15px;
}

.status-select,
.source-select {
  padding: 10px 15px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
  font-family: inherit;
}

.trip-subtitle {
  font-size: 16px;
  color: #666;
  margin: 0;
}

.trip-info-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 25px;
  margin-bottom: 40px;
}

.info-card {
  background: white;
  border-radius: 12px;
  padding: 25px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.05);
}

.info-card-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 20px;
}

.info-icon {
  font-size: 24px;
}

.info-card-header h3 {
  font-size: 18px;
  font-weight: 600;
  color: #222;
  margin: 0;
}

.info-card-content {
  color: #333;
}

.date-display {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.date-range {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.date-label {
  font-size: 14px;
  color: #666;
}

.date-value {
  font-size: 16px;
  font-weight: 500;
}

.date-edit {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.date-input-group {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.date-input-group label {
  font-size: 14px;
  color: #666;
}

.date-input {
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 16px;
  font-family: inherit;
}

.date-input:focus {
  outline: none;
  border-color: #4a6cf7;
}

.budget-display {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.budget-total {
  font-size: 18px;
  color: #222;
}

.budget-breakdown {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.budget-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid #eee;
}

.budget-item:last-child {
  border-bottom: none;
}

.budget-category {
  color: #666;
}

.budget-amount {
  font-weight: 500;
  color: #222;
}

.no-data {
  color: #999;
  font-style: italic;
  margin: 0;
}

.trip-description-section {
  background: white;
  border-radius: 12px;
  padding: 30px;
  margin-bottom: 40px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.05);
}

.trip-description-section h2 {
  font-size: 24px;
  font-weight: 600;
  color: #222;
  margin-bottom: 20px;
}

.description-display p {
  color: #333;
  line-height: 1.6;
  margin: 0;
}

.description-textarea {
  width: 100%;
  padding: 15px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 16px;
  font-family: inherit;
  resize: vertical;
  min-height: 100px;
}

.description-textarea:focus {
  outline: none;
  border-color: #4a6cf7;
}

.daily-schedule-section {
  background: white;
  border-radius: 12px;
  padding: 30px;
  margin-bottom: 40px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.05);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

.section-header h2 {
  font-size: 24px;
  font-weight: 600;
  color: #222;
  margin: 0;
}

.days-list {
  display: flex;
  flex-direction: column;
  gap: 25px;
}

.day-card {
  border: 1px solid #eee;
  border-radius: 8px;
  padding: 20px;
}

.day-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 1px solid #eee;
}

.day-header h3 {
  font-size: 18px;
  font-weight: 600;
  color: #222;
  margin: 0;
}

.day-date {
  color: #666;
  font-size: 14px;
}

.day-slots {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.slot-item {
  display: flex;
  gap: 20px;
}

.slot-time {
  flex-shrink: 0;
  width: 120px;
  padding: 10px;
  background: #f5f7ff;
  border-radius: 6px;
  text-align: center;
  font-weight: 500;
  color: #4a6cf7;
}

.slot-content {
  flex: 1;
}

.slot-text {
  font-weight: 500;
  color: #222;
  margin-bottom: 5px;
}

.slot-note {
  color: #666;
  font-size: 14px;
}

.empty-schedule {
  text-align: center;
  padding: 40px 20px;
}

.empty-icon {
  font-size: 48px;
  margin-bottom: 15px;
}

.empty-schedule h3 {
  font-size: 20px;
  font-weight: 600;
  color: #333;
  margin-bottom: 10px;
}

.empty-schedule p {
  color: #666;
  margin: 0 0 20px;
}

.trip-meta-info {
  text-align: center;
  color: #999;
  font-size: 14px;
}

.trip-meta-info p {
  margin: 5px 0;
}

.trip-not-found .container {
  max-width: 500px;
}

.not-found-content {
  text-align: center;
  padding: 60px 20px;
}

.not-found-icon {
  font-size: 64px;
  margin-bottom: 20px;
}

.not-found-content h2 {
  font-size: 28px;
  font-weight: 600;
  color: #222;
  margin-bottom: 10px;
}

.not-found-content p {
  color: #666;
  margin-bottom: 30px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .trip-detail-container,
  .trip-not-found {
    padding: 20px 0 40px;
  }

  .title-display h1 {
    font-size: 28px;
  }

  .title-input {
    font-size: 20px;
  }

  .trip-info-cards {
    grid-template-columns: 1fr;
  }

  .section-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 15px;
  }

  .slot-item {
    flex-direction: column;
    gap: 10px;
  }

  .slot-time {
    width: auto;
    text-align: left;
  }

  .edit-selects {
    flex-direction: column;
  }
}
</style>