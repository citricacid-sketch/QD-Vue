<script setup lang="ts">
import AppLayout from '@/components/layout/AppLayout.vue'
import { ref } from 'vue'

const policies = ref([
  {
    id: 1,
    category: '签证政策',
    title: '中国签证类型与申请流程',
    description: '了解不同类型签证（旅游、商务、工作等）的申请条件和流程。',
    icon: '📋'
  },
  {
    id: 2,
    category: '入境要求',
    title: '入境健康申报与海关规定',
    description: '最新入境健康申报要求、海关申报规定和禁止携带物品清单。',
    icon: '🛃'
  },
  {
    id: 3,
    category: '旅行安全',
    title: '在华旅行安全指南',
    description: '交通安全、食品安全、紧急联系方式等安全注意事项。',
    icon: '🛡️'
  },
  {
    id: 4,
    category: '文化礼仪',
    title: '中国文化习俗与礼仪',
    description: '了解中国的文化习俗、社交礼仪和禁忌，尊重当地文化。',
    icon: '🎎'
  },
  {
    id: 5,
    category: '交通规则',
    title: '中国交通规则与出行指南',
    description: '公共交通使用、出租车服务、自驾规定等交通信息。',
    icon: '🚗'
  },
  {
    id: 6,
    category: '通讯网络',
    title: '通讯与网络服务',
    description: 'SIM卡购买、Wi-Fi服务、VPN使用等通讯网络指南。',
    icon: '📱'
  },
  {
    id: 7,
    category: '货币支付',
    title: '货币兑换与支付方式',
    description: '人民币兑换、移动支付（微信支付、支付宝）、信用卡使用等。',
    icon: '💰'
  },
  {
    id: 8,
    category: '紧急情况',
    title: '紧急联系方式与求助',
    description: '紧急电话号码、使领馆联系方式、医疗救助等信息。',
    icon: '🚨'
  }
])

const selectedPolicy = ref(policies.value[0] || policies.value[0]!)
const searchQuery = ref('')

// 过滤政策
const filteredPolicies = ref(policies.value)

function searchPolicies() {
  if (!searchQuery.value.trim()) {
    filteredPolicies.value = policies.value
    return
  }

  const query = searchQuery.value.toLowerCase()
  filteredPolicies.value = policies.value.filter(policy =>
    policy.title.toLowerCase().includes(query) ||
    policy.description.toLowerCase().includes(query) ||
    policy.category.toLowerCase().includes(query)
  )
}

function selectPolicy(policy: typeof policies.value[0]) {
  selectedPolicy.value = policy
}
</script>

<template>
  <AppLayout>
    <div class="policy-container">
      <div class="container">
        <div class="policy-header">
          <h1>旅行政策</h1>
          <p class="subtitle">签证与入境规定等官方政策指引</p>
        </div>

        <!-- 搜索栏 -->
        <div class="search-section">
          <div class="search-box">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="搜索政策..."
              @input="searchPolicies"
              @keyup.enter="searchPolicies"
            />
            <button class="btn btn-primary" @click="searchPolicies">
              搜索
            </button>
          </div>
          <p class="search-hint">
            共收录 {{ policies.length }} 个旅行政策指南
          </p>
        </div>

        <div class="policy-content">
          <!-- 政策列表 -->
          <div class="policy-sidebar">
            <div class="policy-categories">
              <h3>政策分类</h3>
              <div class="categories-list">
                <button
                  v-for="category in [...new Set(policies.map(p => p.category))]"
                  :key="category"
                  class="category-button"
                  @click="searchQuery = category; searchPolicies()"
                >
                  {{ category }}
                </button>
              </div>
            </div>

            <div class="policy-list">
              <div
                v-for="policy in filteredPolicies"
                :key="policy.id"
                :class="['policy-item', { active: policy.id === selectedPolicy.id }]"
                @click="selectPolicy(policy)"
              >
                <div class="policy-item-icon">{{ policy.icon }}</div>
                <div class="policy-item-content">
                  <span class="policy-category-tag">{{ policy.category }}</span>
                  <h4>{{ policy.title }}</h4>
                </div>
              </div>
            </div>
          </div>

          <!-- 政策详情 -->
          <div class="policy-detail">
            <div class="detail-header">
              <div class="detail-icon">{{ selectedPolicy.icon }}</div>
              <div class="detail-title">
                <span class="detail-category">{{ selectedPolicy.category }}</span>
                <h2>{{ selectedPolicy.title }}</h2>
              </div>
            </div>

            <div class="detail-content">
              <div class="content-section">
                <h3>政策概述</h3>
                <p>{{ selectedPolicy.description }}</p>
              </div>

              <!-- 签证政策详情 -->
              <div v-if="selectedPolicy.category === '签证政策'" class="content-section">
                <h3>主要签证类型</h3>
                <ul class="policy-list-detail">
                  <li>
                    <strong>L签证（旅游签证）</strong>
                    <p>适用于来华旅游观光、探亲访友的外国人。有效期通常为30-90天，可单次或多次入境。</p>
                  </li>
                  <li>
                    <strong>M签证（商务签证）</strong>
                    <p>适用于来华进行商业贸易活动的外国人。需要中国公司的邀请函。</p>
                  </li>
                  <li>
                    <strong>Z签证（工作签证）</strong>
                    <p>适用于来华工作的外国人。需要《外国人来华工作许可证》和工作类居留许可。</p>
                  </li>
                  <li>
                    <strong>X签证（学习签证）</strong>
                    <p>适用于来华学习、进修的外国人。需要中国学校的录取通知书。</p>
                  </li>
                </ul>

                <h3>申请流程</h3>
                <ol class="process-list">
                  <li>准备申请材料（护照、照片、申请表等）</li>
                  <li>根据签证类型准备相应的证明文件</li>
                  <li>在线填写签证申请表</li>
                  <li>预约并前往中国签证申请服务中心</li>
                  <li>提交申请并缴纳费用</li>
                  <li>等待审核结果（通常4-7个工作日）</li>
                </ol>
              </div>

              <!-- 入境要求详情 -->
              <div v-else-if="selectedPolicy.category === '入境要求'" class="content-section">
                <h3>入境前准备</h3>
                <ul class="policy-list-detail">
                  <li>
                    <strong>健康申报</strong>
                    <p>入境前需通过海关旅客指尖服务小程序完成健康申报，生成二维码。</p>
                  </li>
                  <li>
                    <strong>有效证件</strong>
                    <p>确保护照有效期至少6个月以上，签证在有效期内。</p>
                  </li>
                  <li>
                    <strong>海关申报</strong>
                    <p>了解禁止和限制入境的物品清单，如实申报携带物品。</p>
                  </li>
                </ul>

                <h3>禁止携带物品</h3>
                <div class="warning-box">
                  <ul>
                    <li>各种武器、仿真武器、弹药及爆炸物品</li>
                    <li>伪造的货币及伪造的有价证券</li>
                    <li>对中国政治、经济、文化、道德有害的印刷品、胶卷、照片等</li>
                    <li>各种烈性毒药</li>
                    <li>鸦片、吗啡、海洛因、大麻等毒品</li>
                    <li>新鲜水果、茄科蔬菜、活动物等动植物产品</li>
                  </ul>
                </div>
              </div>

              <!-- 通用政策内容 -->
              <div v-else class="content-section">
                <h3>详细内容</h3>
                <p>政策详细内容正在更新中，如需最新信息，请咨询中国驻外使领馆或访问中国国家移民管理局官方网站。</p>
                <div class="info-box">
                  <h4>重要提示</h4>
                  <ul>
                    <li>政策可能随时调整，请出行前确认最新信息</li>
                    <li>建议通过官方渠道获取权威政策信息</li>
                    <li>如有疑问，可咨询专业旅行社或法律顾问</li>
                  </ul>
                </div>
              </div>

              <div class="content-section">
                <h3>官方资源</h3>
                <div class="official-links">
                  <a href="https://www.nia.gov.cn/" target="_blank" class="official-link">
                    🌐 国家移民管理局
                  </a>
                  <a href="https://www.mfa.gov.cn/" target="_blank" class="official-link">
                    🌐 外交部
                  </a>
                  <a href="https://www.customs.gov.cn/" target="_blank" class="official-link">
                    🌐 海关总署
                  </a>
                </div>
                <p class="update-info">最后更新时间: 2024年12月</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </AppLayout>
</template>

<style scoped>
.policy-container {
  padding: 40px 0 60px;
}

.container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 20px;
}

.policy-header {
  text-align: center;
  margin-bottom: 40px;
}

.policy-header h1 {
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

.search-section {
  margin-bottom: 40px;
}

.search-box {
  display: flex;
  gap: 10px;
  max-width: 600px;
  margin: 0 auto 15px;
}

.search-box input {
  flex: 1;
  padding: 12px 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 16px;
  transition: border-color 0.2s;
}

.search-box input:focus {
  outline: none;
  border-color: #4a6cf7;
}

.btn {
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
  font-size: 16px;
}

.btn-primary {
  background-color: #4a6cf7;
  color: white;
}

.btn-primary:hover {
  background-color: #3a5ce5;
}

.search-hint {
  text-align: center;
  color: #999;
  font-size: 14px;
  margin: 0;
}

.policy-content {
  display: grid;
  grid-template-columns: 350px 1fr;
  gap: 40px;
}

.policy-sidebar {
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.policy-categories {
  background: white;
  border-radius: 12px;
  padding: 25px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.05);
}

.policy-categories h3 {
  font-size: 18px;
  font-weight: 600;
  color: #222;
  margin-bottom: 20px;
}

.categories-list {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.category-button {
  padding: 8px 16px;
  background: #f5f7ff;
  border: none;
  border-radius: 20px;
  font-size: 14px;
  color: #4a6cf7;
  cursor: pointer;
  transition: all 0.2s;
}

.category-button:hover {
  background: #4a6cf7;
  color: white;
}

.policy-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
  max-height: 600px;
  overflow-y: auto;
  padding-right: 10px;
}

.policy-item {
  display: flex;
  gap: 15px;
  padding: 20px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.05);
  cursor: pointer;
  transition: all 0.3s;
  border: 1px solid #eee;
}

.policy-item:hover {
  transform: translateX(5px);
  border-color: #4a6cf7;
}

.policy-item.active {
  border-color: #4a6cf7;
  background: #f5f7ff;
}

.policy-item-icon {
  font-size: 24px;
  flex-shrink: 0;
}

.policy-item-content {
  flex: 1;
}

.policy-category-tag {
  display: inline-block;
  background: rgba(74, 108, 247, 0.1);
  color: #4a6cf7;
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
  margin-bottom: 8px;
}

.policy-item-content h4 {
  font-size: 16px;
  font-weight: 600;
  color: #222;
  margin: 0;
  line-height: 1.4;
}

.policy-detail {
  background: white;
  border-radius: 12px;
  padding: 40px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.05);
}

.detail-header {
  display: flex;
  gap: 20px;
  align-items: flex-start;
  margin-bottom: 40px;
  padding-bottom: 30px;
  border-bottom: 1px solid #eee;
}

.detail-icon {
  font-size: 48px;
  flex-shrink: 0;
}

.detail-title {
  flex: 1;
}

.detail-category {
  display: inline-block;
  background: #4a6cf7;
  color: white;
  padding: 6px 15px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 15px;
}

.detail-title h2 {
  font-size: 28px;
  font-weight: 700;
  color: #222;
  margin: 0;
  line-height: 1.3;
}

.detail-content {
  color: #333;
}

.content-section {
  margin-bottom: 40px;
}

.content-section h3 {
  font-size: 22px;
  font-weight: 600;
  color: #222;
  margin-bottom: 20px;
}

.content-section p {
  line-height: 1.6;
  margin-bottom: 20px;
}

.policy-list-detail {
  list-style: none;
  padding: 0;
  margin: 0 0 30px;
}

.policy-list-detail li {
  margin-bottom: 25px;
  padding-bottom: 25px;
  border-bottom: 1px solid #eee;
}

.policy-list-detail li:last-child {
  border-bottom: none;
}

.policy-list-detail strong {
  display: block;
  font-size: 18px;
  font-weight: 600;
  color: #222;
  margin-bottom: 10px;
}

.policy-list-detail p {
  color: #666;
  margin: 0;
}

.process-list {
  list-style-position: inside;
  padding-left: 20px;
  margin: 0 0 30px;
}

.process-list li {
  margin-bottom: 10px;
  color: #333;
}

.warning-box {
  background: #fff2f2;
  border: 1px solid #fecaca;
  border-radius: 8px;
  padding: 20px;
  margin: 20px 0;
}

.warning-box ul {
  margin: 0;
  padding-left: 20px;
}

.warning-box li {
  color: #dc2626;
  margin-bottom: 8px;
}

.info-box {
  background: #f5f7ff;
  border: 1px solid #dbeafe;
  border-radius: 8px;
  padding: 20px;
  margin: 20px 0;
}

.info-box h4 {
  font-size: 18px;
  font-weight: 600;
  color: #222;
  margin-bottom: 15px;
}

.info-box ul {
  margin: 0;
  padding-left: 20px;
}

.info-box li {
  color: #666;
  margin-bottom: 8px;
}

.official-links {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  margin-bottom: 20px;
}

.official-link {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  background: #f5f7ff;
  border: 1px solid #dbeafe;
  border-radius: 8px;
  color: #4a6cf7;
  text-decoration: none;
  font-weight: 500;
  transition: all 0.2s;
}

.official-link:hover {
  background: #4a6cf7;
  color: white;
  border-color: #4a6cf7;
}

.update-info {
  color: #999;
  font-size: 14px;
  font-style: italic;
  margin: 0;
}

/* 响应式设计 */
@media (max-width: 1024px) {
  .policy-content {
    grid-template-columns: 1fr;
    gap: 30px;
  }

  .policy-sidebar {
    order: 2;
  }

  .policy-detail {
    order: 1;
  }
}

@media (max-width: 768px) {
  .policy-container {
    padding: 20px 0 40px;
  }

  .policy-header h1 {
    font-size: 28px;
  }

  .subtitle {
    font-size: 16px;
  }

  .search-box {
    flex-direction: column;
  }

  .policy-detail {
    padding: 25px;
  }

  .detail-header {
    flex-direction: column;
    text-align: center;
  }

  .detail-icon {
    align-self: center;
  }

  .detail-title h2 {
    font-size: 24px;
  }
}
</style>