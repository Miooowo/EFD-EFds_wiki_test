---
layout: page
---

# 物品图鉴

<script setup>
import { ref, computed, onMounted } from 'vue'

const items = ref([])
const search = ref('')
const selectedTag = ref('')
const selectedQuality = ref('')
const sortField = ref('')
const sortOrder = ref(0) // 0=默认, 1=升序, 2=降序

const qualityMap = {
  1: { name: '常见(lv.1)', color: '#999999' },        // 白色/灰色
  2: { name: '罕见(lv.2)', color: '#1EFF00' },        // 绿色
  3: { name: '稀有(lv.3)', color: '#0070DD' },        // 蓝色
  4: { name: '史诗(lv.4)', color: '#A335EE' },        // 紫色
  5: { name: '传说(lv.5)', color: '#FFD700' },        // 金色
  6: { name: '神话(lv.6)', color: '#FF8000' },        // 橙色
  7: { name: '至尊(lv.7)', color: '#FF0000' },        // 红色
  8: { name: '远古(lv.8)', color: '#8B00FF' },        // 深紫色（暗金）
  9: { name: '永恒(lv.9)', color: '#FF1493' }         // 粉红色（终极）
}

// 判断是否是图片URL
const isImageUrl = (str) => {
  if (!str || typeof str !== 'string') return false
  return str.startsWith('http://') || str.startsWith('https://') || str.startsWith('//')
}

// 处理图片加载失败
const handleImageError = (event) => {
  const img = event.target
  const fallback = img.nextElementSibling
  if (fallback && fallback.classList.contains('item-icon')) {
    img.style.display = 'none'
    fallback.style.display = 'inline-block'
  }
}

// 验证物品数据结构
const validateItem = (item) => {
  const required = ['id', 'nameCN', 'nameEN', 'quality']
  const hasAllRequired = required.every(key => item.hasOwnProperty(key))
  const validTypes = {
    id: ['number', 'string'],
    nameCN: 'string',
    nameEN: 'string',
    quality: 'number',
    tags: 'object',
    price: 'number',
    weight: 'number',
    market: 'object',
    image: 'string'
  }
  
  // 检查必需字段
  if (!hasAllRequired) {
    return { valid: false, error: '缺少必需字段' }
  }
  
  // 检查字段类型
  for (const [key, expected] of Object.entries(validTypes)) {
    if (item.hasOwnProperty(key)) {
      if (Array.isArray(expected)) {
        if (!expected.includes(typeof item[key])) {
          return { valid: false, error: `${key} 类型不正确` }
        }
      } else if (expected === 'object') {
        // market 和 tags 必须是数组
        if (!Array.isArray(item[key])) {
          return { valid: false, error: `${key} 应该是数组` }
        }
        // market 数组中的每个元素必须是字符串
        if (key === 'market' && item[key].length > 0) {
          const allStrings = item[key].every(val => typeof val === 'string')
          if (!allStrings) {
            return { valid: false, error: `${key} 数组中的元素必须是字符串` }
          }
        }
      } else if (typeof item[key] !== expected) {
        return { valid: false, error: `${key} 类型不正确` }
      }
    }
  }
  
  // 检查 quality 范围
  if (item.quality < 1 || item.quality > 9) {
    return { valid: false, error: 'quality 必须在 1-9 之间' }
  }
  
  return { valid: true }
}

onMounted(async () => {
  try {
    // 先加载自动生成的文件列表（用于自动扫描文件夹）
    let jsonFiles = []
    
    try {
      const listRes = await fetch('/data/items-list.json')
      if (listRes.ok) {
        const list = await listRes.json()
        jsonFiles = list.files.map(file => `/data/items/${file}`)
        console.log('📁 自动扫描发现', jsonFiles.length, '个JSON文件')
      } else {
        // 回退到 manifest.json
        const manifestRes = await fetch('/data/items/manifest.json')
        const manifest = await manifestRes.json()
        jsonFiles = manifest.files.map(file => `/data/items/${file}`)
        console.log('📋 使用 manifest.json:', jsonFiles.length, '个JSON文件')
      }
    } catch (err) {
      // 如果都失败了，使用默认的 manifest
      const manifestRes = await fetch('/data/items/manifest.json')
      const manifest = await manifestRes.json()
      jsonFiles = manifest.files.map(file => `/data/items/${file}`)
      console.log('⚠️ 回退到 manifest.json')
    }
    
    console.log('发现', jsonFiles.length, '个JSON文件')
    
    // 加载所有文件并验证
    const loadPromises = jsonFiles.map(async (file) => {
      try {
        const res = await fetch(file)
        if (!res.ok) {
          console.warn(`文件不存在: ${file}`)
          return []
        }
        const data = await res.json()
        
        // 验证数据
        if (!Array.isArray(data)) {
          console.warn(`${file} 不是有效的数组`)
          return []
        }
        
        const validItems = []
        const invalidItems = []
        
        data.forEach((item, index) => {
          const validation = validateItem(item)
          if (validation.valid) {
            validItems.push(item)
          } else {
            invalidItems.push({ index, item, error: validation.error })
          }
        })
        
        if (invalidItems.length > 0) {
          console.warn(`${file} 有 ${invalidItems.length} 个无效物品:`, invalidItems)
        }
        
        console.log(`✓ ${file}: ${validItems.length} 个有效物品`)
        return validItems
      } catch (err) {
        console.warn(`无法加载 ${file}:`, err)
        return []
      }
    })
    
    const allItems = await Promise.all(loadPromises)
    items.value = allItems.flat() // 合并所有数组
    
    console.log('✅ 加载完成:', items.value.length, '个有效物品')
  } catch (error) {
    console.error('❌ 加载物品数据失败:', error)
  }
})

const allTags = computed(() => {
  const tags = []
  items.value.forEach(item => {
    if (item.tags && Array.isArray(item.tags)) {
      item.tags.forEach(tag => {
        if (!tags.includes(tag)) {
          tags.push(tag)
        }
      })
    }
  })
  return tags.sort()
})

const filteredItems = computed(() => {
  let result = items.value.filter(item => {
    // 如果搜索框为空，跳过搜索匹配（但保留标签和品质过滤）
    if (!search.value || search.value.trim() === '') {
      const matchTag = !selectedTag.value || 
        (item.tags && item.tags.includes(selectedTag.value))
      
      const matchQuality = !selectedQuality.value || 
        item.quality === parseInt(selectedQuality.value)
      
      return matchTag && matchQuality
    }
    
    const keyword = search.value.toLowerCase().trim()
    
    // 扩展搜索：包括标签
    const matchTags = keyword !== '' && item.tags?.some(tag => 
      tag.toLowerCase().includes(keyword)
    )
    
    const matchSearch = keyword !== '' && (
      item.nameCN?.toLowerCase().includes(keyword) ||
      item.nameEN?.toLowerCase().includes(keyword) ||
      item.id?.toString().includes(keyword) ||
      item.description?.toLowerCase().includes(keyword) ||
      matchTags
    )
    
    const matchTag = !selectedTag.value || 
      (item.tags && item.tags.includes(selectedTag.value))
    
    const matchQuality = !selectedQuality.value || 
      item.quality === parseInt(selectedQuality.value)
    
    // 如果有搜索关键字，必须匹配搜索；如果没有搜索关键字，就只看标签和品质
    return (keyword === '' || matchSearch) && matchTag && matchQuality
  })
  
  // 排序逻辑
  if (sortField.value && sortOrder.value !== 0) {
    result = [...result].sort((a, b) => {
      let aVal, bVal
      
      switch(sortField.value) {
        case 'id':
          aVal = parseInt(a.id) || 0
          bVal = parseInt(b.id) || 0
          break
        case 'quality':
          aVal = a.quality || 0
          bVal = b.quality || 0
          break
        case 'price':
          aVal = a.price || 0
          bVal = b.price || 0
          break
        case 'weight':
          aVal = a.weight || 0
          bVal = b.weight || 0
          break
        case 'nameCN':
          aVal = a.nameCN || ''
          bVal = b.nameCN || ''
          break
        default:
          return 0
      }
      
      if (typeof aVal === 'string') {
        return sortOrder.value === 1 
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal)
      } else {
        return sortOrder.value === 1 
          ? aVal - bVal
          : bVal - aVal
      }
    })
  }
  
  return result
})

const sortBy = (field) => {
  if (sortField.value === field) {
    sortOrder.value = (sortOrder.value + 1) % 3 // 循环：0->1->2->0
  } else {
    sortField.value = field
    sortOrder.value = 1
  }
}

const getSortIcon = (field) => {
  if (sortField.value !== field) return ''
  if (sortOrder.value === 0) return ''
  if (sortOrder.value === 1) return ' ↑'
  return ' ↓'
}

const formatPrice = (price) => {
  return new Intl.NumberFormat('zh-CN').format(price)
}

const formatWeight = (weight) => {
  return weight ? weight.toFixed(2) : '0.00'
}
</script>

<div class="item-browser">
  <div class="toolbar">
    <input 
      v-model="search" 
      placeholder="搜索物品..." 
      class="search-box" 
    />
    <select v-model="selectedTag" class="filter-select">
      <option value="">全部标签</option>
      <option v-for="tag in allTags" :key="tag" :value="tag">{{ tag }}</option>
    </select>
    <select v-model="selectedQuality" class="filter-select">
      <option value="">全部品质</option>
      <option value="1">常见(lv.1)</option>
      <option value="2">罕见(lv.2)</option>
      <option value="3">稀有(lv.3)</option>
      <option value="4">史诗(lv.4)</option>
      <option value="5">传说(lv.5)</option>
      <option value="6">神话(lv.6)</option>
      <option value="7">至尊(lv.7)</option>
      <option value="8">远古(lv.8)</option>
      <option value="9">永恒(lv.9)</option>
    </select>
    <span class="count">显示: {{ filteredItems.length }} / {{ items.length }}</span>
  </div>

  <div class="table-wrapper">
    <table class="item-table">
      <thead>
        <tr>
          <th class="icon-col">图标</th>
          <th @click="sortBy('id')" class="sortable">
            物品ID{{ getSortIcon('id') }}
          </th>
          <th @click="sortBy('nameCN')" class="sortable">
            中文名{{ getSortIcon('nameCN') }}
          </th>
          <th>英文名</th>
          <th @click="sortBy('quality')" class="sortable">
            品质{{ getSortIcon('quality') }}
          </th>
          <th @click="sortBy('price')" class="sortable">
            价格{{ getSortIcon('price') }}
          </th>
          <th @click="sortBy('weight')" class="sortable">
            重量{{ getSortIcon('weight') }}
          </th>
          <th>标签</th>
          <th>购买源</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in filteredItems" :key="item.id" class="item-row">
          <td class="icon-col">
            <template v-if="isImageUrl(item.image)">
              <img 
                :src="item.image" 
                :alt="item.nameCN" 
                class="item-icon-image"
                @error="handleImageError($event)">
              <span class="item-icon" style="display: none;">📦</span>
            </template>
            <span v-else class="item-icon">{{ item.image || '📦' }}</span>
          </td>
          <td class="mono">#{{ item.id }}</td>
          <td><strong>{{ item.nameCN }}</strong></td>
          <td class="text-muted">{{ item.nameEN }}</td>
          <td>
            <span 
              class="quality-badge" 
              :style="{ color: qualityMap[item.quality]?.color || '#666' }"
            >
              {{ qualityMap[item.quality]?.name || '未知' }}
            </span>
          </td>
          <td class="price">💰 {{ formatPrice(item.price || 0) }}</td>
          <td>⚖️ {{ formatWeight(item.weight) }} kg</td>
          <td>
            <div class="tags">
              <span 
                v-for="tag in (item.tags || [])" 
                :key="tag" 
                class="tag"
              >
                {{ tag }}
              </span>
            </div>
          </td>
          <td>
            <div class="tags">
              <span 
                v-for="source in (item.market || [])" 
                :key="source" 
                class="market-tag"
              >
                {{ source }}
              </span>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
    <div v-if="filteredItems.length === 0" class="no-results">
      <p>🔍 没有找到匹配的物品</p>
    </div>
  </div>
</div>

<style scoped>
.item-browser {
  margin-top: 2rem;
}

.toolbar {
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
  align-items: center;
  flex-wrap: wrap;
}

.search-box {
  flex: 1;
  min-width: 200px;
  padding: 0.75rem;
  border: 1px solid var(--vp-c-divider);
  border-radius: 6px;
  background: var(--vp-c-bg);
  font-size: 0.95rem;
}

.filter-select {
  padding: 0.75rem;
  border: 1px solid var(--vp-c-divider);
  border-radius: 6px;
  background: var(--vp-c-bg);
  cursor: pointer;
  font-size: 0.95rem;
}

.count {
  color: var(--vp-c-text-2);
  font-size: 0.9rem;
}

.table-wrapper {
  overflow-x: auto;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
}

.item-table {
  width: 100%;
  border-collapse: collapse;
  background: var(--vp-c-bg);
}

.item-table th {
  background: var(--vp-c-bg-soft);
  padding: 1rem;
  text-align: left;
  font-weight: 600;
  color: var(--vp-c-text-1);
  border-bottom: 2px solid var(--vp-c-divider);
}

.item-table th.sortable {
  cursor: pointer;
  user-select: none;
  transition: all 0.2s;
}

.item-table th.sortable:hover {
  background: var(--vp-c-bg-soft-active);
  color: var(--vp-c-brand);
}

.item-table td {
  padding: 0.875rem 1rem;
  border-bottom: 1px solid var(--vp-c-divider);
  vertical-align: middle;
}

.item-row:hover {
  background: var(--vp-c-bg-soft);
}

.icon-col {
  text-align: center;
  width: 60px;
}

.item-icon {
  font-size: 2rem;
  display: inline-block;
}

.item-icon-image {
  width: 2rem;
  height: 2rem;
  object-fit: contain;
  display: inline-block;
  vertical-align: middle;
}

.mono {
  font-family: 'Courier New', monospace;
  font-size: 0.9rem;
  color: var(--vp-c-text-2);
}

.text-muted {
  color: var(--vp-c-text-2);
  font-style: italic;
}

.quality-badge {
  font-size: 0.85rem;
  font-weight: 600;
}

.price {
  font-weight: 600;
  color: var(--vp-c-brand);
}

.tags {
  display: flex;
  gap: 0.25rem;
  flex-wrap: wrap;
}

.tag {
  display: inline-block;
  padding: 0.2rem 0.5rem;
  background: var(--vp-c-mute);
  border-radius: 4px;
  font-size: 0.75rem;
}

.market-tag {
  display: inline-block;
  padding: 0.2rem 0.5rem;
  background: var(--vp-c-brand-soft);
  border-radius: 4px;
  font-size: 0.75rem;
  color: var(--vp-c-brand);
  font-weight: 500;
  margin: 0.1rem;
}

.no-results {
  text-align: center;
  padding: 3rem;
  color: var(--vp-c-text-2);
}

@media (max-width: 768px) {
  .toolbar {
    flex-direction: column;
  }
  
  .search-box,
  .filter-select {
    width: 100%;
  }
}
</style>