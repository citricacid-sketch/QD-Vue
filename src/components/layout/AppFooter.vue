<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>

<template>
  <footer class="site-footer">
    <div class="container footer-inner">
      <div class="footer-brand">
        <RouterLink to="/" class="logo">
          旅<span>迹</span>
        </RouterLink>
        <p>五大模块 · 服务来华与境内智慧旅行。</p>
      </div>

      <div class="footer-links">
        <RouterLink to="/">首页</RouterLink>
        <RouterLink to="/auth">个人中心</RouterLink>
        <RouterLink to="/ai">AI 智能规划</RouterLink>
        <RouterLink to="/dest">目的地</RouterLink>
        <RouterLink to="/trip">行程</RouterLink>
        <RouterLink to="/policy">政策</RouterLink>
      </div>

      <p class="footer-copy">© 2025 旅迹</p>
    </div>
  </footer>
</template>

<style scoped>
.site-footer {
  background-color: #f8f9fa;
  padding: 40px 0 20px;
  margin-top: auto;
}

.footer-inner {
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.footer-brand {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.footer-brand .logo {
  font-size: 24px;
  font-weight: 700;
  color: #333;
  text-decoration: none;
}

.footer-brand .logo span {
  color: #4a6cf7;
}

.footer-brand p {
  color: #666;
  font-size: 14px;
  margin: 0;
}

.footer-links {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}

.footer-links a {
  color: #666;
  text-decoration: none;
  font-size: 14px;
  transition: color 0.2s;
}

.footer-links a:hover {
  color: #4a6cf7;
}

.footer-copy {
  color: #999;
  font-size: 13px;
  text-align: center;
  padding-top: 20px;
  border-top: 1px solid #eee;
  margin: 0;
}

/* 响应式设计 */
@media (min-width: 768px) {
  .footer-inner {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }

  .footer-brand {
    max-width: 300px;
  }

  .footer-links {
    order: 3;
  }

  .footer-copy {
    order: 2;
    border-top: none;
    padding-top: 0;
  }
}
</style>