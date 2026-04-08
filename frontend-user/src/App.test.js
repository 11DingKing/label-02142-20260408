import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { setActivePinia, createPinia } from 'pinia'
import App from './App.vue'

// Mock 所有子组件
vi.mock('@/components/BackgroundModule.vue', () => ({
  default: { template: '<div class="mock-background"></div>' }
}))
vi.mock('@/components/TimeWeatherModule.vue', () => ({
  default: { template: '<div class="mock-time-weather"></div>' }
}))
vi.mock('@/components/SearchModule.vue', () => ({
  default: { template: '<div class="mock-search"></div>' }
}))
vi.mock('@/components/DailyQuoteModule.vue', () => ({
  default: { template: '<div class="mock-daily-quote"></div>' }
}))
vi.mock('@/components/MottoModule.vue', () => ({
  default: { template: '<div class="mock-motto"></div>' }
}))
vi.mock('@/components/WebsiteLinksModule.vue', () => ({
  default: { template: '<div class="mock-website-links"></div>' }
}))
vi.mock('@/components/ServerInfoModule.vue', () => ({
  default: { template: '<div class="mock-server-info"></div>' }
}))
vi.mock('@/components/Toast.vue', () => ({
  default: { template: '<div class="mock-toast"></div>' }
}))

/**
 * App 根组件测试
 * 测试整体布局和模块组织
 */
describe('App', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.useFakeTimers()
  })

  describe('组件渲染', () => {
    it('应正确渲染根组件', () => {
      const wrapper = mount(App)
      expect(wrapper.exists()).toBe(true)
      expect(wrapper.find('.app').exists()).toBe(true)
    })

    it('应包含主内容区域', () => {
      const wrapper = mount(App)
      expect(wrapper.find('.main-content').exists()).toBe(true)
    })

    it('应包含内容包装器', () => {
      const wrapper = mount(App)
      expect(wrapper.find('.content-wrapper').exists()).toBe(true)
    })
  })

  describe('布局结构', () => {
    it('应包含头部区域', () => {
      const wrapper = mount(App)
      expect(wrapper.find('.header-section').exists()).toBe(true)
    })

    it('应包含引言区域', () => {
      const wrapper = mount(App)
      expect(wrapper.find('.quote-section').exists()).toBe(true)
    })

    it('应包含链接区域', () => {
      const wrapper = mount(App)
      expect(wrapper.find('.links-section').exists()).toBe(true)
    })

    it('应包含底部区域', () => {
      const wrapper = mount(App)
      expect(wrapper.find('.footer-section').exists()).toBe(true)
    })
  })

  describe('装饰元素', () => {
    it('应包含装饰容器', () => {
      const wrapper = mount(App)
      expect(wrapper.find('.decorations').exists()).toBe(true)
    })

    it('应包含三个装饰元素', () => {
      const wrapper = mount(App)
      const decorations = wrapper.findAll('.decoration')
      expect(decorations.length).toBe(3)
    })
  })

  describe('子组件', () => {
    it('应渲染背景模块', () => {
      const wrapper = mount(App)
      expect(wrapper.find('.mock-background').exists()).toBe(true)
    })

    it('应渲染时间天气模块', () => {
      const wrapper = mount(App)
      expect(wrapper.find('.mock-time-weather').exists()).toBe(true)
    })

    it('应渲染搜索模块', () => {
      const wrapper = mount(App)
      expect(wrapper.find('.mock-search').exists()).toBe(true)
    })

    it('应渲染每日一言模块', () => {
      const wrapper = mount(App)
      expect(wrapper.find('.mock-daily-quote').exists()).toBe(true)
    })

    it('应渲染话术模块', () => {
      const wrapper = mount(App)
      expect(wrapper.find('.mock-motto').exists()).toBe(true)
    })

    it('应渲染网站链接模块', () => {
      const wrapper = mount(App)
      expect(wrapper.find('.mock-website-links').exists()).toBe(true)
    })

    it('应渲染服务器信息模块', () => {
      const wrapper = mount(App)
      expect(wrapper.find('.mock-server-info').exists()).toBe(true)
    })

    it('应渲染 Toast 组件', () => {
      const wrapper = mount(App)
      expect(wrapper.find('.mock-toast').exists()).toBe(true)
    })
  })

  describe('动画类', () => {
    it('时间天气模块应有入场动画类', () => {
      const wrapper = mount(App)
      const timeWeather = wrapper.find('.mock-time-weather')
      // 检查父元素是否有动画类
      expect(wrapper.html()).toContain('animate-fade-in-down')
    })

    it('搜索模块应有入场动画类', () => {
      const wrapper = mount(App)
      expect(wrapper.html()).toContain('animate-delay-2')
    })

    it('每日一言模块应有入场动画类', () => {
      const wrapper = mount(App)
      expect(wrapper.html()).toContain('animate-fade-in-scale')
    })
  })
})
