<template>
  <div class="not-found">
    <div class="not-found-content">
      <h1>404</h1>
      <p>页面未找到</p>
      <p class="description">您访问的页面不存在或已被移除</p>
      <div class="actions">
        <el-button type="primary" @click="$router.push('/')">返回首页</el-button>
        <el-button @click="$router.go(-1)">返回上一页</el-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()
</script>

<style scoped>
.not-found {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 70vh;
  text-align: center;
  padding: 20px;
}

.not-found-content {
  max-width: 500px;
}

.not-found h1 {
  font-size: 6rem;
  margin: 0;
  color: var(--el-color-primary);
  font-weight: bold;
}

.not-found p {
  font-size: 1.5rem;
  margin: 10px 0;
  color: var(--el-text-color-regular);
}

.not-found .description {
  font-size: 1rem;
  color: var(--el-text-color-secondary);
  margin-bottom: 30px;
}

.not-found .actions {
  display: flex;
  gap: 15px;
  justify-content: center;
  margin-top: 20px;
}
</style>