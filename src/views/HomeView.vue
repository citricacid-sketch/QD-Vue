<script setup lang="ts">
import AppLayout from '@/components/layout/AppLayout.vue'
</script>

<template>
  <AppLayout>
    <div class="home-container">
      <!-- Hero区域 -->
      <section class="hero">
        <div class="hero-bg"></div>
        <div class="hero-content">
          <p class="hero-tag">一站式 · 智能 · 可信</p>
          <h1>探索中国，从旅迹开始</h1>
          <p class="hero-lead">账号与资料、AI 路线规划、目的地百科、行程管理与在华旅行政策，五大模块协同，让每一次旅程更清晰、更省心。</p>
          <div class="hero-actions">
            <router-link to="/ai" class="btn btn-primary">开始智能规划</router-link>
          </div>
        </div>

        <!-- 五大核心模块 -->
        <div class="modules-overview">
          <h2 class="section-title">五大核心模块</h2>
          <div class="module-grid">
            <router-link to="/auth" class="module-card">
              <div class="module-image">
                <div class="module-icon">👤</div>
              </div>
              <div class="module-content">
                <h3>用户认证与个人中心</h3>
                <p>账号管理、身份认证与个人资料维护。</p>
              </div>
            </router-link>
            <router-link to="/ai" class="module-card highlight">
              <div class="module-image">
                <div class="module-icon">🤖</div>
              </div>
              <div class="module-content">
                <h3>AI 智能规划</h3>
                <p>文字、语音、图片对话，路线推荐与方案优化。</p>
              </div>
            </router-link>
            <router-link to="/dest" class="module-card">
              <div class="module-image">
                <div class="module-icon">🗺️</div>
              </div>
              <div class="module-content">
                <h3>目的地管理</h3>
                <p>地图搜索与展示，目的地查询与管理。</p>
              </div>
            </router-link>
            <router-link to="/trip" class="module-card">
              <div class="module-image">
                <div class="module-icon">📅</div>
              </div>
              <div class="module-content">
                <h3>行程管理</h3>
                <p>查看完成与未完成行程；AI 或手动创建。</p>
              </div>
            </router-link>
            <router-link to="/policy" class="module-card">
              <div class="module-image">
                <div class="module-icon">📋</div>
              </div>
              <div class="module-content">
                <h3>旅行政策</h3>
                <p>签证与入境规定等官方政策指引。</p>
              </div>
            </router-link>
          </div>
        </div>
      </section>
    </div>
  </AppLayout>
</template>

<style scoped>
.home-container {
  width: 100%;
  height: 100%;
  min-height: 600px;
  display: flex;
  flex-direction: column;
}

.hero {
  position: relative;
  width: 100%;
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.hero-bg {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, #f5f7ff 0%, #e3e9ff 100%);
  z-index: -1;
}

.hero-bg::after {
  content: '';
  position: absolute;
  top: -50%;
  right: -50%;
  width: 100%;
  height: 200%;
  background: radial-gradient(circle, rgba(74, 108, 247, 0.1) 0%, transparent 70%);
}

.hero-content {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 60px 40px 40px;
  text-align: center;
  position: relative;
  z-index: 1;
  background: rgba(255, 255, 255, 0.1);
}

.hero-tag {
  display: inline-block;
  background: rgba(74, 108, 247, 0.1);
  color: #4a6cf7;
  padding: 6px 15px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 20px;
}

.hero h1 {
  font-size: 48px;
  font-weight: 700;
  color: #222;
  margin-bottom: 20px;
  line-height: 1.2;
  transition: font-size 0.3s ease;
}

.hero-lead {
  font-size: 18px;
  color: #555;
  max-width: 700px;
  margin: 0 auto 40px;
  line-height: 1.6;
  transition: font-size 0.3s ease;
}

.hero-actions {
  display: flex;
  gap: 15px;
  justify-content: center;
  flex-wrap: wrap;
}

.btn {
  padding: 12px 30px;
  border-radius: 8px;
  font-weight: 500;
  text-decoration: none;
  cursor: pointer;
  transition: all 0.2s;
  border: 2px solid transparent;
  font-size: 16px;
  display: inline-block;
  min-height: 44px;
  min-width: 120px;
}

.btn-primary {
  background-color: #4a6cf7;
  color: white;
}

.btn-primary:hover {
  background-color: #3a5ce5;
}

.modules-overview {
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 40px 20px;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
}

.section-title {
  font-size: 36px;
  font-weight: 700;
  color: #222;
  text-align: center;
  margin-bottom: 40px;
}

.module-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  margin: 0 auto;
  max-width: 100%;
}

.module-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.05);
  text-decoration: none;
  color: inherit;
  transition: all 0.3s;
  border: 1px solid #eee;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.module-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
  border-color: #4a6cf7;
}

.module-card.highlight {
  border-color: #4a6cf7;
  box-shadow: 0 5px 20px rgba(74, 108, 247, 0.15);
}

.module-image {
  background: linear-gradient(135deg, #4a6cf7 0%, #3a5ce5 100%);
  padding: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 120px;
}

.module-card.highlight .module-image {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
}

.module-icon {
  font-size: 48px;
  color: white;
}

.module-content {
  padding: 20px;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.module-card h3 {
  font-size: 18px;
  font-weight: 600;
  color: #222;
  margin-bottom: 8px;
}

.module-card p {
  color: #666;
  font-size: 14px;
  line-height: 1.5;
  margin: 0;
  flex: 1;
}

/* 响应式设计 */
@media (max-width: 1024px) {
  .hero h1 {
    font-size: 36px;
  }

  .hero-lead {
    font-size: 16px;
  }

  .module-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .btn {
    padding: 10px 24px;
    font-size: 15px;
  }
}

@media (max-width: 768px) {
  .hero {
    flex-direction: column;
  }

  .hero-content {
    padding: 30px 20px;
  }

  .hero h1 {
    font-size: 28px;
  }

  .hero-lead {
    font-size: 14px;
    max-width: 100%;
    margin: 0 auto 30px;
  }

  .hero-actions {
    width: 100%;
  }

  .btn {
    width: 100%;
    padding: 14px 20px;
    font-size: 16px;
  }

  .modules-overview {
    padding: 20px 15px;
  }

  .section-title {
    font-size: 24px;
    margin-bottom: 30px;
  }

  .module-grid {
    grid-template-columns: 1fr;
    gap: 15px;
  }

  .module-card {
    height: auto;
  }

  .module-image {
    padding: 20px;
    min-height: 100px;
  }

  .module-icon {
    font-size: 36px;
  }

  .module-content {
    padding: 15px;
  }

  .module-card h3 {
    font-size: 16px;
  }

  .module-card p {
    font-size: 13px;
  }
}
</style>
