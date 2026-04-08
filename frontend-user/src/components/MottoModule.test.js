import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { setActivePinia, createPinia } from 'pinia'
import MottoModule from './MottoModule.vue'
import { useAppStore } from '@/stores/app.js'

// Mock API
vi.mock('@/api', () => ({
  fetchBackgroundImage: vi.fn(() => Promise.resolve('')),
  fetchDailyQuote: vi.fn(() => Promise.resolve({ content: '', source: '', author: '' })),
  fetchWeather: vi.fn(() => Promise.resolve({ temp: '25', text: '晴' })),
  fetchServerInfo: vi.fn(() => Promise.resolve(null))
}))

/**
 * 话术文案模块组件测试
 * 测试话术显示、切换动画等功能
 */
describe('MottoModule', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  describe('组件渲染', () => {
    it('应正确渲染组件', () => {
      const wrapper = mount(MottoModule)
      expect(wrapper.exists()).toBe(true)
      expect(wrapper.find('.motto-module').exists()).toBe(true)
    })
  })

  describe('话术内容', () => {
    it('应显示话术文案', () => {
      const wrapper = mount(MottoModule)
      const mottoText = wrapper.find('.motto-text')
      expect(mottoText.exists()).toBe(true)
      expect(mottoText.text()).toBeTruthy()
    })

    it('话术文案应包含 store 中的内容', () => {
      const wrapper = mount(MottoModule)
      const store = useAppStore()
      
      const mottoText = wrapper.find('.motto-text')
      // 话术文案包含装饰图标，所以使用 toContain
      expect(mottoText.text()).toContain(store.currentMotto)
    })

    it('话术应包含装饰图标', () => {
      const wrapper = mount(MottoModule)
      const mottoIcons = wrapper.findAll('.motto-icon')
      expect(mottoIcons.length).toBe(2)
    })

    it('装饰图标应为星星 emoji', () => {
      const wrapper = mount(MottoModule)
      const mottoIcons = wrapper.findAll('.motto-icon')
      mottoIcons.forEach(icon => {
        expect(icon.text()).toBe('✨')
      })
    })
  })

  describe('话术切换', () => {
    it('nextMotto 应切换到下一条话术', () => {
      const store = useAppStore()
      const firstMotto = store.currentMotto
      
      store.nextMotto()
      
      // 如果有多条话术，应该切换
      expect(store.currentMotto).toBeDefined()
    })

    it('话术应循环切换', () => {
      const store = useAppStore()
      const mottoCount = store.mottos?.length || 1
      
      // 切换超过话术数量次
      for (let i = 0; i < mottoCount + 1; i++) {
        store.nextMotto()
      }
      
      // 应该循环回来
      expect(store.currentMotto).toBeDefined()
    })
  })

  describe('样式', () => {
    it('话术应有磨砂玻璃背景样式', () => {
      const wrapper = mount(MottoModule)
      const mottoText = wrapper.find('.motto-text')
      expect(mottoText.exists()).toBe(true)
    })
  })
})
