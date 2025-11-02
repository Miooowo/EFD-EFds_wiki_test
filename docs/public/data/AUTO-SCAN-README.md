# 🔍 自动扫描功能

## 工作原理

系统现在**自动识别** `data/items/` 文件夹中的所有 JSON 文件，无需手动配置。

### 自动扫描流程

1. **构建时扫描**：运行 `npm run docs:dev` 或 `npm run docs:build` 时，会自动运行 `generate-items-list.js` 脚本
2. **生成文件列表**：扫描 `public/data/items/` 文件夹，生成 `items-list.json`
3. **加载数据**：页面加载时自动读取 `items-list.json`，加载所有符合规范的 JSON 文件

### ✅ 符合规范的文件

- 文件扩展名为 `.json`
- 文件内容为**有效的 JSON 数组**
- 每个物品对象包含必需的字段：
  - `id`（数字或字符串）
  - `nameCN`（字符串）
  - `nameEN`（字符串）
  - `quality`（数字，1-9）

### 📝 添加新类别

只需在 `data/items/` 文件夹添加 JSON 文件，无需修改任何配置！

**示例**：
```bash
# 创建新类别文件
public/data/items/new-category.json

# 重新运行开发服务器
npm run docs:dev
```

系统会自动识别并加载 `new-category.json`。

### 🔄 回退机制

如果 `items-list.json` 不存在或加载失败，系统会自动回退到 `manifest.json`。

### 💡 使用建议

1. **文件命名**：使用有意义的文件名，如 `weapons.json`、`armor.json`
2. **数据组织**：按类别分类（医疗、武器、护甲等）
3. **数据验证**：不符合规范的物品会被跳过，并在控制台显示警告
4. **性能优化**：避免单个文件过大，建议每个文件不超过 100 个物品

### 🛠️ 手动生成文件列表

如果需要手动生成文件列表：

```bash
npm run generate:items
```

### 📊 文件结构

```
public/data/items/
├── armor.json          # 护甲
├── containers.json     # 容器
├── food.json          # 食物
├── medical.json        # 医疗
├── special.json       # 特殊
├── tools.json         # 工具
├── weapons.json       # 武器
├── items-list.json    # 自动生成的文件列表（不要手动修改）
└── manifest.json      # 备用清单（保留用于兼容）
```

### ⚠️ 注意事项

- 不要手动编辑 `items-list.json`，它会在每次构建时自动更新
- 建议保留 `manifest.json` 作为备用
- 删除文件后记得重新运行构建命令

