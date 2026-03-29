<script setup lang="ts">
import { RouterLink } from 'vue-router'

defineProps<{
  isAuthenticated: boolean
  userDisplayName: string
  userInitial: string
  isMobileMenuOpen: boolean
}>()

defineEmits<{
  'toggle-mobile-menu': []
  'logout': []
}>()
</script>

<template>
  <header class="site-header">
    <div class="container header-inner">
      <!-- Logo -->
      <RouterLink to="/" class="logo">
        旅<span>迹</span>
      </RouterLink>

      <!-- 移动端菜单按钮 -->
      <button
        type="button"
        class="nav-toggle"
        :aria-label="isMobileMenuOpen ? '关闭菜单' : '打开菜单'"
        @click="$emit('toggle-mobile-menu')"
      >
        <span class="nav-toggle-line"></span>
        <span class="nav-toggle-line"></span>
        <span class="nav-toggle-line"></span>
      </button>

      <!-- 主导航 -->
      <nav class="main-nav" :class="{ 'is-open': isMobileMenuOpen }">
        <RouterLink to="/ai" @click="$emit('toggle-mobile-menu')">
          AI 智能规划
        </RouterLink>
        <RouterLink to="/dest" @click="$emit('toggle-mobile-menu')">
          目的地
        </RouterLink>
        <RouterLink to="/trip" @click="$emit('toggle-mobile-menu')">
          行程管理
        </RouterLink>
        <RouterLink to="/policy" @click="$emit('toggle-mobile-menu')">
          旅行政策
        </RouterLink>

        <!-- 移动端认证链接 -->
        <RouterLink
          v-if="!isAuthenticated"
          to="/login"
          class="nav-auth-mobile"
          @click="$emit('toggle-mobile-menu')"
        >
          登录 / 注册
        </RouterLink>
        <RouterLink
          v-else
          to="/auth"
          class="nav-auth-mobile nav-auth-profile"
          @click="$emit('toggle-mobile-menu')"
        >
          个人中心
        </RouterLink>
      </nav>

      <!-- 桌面端认证区域 -->
      <div class="header-auth">
        <RouterLink
          v-if="!isAuthenticated"
          to="/login"
          class="btn btn-primary btn-sm header-cta"
        >
          登录 / 注册
        </RouterLink>

        <div v-else class="user-menu">
          <button
            type="button"
            class="user-menu-trigger"
            aria-expanded="false"
            aria-haspopup="true"
            aria-label="打开账户菜单"
          >
            <span class="user-avatar">
              <span>{{ userInitial }}</span>
            </span>
          </button>
          <div class="user-menu-dropdown" role="menu">
            <div class="user-menu-header">
              <span class="user-menu-name">{{ userDisplayName }}</span>
            </div>
            <RouterLink to="/auth" role="menuitem">个人中心</RouterLink>
            <button
              type="button"
              class="user-menu-logout"
              role="menuitem"
              @click="$emit('logout')"
            >
              退出登录
            </button>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<style scoped>
.site-header {
  background-color: #fff;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  position: sticky;
  top: 0;
  z-index: 100;
}

.container {
  width: 100%;
  margin: 0 auto;
  padding: 0 20px;
}

.header-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 70px;
}

.logo {
  font-size: 24px;
  font-weight: 700;
  color: #333;
  text-decoration: none;
}

.logo span {
  color: #4a6cf7;
}

.nav-toggle {
  display: none;
  background: none;
  border: none;
  cursor: pointer;
  padding: 10px;
}

.nav-toggle-line {
  display: block;
  width: 22px;
  height: 2px;
  background-color: #333;
  margin: 4px 0;
  transition: all 0.3s ease;
  transform-origin: center;
}

.main-nav {
  display: flex;
  gap: 30px;
  align-items: center;
}

.main-nav a {
  color: #555;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s;
}

.main-nav a:hover,
.main-nav a.router-link-active {
  color: #4a6cf7;
}

.nav-auth-mobile {
  display: none;
}

.header-auth {
  display: flex;
  align-items: center;
}

.btn {
  padding: 8px 20px;
  border-radius: 6px;
  font-weight: 500;
  text-decoration: none;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
  font-size: 14px;
}

.btn-primary {
  background-color: #4a6cf7;
  color: white;
}

.btn-primary:hover {
  background-color: #3a5ce5;
}

.btn-sm {
  padding: 6px 16px;
}

.user-menu {
  position: relative;
}

.user-menu-trigger {
  background: none;
  border: none;
  cursor: pointer;
  padding: 5px;
}

.user-avatar {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  background-color: #4a6cf7;
  color: white;
  border-radius: 50%;
  font-weight: 600;
}

.user-menu-dropdown {
  position: absolute;
  top: 100%;
  right: 0;
  background: white;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  padding: 10px 0;
  min-width: 180px;
  opacity: 0;
  visibility: hidden;
  transform: translateY(10px);
  transition: all 0.2s;
}

.user-menu:hover .user-menu-dropdown {
  opacity: 1;
  visibility: visible;
  transform: translateY(0);
}

.user-menu-header {
  padding: 10px 15px;
  border-bottom: 1px solid #eee;
  margin-bottom: 5px;
}

.user-menu-name {
  font-weight: 600;
  color: #333;
}

.user-menu-dropdown a,
.user-menu-logout {
  display: block;
  padding: 8px 15px;
  color: #555;
  text-decoration: none;
  background: none;
  border: none;
  width: 100%;
  text-align: left;
  cursor: pointer;
  transition: background-color 0.2s;
}

.user-menu-dropdown a:hover,
.user-menu-logout:hover {
  background-color: #f5f7ff;
  color: #4a6cf7;
}

/* 汉堡菜单动画 */
.nav-toggle:hover .nav-toggle-line:nth-child(1) {
  transform: translateY(1px);
}

.nav-toggle:hover .nav-toggle-line:nth-child(3) {
  transform: translateY(-1px);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .nav-toggle {
    display: block;
    padding: 8px;
  }

  .nav-toggle-line {
    width: 24px;
    height: 2px;
  }

  .main-nav {
    position: fixed;
    top: 70px;
    left: 0;
    right: 0;
    background: white;
    flex-direction: column;
    padding: 20px;
    box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
    transform: translateY(-100%);
    opacity: 0;
    visibility: hidden;
    transition: all 0.3s ease;
    gap: 0;
    max-height: calc(100vh - 70px);
    overflow-y: auto;
  }

  .main-nav a {
    padding: 15px 0;
    border-bottom: 1px solid #f0f0f0;
    font-size: 16px;
  }

  .main-nav a:last-child {
    border-bottom: none;
  }

  .main-nav.is-open {
    transform: translateY(0);
    opacity: 1;
    visibility: visible;
  }

  .nav-auth-mobile {
    display: block;
    margin-top: 10px;
    padding: 15px 0;
    border-top: 1px solid #eee;
    font-size: 16px;
    font-weight: 600;
  }

  .header-auth .btn {
    display: none;
  }

  .user-menu {
    display: none;
  }
}
</style>