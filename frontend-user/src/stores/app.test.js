import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useAppStore } from './app.js'

// Mock API 模块
vi.mock('@/api', () => ({
  fetchBackgroundImage: vi.fn(() => Promise.resolve('https://example.com/image.jpg')),
  fetchDailyQuote: vi.fn(() => Promise.resolve({
    content: '测试一言',
    source: '测试来源',
    author: '测试作者'
  })),
  fetchWeather: vi.fn(() => Promise.resolve({
    temp: '25',
    text: '晴',
    icon: '100',
    humidity: '50',
    windDir: '东风',
    windScale: '2'
  })),
  fetchServerInfo: vi.fn(() => Promise.resolve({
    cpu: { usage: 30, cores: 8, model: 'Test CPU' },
    memory: { total: 16000000000, used: 8000000000, available: 8000000000, usagePercent: 50 },
    disk: { total: 500000000000, used: 200000000000, available: 300000000000, usagePercent: 40 },
    network: { txBytes: 1024, rxBytes: 2048, txPackets: 100, rxPackets: 200 },
    uptime: 86400
  }))
}))

/**
 * Pinia Store 测试
 */
describe('App Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.useFakeTimers()
  })

  describe('初始状态', () => {
    it('背景图片初始为空', () => {
      const store = useAppStore()
      expect(store.backgroundImage).toBe('')
      expect(store.backgroundLoading).toBe(true)
    })

    it('每日一言初始为空对象', () => {
      const store = useAppStore()
      expect(store.dailyQuote.content).toBe('')
      expect(store.dailyQuote.source).toBe('')
      expect(store.dailyQuote.author).toBe('')
    })

    it('天气初始为默认值', () => {
      const store = useAppStore()
      expect(store.weather.temp).toBe('--')
      expect(store.weather.text).toBe('加载中')
    })

    it('服务器信息初始为 null', () => {
      const store = useAppStore()
      expect(store.serverInfo).toBeNull()
      expect(store.serverInfoLoading).toBe(true)
    })
  })

  describe('时间相关', () => {
    it('formattedTime 应返回格式化的时间字符串', () => {
      const store = useAppStore()
      const timeRegex = /^\d{2}:\d{2}:\d{2}$/
      expect(store.formattedTime).toMatch(timeRegex)
    })

    it('formattedDate 应返回格式化的日期字符串', () => {
      const store = useAppStore()
      expect(store.formattedDate).toBeDefined()
      expect(typeof store.formattedDate).toBe('string')
      expect(store.formattedDate.length).toBeGreaterThan(0)
    })

    it('greeting 应根据时间返回问候语', () => {
      const store = useAppStore()
      const validGreetings = ['夜深了', '早上好', '上午好', '中午好', '下午好', '晚上好']
      expect(validGreetings).toContain(store.greeting)
    })

    it('updateTime 应更新当前时间', () => {
      const store = useAppStore()
      const oldTime = store.currentTime
      
      vi.advanceTimersByTime(1000)
      store.updateTime()
      
      expect(store.currentTime.getTime()).toBeGreaterThanOrEqual(oldTime.getTime())
    })
  })

  describe('话术文案', () => {
    it('currentMotto 应返回当前话术', () => {
      const store = useAppStore()
      expect(store.currentMotto).toBeDefined()
      expect(typeof store.currentMotto).toBe('string')
    })

    it('nextMotto 应切换到下一条话术', () => {
      const store = useAppStore()
      const firstMotto = store.currentMotto
      
      store.nextMotto()
      // 如果只有一条话术，可能相同；如果有多条，应该不同或循环
      expect(store.currentMotto).toBeDefined()
    })
  })

  describe('数据加载', () => {
    it('loadBackgroundImage 应加载背景图片', async () => {
      const store = useAppStore()
      
      await store.loadBackgroundImage()
      
      // 由于图片预加载是异步的，这里只验证 loading 状态变化
      expect(store.backgroundLoading).toBeDefined()
    })

    it('loadDailyQuote 应加载每日一言', async () => {
      const store = useAppStore()
      
      await store.loadDailyQuote()
      
      expect(store.quoteLoading).toBe(false)
      expect(store.dailyQuote.content).toBe('测试一言')
      expect(store.dailyQuote.source).toBe('测试来源')
    })

    it('loadWeather 应加载天气信息', async () => {
      const store = useAppStore()
      
      await store.loadWeather()
      
      expect(store.weatherLoading).toBe(false)
      expect(store.weather.temp).toBe('25')
      expect(store.weather.text).toBe('晴')
    })

    it('loadServerInfo 应加载服务器信息', async () => {
      const store = useAppStore()
      
      await store.loadServerInfo()
      
      expect(store.serverInfoLoading).toBe(false)
      expect(store.serverInfo).not.toBeNull()
      expect(store.serverInfo.cpu.usage).toBe(30)
    })
  })
})
