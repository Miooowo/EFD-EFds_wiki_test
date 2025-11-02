<script setup>
import { ref, computed, onMounted } from 'vue'
import itemsData from '@/items-data.json'

console.log('ItemsBrowser mounted')
console.log('Data loaded:', itemsData)

const searchQuery = ref('')
const selectedQuality = ref(null)
const items = ref(itemsData.items || [])

const qualityMap = {
  1: { name: '普通', color: '#8B8B8B' },
  2: { name: '精良', color: '#8B8B8B' },
  3: { name: '稀有', color: '#1EFF00' },
  4: { name: '史诗', color: '#0070DD' },
  5: { name: '传说', color: '#A335EE' },
  6: { name: '神话', color: '#FF8000' },
  7: { name: '不朽', color: '#E6CC80' },
  8: { name: '神器', color: '#FFFFFF' },
  9: { name: '至尊', color: '#FF0000' }
}

const filteredItems = computed(() => {
  let result = items.value

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(item => 
      item.id.toString().includes(query) ||
      item.nameCN.toLowerCase().includes(query) ||
      item.nameEN.toLowerCase().includes(query) ||
      item.tags.some(tag => tag.toLowerCase().includes(query)) ||
      item.description.toLowerCase().includes(query)
    )
  }

  if (selectedQuality.value !== null) {
    result = result.filter(item => item.quality === selectedQuality.value)
  }

  return result
})

const qualityStats = computed(() => {
  const stats = {}
  for (let i = 1; i <= 9; i++) {
    stats[i] = items.value.filter(item => item.quality === i).length
  }
  return stats
})

const formatPrice = (price) => {
  return new Intl.NumberFormat('zh-CN').format(price)
}
</script>

<template>
  <div class="items-container">
    <div class="search-filter-bar">
      <div class="search-box">
        <input 
          v-model="searchQuery"
          type="text" 
          placeholder="搜索物品ID、中英文名、标签..."
          class="search-input"
        />
      </div>
      
      <div class="quality-filters">
        <button 
          @click="selectedQuality = null"
          :class="['quality-btn', { active: selectedQuality === null }]"
        >
          全部
        </button>
        <button 
          v-for="(info, level) in qualityMap" 
          :key="level"
          @click="selectedQuality = parseInt(level)"
          :class="['quality-btn', { active: selectedQuality === parseInt(level) }]"
          :style="{ borderColor: info.color }"
        >
          {{ info.name }} ({{ qualityStats[level] }})
        </button>
      </div>

      <div class="results-count">
        显示 {{ filteredItems.length }} 项，共 {{ items.length }} 项
      </div>
    </div>

    <div class="items-grid">
      <div 
        v-for="item in filteredItems" 
        :key="item.id"
        class="item-card"
      >
        <div class="item-header">
          <div class="item-quality" :style="{ color: qualityMap[item.quality].color }">
            {{ qualityMap[item.quality].name }}
          </div>
          <div class="item-id">#{{ item.id }}</div>
        </div>
        
        <div class="item-name">
          <div class="name-cn">{{ item.nameCN }}</div>
          <div class="name-en">{{ item.nameEN }}</div>
        </div>

        <div class="item-description">{{ item.description }}</div>

        <div class="item-tags">
          <span 
            v-for="tag in item.tags" 
            :key="tag"
            class="tag"
          >
            {{ tag }}
          </span>
        </div>

        <div class="item-info">
          <div class="info-row">
            <span class="label">价格:</span>
            <span class="value">💰 {{ formatPrice(item.price) }}</span>
          </div>
          <div class="info-row">
            <span class="label">占用:</span>
            <span class="value">📦 {{ item.gridSize }}</span>
          </div>
          <div class="info-row">
            <span class="label">可交易:</span>
            <span class="value">{{ item.market ? '✅ 是' : '❌ 否' }}</span>
          </div>
        </div>
      </div>
    </div>

    <div v-if="filteredItems.length === 0" class="no-results">
      <p>🔍 没有找到匹配的物品</p>
      <p>请尝试其他搜索关键词或调整筛选条件</p>
    </div>
  </div>
</template>

<style scoped>
.items-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem;
}

.search-filter-bar {
  margin-bottom: 2rem;
}

.search-box {
  margin-bottom: 1.5rem;
}

.search-input {
  width: 100%;
  max-width: 600px;
  padding: 1rem;
  font-size: 1rem;
  border: 2px solid var(--vp-c-divider);
  border-radius: 8px;
  transition: border-color 0.3s;
}

.search-input:focus {
  outline: none;
  border-color: var(--vp-c-brand);
}

.quality-filters {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.quality-btn {
  padding: 0.5rem 1rem;
  border: 2px solid var(--vp-c-divider);
  border-radius: 6px;
  background: var(--vp-c-bg);
  cursor: pointer;
  transition: all 0.2s;
  font-size: 0.9rem;
}

.quality-btn:hover {
  transform: translateY(-2px);
}

.quality-btn.active {
  font-weight: bold;
  transform: translateY(-2px);
}

.results-count {
  color: var(--vp-c-text-2);
  font-size: 0.9rem;
}

.items-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 1.5rem;
}

.item-card {
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  padding: 1.5rem;
  transition: all 0.3s;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.item-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
}

.item-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.item-quality {
  font-weight: bold;
  font-size: 0.9rem;
}

.item-id {
  font-size: 0.85rem;
  color: var(--vp-c-text-2);
}

.item-name {
  margin-bottom: 0.75rem;
}

.name-cn {
  font-size: 1.25rem;
  font-weight: bold;
  margin-bottom: 0.25rem;
}

.name-en {
  font-size: 0.95rem;
  color: var(--vp-c-text-2);
  font-style: italic;
}

.item-description {
  color: var(--vp-c-text-2);
  margin-bottom: 1rem;
  font-size: 0.9rem;
  line-height: 1.5;
}

.item-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.tag {
  padding: 0.25rem 0.75rem;
  background: var(--vp-c-mute);
  border-radius: 4px;
  font-size: 0.8rem;
}

.item-info {
  padding-top: 1rem;
  border-top: 1px solid var(--vp-c-divider);
}

.info-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
}

.info-row:last-child {
  margin-bottom: 0;
}

.label {
  color: var(--vp-c-text-2);
}

.value {
  font-weight: 500;
}

.no-results {
  text-align: center;
  padding: 4rem 2rem;
  color: var(--vp-c-text-2);
}

.no-results p {
  margin: 0.5rem 0;
  font-size: 1.1rem;
}

@media (max-width: 768px) {
  .items-grid {
    grid-template-columns: 1fr;
  }
  
  .quality-filters {
    gap: 0.25rem;
  }
  
  .quality-btn {
    font-size: 0.8rem;
    padding: 0.4rem 0.8rem;
  }
}
</style>
