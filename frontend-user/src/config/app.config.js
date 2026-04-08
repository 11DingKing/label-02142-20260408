/**
 * 应用配置文件
 * 所有可配置项集中管理，方便后续维护和修改
 */

export default {
  // ==================== 背景图片配置 ====================
  background: {
    /**
     * 背景图片来源类型
     * - 'unsplash': 使用 Unsplash API 获取随机图片
     * - 'bing': 使用必应每日壁纸
     * - 'local': 使用本地配置的图片列表
     * - 'picsum': 使用 Lorem Picsum 随机图片（无需 API Key）
     */
    type: 'picsum',

    /**
     * Unsplash API Access Key
     * 获取地址: https://unsplash.com/developers
     * 注意: 免费版每小时限制 50 次请求
     */
    unsplashAccessKey: '',

    /**
     * Unsplash 图片搜索关键词
     * 用于获取特定主题的图片
     */
    unsplashQuery: 'nature,landscape,mountain',

    /**
     * 本地图片列表
     * 当 type 为 'local' 时使用
     * 支持相对路径和绝对 URL
     */
    localImages: [
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4',
      'https://images.unsplash.com/photo-1469474968028-56623f02e42e',
      'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d'
    ],

    /**
     * 背景图片刷新间隔（毫秒）
     * 默认: 3600000 (1小时)
     */
    refreshInterval: 3600000,

    /**
     * 背景图片模糊程度 (px)
     */
    blurAmount: 0,

    /**
     * 背景遮罩透明度 (0-1)
     * 用于提高文字可读性
     */
    overlayOpacity: 0.3
  },

  // ==================== 天气配置 ====================
  weather: {
    /**
     * 是否启用天气模块
     */
    enabled: true,

    /**
     * 和风天气 API Key
     * 获取地址: https://dev.qweather.com/
     * 免费版每天限制 1000 次请求
     */
    apiKey: '75d6e3462317483ca6a9a272aa62a1d9',

    /**
     * 和风天气 API Host
     * 在控制台-项目管理中查看你的 API Host
     * 免费订阅默认为: devapi.qweather.com
     * 付费订阅格式为: xxx.qweatherapi.com
     */
    apiHost: 'nb73jqmdxb.re.qweatherapi.com',

    /**
     * 默认城市名称
     * 当无法获取地理位置时使用
     */
    defaultCity: '北京',

    /**
     * 默认城市 ID（和风天气城市 ID）
     * 北京: 101010100
     */
    defaultCityId: '101010100',

    /**
     * 温度单位
     * - 'metric': 摄氏度
     * - 'imperial': 华氏度
     */
    unit: 'metric',

    /**
     * 天气数据刷新间隔（毫秒）
     * 默认: 1800000 (30分钟)
     */
    refreshInterval: 1800000
  },

  // ==================== 时间日期配置 ====================
  datetime: {
    /**
     * 时间格式
     * - '24h': 24小时制
     * - '12h': 12小时制
     */
    timeFormat: '24h',

    /**
     * 是否显示秒
     */
    showSeconds: true,

    /**
     * 日期格式
     * 使用 Intl.DateTimeFormat 格式
     */
    dateFormat: {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    },

    /**
     * 语言区域
     */
    locale: 'zh-CN'
  },

  // ==================== 每日一言配置 ====================
  dailyQuote: {
    /**
     * 是否启用每日一言模块
     */
    enabled: true,

    /**
     * 一言 API 类型
     * - 'a': 动画
     * - 'b': 漫画
     * - 'c': 游戏
     * - 'd': 文学
     * - 'e': 原创
     * - 'f': 来自网络
     * - 'g': 其他
     * - 'h': 影视
     * - 'i': 诗词
     * - 'j': 网易云
     * - 'k': 哲学
     * - 'l': 抖机灵
     * 可以组合使用，如 'a,b,c'
     */
    type: 'd,i,k',

    /**
     * 刷新间隔（毫秒）
     * 默认: 60000 (1分钟)
     */
    refreshInterval: 60000,

    /**
     * 是否显示来源
     */
    showSource: true
  },

  // ==================== 网站链接配置 ====================
  websites: {
    /**
     * 是否启用网站链接模块
     */
    enabled: true,

    /**
     * 网站分类及链接列表
     * icon 支持: emoji 或 图片 URL
     */
    categories: [
      {
        name: '常用工具',
        links: [
          { name: 'Google', url: 'https://www.google.com', icon: '🔍', description: '搜索引擎' },
          { name: 'GitHub', url: 'https://github.com', icon: '🐙', description: '代码托管' },
          { name: 'ChatGPT', url: 'https://chat.openai.com', icon: '🤖', description: 'AI 助手' },
          { name: 'Notion', url: 'https://notion.so', icon: '📝', description: '笔记工具' }
        ]
      },
      {
        name: '开发资源',
        links: [
          { name: 'MDN', url: 'https://developer.mozilla.org', icon: '📚', description: 'Web 文档' },
          { name: 'Stack Overflow', url: 'https://stackoverflow.com', icon: '💬', description: '技术问答' },
          { name: 'NPM', url: 'https://www.npmjs.com', icon: '📦', description: '包管理' },
          { name: 'Can I Use', url: 'https://caniuse.com', icon: '✅', description: '兼容性查询' }
        ]
      },
      {
        name: '设计资源',
        links: [
          { name: 'Dribbble', url: 'https://dribbble.com', icon: '🎨', description: '设计灵感' },
          { name: 'Figma', url: 'https://figma.com', icon: '✏️', description: '设计工具' },
          { name: 'Unsplash', url: 'https://unsplash.com', icon: '📷', description: '免费图片' },
          { name: 'IconFont', url: 'https://www.iconfont.cn', icon: '🎯', description: '图标库' }
        ]
      },
      {
        name: '娱乐休闲',
        links: [
          { name: 'YouTube', url: 'https://youtube.com', icon: '▶️', description: '视频平台' },
          { name: 'Spotify', url: 'https://spotify.com', icon: '🎵', description: '音乐平台' },
          { name: 'Reddit', url: 'https://reddit.com', icon: '📰', description: '社区论坛' },
          { name: 'Twitter', url: 'https://twitter.com', icon: '🐦', description: '社交媒体' }
        ]
      }
    ]
  },

  // ==================== 话术文案配置 ====================
  mottos: {
    /**
     * 是否启用话术文案模块
     */
    enabled: true,

    /**
     * 文案列表
     * 随机展示其中一条
     */
    list: [
      '代码改变世界，创意点亮生活',
      '保持学习，保持进步',
      '简约而不简单',
      '今天也要加油鸭 🦆',
      '愿你的代码永无 Bug',
      '生活不止眼前的代码，还有诗和远方',
      '每一行代码都是一次思考的结晶',
      'Stay hungry, Stay foolish'
    ],

    /**
     * 切换间隔（毫秒）
     * 默认: 10000 (10秒)
     */
    switchInterval: 10000
  },

  // ==================== 服务器信息配置 ====================
  serverInfo: {
    /**
     * 是否启用服务器信息模块
     */
    enabled: true,

    /**
     * 后端 API 地址
     * 留空则使用相对路径 /api
     */
    apiBaseUrl: '',

    /**
     * 数据刷新间隔（毫秒）
     * 默认: 5000 (5秒)
     */
    refreshInterval: 5000,

    /**
     * 显示的信息项
     */
    showItems: {
      cpu: true,
      memory: true,
      disk: true,
      network: true,
      uptime: true
    }
  },

  // ==================== 搜索框配置 ====================
  search: {
    /**
     * 是否启用搜索框
     */
    enabled: true,

    /**
     * 默认搜索引擎
     */
    defaultEngine: 'google',

    /**
     * 搜索引擎列表
     */
    engines: [
      { key: 'google', name: 'Google', url: 'https://www.google.com/search?q=' },
      { key: 'bing', name: 'Bing', url: 'https://www.bing.com/search?q=' },
      { key: 'baidu', name: '百度', url: 'https://www.baidu.com/s?wd=' },
      { key: 'github', name: 'GitHub', url: 'https://github.com/search?q=' }
    ],

    /**
     * 搜索框占位符
     */
    placeholder: '搜索...'
  },

  // ==================== 主题配置 ====================
  theme: {
    /**
     * 主色调
     */
    primaryColor: '#667eea',

    /**
     * 渐变色
     */
    gradientStart: '#667eea',
    gradientEnd: '#764ba2',

    /**
     * 磨砂玻璃背景透明度 (0-1)
     */
    glassOpacity: 0.15,

    /**
     * 磨砂玻璃模糊程度 (px)
     */
    glassBlur: 20,

    /**
     * 卡片圆角 (px)
     */
    borderRadius: 16,

    /**
     * 动画持续时间 (s)
     */
    animationDuration: 0.3
  },

  // ==================== 布局配置 ====================
  layout: {
    /**
     * 最大内容宽度 (px)
     */
    maxWidth: 1400,

    /**
     * 内容内边距 (px)
     */
    padding: 24,

    /**
     * 模块间距 (px)
     */
    gap: 24
  }
}
