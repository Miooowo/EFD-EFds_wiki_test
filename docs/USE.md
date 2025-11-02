# 使用指南

## 快速开始

### 1. 安装依赖并启动

```bash
# 安装依赖
pnpm install

# 启动开发服务器
pnpm docs:dev

# 构建生产版本
pnpm docs:build
```

### 2. 访问应用

开发环境：`http://localhost:5173`

## 主要功能

### 搜索功能

在物品图鉴页面，你可以通过以下方式搜索物品：

1. **物品ID**：输入数字ID（如：`1`、`10`）
2. **中文名**：输入中文名称（如：`绷带`、`防护背心`）
3. **英文名**：输入英文名称（如：`Bandage`、`Body Armor`）
4. **标签**：输入标签（如：`医疗`、`武器`、`防具`）
5. **描述**：部分描述文字也会被搜索

### 品质筛选

点击顶部的品质按钮可以按品质筛选：

- **全部**：显示所有物品
- **普通(1)**：灰色品质物品
- **精良(2)**：白色品质物品
- **稀有(3)**：绿色品质物品
- **史诗(4)**：蓝色品质物品
- **传说(5)**：紫色品质物品
- **神话(6)**：橙色品质物品
- **不朽(7)**：金色品质物品
- **神器(8)**：白色边框品质物品
- **至尊(9)**：红色品质物品

每个品质按钮旁的数字表示该品质的物品数量。

### 物品信息

每个物品卡片显示：

- **品质等级**：右上角显示物品品质
- **物品ID**：左上角显示物品编号
- **中英文名**：双语显示
- **描述**：物品详细信息
- **标签**：物品分类标签
- **价格**：市场价格
- **占用**：背包占用格数
- **可交易**：是否可在市场交易

## 添加新物品

编辑 `items-data.json` 文件，在 `items` 数组中添加新物品：

```json
{
  "id": 51,
  "nameCN": "新物品",
  "nameEN": "New Item",
  "tags": ["分类"],
  "quality": 5,
  "description": "物品描述",
  "price": 1000,
  "gridSize": "2x2",
  "market": true
}
```

保存后，刷新页面即可看到新物品。

## 数据更新

### 批量更新

可以使用脚本或工具批量更新 `items-data.json` 中的物品数据。

### 字段说明

- `id`: 唯一标识符，建议从小到大递增
- `nameCN`: 中文名称
- `nameEN`: 英文名称
- `tags`: 标签数组，用于分类（如：["医疗", "消耗品"]）
- `quality`: 品质等级（1-9）
- `description`: 物品描述
- `price`: 市场价格（数字）
- `gridSize`: 占格大小（字符串，如 "1x1", "2x2"）
- `market`: 是否可交易（布尔值）

## 部署

### Netlify

1. 创建 `netlify.toml`：
```toml
[build]
  command = "pnpm docs:build"
  publish = ".vitepress/dist"
```

2. 连接到 GitHub 仓库
3. 自动部署成功

### Vercel

1. 在项目根目录运行：
```bash
vercel --prod
```

2. 或通过 Vercel 控制台导入项目

### GitHub Pages

1. 在 `package.json` 中添加脚本：
```json
"scripts": {
  "docs:deploy": "vitepress build && gh-pages -d .vitepress/dist"
}
```

2. 运行部署命令：
```bash
pnpm docs:deploy
```

## 自定义

### 修改主题色

编辑 `.vitepress/theme/index.ts` 和相关样式文件。

### 添加新页面

1. 在根目录创建新的 `.md` 文件
2. 在 `.vitepress/config.mts` 的 `themeConfig.nav` 中添加导航链接

### 修改数据源

默认使用 `items-data.json`。如需使用数据库：

1. 修改 `items/index.md` 中的数据导入
2. 添加 API 调用逻辑

## 故障排除

### 开发服务器无法启动

- 检查 Node.js 版本（推荐 18+）
- 清理 `node_modules` 并重新安装：`rm -rf node_modules && pnpm install`
- 检查端口是否被占用：`netstat -ano | findstr :5173`

### 页面显示异常

- 清除浏览器缓存
- 检查控制台错误信息
- 确认所有文件路径正确

### 搜索功能不工作

- 检查 `items-data.json` 格式是否正确
- 确认数据加载成功（检查控制台）
- 查看网络请求是否正常

## 获取帮助

- 查看 VitePress 官方文档：https://vitepress.dev/
- 查看项目 GitHub Issues
- 阅读代码注释了解更多细节

## 贡献

欢迎贡献代码、报告问题或提出改进建议！

