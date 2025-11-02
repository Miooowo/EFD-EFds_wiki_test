# 逃离鸭科夫 - 物品图鉴

基于 VitePress 构建的《逃离鸭科夫》游戏物品图鉴系统，支持多维度搜索和品质筛选。

## 功能特性

- ✅ **多维度搜索**：支持通过物品ID、中文名、英文名、标签和描述进行搜索
- ✅ **品质筛选**：按照物品品质（1-9级）进行筛选
- ✅ **精美卡片展示**：不同品质的物品用不同颜色区分
- ✅ **实时统计**：显示每个品质等级的物品数量
- ✅ **响应式设计**：支持移动端和桌面端访问
- ✅ **详细信息**：包含价格、占格、可交易性等完整信息

## 品质等级

- **品质 1** - 常见(lv.1)（灰色 #999999）
- **品质 2** - 罕见(lv.2)（绿色 #1EFF00）
- **品质 3** - 稀有(lv.3)（蓝色 #0070DD）
- **品质 4** - 史诗(lv.4)（紫色 #A335EE）
- **品质 5** - 传说(lv.5)（金色 #FFD700）
- **品质 6** - 神话(lv.6)（橙色 #FF8000）
- **品质 7** - 至尊(lv.7)（红色 #FF0000）
- **品质 8** - 远古(lv.8)（深紫色 #8B00FF）
- **品质 9** - 永恒(lv.9)（粉红色 #FF1493）

## 开始使用

### 开发环境

```bash
# 安装依赖
pnpm install

# 启动开发服务器
pnpm docs:dev

# # 构建生产版本
# pnpm docs:build

# # 预览生产版本
# pnpm docs:preview
```

### 访问地址

<!-- 启动后访问：`http://localhost:5173` -->

## 项目结构

```
.
├── .vitepress/          # VitePress 配置文件
│   └── config.mts      # 站点配置
├── items/               # 物品图鉴页面
│   └── index.md        # 物品列表（Vue 组件）
├── items-data.json     # 物品数据（JSON）
├── quality-guide.md    # 品质说明页面
├── index.md            # 首页
└── package.json        # 项目配置

```

## 数据格式

### 物品数据结构

```json
{
  "id": 1,
  "nameCN": "物品中文名",
  "nameEN": "Item English Name",
  "tags": ["标签1", "标签2"],
  "quality": 1,
  "description": "物品描述",
  "price": 100,
  "gridSize": "1x1",
  // "market": true 此条暂时没用到，后续可能会做处理
}
```

### 字段说明

- `id`: 物品唯一标识符
- `nameCN`: 物品中文名称
- `nameEN`: 物品英文名称
- `tags`: 物品标签数组
- `quality`: 品质等级（1-9）
- `description`: 物品描述
- `price`: 市场价格
- `gridSize`: 占格大小（如 "1x1", "2x2"）
- `market`: 是否可以在市场交易

## 添加新物品

编辑 `items-data.json` 文件，在 `items` 数组中添加新物品。

## 部署

### Netlify

1. 连接到 GitHub 仓库
2. 构建命令：`pnpm docs:build`
3. 发布目录：`.vitepress/dist`

### Vercel

1. 连接到 GitHub 仓库
2. 框架预设：Vite
3. 构建命令：`pnpm docs:build`
4. 输出目录：`.vitepress/dist`

## 技术栈

- **VitePress** - 文档网站生成器
- **Vue 3** - 前端框架
- **TypeScript** - 类型安全

## 参考

- 参考网站：[逃离鸭科夫 Wiki](https://escapefromduckovwiki.com/zh/items)

## 许可证

本项目为粉丝制作的非官方网站，仅供学习交流使用。

