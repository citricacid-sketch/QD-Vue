<script setup lang="ts">
import { ref, computed } from 'vue'
import { useTravelStore } from '@/stores/travel.store'
import AppHeader from './AppHeader.vue'
import AppFooter from './AppFooter.vue'

const travelStore = useTravelStore()
const isMobileMenuOpen = ref(false)

// 计算用户显示名称
const userDisplayName = computed(() => {
  return travelStore.user.name || travelStore.user.email || '旅行者'
})

// 用户头像首字母
const userInitial = computed(() => {
  const name = travelStore.user.name || travelStore.user.email || '游'
  return name.charAt(0).toUpperCase()
})

// 切换移动菜单
function toggleMobileMenu() {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}

// 关闭移动菜单
function closeMobileMenu() {
  isMobileMenuOpen.value = false
}

// 用户登出
function handleLogout() {
  travelStore.logout()
  // 跳转到首页
  window.location.href = '/'
}
</script>

<template>
  <div class="app-layout">
    <AppHeader
      :is-authenticated="travelStore.isAuthenticated"
      :user-display-name="userDisplayName"
      :user-initial="userInitial"
      :is-mobile-menu-open="isMobileMenuOpen"
      @toggle-mobile-menu="toggleMobileMenu"
      @logout="handleLogout"
    />

    <main class="main-content" @click="closeMobileMenu">
      <slot></slot>
    </main>

    <AppFooter />
  </div>
</template>

<style scoped>
.app-layout {
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
}

.main-content {
  flex: 1;
  overflow-y: auto;
  position: relative;
}
</style>