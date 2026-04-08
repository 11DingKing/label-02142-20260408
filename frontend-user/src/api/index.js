/**
 * API 请求模块
 * 封装所有外部 API 调用
 */
import axios from 'axios'
import config from '@/config/app.config.js'

// 日志工具函数
const logger = {
  info: (module, message, data = null) => {
    console.log(`[${module}] ${message}`, data ? data : '')
  },
  warn: (module, message, data = null) => {
    console.warn(`[${module}] ${message}`, data ? data : '')
  },
  error: (module, message, error = null) => {
    console.error(`[${module}] ${message}`, error ? error : '')
  },
  debug: (module, message, data = null) => {
    if (import.meta.env.DEV) {
      console.debug(`[${module}] ${message}`, data ? data : '')
    }
  }
}

// 创建 axios 实例
const apiClient = axios.create({
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// 请求拦截器
apiClient.interceptors.request.use(
  (config) => {
    logger.debug('API', `发起请求: ${config.method?.toUpperCase()} ${config.url}`)
    return config
  },
  (error) => {
    logger.error('API', '请求配置错误:', error)
    return Promise.reject(error)
  }
)

// 响应拦截器
apiClient.interceptors.response.use(
  (response) => {
    logger.debug('API', `请求成功: ${response.config.url}`, { status: response.status })
    return response.data
  },
  (error) => {
    logger.error('API', `请求失败: ${error.config?.url}`, {
      status: error.response?.status,
      message: error.message
    })
    return Promise.reject(error)
  }
)

/**
 * 获取随机背景图片
 * @returns {Promise<string>} 图片 URL
 */
export async function fetchBackgroundImage() {
  const bgConfig = config.background
  logger.info('Background', `开始获取背景图片, 类型: ${bgConfig.type}`)
  
  try {
    let imageUrl
    switch (bgConfig.type) {
      case 'unsplash':
        if (!bgConfig.unsplashAccessKey) {
          logger.warn('Background', 'Unsplash API Key 未配置, 使用 picsum')
          imageUrl = await fetchPicsumImage()
        } else {
          imageUrl = await fetchUnsplashImage()
        }
        break
      
      case 'bing':
        imageUrl = await fetchBingImage()
        break
      
      case 'local':
        imageUrl = getRandomLocalImage()
        break
      
      case 'picsum':
      default:
        imageUrl = await fetchPicsumImage()
    }
    
    logger.info('Background', '背景图片获取成功', { url: imageUrl?.substring(0, 50) + '...' })
    return imageUrl
  } catch (error) {
    logger.error('Background', '获取背景图片失败', error)
    return fetchPicsumImage()
  }
}

/**
 * 从 Unsplash 获取随机图片
 */
async function fetchUnsplashImage() {
  const bgConfig = config.background
  const url = `https://api.unsplash.com/photos/random?query=${bgConfig.unsplashQuery}&orientation=landscape`
  
  logger.debug('Background', '从 Unsplash 获取图片', { query: bgConfig.unsplashQuery })
  
  try {
    const response = await axios.get(url, {
      headers: {
        Authorization: `Client-ID ${bgConfig.unsplashAccessKey}`
      }
    })
    logger.info('Background', 'Unsplash 图片获取成功')
    return response.data.urls.regular
  } catch (error) {
    logger.error('Background', 'Unsplash 图片获取失败', error)
    return fetchPicsumImage()
  }
}

/**
 * 从必应获取每日壁纸
 */
async function fetchBingImage() {
  logger.debug('Background', '从必应获取每日壁纸')
  
  try {
    // 使用代理或直接访问必应 API
    const response = await axios.get('https://www.bing.com/HPImageArchive.aspx?format=js&idx=0&n=1')
    const imagePath = response.data.images[0].url
    const imageUrl = `https://www.bing.com${imagePath}`
    logger.info('Background', '必应壁纸获取成功')
    return imageUrl
  } catch (error) {
    logger.error('Background', '必应壁纸获取失败', error)
    return fetchPicsumImage()
  }
}

/**
 * 从 Lorem Picsum 获取随机图片（无需 API Key）
 */
async function fetchPicsumImage() {
  const width = window.innerWidth
  const height = window.innerHeight
  // 添加随机参数避免缓存
  const random = Math.floor(Math.random() * 1000)
  const url = `https://picsum.photos/${width}/${height}?random=${random}`
  logger.debug('Background', 'Picsum 图片 URL 生成', { width, height, random })
  return url
}

/**
 * 获取本地配置的随机图片
 */
function getRandomLocalImage() {
  const images = config.background.localImages
  if (!images || images.length === 0) {
    logger.warn('Background', '本地图片列表为空, 使用 picsum')
    return fetchPicsumImage()
  }
  const randomIndex = Math.floor(Math.random() * images.length)
  logger.debug('Background', '选择本地图片', { index: randomIndex })
  return images[randomIndex]
}

/**
 * 获取每日一言
 * @returns {Promise<Object>} 一言数据
 */
export async function fetchDailyQuote() {
  const quoteConfig = config.dailyQuote
  // 一言 API 的 c 参数只能是单个字符，随机选择一个类型
  const types = (quoteConfig.type || 'd').split(',')
  const randomType = types[Math.floor(Math.random() * types.length)].trim()
  
  logger.info('DailyQuote', '开始获取每日一言', { type: randomType })
  
  try {
    const response = await axios.get(`https://v1.hitokoto.cn/?c=${randomType}&encode=json`)
    const quote = {
      content: response.data.hitokoto,
      source: response.data.from || '佚名',
      author: response.data.from_who || ''
    }
    logger.info('DailyQuote', '每日一言获取成功', { source: quote.source })
    return quote
  } catch (error) {
    logger.error('DailyQuote', '获取每日一言失败', error)
    // 返回默认一言
    return {
      content: '生活不止眼前的代码，还有诗和远方。',
      source: '程序员箴言',
      author: ''
    }
  }
}

/**
 * 获取天气信息
 * @param {string} cityId 城市 ID
 * @returns {Promise<Object>} 天气数据
 */
export async function fetchWeather(cityId) {
  const weatherConfig = config.weather
  
  logger.info('Weather', '开始获取天气信息', { cityId })
  
  if (!weatherConfig.apiKey) {
    logger.warn('Weather', '天气 API Key 未配置, 返回模拟数据')
    return getMockWeather()
  }
  
  try {
    // 和风天气 API - 使用 URL 参数方式传递 API KEY
    const apiHost = weatherConfig.apiHost || 'devapi.qweather.com'
    const response = await axios.get(
      `https://${apiHost}/v7/weather/now?location=${cityId}&key=${weatherConfig.apiKey}`
    )
    
    if (response.data.code === '200') {
      const now = response.data.now
      const weather = {
        temp: now.temp,
        text: now.text,
        icon: now.icon,
        humidity: now.humidity,
        windDir: now.windDir,
        windScale: now.windScale
      }
      logger.info('Weather', '天气信息获取成功', { temp: weather.temp, text: weather.text })
      return weather
    }
    logger.warn('Weather', '天气 API 返回非 200 状态', { code: response.data.code })
    return getMockWeather()
  } catch (error) {
    logger.error('Weather', '获取天气信息失败', error)
    return getMockWeather()
  }
}

/**
 * 获取模拟天气数据（当 API 不可用时）
 */
function getMockWeather() {
  logger.debug('Weather', '返回模拟天气数据')
  return {
    temp: '--',
    text: '晴',
    icon: '100',
    humidity: '--',
    windDir: '东风',
    windScale: '2'
  }
}

/**
 * 获取服务器信息
 * @returns {Promise<Object>} 服务器信息
 */
export async function fetchServerInfo() {
  const serverConfig = config.serverInfo
  const baseUrl = serverConfig.apiBaseUrl || ''
  
  logger.info('ServerInfo', '开始获取服务器信息', { baseUrl })
  
  try {
    const startTime = Date.now()
    const response = await apiClient.get(`${baseUrl}/api/server/info`)
    const duration = Date.now() - startTime
    logger.info('ServerInfo', `服务器信息获取成功 - 耗时: ${duration}ms`, {
      cpu: response?.cpu?.usage,
      memory: response?.memory?.usagePercent
    })
    return response
  } catch (error) {
    logger.error('ServerInfo', '获取服务器信息失败', error)
    return null
  }
}

/**
 * 获取 CPU 使用率
 */
export async function fetchCpuInfo() {
  const serverConfig = config.serverInfo
  const baseUrl = serverConfig.apiBaseUrl || ''
  
  logger.debug('ServerInfo', '获取 CPU 信息')
  
  try {
    const response = await apiClient.get(`${baseUrl}/api/server/cpu`)
    logger.info('ServerInfo', 'CPU 信息获取成功', { usage: response?.data?.usage })
    return response
  } catch (error) {
    logger.error('ServerInfo', '获取 CPU 信息失败', error)
    return null
  }
}

/**
 * 获取内存使用情况
 */
export async function fetchMemoryInfo() {
  const serverConfig = config.serverInfo
  const baseUrl = serverConfig.apiBaseUrl || ''
  
  logger.debug('ServerInfo', '获取内存信息')
  
  try {
    const response = await apiClient.get(`${baseUrl}/api/server/memory`)
    logger.info('ServerInfo', '内存信息获取成功', { usagePercent: response?.data?.usagePercent })
    return response
  } catch (error) {
    logger.error('ServerInfo', '获取内存信息失败', error)
    return null
  }
}

/**
 * 获取磁盘使用情况
 */
export async function fetchDiskInfo() {
  const serverConfig = config.serverInfo
  const baseUrl = serverConfig.apiBaseUrl || ''
  
  logger.debug('ServerInfo', '获取磁盘信息')
  
  try {
    const response = await apiClient.get(`${baseUrl}/api/server/disk`)
    logger.info('ServerInfo', '磁盘信息获取成功', { usagePercent: response?.data?.usagePercent })
    return response
  } catch (error) {
    logger.error('ServerInfo', '获取磁盘信息失败', error)
    return null
  }
}

/**
 * 获取网络流量信息
 */
export async function fetchNetworkInfo() {
  const serverConfig = config.serverInfo
  const baseUrl = serverConfig.apiBaseUrl || ''
  
  logger.debug('ServerInfo', '获取网络信息')
  
  try {
    const response = await apiClient.get(`${baseUrl}/api/server/network`)
    logger.info('ServerInfo', '网络信息获取成功', {
      txBytes: response?.data?.txBytes,
      rxBytes: response?.data?.rxBytes
    })
    return response
  } catch (error) {
    logger.error('ServerInfo', '获取网络信息失败', error)
    return null
  }
}

export default {
  fetchBackgroundImage,
  fetchDailyQuote,
  fetchWeather,
  fetchServerInfo,
  fetchCpuInfo,
  fetchMemoryInfo,
  fetchDiskInfo,
  fetchNetworkInfo
}
