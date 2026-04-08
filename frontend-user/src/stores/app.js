/**
 * 应用状态管理
 * 使用 Pinia 管理全局状态
 */
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { 
  fetchBackgroundImage, 
  fetchDailyQuote, 
  fetchWeather,
  fetchServerInfo 
} from '@/api'
import config from '@/config/app.config.js'

// 日志工具
const logger = {
  info: (message, data = null) => {
    console.log(`[AppStore] ${message}`, data ? data : '')
  },
  warn: (message, data = null) => {
    console.warn(`[AppStore] ${message}`, data ? data : '')
  },
  error: (message, error = null) => {
    console.error(`[AppStore] ${message}`, error ? error : '')
  },
  debug: (message, data = null) => {
    if (import.meta.env.DEV) {
      console.debug(`[AppStore] ${message}`, data ? data : '')
    }
  }
}

export const useAppStore = defineStore('app', () => {
  // ==================== 背景图片状态 ====================
  const backgroundImage = ref('')
  const backgroundLoading = ref(true)
  
  /**
   * 加载背景图片
   */
  async function loadBackgroundImage() {
    logger.info('开始加载背景图片')
    backgroundLoading.value = true
    try {
      const imageUrl = await fetchBackgroundImage()
      // 预加载图片
      const img = new Image()
      img.onload = () => {
        backgroundImage.value = imageUrl
        backgroundLoading.value = false
        logger.info('背景图片加载完成')
      }
      img.onerror = () => {
        logger.error('背景图片加载失败')
        backgroundLoading.value = false
      }
      img.src = imageUrl
    } catch (error) {
      logger.error('加载背景图片异常', error)
      backgroundLoading.value = false
    }
  }
  
  // ==================== 每日一言状态 ====================
  const dailyQuote = ref({
    content: '',
    source: '',
    author: ''
  })
  const quoteLoading = ref(true)
  
  /**
   * 加载每日一言
   */
  async function loadDailyQuote() {
    logger.info('开始加载每日一言')
    quoteLoading.value = true
    try {
      const quote = await fetchDailyQuote()
      dailyQuote.value = quote
      logger.info('每日一言加载完成', { source: quote.source })
    } catch (error) {
      logger.error('加载每日一言失败', error)
    } finally {
      quoteLoading.value = false
    }
  }
  
  // ==================== 天气状态 ====================
  const weather = ref({
    temp: '--',
    text: '加载中',
    icon: '100',
    humidity: '--',
    windDir: '',
    windScale: ''
  })
  const weatherLoading = ref(true)
  const currentCity = ref(config.weather.defaultCity)
  
  /**
   * 加载天气信息
   */
  async function loadWeather() {
    logger.info('开始加载天气信息')
    weatherLoading.value = true
    try {
      const cityId = config.weather.defaultCityId
      const weatherData = await fetchWeather(cityId)
      weather.value = weatherData
      logger.info('天气信息加载完成', { temp: weatherData.temp, text: weatherData.text })
    } catch (error) {
      logger.error('加载天气信息失败', error)
    } finally {
      weatherLoading.value = false
    }
  }
  
  // ==================== 服务器信息状态 ====================
  const serverInfo = ref(null)
  const serverInfoLoading = ref(true)
  const serverInfoError = ref(false)
  
  /**
   * 加载服务器信息
   */
  async function loadServerInfo() {
    if (!config.serverInfo.enabled) {
      logger.debug('服务器信息模块已禁用')
      serverInfoLoading.value = false
      return
    }
    
    logger.info('开始加载服务器信息')
    try {
      const info = await fetchServerInfo()
      if (info) {
        serverInfo.value = info
        serverInfoError.value = false
        logger.info('服务器信息加载完成', {
          cpu: info.cpu?.usage,
          memory: info.memory?.usagePercent
        })
      } else {
        serverInfoError.value = true
        logger.warn('服务器信息返回为空')
      }
    } catch (error) {
      logger.error('加载服务器信息失败', error)
      serverInfoError.value = true
    } finally {
      serverInfoLoading.value = false
    }
  }
  
  // ==================== 话术文案状态 ====================
  const currentMottoIndex = ref(0)
  const mottos = computed(() => config.mottos.list)
  const currentMotto = computed(() => mottos.value[currentMottoIndex.value] || '')
  
  /**
   * 切换到下一条话术
   */
  function nextMotto() {
    currentMottoIndex.value = (currentMottoIndex.value + 1) % mottos.value.length
  }
  
  // ==================== 时间状态 ====================
  const currentTime = ref(new Date())
  
  /**
   * 更新当前时间
   */
  function updateTime() {
    currentTime.value = new Date()
  }
  
  // 格式化时间
  const formattedTime = computed(() => {
    const date = currentTime.value
    const hours = date.getHours().toString().padStart(2, '0')
    const minutes = date.getMinutes().toString().padStart(2, '0')
    const seconds = date.getSeconds().toString().padStart(2, '0')
    
    if (config.datetime.showSeconds) {
      return `${hours}:${minutes}:${seconds}`
    }
    return `${hours}:${minutes}`
  })
  
  // 格式化日期
  const formattedDate = computed(() => {
    return currentTime.value.toLocaleDateString(
      config.datetime.locale,
      config.datetime.dateFormat
    )
  })
  
  // 问候语
  const greeting = computed(() => {
    const hour = currentTime.value.getHours()
    if (hour < 6) return '夜深了'
    if (hour < 9) return '早上好'
    if (hour < 12) return '上午好'
    if (hour < 14) return '中午好'
    if (hour < 18) return '下午好'
    if (hour < 22) return '晚上好'
    return '夜深了'
  })
  
  // ==================== 初始化 ====================
  /**
   * 初始化应用数据
   */
  async function initializeApp() {
    logger.info('开始初始化应用')
    const startTime = Date.now()
    
    // 并行加载所有数据
    await Promise.all([
      loadBackgroundImage(),
      loadDailyQuote(),
      loadWeather(),
      loadServerInfo()
    ])
    
    const duration = Date.now() - startTime
    logger.info(`应用初始化完成 - 耗时: ${duration}ms`)
    
    // 启动定时器
    startTimers()
  }
  
  /**
   * 启动各种定时器
   */
  function startTimers() {
    logger.info('启动定时器')
    
    // 时间更新（每秒）
    setInterval(updateTime, 1000)
    
    // 话术切换
    if (config.mottos.enabled) {
      setInterval(nextMotto, config.mottos.switchInterval)
      logger.debug('话术切换定时器已启动', { interval: config.mottos.switchInterval })
    }
    
    // 背景图片刷新
    setInterval(loadBackgroundImage, config.background.refreshInterval)
    logger.debug('背景刷新定时器已启动', { interval: config.background.refreshInterval })
    
    // 每日一言刷新
    if (config.dailyQuote.enabled) {
      setInterval(loadDailyQuote, config.dailyQuote.refreshInterval)
      logger.debug('一言刷新定时器已启动', { interval: config.dailyQuote.refreshInterval })
    }
    
    // 天气刷新
    if (config.weather.enabled) {
      setInterval(loadWeather, config.weather.refreshInterval)
      logger.debug('天气刷新定时器已启动', { interval: config.weather.refreshInterval })
    }
    
    // 服务器信息刷新
    if (config.serverInfo.enabled) {
      setInterval(loadServerInfo, config.serverInfo.refreshInterval)
      logger.debug('服务器信息刷新定时器已启动', { interval: config.serverInfo.refreshInterval })
    }
    
    logger.info('所有定时器启动完成')
  }
  
  return {
    // 背景
    backgroundImage,
    backgroundLoading,
    loadBackgroundImage,
    
    // 一言
    dailyQuote,
    quoteLoading,
    loadDailyQuote,
    
    // 天气
    weather,
    weatherLoading,
    currentCity,
    loadWeather,
    
    // 服务器
    serverInfo,
    serverInfoLoading,
    serverInfoError,
    loadServerInfo,
    
    // 话术
    currentMotto,
    nextMotto,
    
    // 时间
    currentTime,
    formattedTime,
    formattedDate,
    greeting,
    updateTime,
    
    // 初始化
    initializeApp
  }
})
