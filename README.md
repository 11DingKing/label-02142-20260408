# 个人导航首页

一个现代化的个人导航首页，采用磨砂玻璃设计风格，支持随机背景图片、时间天气显示、每日一言、网站链接导航、服务器状态监控等功能。

## How to Run

### 使用 Docker Compose（推荐）

```bash
# 构建并启动所有服务
docker-compose up --build -d

# 查看服务状态
docker-compose ps

# 查看日志
docker-compose logs -f

# 停止服务
docker-compose down
```

### 手动启动

#### 后端

```bash
cd backend
mvn clean package -DskipTests
java -jar target/navigation-backend-1.0.0.jar
```

#### 前端

```bash
cd frontend-user
npm install
npm run dev
```

## Services

| 服务 | 端口 | 描述 |
|------|------|------|
| 前端 | 8081 | Vue 3 前端应用 |
| 后端 | 8080 | Spring Boot 后端 API |

## 测试账号

本项目无需登录，直接访问即可使用。

## 访问地址

- 前端页面: http://localhost:8081
- 后端 API: http://localhost:8080/api
- 健康检查: http://localhost:8080/api/health
- 服务器信息: http://localhost:8080/api/server/info

## 题目内容

做一个现代化的个人导航home页，功能包含但不限于：
1. 一个漂亮的随机的图片背景
2. 磨砂玻璃透明，模块化的设计
3. 一些展示话术文案的地方
4. 时间/日历/位置/天气等等
5. 每日一言等接口，展示每日的话或句子
6. 网站列表，一个一个的格子，可以跳转到其他网站
7. 服务器信息，展示服务器的一些信息，比如cpu、内存、磁盘空间、网络流量等等能获取到的

样式格调：
1. 现代化的风格，扁平化的设计
2. 响应式设计，适配不同的设备
3. 适当的动画效果，提升用户体验，显示技术性和互动性
4. 一些简单的交互，比如点击某个模块，会有一些动画效果
5. 美观，优雅，有趣

其他限制：
1. 使用vue框架即可
2. 各种功能做成配置文件，方便后续维护和修改
3. 代码清晰优雅，注释完善，符合标准的开发规范
4. 代码设计合理，模块拆分清晰

## 项目结构

```
├── backend/                    # 后端项目 (Spring Boot)
│   ├── src/
│   │   └── main/
│   │       ├── java/com/navigation/
│   │       │   ├── aspect/     # AOP 切面
│   │       │   ├── common/     # 通用类
│   │       │   ├── config/     # 配置类
│   │       │   ├── controller/ # 控制器
│   │       │   ├── dto/        # 数据传输对象
│   │       │   └── service/    # 服务层
│   │       └── resources/
│   ├── Dockerfile
│   └── pom.xml
├── frontend-user/              # 前端项目 (Vue 3)
│   ├── src/
│   │   ├── api/               # API 请求
│   │   ├── components/        # 组件
│   │   ├── config/            # 配置文件
│   │   ├── stores/            # Pinia 状态管理
│   │   └── styles/            # 样式文件
│   ├── Dockerfile
│   ├── nginx.conf
│   └── package.json
├── docs/                       # 文档
├── docker-compose.yml
├── .gitignore
└── README.md
```

## 功能特性

### 🎨 视觉设计
- 随机背景图片（支持 Unsplash、必应、Picsum）
- 磨砂玻璃效果卡片
- 渐变色主题
- 响应式布局

### ⏰ 时间天气
- 实时时间显示
- 日期和星期
- 智能问候语
- 天气信息（需配置 API Key）

### 💬 每日一言
- 来自一言 API
- 自动刷新
- 手动刷新按钮

### 🔗 网站导航
- 分类标签切换
- 卡片式链接展示
- Hover 动画效果

### 📊 服务器监控
- CPU 使用率
- 内存使用情况
- 磁盘空间
- 网络流量
- 系统运行时间

### 🔍 搜索功能
- 多搜索引擎切换
- 快捷搜索

## 配置说明

所有配置项集中在 `frontend-user/src/config/app.config.js` 文件中。

### API Keys 配置

| 功能 | 配置项 | 获取地址 | 说明 |
|------|--------|----------|------|
| 天气 | `weather.apiKey` | [和风天气](https://dev.qweather.com/) | 免费版每天 1000 次请求 |
| 背景图片 | `background.unsplashAccessKey` | [Unsplash Developers](https://unsplash.com/developers) | 可选，免费版每小时 50 次请求 |

### 配置示例

```javascript
// frontend-user/src/config/app.config.js

// 天气配置
weather: {
  enabled: true,
  apiKey: 'your_qweather_api_key',  // 填入和风天气 API Key
  defaultCity: '北京',
  defaultCityId: '101010100',  // 和风天气城市 ID
}

// 背景图片配置
background: {
  type: 'picsum',  // 可选: 'unsplash', 'bing', 'picsum', 'local'
  unsplashAccessKey: 'your_unsplash_access_key',  // 使用 unsplash 时需要
}
```

### 背景图片来源

| 类型 | 说明 | 是否需要 API Key |
|------|------|------------------|
| `picsum` | Lorem Picsum 随机图片 | ❌ 不需要 |
| `bing` | 必应每日壁纸 | ❌ 不需要 |
| `unsplash` | Unsplash 高质量图片 | ✅ 需要 |
| `local` | 本地配置的图片列表 | ❌ 不需要 |

### 其他配置项

- `dailyQuote`: 每日一言配置（使用一言 API，无需 Key）
- `websites`: 网站链接列表
- `mottos`: 话术文案列表
- `serverInfo`: 服务器监控配置
- `search`: 搜索引擎配置
- `theme`: 主题颜色配置

详细配置说明请查看配置文件中的注释。

## 技术栈

### 前端
- Vue 3 + Composition API
- Vite 5
- Pinia 状态管理
- Axios HTTP 客户端
- SCSS 样式
- @vueuse/core 工具库

### 后端
- Java 17
- Spring Boot 3.2
- OSHI 系统信息库
- Lombok

### 部署
- Docker + Docker Compose
- Nginx 反向代理

## License

MIT
