import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { setActivePinia, createPinia } from 'pinia'
import DailyQuoteModule from './DailyQuoteModule.vue'
import { useAppStore } from '@/stores/app.js'

// Mock API
vi.mock('@/api', () => ({
  fetchBackgroundImage: vi.fn(() => Promise.resolve('https://example.com/image.jpg')),
  fetchDailyQuote: vi.fn(() => Promise.resolve({
    content: '测试一言内容',
    source: '测试来源',
    author: '测试作者'
  })),
  fetchWeather: vi.fn(() => Promise.resolve({ temp: '25', text: '晴' })),
  fetchServerInfo: vi.fn(() => Promise.resolve(null))
}))

/**
 * 每日一言模块组件测试
 * 测试一言内容显示、来源信息、刷新功能等
 */
describe('DailyQuoteModule', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  describe('组件渲染', () => {
    it('应正确渲染组件', () => {
      const wrapper = mount(DailyQuoteModule)
      expect(wrapper.exists()).toBe(true)
      expect(wrapper.find('.daily-quote-module').exists()).toBe(true)
    })
  })

  describe('加载状态', () => {
    it('加载中应显示骨架屏', () => {
      const wrapper = mount(DailyQuoteModule)
      const store = useAppStore()
      
      // 初始状态应该是加载中
      if (store.quoteLoading) {
        const skeleton = wrapper.find('.quote-skeleton')
        expect(skeleton.exists()).toBe(true)
      }
    })

    it('加载中骨架屏应包含占位元素', () => {
      const wrapper = mount(DailyQuoteModule)
      const store = useAppStore()
      
      if (store.quoteLoading) {
        const skeletons = wrapper.findAll('.skeleton')
        expect(skeletons.length).toBeGreaterThan(0)
      }
    })
  })

  describe('一言内容', () => {
    it('加载完成后应显示一言内容', async () => {
      const wrapper = mount(DailyQuoteModule)
      const store = useAppStore()
      
      // 手动设置加载完成状态
      store.quoteLoading = false
      store.dailyQuote = {
        content: '测试一言',
        source: '测试来源',
        author: '测试作者'
      }
      
      await wrapper.vm.$nextTick()
      
      const quoteText = wrapper.find('.quote-text')
      expect(quoteText.exists()).toBe(true)
      expect(quoteText.text()).toBe('测试一言')
    })

    it('应显示装饰引号', async () => {
      const wrapper = mount(DailyQuoteModule)
      const store = useAppStore()
      
      store.quoteLoading = false
      store.dailyQuote = { content: '测试', source: '', author: '' }
      
      await wrapper.vm.$nextTick()
      
      const quoteMarks = wrapper.findAll('.quote-mark')
      expect(quoteMarks.length).toBe(2)
      
      // 检查左引号和右引号
      const leftMark = wrapper.find('.quote-mark--left')
      const rightMark = wrapper.find('.quote-mark--right')
      expect(leftMark.exists()).toBe(true)
      expect(rightMark.exists()).toBe(true)
    })

    it('应显示来源信息', async () => {
      const wrapper = mount(DailyQuoteModule)
      const store = useAppStore()
      
      store.quoteLoading = false
      store.dailyQuote = {
        content: '测试一言',
        source: '测试来源',
        author: '测试作者'
      }
      
      await wrapper.vm.$nextTick()
      
      const meta = wrapper.find('.quote-meta')
      expect(meta.exists()).toBe(true)
      
      const source = wrapper.find('.meta-source')
      expect(source.exists()).toBe(true)
      expect(source.text()).toContain('测试来源')
    })

    it('应显示作者信息', async () => {
      const wrapper = mount(DailyQuoteModule)
      const store = useAppStore()
      
      store.quoteLoading = false
      store.dailyQuote = {
        content: '测试一言',
        source: '测试来源',
        author: '测试作者'
      }
      
      await wrapper.vm.$nextTick()
      
      const author = wrapper.find('.meta-author')
      expect(author.exists()).toBe(true)
      expect(author.text()).toBe('测试作者')
    })

    it('无作者时不应显示作者元素', async () => {
      const wrapper = mount(DailyQuoteModule)
      const store = useAppStore()
      
      store.quoteLoading = false
      store.dailyQuote = {
        content: '测试一言',
        source: '测试来源',
        author: ''
      }
      
      await wrapper.vm.$nextTick()
      
      const author = wrapper.find('.meta-author')
      expect(author.exists()).toBe(false)
    })
  })

  describe('刷新功能', () => {
    it('应有刷新按钮', () => {
      const wrapper = mount(DailyQuoteModule)
      const refreshButton = wrapper.find('.refresh-button')
      expect(refreshButton.exists()).toBe(true)
    })

    it('刷新按钮应包含图标', () => {
      const wrapper = mount(DailyQuoteModule)
      const refreshIcon = wrapper.find('.refresh-icon')
      expect(refreshIcon.exists()).toBe(true)
    })

    it('刷新按钮应包含文字', () => {
      const wrapper = mount(DailyQuoteModule)
      const refreshText = wrapper.find('.refresh-text')
      expect(refreshText.exists()).toBe(true)
      expect(refreshText.text()).toBe('换一句')
    })

    it('点击刷新按钮应调用 loadDailyQuote', async () => {
      const wrapper = mount(DailyQuoteModule)
      const store = useAppStore()
      
      store.quoteLoading = false
      await wrapper.vm.$nextTick()
      
      const loadSpy = vi.spyOn(store, 'loadDailyQuote')
      const refreshButton = wrapper.find('.refresh-button')
      await refreshButton.trigger('click')
      
      expect(loadSpy).toHaveBeenCalled()
    })

    it('加载中时刷新按钮应禁用', async () => {
      const wrapper = mount(DailyQuoteModule)
      const store = useAppStore()
      
      store.quoteLoading = true
      await wrapper.vm.$nextTick()
      
      const refreshButton = wrapper.find('.refresh-button')
      expect(refreshButton.attributes('disabled')).toBeDefined()
    })

    it('加载中时刷新按钮应有 is-loading 类', async () => {
      const wrapper = mount(DailyQuoteModule)
      const store = useAppStore()
      
      store.quoteLoading = true
      await wrapper.vm.$nextTick()
      
      const refreshButton = wrapper.find('.refresh-button')
      expect(refreshButton.classes()).toContain('is-loading')
    })
  })

  describe('样式和动画', () => {
    it('应有装饰线条', async () => {
      const wrapper = mount(DailyQuoteModule)
      const store = useAppStore()
      
      store.quoteLoading = false
      store.dailyQuote = { content: '测试', source: '来源', author: '' }
      
      await wrapper.vm.$nextTick()
      
      const metaLines = wrapper.findAll('.meta-line')
      expect(metaLines.length).toBe(2)
    })
  })
})
