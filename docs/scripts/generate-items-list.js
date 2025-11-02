// 脚本：自动扫描 data/items 文件夹并生成文件列表
import { readdir } from 'fs/promises'
import { join } from 'path'
import { fileURLToPath } from 'url'
import { writeFileSync } from 'fs'

const __dirname = fileURLToPath(new URL('.', import.meta.url))

async function generateItemsList() {
  try {
    const itemsDir = join(__dirname, '../public/data/items')
    const files = await readdir(itemsDir)
    
    // 过滤出所有 .json 文件，排除 manifest.json
    const jsonFiles = files
      .filter(file => file.endsWith('.json') && file !== 'manifest.json')
      .sort()
    
    console.log('📦 扫描到的 JSON 文件:')
    jsonFiles.forEach(file => console.log(`  ✓ ${file}`))
    
    // 生成 items-list.json
    const outputPath = join(__dirname, '../public/data/items-list.json')
    const data = { files: jsonFiles }
    
    writeFileSync(outputPath, JSON.stringify(data, null, 2), 'utf-8')
    
    console.log(`\n✅ 已生成文件列表: ${jsonFiles.length} 个文件`)
    console.log(`📄 输出文件: public/data/items-list.json`)
  } catch (error) {
    console.error('❌ 生成失败:', error)
    process.exit(1)
  }
}

generateItemsList()

