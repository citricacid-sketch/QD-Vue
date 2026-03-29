<script setup lang="ts">
import AppLayout from '@/components/layout/AppLayout.vue'
import { useTravelStore } from '@/stores/travel.store'
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'

const travelStore = useTravelStore()
const router = useRouter()

const activeTab = ref('profile')
const isEditing = ref(false)

// 用户信息表单
const userForm = ref({
  name: travelStore.user.name || '',
  email: travelStore.user.email || '',
  phone: '',
  country: '中国',
  language: '中文',
  notifications: true,
  newsletter: true
})

// 用户头像首字母
const userInitial = computed(() => {
  const name = travelStore.user.name || travelStore.user.email || '游'
  return name.charAt(0).toUpperCase()
})

// 用户统计数据
const userStats = computed(() => ({
  totalTrips: travelStore.tripStats.total,
  ongoingTrips: travelStore.tripStats.ongoing,
  completedTrips: travelStore.tripStats.completed,
  aiChats: 0 // 暂时为0
}))

// 开始编辑
function startEditing() {
  isEditing.value = true
}

// 取消编辑
function cancelEditing() {
  isEditing.value = false
  resetForm()
}

// 保存编辑
function saveEditing() {
  travelStore.updateUserInfo({
    name: userForm.value.name,
    email: userForm.value.email
  })
  isEditing.value = false
}

// 重置表单
function resetForm() {
  userForm.value = {
    name: travelStore.user.name || '',
    email: travelStore.user.email || '',
    phone: '',
    country: '中国',
    language: '中文',
    notifications: true,
    newsletter: true
  }
}

// 登出
function handleLogout() {
  travelStore.logout()
  router.push('/')
}

// 导出数据
function exportData() {
  const data = {
    user: travelStore.user,
    trips: travelStore.trips,
    stats: userStats.value,
    exportDate: new Date().toISOString()
  }

  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `travel-platform-data-${new Date().getTime()}.json`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

// 删除账户
function deleteAccount() {
  if (confirm('确定要删除账户吗？此操作将永久删除您的所有数据且不可恢复。')) {
    // 在实际项目中，这里应该调用删除账户的API
    travelStore.logout()
    travelStore.clearAllTrips()
    router.push('/')
  }
}
</script>

<template>
  <AppLayout>
    <div class="auth-container">
      <div class="container">
        <!-- 用户信息头部 -->
        <div class="user-header">
          <div class="user-avatar-large">
            {{ userInitial }}
          </div>
          <div class="user-info">
            <h1>{{ travelStore.user.name || travelStore.user.email || '旅行者' }}</h1>
            <p class="user-email">{{ travelStore.user.email || '未设置邮箱' }}</p>
            <div class="user-stats">
              <div class="stat-item">
                <span class="stat-number">{{ userStats.totalTrips }}</span>
                <span class="stat-label">行程</span>
              </div>
              <div class="stat-item">
                <span class="stat-number">{{ userStats.ongoingTrips }}</span>
                <span class="stat-label">进行中</span>
              </div>
              <div class="stat-item">
                <span class="stat-number">{{ userStats.completedTrips }}</span>
                <span class="stat-label">已完成</span>
              </div>
              <div class="stat-item">
                <span class="stat-number">{{ userStats.aiChats }}</span>
                <span class="stat-label">AI对话</span>
              </div>
            </div>
          </div>
          <div class="user-actions">
            <button class="btn btn-outline" @click="startEditing" v-if="!isEditing">
              编辑资料
            </button>
            <button class="btn btn-danger" @click="handleLogout">
              退出登录
            </button>
          </div>
        </div>

        <!-- 标签页导航 -->
        <div class="auth-tabs">
          <button
            :class="['tab-button', { active: activeTab === 'profile' }]"
            @click="activeTab = 'profile'"
          >
            个人资料
          </button>
          <button
            :class="['tab-button', { active: activeTab === 'settings' }]"
            @click="activeTab = 'settings'"
          >
            账户设置
          </button>
          <button
            :class="['tab-button', { active: activeTab === 'security' }]"
            @click="activeTab = 'security'"
          >
            安全与隐私
          </button>
          <button
            :class="['tab-button', { active: activeTab === 'data' }]"
            @click="activeTab = 'data'"
          >
            数据管理
          </button>
        </div>

        <!-- 标签页内容 -->
        <div class="tab-content">
          <!-- 个人资料标签页 -->
          <div v-if="activeTab === 'profile'" class="profile-tab">
            <div class="tab-card">
              <h2>基本信息</h2>

              <div v-if="!isEditing" class="info-display">
                <div class="info-row">
                  <span class="info-label">姓名</span>
                  <span class="info-value">{{ travelStore.user.name || '未设置' }}</span>
                </div>
                <div class="info-row">
                  <span class="info-label">邮箱</span>
                  <span class="info-value">{{ travelStore.user.email || '未设置' }}</span>
                </div>
                <div class="info-row">
                  <span class="info-label">手机号</span>
                  <span class="info-value">{{ userForm.phone || '未设置' }}</span>
                </div>
                <div class="info-row">
                  <span class="info-label">国家/地区</span>
                  <span class="info-value">{{ userForm.country }}</span>
                </div>
                <div class="info-row">
                  <span class="info-label">偏好语言</span>
                  <span class="info-value">{{ userForm.language }}</span>
                </div>
              </div>

              <div v-else class="info-edit">
                <div class="form-group">
                  <label for="name">姓名</label>
                  <input
                    id="name"
                    v-model="userForm.name"
                    type="text"
                    placeholder="请输入姓名"
                  />
                </div>
                <div class="form-group">
                  <label for="email">邮箱</label>
                  <input
                    id="email"
                    v-model="userForm.email"
                    type="email"
                    placeholder="请输入邮箱"
                  />
                </div>
                <div class="form-group">
                  <label for="phone">手机号</label>
                  <input
                    id="phone"
                    v-model="userForm.phone"
                    type="tel"
                    placeholder="请输入手机号"
                  />
                </div>
                <div class="form-group">
                  <label for="country">国家/地区</label>
                  <select id="country" v-model="userForm.country">
                    <option value="中国">中国</option>
                    <option value="美国">美国</option>
                    <option value="日本">日本</option>
                    <option value="韩国">韩国</option>
                    <option value="英国">英国</option>
                    <option value="其他">其他</option>
                  </select>
                </div>
                <div class="form-group">
                  <label for="language">偏好语言</label>
                  <select id="language" v-model="userForm.language">
                    <option value="中文">中文</option>
                    <option value="English">English</option>
                    <option value="日本語">日本語</option>
                    <option value="한국어">한국어</option>
                  </select>
                </div>

                <div class="edit-actions">
                  <button class="btn btn-secondary" @click="cancelEditing">
                    取消
                  </button>
                  <button class="btn btn-primary" @click="saveEditing">
                    保存更改
                  </button>
                </div>
              </div>
            </div>

            <div class="tab-card">
              <h2>通知偏好</h2>
              <div class="preferences">
                <label class="checkbox-label">
                  <input v-model="userForm.notifications" type="checkbox" :disabled="!isEditing" />
                  <span>接收行程提醒和通知</span>
                </label>
                <label class="checkbox-label">
                  <input v-model="userForm.newsletter" type="checkbox" :disabled="!isEditing" />
                  <span>接收产品更新和优惠信息</span>
                </label>
              </div>
            </div>
          </div>

          <!-- 账户设置标签页 -->
          <div v-else-if="activeTab === 'settings'" class="settings-tab">
            <div class="tab-card">
              <h2>显示设置</h2>
              <div class="setting-item">
                <span class="setting-label">主题模式</span>
                <div class="setting-control">
                  <select>
                    <option value="light">浅色模式</option>
                    <option value="dark">深色模式</option>
                    <option value="auto">跟随系统</option>
                  </select>
                </div>
              </div>
              <div class="setting-item">
                <span class="setting-label">日期格式</span>
                <div class="setting-control">
                  <select>
                    <option value="zh-CN">YYYY-MM-DD</option>
                    <option value="en-US">MM/DD/YYYY</option>
                    <option value="en-GB">DD/MM/YYYY</option>
                  </select>
                </div>
              </div>
              <div class="setting-item">
                <span class="setting-label">货币单位</span>
                <div class="setting-control">
                  <select>
                    <option value="CNY">人民币 (¥)</option>
                    <option value="USD">美元 ($)</option>
                    <option value="EUR">欧元 (€)</option>
                    <option value="JPY">日元 (¥)</option>
                  </select>
                </div>
              </div>
            </div>

            <div class="tab-card">
              <h2>旅行偏好</h2>
              <div class="setting-item">
                <span class="setting-label">默认行程天数</span>
                <div class="setting-control">
                  <input type="number" min="1" max="30" value="7" />
                </div>
              </div>
              <div class="setting-item">
                <span class="setting-label">默认预算范围</span>
                <div class="setting-control">
                  <select>
                    <option value="economy">经济型</option>
                    <option value="standard" selected>标准型</option>
                    <option value="luxury">豪华型</option>
                  </select>
                </div>
              </div>
              <div class="setting-item">
                <span class="setting-label">偏好的交通方式</span>
                <div class="setting-control">
                  <select>
                    <option value="mixed">混合交通</option>
                    <option value="public">公共交通</option>
                    <option value="private">包车/自驾</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <!-- 安全与隐私标签页 -->
          <div v-else-if="activeTab === 'security'" class="security-tab">
            <div class="tab-card">
              <h2>账户安全</h2>
              <div class="security-item">
                <div class="security-info">
                  <h3>修改密码</h3>
                  <p>定期修改密码以提高账户安全性</p>
                </div>
                <button class="btn btn-outline">修改密码</button>
              </div>
              <div class="security-item">
                <div class="security-info">
                  <h3>双重认证</h3>
                  <p>为账户添加额外的安全保护层</p>
                </div>
                <button class="btn btn-outline">启用</button>
              </div>
              <div class="security-item">
                <div class="security-info">
                  <h3>登录设备管理</h3>
                  <p>查看和管理所有登录过的设备</p>
                </div>
                <button class="btn btn-outline">查看设备</button>
              </div>
            </div>

            <div class="tab-card">
              <h2>隐私设置</h2>
              <div class="privacy-settings">
                <label class="checkbox-label">
                  <input type="checkbox" checked />
                  <span>公开我的行程（仅限链接访问）</span>
                </label>
                <label class="checkbox-label">
                  <input type="checkbox" checked />
                  <span>允许其他用户查看我的旅行足迹</span>
                </label>
                <label class="checkbox-label">
                  <input type="checkbox" />
                  <span>向合作伙伴分享匿名数据以改进服务</span>
                </label>
              </div>
            </div>
          </div>

          <!-- 数据管理标签页 -->
          <div v-else-if="activeTab === 'data'" class="data-tab">
            <div class="tab-card">
              <h2>数据导出</h2>
              <p class="data-description">
                导出您的所有行程数据，包括行程详情、预算信息和AI对话记录。导出的数据为JSON格式，可用于备份或迁移到其他平台。
              </p>
              <button class="btn btn-primary" @click="exportData">
                导出所有数据
              </button>
            </div>

            <div class="tab-card warning-card">
              <h2>账户管理</h2>
              <div class="warning-content">
                <div class="warning-icon">⚠️</div>
                <div class="warning-text">
                  <h3>删除账户</h3>
                  <p>此操作将永久删除您的账户和所有相关数据，包括行程记录、AI对话历史等。此操作不可撤销，请谨慎操作。</p>
                  <p class="warning-tip">建议在删除账户前先导出您的数据。</p>
                </div>
              </div>
              <button class="btn btn-danger" @click="deleteAccount">
                删除我的账户
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </AppLayout>
</template>

<style scoped>
.auth-container {
  padding: 40px 0 60px;
  transition: padding 0.3s ease;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.user-header {
  display: flex;
  gap: 30px;
  align-items: flex-start;
  margin-bottom: 40px;
  padding-bottom: 40px;
  border-bottom: 1px solid #eee;
  transition: all 0.3s ease;
}

.user-avatar-large {
  width: 100px;
  height: 100px;
  background: linear-gradient(135deg, #4a6cf7, #3a5ce5);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 40px;
  font-weight: 600;
  flex-shrink: 0;
}

.user-info {
  flex: 1;
}

.user-info h1 {
  font-size: 32px;
  font-weight: 700;
  color: #222;
  margin-bottom: 5px;
}

.user-email {
  color: #666;
  font-size: 16px;
  margin-bottom: 25px;
}

.user-stats {
  display: flex;
  gap: 30px;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.stat-number {
  font-size: 28px;
  font-weight: 700;
  color: #4a6cf7;
  margin-bottom: 5px;
}

.stat-label {
  font-size: 14px;
  color: #666;
}

.user-actions {
  display: flex;
  flex-direction: column;
  gap: 10px;
  min-width: 120px;
}

.btn {
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
  font-size: 14px;
  text-align: center;
  min-height: 44px;
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

.auth-tabs {
  display: flex;
  gap: 10px;
  margin-bottom: 30px;
  border-bottom: 1px solid #eee;
  padding-bottom: 10px;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
}

.tab-button {
  padding: 12px 25px;
  background: none;
  border: none;
  font-size: 16px;
  font-weight: 500;
  color: #666;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
  border-radius: 8px 8px 0 0;
}

.tab-button:hover {
  color: #4a6cf7;
  background-color: #f5f7ff;
}

.tab-button.active {
  color: #4a6cf7;
  border-bottom: 3px solid #4a6cf7;
  background-color: #f5f7ff;
}

.tab-content {
  display: grid;
  grid-template-columns: 1fr;
  gap: 30px;
}

.tab-card {
  background: white;
  border-radius: 12px;
  padding: 30px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.05);
}

.tab-card h2 {
  font-size: 22px;
  font-weight: 600;
  color: #222;
  margin-bottom: 25px;
}

.info-display {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.info-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 15px;
  border-bottom: 1px solid #f0f0f0;
}

.info-row:last-child {
  border-bottom: none;
}

.info-label {
  font-weight: 500;
  color: #666;
}

.info-value {
  font-weight: 500;
  color: #222;
}

.info-edit {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-group label {
  font-weight: 500;
  color: #333;
  font-size: 14px;
}

.form-group input,
.form-group select {
  padding: 12px 15px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 16px;
  font-family: inherit;
  transition: border-color 0.2s;
}

.form-group input:focus,
.form-group select:focus {
  outline: none;
  border-color: #4a6cf7;
}

.edit-actions {
  display: flex;
  justify-content: flex-end;
  gap: 15px;
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #eee;
}

.preferences {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  color: #333;
}

.checkbox-label input {
  width: auto;
}

.setting-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 0;
  border-bottom: 1px solid #f0f0f0;
}

.setting-item:last-child {
  border-bottom: none;
}

.setting-label {
  font-weight: 500;
  color: #333;
}

.setting-control {
  min-width: 200px;
}

.setting-control select,
.setting-control input {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
  font-family: inherit;
}

.security-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 0;
  border-bottom: 1px solid #f0f0f0;
}

.security-item:last-child {
  border-bottom: none;
}

.security-info h3 {
  font-size: 18px;
  font-weight: 600;
  color: #222;
  margin-bottom: 5px;
}

.security-info p {
  color: #666;
  margin: 0;
}

.privacy-settings {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.data-description {
  color: #666;
  line-height: 1.6;
  margin-bottom: 25px;
}

.warning-card {
  border: 1px solid #fecaca;
  background-color: #fff2f2;
}

.warning-content {
  display: flex;
  gap: 20px;
  margin-bottom: 25px;
}

.warning-icon {
  font-size: 36px;
  flex-shrink: 0;
}

.warning-text h3 {
  font-size: 20px;
  font-weight: 600;
  color: #dc2626;
  margin-bottom: 10px;
}

.warning-text p {
  color: #666;
  margin-bottom: 10px;
  line-height: 1.5;
}

.warning-tip {
  color: #999;
  font-size: 14px;
  font-style: italic;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .auth-container {
    padding: 20px 0 40px;
  }

  .container {
    padding: 0 15px;
  }

  .user-header {
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 20px;
    padding-bottom: 30px;
  }

  .user-avatar-large {
    width: 80px;
    height: 80px;
    font-size: 32px;
  }

  .user-info h1 {
    font-size: 24px;
  }

  .user-email {
    font-size: 14px;
    margin-bottom: 20px;
  }

  .user-stats {
    justify-content: center;
    gap: 20px;
    flex-wrap: wrap;
  }

  .stat-number {
    font-size: 24px;
  }

  .stat-label {
    font-size: 13px;
  }

  .user-actions {
    flex-direction: column;
    width: 100%;
    min-width: auto;
    gap: 10px;
  }

  .user-actions .btn {
    width: 100%;
  }

  .auth-tabs {
    overflow-x: auto;
    padding-bottom: 5px;
  }

  .tab-button {
    padding: 10px 15px;
    font-size: 14px;
  }

  .tab-content {
    gap: 20px;
  }

  .tab-card {
    padding: 20px 15px;
  }

  .tab-card h2 {
    font-size: 20px;
  }

  .info-row {
    padding: 12px 0;
  }

  .info-label {
    font-size: 13px;
  }

  .info-value {
    font-size: 14px;
  }

  .form-group {
    margin-bottom: 20px;
  }

  .form-group label {
    font-size: 13px;
  }

  .form-group input,
  .form-group select {
    padding: 12px 15px;
    font-size: 16px;
  }

  .edit-actions {
    flex-direction: column;
    gap: 10px;
  }

  .edit-actions .btn {
    width: 100%;
  }

  .setting-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }

  .setting-control {
    min-width: auto;
    width: 100%;
  }

  .setting-control input,
  .setting-control select {
    width: 100%;
    padding: 12px 15px;
    font-size: 16px;
  }

  .security-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 15px;
  }

  .security-item .btn {
    width: 100%;
  }

  .data-description {
    font-size: 14px;
  }

  .warning-content {
    flex-direction: column;
    gap: 15px;
    text-align: center;
  }

  .warning-text h3 {
    font-size: 18px;
  }

  .warning-text p {
    font-size: 14px;
  }
}
</style>