import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import axios from 'axios'

// Mock axios
vi.mock('axios', () => ({
  default: {
    create: vi.fn(() => ({
      get: vi.fn(),
      interceptors: {
        request: { use: vi.fn() },
        response: { use: vi.fn() }
      }
    })),
    get: vi.fn()
  }
}))

// Mock config
vi.mock('@/config/app.config.js', () => ({
  default: {
    background: {
      type: 'picsum',
      unsplashAccessKey: '',
      unsplashQuery: 'nature',
      localImages: ['https://example.com/1.jpg', 'https://example.com/2.jpg'],
      refreshInterval: 3600000
    },
    weather: {
      enabled: true,
      apiKey: '',
      defaultCity: '北京',
      defaultCityId: '101010100'
    },
    dailyQuote: {
      enabled: true,
      type: 'd',
      refreshInterval: 60000
    },
    serverInfo: {
      enabled: true,
      apiBaseUrl: '',
      refreshInterval: 5000
    }
  }
}))

/**
 * API 模块测试
 */
describe('API Module', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    // Mock window dimensions
    Object.defineProperty(window, 'innerWidth', { value: 1920, writable: true })
    Object.defineProperty(window, 'innerHeight', { value: 1080, writable: true })
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('fetchBackgroundImage', () => {
    it('picsum 模式应返回正确格式的 URL', async () => {
      // 动态导入以获取 mock 后的模块
      const { fetchBackgroundImage } = await import('./index.js')
      
      const result = await fetchBackgroundImage()
      
      expect(result).toMatch(/^https:\/\/picsum\.photos\/\d+\/\d+\?random=\d+$/)
    })
  })

  describe('fetchDailyQuote', () => {
    it('应调用一言 API 并返回格式化数据', async () => {
      const mockResponse = {
        data: {
          hitokoto: '测试一言内容',
          from: '测试来源',
          from_who: '测试作者'
        }
      }
      
      axios.get.mockResolvedValueOnce(mockResponse)
      
      const { fetchDailyQuote } = await import('./index.js')
      const result = await fetchDailyQuote()
      
      expect(result).toEqual({
        content: '测试一言内容',
        source: '测试来源',
        author: '测试作者'
      })
    })

    it('API 失败时应返回默认一言', async () => {
      axios.get.mockRejectedValueOnce(new Error('Network error'))
      
      const { fetchDailyQuote } = await import('./index.js')
      const result = await fetchDailyQuote()
      
      expect(result.content).toBeDefined()
      expect(result.source).toBeDefined()
    })
  })

  describe('fetchWeather', () => {
    it('无 API Key 时应返回模拟数据', async () => {
      const { fetchWeather } = await import('./index.js')
      const result = await fetchWeather('101010100')
      
      expect(result).toBeDefined()
      expect(result.temp).toBeDefined()
      expect(result.text).toBeDefined()
    })
  })
})

/**
 * 工具函数测试
 */
describe('Utility Functions', () => {
  describe('URL 格式验证', () => {
    it('Picsum URL 应包含正确的参数', () => {
      const width = 1920
      const height = 1080
      const random = 123
      const url = `https://picsum.photos/${width}/${height}?random=${random}`
      
      expect(url).toContain('picsum.photos')
      expect(url).toContain(`${width}/${height}`)
      expect(url).toContain('random=')
    })
  })
})
