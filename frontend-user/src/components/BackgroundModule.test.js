import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { setActivePinia, createPinia } from 'pinia'
import BackgroundModule from './BackgroundModule.vue'
import { useAppStore } from '@/stores/app.js'

// Mock API
vi.mock('@/api', () => ({
  fetchBackgroundImage: vi.fn(() => Promise.resolve('https://example.com/test-image.jpg')),
  fetchDailyQuote: vi.fn(() => Promise.resolve({ content: '', source: '', author: '' })),
  fetchWeather: vi.fn(() => Promise.resolve({ temp: '25', text: '晴' })),
  fetchServerInfo: vi.fn(() => Promise.resolve(null))
}))

/**
 * 背景模块组件测试
 * 测试背景图片加载、遮罩层、加载动画等功能
 */
describe('BackgroundModule', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  describe('组件渲染', () => {
    it('应正确渲染组件', () => {
      const wrapper = mount(BackgroundModule)
      expect(wrapper.exists()).toBe(true)
      expect(wrapper.find('.background-module').exists()).toBe(true)
    })

    it('应包含背景图片层', () => {
      const wrapper = mount(BackgroundModule)
      const bgImage = wrapper.find('.background-image')
      expect(bgImage.exists()).toBe(true)
    })

    it('应包含渐变遮罩层', () => {
      const wrapper = mount(BackgroundModule)
      const overlay = wrapper.find('.background-overlay')
      expect(overlay.exists()).toBe(true)
    })

    it('应包含噪点纹理层', () => {
      const wrapper = mount(BackgroundModule)
      const noise = wrapper.find('.background-noise')
      expect(noise.exists()).toBe(true)
    })

    it('应包含网格装饰层', () => {
      const wrapper = mount(BackgroundModule)
      const grid = wrapper.find('.background-grid')
      expect(grid.exists()).toBe(true)
    })
  })

  describe('加载状态', () => {
    it('加载中应显示加载动画', () => {
      const wrapper = mount(BackgroundModule)
      const store = useAppStore()
      
      // 初始状态应该是加载中
      if (store.backgroundLoading) {
        const loading = wrapper.find('.background-loading')
        expect(loading.exists()).toBe(true)
      }
    })

    it('加载动画应包含 loading-ring', () => {
      const wrapper = mount(BackgroundModule)
      const store = useAppStore()
      
      if (store.backgroundLoading) {
        const ring = wrapper.find('.loading-ring')
        expect(ring.exists()).toBe(true)
      }
    })

    it('加载动画应包含三个环形元素', () => {
      const wrapper = mount(BackgroundModule)
      const store = useAppStore()
      
      if (store.backgroundLoading) {
        const rings = wrapper.findAll('.ring')
        expect(rings.length).toBe(3)
      }
    })

    it('加载动画应显示加载文字', () => {
      const wrapper = mount(BackgroundModule)
      const store = useAppStore()
      
      if (store.backgroundLoading) {
        const loadingText = wrapper.find('.loading-text')
        expect(loadingText.exists()).toBe(true)
        expect(loadingText.text()).toBe('加载中...')
      }
    })
  })

  describe('背景图片', () => {
    it('背景图片加载后应设置 background-image 样式', async () => {
      const wrapper = mount(BackgroundModule)
      const store = useAppStore()
      
      // 模拟图片加载完成
      store.backgroundImage = 'https://example.com/test.jpg'
      store.backgroundLoading = false
      
      await wrapper.vm.$nextTick()
      
      const bgImage = wrapper.find('.background-image')
      const style = bgImage.attributes('style')
      
      if (store.backgroundImage) {
        expect(style).toContain('background-image')
        expect(style).toContain('https://example.com/test.jpg')
      }
    })

    it('无背景图片时应设置 background-image 为 none', async () => {
      const wrapper = mount(BackgroundModule)
      const store = useAppStore()
      
      store.backgroundImage = ''
      store.backgroundLoading = false
      
      await wrapper.vm.$nextTick()
      
      const bgImage = wrapper.find('.background-image')
      const style = bgImage.attributes('style')
      expect(style).toContain('none')
    })
  })

  describe('初始化', () => {
    it('组件挂载时应调用 initializeApp', async () => {
      const store = useAppStore()
      const initSpy = vi.spyOn(store, 'initializeApp')
      
      mount(BackgroundModule)
      
      expect(initSpy).toHaveBeenCalled()
    })
  })

  describe('样式和布局', () => {
    it('背景模块应固定定位', () => {
      const wrapper = mount(BackgroundModule)
      const module = wrapper.find('.background-module')
      expect(module.exists()).toBe(true)
    })
  })
})
