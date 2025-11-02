import { defineConfig } from 'vitepress'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = fileURLToPath(new URL('.', import.meta.url))

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "逃离饥科夫 - 物品图鉴",
  description: "全面的游戏物品数据库，支持多维度搜索和筛选",
  
  head: [
    ['link', { rel: 'icon', href: '/favicon.ico' }]
  ],
  
  // 不设置基础 URL，使用相对路径
  base: '/',
  
  vite: {
    resolve: {
      alias: {
        '@': resolve(__dirname, '../../'),
      }
    }
  },
  
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: '首页', link: '/' },
      { text: '物品图鉴', link: '/items/' }
    ],

    sidebar: [
      {
        text: '导航',
        items: [
          { text: '首页', link: '/' },
          { text: '物品图鉴', link: '/items/' }
        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/Miooowo/EFD-EFds_wiki_test' }
    ]
  }
})
