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

// 全局 loading 状态管理
const loadingState = {
  count: 0,
  listeners: [],
  
  add() {
    this.count++
    this.notify()
  },
  
  remove() {
    if (this.count > 0) {
      this.count--
      this.notify()
    }
  },
  
  subscribe(listener) {
    this.listeners.push(listener)
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener)
    }
  },
  
  notify() {
    this.listeners.forEach(listener => listener(this.count > 0))
  }
}

// 错误码映射
const ERROR_MESSAGES = {
  400: '请求参数错误',
  401: '未授权，请登录',
  403: '拒绝访问',
  404: '请求资源不存在',
  408: '请求超时',
  500: '服务器内部错误',
  502: '网关错误',
  503: '服务不可用',
  504: '网关超时'
}

// 可重试的错误码
const RETRYABLE_ERRORS = [408, 500, 502, 503, 504, 'ECONNABORTED', 'ETIMEDOUT']

// 最大重试次数
const MAX_RETRIES = 2

// 重试延迟（毫秒）
const RETRY_DELAY = 1000

/**
 * 延迟函数
 * @param {number} ms - 延迟毫秒数
 */
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

/**
 * 检查是否应该重试
 * @param {Object} error - 错误对象
 * @param {number} retryCount - 当前重试次数
 */
function shouldRetry(error, retryCount) {
  if (retryCount >= MAX_RETRIES) return false
  
  const status = error.response?.status
  const code = error.code
  
  if (RETRYABLE_ERRORS.includes(status)) return true
  if (RETRYABLE_ERRORS.includes(code)) return true
  
  return false
}

/**
 * 获取错误消息
 * @param {Object} error - 错误对象
 */
function getErrorMessage(error) {
  const status = error.response?.status
  
  if (status && ERROR_MESSAGES[status]) {
    return ERROR_MESSAGES[status]
  }
  
  if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
    return '请求超时，请稍后重试'
  }
  
  if (error.code === 'ERR_NETWORK' || error.message.includes('Network Error')) {
    return '网络错误，请检查网络连接'
  }
  
  return error.message || '请求失败'
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
    
    // 标记请求开始时间
    config.metadata = { startTime: Date.now() }
    
    // 显示 loading（可选，根据需要）
    if (config.showLoading !== false) {
      loadingState.add()
    }
    
    return config
  },
  (error) => {
    logger.error('API', '请求配置错误:', error)
    loadingState.remove()
    return Promise.reject(error)
  }
)

// 响应拦截器
apiClient.interceptors.response.use(
  (response) => {
    const duration = Date.now() - response.config.metadata?.startTime
    logger.debug('API', `请求成功: ${response.config.url}`, { 
      status: response.status,
      duration: `${duration}ms`
    })
    
    // 隐藏 loading
    if (response.config.showLoading !== false) {
      loadingState.remove()
    }
    
    return response.data
  },
  async (error) => {
    const config = error.config
    
    // 隐藏 loading
    if (config?.showLoading !== false) {
      loadingState.remove()
    }
    
    // 初始化重试计数
    if (!config) {
      config = {}
    }
    config._retryCount = config._retryCount || 0
    
    // 检查是否应该重试
    if (shouldRetry(error, config._retryCount)) {
      config._retryCount++
      
      logger.warn('API', `请求失败，正在重试 (${config._retryCount}/${MAX_RETRIES}): ${config.url}`, {
        status: error.response?.status,
        code: error.code
      })
      
      // 延迟后重试
      await delay(RETRY_DELAY * config._retryCount)
      
      return apiClient(config)
    }
    
    // 记录错误
    const errorMessage = getErrorMessage(error)
    logger.error('API', `请求失败: ${config?.url || 'unknown'}`, {
      status: error.response?.status,
      code: error.code,
      message: errorMessage
    })
    
    // 增强错误对象
    error.userMessage = errorMessage
    error.status = error.response?.status
    error.isTimeout = error.code === 'ECONNABORTED' || error.message?.includes('timeout')
    error.isNetworkError = error.code === 'ERR_NETWORK' || error.message?.includes('Network Error')
    
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
      },
      timeout: 10000
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
    const response = await axios.get('https://www.bing.com/HPImageArchive.aspx?format=js&idx=0&n=1', {
      timeout: 10000
    })
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
    const response = await axios.get(`https://v1.hitokoto.cn/?c=${randomType}&encode=json`, {
      timeout: 10000
    })
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
      `https://${apiHost}/v7/weather/now?location=${cityId}&key=${weatherConfig.apiKey}`,
      { timeout: 10000 }
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

// 导出 loading 状态管理
export const loading = {
  isLoading: () => loadingState.count > 0,
  subscribe: (listener) => loadingState.subscribe(listener)
}

// 导出错误处理工具
export const errorHandler = {
  getErrorMessage,
  shouldRetry,
  ERROR_MESSAGES,
  RETRYABLE_ERRORS
}

export default {
  fetchBackgroundImage,
  fetchDailyQuote,
  fetchWeather,
  fetchServerInfo,
  fetchCpuInfo,
  fetchMemoryInfo,
  fetchDiskInfo,
  fetchNetworkInfo,
  loading,
  errorHandler
}
