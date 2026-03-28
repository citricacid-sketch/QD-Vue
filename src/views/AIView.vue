<script setup lang="ts">
import AppLayout from '@/components/layout/AppLayout.vue'
import { ref } from 'vue'
import { useTravelStore } from '@/stores/travel.store'
import { marked } from 'marked'

const travelStore = useTravelStore()
const message = ref('')
const isLoading = ref(false)
const chatHistory = ref<Array<{ sender: string; content: string }>>([])

// 将Markdown转换为HTML
const renderMarkdown = (content: string) => {
  return marked(content)
}

async function sendMessage() {
  if (!message.value.trim()) return

  const userMessage = message.value.trim()
  chatHistory.value.push({ sender: 'user', content: userMessage })
  const currentMessage = userMessage

  message.value = ''
  isLoading.value = true

  try {
    const response = await travelStore.chatWithAI(currentMessage)
    chatHistory.value.push({ sender: 'ai', content: response })
  } catch (error) {
    chatHistory.value.push({ sender: 'ai', content: '抱歉，AI暂时无法响应，请稍后再试。' })
  } finally {
    isLoading.value = false
  }
}

function clearChat() {
  chatHistory.value = []
}

function startNewChat() {
  travelStore.resetSession()
  chatHistory.value = []
}
</script>

<template>
  <AppLayout>
    <div class="ai-chat-container">
      <div class="container">
        <div class="ai-chat-header">
          <div class="header-content">
            <h1>AI 智能规划</h1>
            <p class="subtitle">文字、语音、图片对话，路线推荐与方案优化</p>
          </div>
          <div class="header-actions">
            <button class="btn btn-outline" @click="startNewChat">
              <span>+</span> 新会话
            </button>
          </div>
        </div>

        <div class="ai-chat-main">
          <!-- 聊天历史 -->
          <div class="chat-history">
            <div v-if="chatHistory.length === 0" class="empty-chat">
              <div class="empty-icon">🤖</div>
              <h3>开始与AI对话</h3>
              <p>告诉我您的旅行需求，我会为您推荐合适的路线和方案。</p>
              <div class="example-prompts">
                <p>例如：</p>
                <ul>
                  <li>"我想去上海玩3天，有什么推荐？"</li>
                  <li>"帮我规划一个北京5日游的行程"</li>
                  <li>"云南旅游的最佳季节是什么时候？"</li>
                </ul>
              </div>
            </div>

            <div v-else class="chat-messages">
              <div
                v-for="(msg, index) in chatHistory"
                :key="index"
                :class="['chat-message', `chat-message-${msg.sender}`]"
              >
                <div class="message-avatar">
                  <span v-if="msg.sender === 'user'">👤</span>
                  <span v-else>🤖</span>
                </div>
                <div class="message-content">
                  <div class="message-text" v-html="renderMarkdown(msg.content)"></div>
                  <div class="message-time">{{ new Date().toLocaleTimeString() }}</div>
                </div>
              </div>
            </div>
          </div>

          <!-- 输入区域 -->
          <div class="chat-input-area">
            <div class="input-wrapper">
              <textarea
                v-model="message"
                placeholder="告诉我您的旅行需求..."
                rows="3"
                @keydown.enter.exact.prevent="sendMessage"
              ></textarea>
              <div class="input-actions">
                <button
                  class="btn btn-secondary"
                  @click="clearChat"
                  :disabled="chatHistory.length === 0"
                >
                  清空对话
                </button>
                <div class="action-group">
                  <button
                    class="btn btn-icon"
                    title="发送图片"
                  >
                    📷
                  </button>
                  <button
                    class="btn btn-icon"
                    title="发送语音"
                  >
                    🎤
                  </button>
                  <button
                    class="btn btn-primary"
                    @click="sendMessage"
                    :disabled="!message.trim() || isLoading"
                  >
                    <span v-if="isLoading">发送中...</span>
                    <span v-else>发送消息</span>
                  </button>
                </div>
              </div>
            </div>
            <p class="input-hint">
              按 Enter 发送，Shift + Enter 换行
            </p>
          </div>
        </div>
      </div>
    </div>
  </AppLayout>
</template>

<style scoped>
.ai-chat-container {
  padding: 40px 0 60px;
  background: linear-gradient(135deg, #f5f7ff 0%, #e3e9ff 100%);
  min-height: calc(100vh - 140px);
}

.container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 0 20px;
}

.ai-chat-header {
  text-align: center;
  margin-bottom: 40px;
  position: relative;
}

.header-content {
  background: white;
  padding: 30px;
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(74, 108, 247, 0.15);
  display: inline-block;
  border: 1px solid #e0e7ff;
}

.ai-chat-header h1 {
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

.ai-chat-main {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.chat-history {
  background: white;
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
  padding: 30px;
  min-height: 400px;
  max-height: 600px;
  overflow-y: auto;
  border: 1px solid #e0e7ff;
}

.empty-chat {
  text-align: center;
  padding: 60px 20px;
}

.empty-icon {
  font-size: 64px;
  margin-bottom: 20px;
}

.empty-chat h3 {
  font-size: 24px;
  font-weight: 600;
  color: #333;
  margin-bottom: 10px;
}

.empty-chat p {
  color: #666;
  margin-bottom: 30px;
}

.example-prompts {
  text-align: left;
  background: #f8f9fa;
  border-radius: 12px;
  padding: 20px;
  max-width: 500px;
  margin: 0 auto;
  border: 1px solid #e9ecef;
}

.example-prompts p {
  font-weight: 600;
  margin-bottom: 10px;
  color: #333;
}

.example-prompts ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.example-prompts li {
  color: #666;
  padding: 10px 15px;
  border-bottom: 1px solid #eee;
  border-radius: 6px;
  margin-bottom: 5px;
  background: white;
  transition: all 0.2s;
}

.example-prompts li:hover {
  background: #f5f7ff;
  transform: translateX(5px);
}

.example-prompts li:last-child {
  border-bottom: none;
  margin-bottom: 0;
}

.chat-messages {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.chat-message {
  display: flex;
  gap: 12px;
  align-items: flex-start;
}

.chat-message-user {
  flex-direction: row-reverse;
}

.message-avatar {
  flex-shrink: 0;
  width: 44px;
  height: 44px;
  background: linear-gradient(135deg, #4a6cf7 0%, #3a5ce5 100%);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  box-shadow: 0 2px 8px rgba(74, 108, 247, 0.3);
}

.chat-message-ai .message-avatar {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  box-shadow: 0 2px 8px rgba(16, 185, 129, 0.3);
}

.message-content {
  flex: 1;
  max-width: 80%;
}

.message-text {
  background: #f5f7ff;
  padding: 18px;
  border-radius: 16px;
  color: #333;
  line-height: 1.6;
  white-space: pre-wrap;
  position: relative;
  box-shadow: 0 2px 10px rgba(74, 108, 247, 0.1);
  border: 1px solid #e0e7ff;
}

.chat-message-user .message-text {
  background: linear-gradient(135deg, #4a6cf7 0%, #3a5ce5 100%);
  color: white;
  box-shadow: 0 2px 10px rgba(74, 108, 247, 0.2);
  border: none;
}

/* 消息时间戳 */
.message-time {
  font-size: 12px;
  color: #9ca3af;
  margin-top: 6px;
  text-align: right;
  padding: 0 10px;
}

.chat-message-user .message-time {
  color: rgba(255, 255, 255, 0.7);
  text-align: left;
}

/* 图片消息样式 */
.message-image {
  max-width: 300px;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  border: 2px solid #e0e7ff;
}

.message-image img {
  width: 100%;
  height: auto;
  display: block;
}

.chat-message-user .message-image {
  border-color: rgba(255, 255, 255, 0.3);
}

/* Markdown表格样式 */
.message-text :deep(table) {
  width: 100%;
  border-collapse: collapse;
  margin: 15px 0;
  font-size: 14px;
  background: white;
  border-radius: 8px;
  overflow: hidden;
}

.chat-message-user .message-text :deep(table) {
  background: rgba(255, 255, 255, 0.1);
}

.message-text :deep(th),
.message-text :deep(td) {
  border: 1px solid #e5e7eb;
  padding: 10px;
  text-align: left;
}

.chat-message-user .message-text :deep(th),
.chat-message-user .message-text :deep(td) {
  border-color: rgba(255, 255, 255, 0.2);
}

.message-text :deep(th) {
  background-color: #4a6cf7;
  color: white;
  font-weight: 600;
}

.chat-message-user .message-text :deep(th) {
  background-color: rgba(255, 255, 255, 0.2);
}

.message-text :deep(tr:nth-child(even)) {
  background-color: #f9f9fa;
}

.chat-message-user .message-text :deep(tr:nth-child(even)) {
  background-color: rgba(255, 255, 255, 0.05);
}

.message-text :deep(tr:hover) {
  background-color: #f0f0f0;
}

.chat-message-user .message-text :deep(tr:hover) {
  background-color: rgba(255, 255, 255, 0.1);
}

.chat-input-area {
  background: white;
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
  padding: 25px;
  border: 1px solid #e0e7ff;
}

.input-wrapper {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

textarea {
  width: 100%;
  padding: 18px;
  border: 2px solid #e0e7ff;
  border-radius: 12px;
  font-size: 16px;
  font-family: inherit;
  resize: vertical;
  min-height: 100px;
  transition: all 0.2s;
  background: #f9fafb;
}

textarea:focus {
  outline: none;
  border-color: #4a6cf7;
  background: white;
  box-shadow: 0 0 0 3px rgba(74, 108, 247, 0.1);
}

.input-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
}

.action-group {
  display: flex;
  gap: 10px;
  align-items: center;
}

.btn {
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
  font-size: 14px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.btn-primary {
  background: linear-gradient(135deg, #4a6cf7 0%, #3a5ce5 100%);
  color: white;
  box-shadow: 0 4px 12px rgba(74, 108, 247, 0.3);
  font-weight: 600;
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(74, 108, 247, 0.4);
}

.btn-primary:disabled {
  background: #e5e7eb;
  color: #9ca3af;
  box-shadow: none;
  cursor: not-allowed;
}

.btn-secondary {
  background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%);
  color: #4b5563;
  border: 1px solid #d1d5db;
}

.btn-secondary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.btn-secondary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-icon {
  width: 44px;
  height: 44px;
  padding: 0;
  border-radius: 50%;
  background: linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%);
  color: #6b7280;
  border: 1px solid #d1d5db;
  font-size: 18px;
  transition: all 0.2s;
}

.btn-icon:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%);
}

.input-hint {
  font-size: 13px;
  color: #9ca3af;
  text-align: center;
  margin-top: 15px;
  margin-bottom: 0;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .ai-chat-container {
    padding: 20px 0 40px;
  }

  .container {
    padding: 0 15px;
  }

  .header-content {
    padding: 20px;
  }

  .ai-chat-header h1 {
    font-size: 28px;
  }

  .subtitle {
    font-size: 16px;
  }

  .chat-history {
    padding: 20px;
    min-height: 300px;
    max-height: 500px;
  }

  .empty-icon {
    font-size: 48px;
  }

  .empty-chat h3 {
    font-size: 20px;
  }

  .chat-message {
    gap: 8px;
  }

  .message-avatar {
    width: 36px;
    height: 36px;
    font-size: 16px;
  }

  .message-content {
    max-width: 90%;
  }

  .message-text {
    padding: 14px;
    border-radius: 12px;
  }

  .example-prompts {
    padding: 15px;
  }

  .chat-input-area {
    padding: 20px;
  }

  textarea {
    padding: 15px;
    min-height: 80px;
  }

  .input-actions {
    flex-direction: column;
    align-items: stretch;
  }

  .action-group {
    justify-content: center;
  }

  .btn {
    padding: 10px 20px;
  }

  .btn-icon {
    width: 40px;
    height: 40px;
    font-size: 16px;
  }
}
</style>