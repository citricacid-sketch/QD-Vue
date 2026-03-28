<script setup lang="ts">
import AppLayout from '@/components/layout/AppLayout.vue'
import { useTravelStore } from '@/stores/travel.store'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const travelStore = useTravelStore()
const router = useRouter()

const username = ref('')
const password = ref('')
const rememberMe = ref(false)
const isLoading = ref(false)
const errorMessage = ref('')
const isLoginMode = ref(true) // true: 登录, false: 注册

async function handleSubmit() {
  if (!username.value.trim() || !password.value.trim()) {
    errorMessage.value = '请输入用户名和密码'
    return
  }

  isLoading.value = true
  errorMessage.value = ''

  try {
    if (isLoginMode.value) {
      // 登录
      const success = travelStore.login(username.value, password.value)
      if (success) {
        // 登录成功，跳转到首页
        router.push('/')
      } else {
        errorMessage.value = '用户名或密码错误'
      }
    } else {
      // 注册（模拟）
      // 在实际项目中，这里应该调用注册API
      const success = travelStore.login(username.value, password.value)
      if (success) {
        // 注册成功，自动登录并跳转到首页
        router.push('/')
      }
    }
  } catch (error) {
    errorMessage.value = '登录失败，请稍后重试'
    console.error('登录失败:', error)
  } finally {
    isLoading.value = false
  }
}

function toggleMode() {
  isLoginMode.value = !isLoginMode.value
  errorMessage.value = ''
}
</script>

<template>
  <AppLayout>
    <div class="login-container">
      <div class="container">
        <div class="login-wrapper">
          <div class="login-card">
            <!-- 登录头部 -->
            <div class="login-header">
              <div class="logo">旅<span>迹</span></div>
              <h1>{{ isLoginMode ? '欢迎回来' : '创建账户' }}</h1>
              <p class="login-subtitle">
                {{ isLoginMode ? '登录您的账户继续使用旅迹服务' : '注册新账户开始规划您的旅程' }}
              </p>
            </div>

            <!-- 登录表单 -->
            <form @submit.prevent="handleSubmit" class="login-form">
              <div class="form-group">
                <label for="username">用户名</label>
                <input
                  id="username"
                  v-model="username"
                  type="text"
                  placeholder="请输入用户名"
                  required
                  :disabled="isLoading"
                />
              </div>

              <div class="form-group">
                <label for="password">密码</label>
                <input
                  id="password"
                  v-model="password"
                  type="password"
                  placeholder="请输入密码"
                  required
                  :disabled="isLoading"
                />
              </div>

              <div v-if="isLoginMode" class="form-options">
                <label class="checkbox-label">
                  <input
                    v-model="rememberMe"
                    type="checkbox"
                    :disabled="isLoading"
                  />
                  <span>记住我</span>
                </label>
                <router-link to="/" class="forgot-password">
                  忘记密码？
                </router-link>
              </div>

              <div v-if="errorMessage" class="error-message">
                {{ errorMessage }}
              </div>

              <button
                type="submit"
                class="btn btn-primary btn-block"
                :disabled="isLoading"
              >
                <span v-if="isLoading">
                  {{ isLoginMode ? '登录中...' : '注册中...' }}
                </span>
                <span v-else>
                  {{ isLoginMode ? '登录' : '注册' }}
                </span>
              </button>

              <div class="mode-toggle">
                <p>
                  {{ isLoginMode ? '还没有账户？' : '已有账户？' }}
                  <button
                    type="button"
                    class="toggle-button"
                    @click="toggleMode"
                    :disabled="isLoading"
                  >
                    {{ isLoginMode ? '立即注册' : '立即登录' }}
                  </button>
                </p>
              </div>

              <div class="login-divider">
                <span>或</span>
              </div>

              <div class="social-login">
                <button type="button" class="btn btn-social btn-wechat">
                  <span class="social-icon">📱</span>
                  微信登录
                </button>
                <button type="button" class="btn btn-social btn-qq">
                  <span class="social-icon">🐧</span>
                  QQ登录
                </button>
              </div>
            </form>

            <!-- 服务条款 -->
            <div class="terms-notice">
              <p>
                注册即表示您同意我们的
                <router-link to="/policy">服务条款</router-link>
                和
                <router-link to="/policy">隐私政策</router-link>
              </p>
            </div>
          </div>

          <!-- 登录页面特色 -->
          <div class="login-features">
            <div class="feature-item">
              <div class="feature-icon">🔒</div>
              <div class="feature-content">
                <h3>安全可靠</h3>
                <p>您的个人信息和数据受到加密保护</p>
              </div>
            </div>
            <div class="feature-item">
              <div class="feature-icon">🌍</div>
              <div class="feature-content">
                <h3>全球覆盖</h3>
                <p>支持全球用户使用，提供多语言服务</p>
              </div>
            </div>
            <div class="feature-item">
              <div class="feature-icon">🤖</div>
              <div class="feature-content">
                <h3>智能助手</h3>
                <p>AI智能规划，为您提供个性化旅行方案</p>
              </div>
            </div>
            <div class="feature-item">
              <div class="feature-icon">📱</div>
              <div class="feature-content">
                <h3>多端同步</h3>
                <p>支持Web、移动端，数据实时同步</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </AppLayout>
</template>

<style scoped>
.login-container {
  padding: 40px 0 80px;
  min-height: 100vh;
  display: flex;
  align-items: center;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.login-wrapper {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 60px;
  align-items: center;
}

.login-card {
  background: white;
  border-radius: 20px;
  padding: 50px 40px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.08);
}

.login-header {
  text-align: center;
  margin-bottom: 40px;
}

.login-header .logo {
  font-size: 36px;
  font-weight: 700;
  color: #333;
  margin-bottom: 20px;
}

.login-header .logo span {
  color: #4a6cf7;
}

.login-header h1 {
  font-size: 32px;
  font-weight: 700;
  color: #222;
  margin-bottom: 10px;
}

.login-subtitle {
  font-size: 16px;
  color: #666;
  margin: 0;
}

.login-form {
  margin-bottom: 30px;
}

.form-group {
  margin-bottom: 25px;
}

.form-group label {
  display: block;
  font-size: 14px;
  font-weight: 500;
  color: #333;
  margin-bottom: 8px;
}

.form-group input {
  width: 100%;
  padding: 15px 20px;
  border: 1px solid #ddd;
  border-radius: 10px;
  font-size: 16px;
  transition: all 0.2s;
  box-sizing: border-box;
}

.form-group input:focus {
  outline: none;
  border-color: #4a6cf7;
  box-shadow: 0 0 0 3px rgba(74, 108, 247, 0.1);
}

.form-group input:disabled {
  background-color: #f8f9fa;
  cursor: not-allowed;
}

.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  font-size: 14px;
  color: #666;
}

.checkbox-label input {
  margin: 0;
  width: auto;
}

.forgot-password {
  color: #4a6cf7;
  text-decoration: none;
  font-size: 14px;
  transition: color 0.2s;
}

.forgot-password:hover {
  color: #3a5ce5;
  text-decoration: underline;
}

.error-message {
  background-color: #fee;
  color: #c33;
  padding: 12px 20px;
  border-radius: 8px;
  margin-bottom: 20px;
  font-size: 14px;
  border: 1px solid #fcc;
}

.btn {
  padding: 15px 30px;
  border-radius: 10px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
  font-size: 16px;
  text-align: center;
}

.btn-block {
  width: 100%;
  display: block;
}

.btn-primary {
  background-color: #4a6cf7;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background-color: #3a5ce5;
}

.btn-primary:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.mode-toggle {
  text-align: center;
  margin: 25px 0;
  color: #666;
}

.mode-toggle p {
  margin: 0;
}

.toggle-button {
  background: none;
  border: none;
  color: #4a6cf7;
  font-weight: 600;
  cursor: pointer;
  padding: 0;
  font-size: inherit;
}

.toggle-button:hover:not(:disabled) {
  text-decoration: underline;
}

.toggle-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.login-divider {
  display: flex;
  align-items: center;
  margin: 30px 0;
  color: #999;
}

.login-divider::before,
.login-divider::after {
  content: '';
  flex: 1;
  height: 1px;
  background-color: #eee;
}

.login-divider span {
  padding: 0 20px;
  font-size: 14px;
}

.social-login {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
}

.btn-social {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  background: #f8f9fa;
  color: #333;
  border: 1px solid #ddd;
}

.btn-social:hover {
  background: #e9ecef;
  border-color: #ccc;
}

.btn-wechat .social-icon {
  color: #07c160;
}

.btn-qq .social-icon {
  color: #12b7f5;
}

.terms-notice {
  text-align: center;
  padding-top: 30px;
  border-top: 1px solid #eee;
  color: #999;
  font-size: 13px;
}

.terms-notice p {
  margin: 0;
}

.terms-notice a {
  color: #4a6cf7;
  text-decoration: none;
}

.terms-notice a:hover {
  text-decoration: underline;
}

.login-features {
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.feature-item {
  display: flex;
  gap: 20px;
  align-items: flex-start;
}

.feature-icon {
  font-size: 36px;
  flex-shrink: 0;
}

.feature-content h3 {
  font-size: 20px;
  font-weight: 600;
  color: #222;
  margin-bottom: 5px;
}

.feature-content p {
  color: #666;
  margin: 0;
  line-height: 1.5;
}

/* 响应式设计 */
@media (max-width: 992px) {
  .login-wrapper {
    grid-template-columns: 1fr;
    gap: 40px;
  }

  .login-features {
    order: -1;
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
  }
}

@media (max-width: 768px) {
  .login-container {
    padding: 20px 0 40px;
  }

  .login-card {
    padding: 30px 25px;
  }

  .login-header h1 {
    font-size: 28px;
  }

  .social-login {
    grid-template-columns: 1fr;
  }

  .login-features {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 480px) {
  .login-header .logo {
    font-size: 28px;
  }

  .form-options {
    flex-direction: column;
    align-items: flex-start;
    gap: 15px;
  }
}
</style>