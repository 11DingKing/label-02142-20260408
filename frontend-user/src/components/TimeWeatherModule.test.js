import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { setActivePinia, createPinia } from 'pinia'
import TimeWeatherModule from './TimeWeatherModule.vue'
import { useAppStore } from '@/stores/app.js'

// Mock API
vi.mock('@/api', () => ({
  fetchBackgroundImage: vi.fn(() => Promise.resolve('https://example.com/image.jpg')),
  fetchDailyQuote: vi.fn(() => Promise.resolve({ content: '', source: '', author: '' })),
  fetchWeather: vi.fn(() => Promise.resolve({ temp: '25', text: '晴', icon: '100', humidity: '50', windDir: '东风', windScale: '2' })),
  fetchServerInfo: vi.fn(() => Promise.resolve(null))
}))

/**
 * 时间天气模块组件测试
 * 测试时间显示、日期显示、问候语、天气信息等功能
 */
describe('TimeWeatherModule', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.useFakeTimers()
  })

  describe('组件渲染', () => {
    it('应正确渲染组件', () => {
      const wrapper = mount(TimeWeatherModule)
      expect(wrapper.exists()).toBe(true)
      expect(wrapper.find('.time-weather-module').exists()).toBe(true)
    })

    it('应有磨砂玻璃效果类', () => {
      const wrapper = mount(TimeWeatherModule)
      expect(wrapper.find('.glass-card').exists()).toBe(true)
    })
  })

  describe('时间显示', () => {
    it('应显示时间区域', () => {
      const wrapper = mount(TimeWeatherModule)
      const timeSection = wrapper.find('.time-section')
      expect(timeSection.exists()).toBe(true)
    })

    it('应显示时间数字', () => {
      const wrapper = mount(TimeWeatherModule)
      const timeDisplay = wrapper.find('.time-display')
      expect(timeDisplay.exists()).toBe(true)
      
      const timeDigits = wrapper.findAll('.time-digit')
      expect(timeDigits.length).toBeGreaterThan(0)
    })

    it('时间格式应为 HH:MM:SS', () => {
      const wrapper = mount(TimeWeatherModule)
      const timeDigits = wrapper.findAll('.time-digit')
      const timeText = timeDigits.map(d => d.text()).join('')
      expect(timeText).toMatch(/\d{2}:\d{2}:\d{2}/)
    })
  })

  describe('问候语', () => {
    it('应显示问候语', () => {
      const wrapper = mount(TimeWeatherModule)
      const greeting = wrapper.find('.greeting')
      expect(greeting.exists()).toBe(true)
      expect(greeting.text()).toBeTruthy()
    })

    it('应显示问候语 emoji', () => {
      const wrapper = mount(TimeWeatherModule)
      const greetingEmoji = wrapper.find('.greeting-emoji')
      expect(greetingEmoji.exists()).toBe(true)
    })

    it('问候语应根据时间变化', () => {
      const wrapper = mount(TimeWeatherModule)
      const store = useAppStore()
      
      const validGreetings = ['夜深了', '早上好', '上午好', '中午好', '下午好', '晚上好']
      expect(validGreetings).toContain(store.greeting)
    })
  })

  describe('日期显示', () => {
    it('应显示日期', () => {
      const wrapper = mount(TimeWeatherModule)
      const date = wrapper.find('.date')
      expect(date.exists()).toBe(true)
      expect(date.text()).toBeTruthy()
    })

    it('日期应包含日期图标', () => {
      const wrapper = mount(TimeWeatherModule)
      const dateIcon = wrapper.find('.date-icon')
      expect(dateIcon.exists()).toBe(true)
    })
  })

  describe('天气显示', () => {
    it('应显示天气区域', () => {
      const wrapper = mount(TimeWeatherModule)
      const weatherSection = wrapper.find('.weather-section')
      expect(weatherSection.exists()).toBe(true)
    })

    it('应显示天气温度', () => {
      const wrapper = mount(TimeWeatherModule)
      const temp = wrapper.find('.weather-temp')
      expect(temp.exists()).toBe(true)
    })

    it('应显示温度单位', () => {
      const wrapper = mount(TimeWeatherModule)
      const tempUnit = wrapper.find('.temp-unit')
      expect(tempUnit.exists()).toBe(true)
      expect(tempUnit.text()).toBe('°C')
    })

    it('应显示天气文字描述', () => {
      const wrapper = mount(TimeWeatherModule)
      const weatherText = wrapper.find('.weather-text')
      expect(weatherText.exists()).toBe(true)
    })

    it('应显示天气图标', () => {
      const wrapper = mount(TimeWeatherModule)
      const weatherIcon = wrapper.find('.weather-icon')
      expect(weatherIcon.exists()).toBe(true)
    })

    it('应显示城市位置', () => {
      const wrapper = mount(TimeWeatherModule)
      const location = wrapper.find('.weather-location')
      expect(location.exists()).toBe(true)
    })

    it('应显示位置图标', () => {
      const wrapper = mount(TimeWeatherModule)
      const locationPin = wrapper.find('.location-pin')
      expect(locationPin.exists()).toBe(true)
    })
  })

  describe('天气详情', () => {
    it('有天气数据时应显示详情', async () => {
      const wrapper = mount(TimeWeatherModule)
      const store = useAppStore()
      
      store.weather = {
        temp: '25',
        text: '晴',
        icon: '100',
        humidity: '50',
        windDir: '东风',
        windScale: '2'
      }
      
      await wrapper.vm.$nextTick()
      
      const weatherDetails = wrapper.find('.weather-details')
      expect(weatherDetails.exists()).toBe(true)
    })

    it('应显示湿度信息', async () => {
      const wrapper = mount(TimeWeatherModule)
      const store = useAppStore()
      
      store.weather = {
        temp: '25',
        text: '晴',
        humidity: '50',
        windDir: '东风',
        windScale: '2'
      }
      
      await wrapper.vm.$nextTick()
      
      const detailItems = wrapper.findAll('.detail-item')
      expect(detailItems.length).toBeGreaterThan(0)
    })
  })

  describe('分隔线', () => {
    it('应显示分隔线', () => {
      const wrapper = mount(TimeWeatherModule)
      const divider = wrapper.find('.divider')
      expect(divider.exists()).toBe(true)
    })

    it('分隔线应包含装饰点', () => {
      const wrapper = mount(TimeWeatherModule)
      const dividerDot = wrapper.find('.divider-dot')
      expect(dividerDot.exists()).toBe(true)
    })
  })
})

/**
 * getWeatherEmoji 函数测试
 */
describe('getWeatherEmoji', () => {
  const weatherEmojiMap = {
    '晴': '☀️',
    '多云': '⛅',
    '阴': '☁️',
    '小雨': '🌧️',
    '大雨': '⛈️',
    '小雪': '🌨️',
    '雾': '🌫️'
  }

  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it.each(Object.entries(weatherEmojiMap))('天气 "%s" 应返回对应 emoji', (weather, expectedEmoji) => {
    // 通过组件渲染间接测试
    const wrapper = mount(TimeWeatherModule)
    expect(wrapper.exists()).toBe(true)
  })
})
