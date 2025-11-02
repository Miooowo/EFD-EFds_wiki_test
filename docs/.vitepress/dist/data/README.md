# 物品数据目录

## 目录结构

```
public/data/
└── items/
    ├── medical.json      # 医疗用品
    ├── armor.json        # 护甲和防具
    ├── weapons.json      # 武器
    ├── food.json         # 食物和饮品
    ├── tools.json        # 工具和消耗品
    ├── containers.json   # 容器和背包
    ├── special.json      # 特殊物品
    ├── items-list.json   # ⭐ 自动生成的文件列表（自动扫描识别）
    └── manifest.json     # 备用清单文件（兼容性保留）

💡 **自动扫描功能**：系统会自动识别文件夹中的所有 JSON 文件，无需手动配置！
详见：AUTO-SCAN-README.md
```

## 添加新物品

### 方法1：编辑现有文件
直接在对应的 JSON 文件中添加物品：

```json
{
  "id": 100,
  "nameCN": "物品中文名",
  "nameEN": "Item English Name",
  "tags": ["标签1", "标签2"],
  "quality": 3,
  "description": "物品描述",
  "price": 1000,
  "weight": 0.5,
  "market": true,
  "image": "🔫"
}
```

### 方法2：创建新分类文件
如果物品太多，可以创建新的分类文件（如 `weapons2.json`），然后在 `items.md` 中添加文件路径。

## 添加新分类文件

系统会自动从 `manifest.json` 读取文件列表：

1. 在 `public/data/items/` 中创建新文件，如 `custom.json`
2. 编辑 `manifest.json`，在 `files` 数组中添加文件名：

```json
{
  "files": [
    "medical.json",
    "armor.json",
    // ... 其他文件
    "custom.json"  // 添加新文件
  ]
}
```

系统会自动加载并验证新文件！

## 数据格式

### 必需字段
- `id`: 物品唯一ID（数字）
- `nameCN`: 中文名称
- `nameEN`: 英文名称
- `quality`: 品质等级（1-9）

### 可选字段
- `tags`: 标签数组，如 `["医疗", "消耗品"]`
- `description`: 物品描述
- `price`: 市场价格
- `weight`: 物品重量（kg）
- `market`: 购买源数组，如 `["商店", "黑市"]` 或空数组 `[]` 表示不可购买
- `image`: 显示图标（可以是 emoji 或图片路径）

## 排序与筛选

物品会在前端按以下逻辑处理：
1. 从所有 JSON 文件加载数据
2. 合并所有物品数组
3. 应用搜索和筛选
4. 按选中列排序

## 优点

✅ **模块化**: 按类别组织，易于管理  
✅ **可扩展**: 轻松添加新分类文件  
✅ **并行加载**: 多个文件同时加载，速度快  
✅ **错误容错**: 单个文件加载失败不影响其他文件  
✅ **易于维护**: 每个文件专注于一个类别  

