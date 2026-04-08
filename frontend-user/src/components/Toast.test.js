import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import Toast from './Toast.vue'

/**
 * Toast 通知组件测试
 * 测试消息提示功能
 */
describe('Toast', () => {
  let wrapper

  beforeEach(() => {
    // 创建 teleport 目标
    const el = document.createElement('div')
    el.id = 'teleport-target'
    document.body.appendChild(el)
    
    wrapper = mount(Toast, {
      global: {
        stubs: {
          teleport: true
        }
      }
    })
  })

  afterEach(() => {
    wrapper.unmount()
    // 清理 teleport 目标
    const el = document.getElementById('teleport-target')
    if (el) {
      document.body.removeChild(el)
    }
    // 清理全局 $toast
    delete window.$toast
  })

  describe('组件渲染', () => {
    it('应正确渲染组件', () => {
      expect(wrapper.exists()).toBe(true)
    })

    it('初始状态应无 toast 显示', () => {
      const toasts = wrapper.findAll('.toast-item')
      expect(toasts.length).toBe(0)
    })
  })

  describe('添加 Toast', () => {
    it('addToast 应添加新的 toast', async () => {
      wrapper.vm.addToast({ message: '测试消息' })
      await wrapper.vm.$nextTick()
      
      const toasts = wrapper.findAll('.toast-item')
      expect(toasts.length).toBe(1)
    })

    it('应显示正确的消息内容', async () => {
      wrapper.vm.addToast({ message: '测试消息内容' })
      await wrapper.vm.$nextTick()
      
      const message = wrapper.find('.toast-message')
      expect(message.text()).toBe('测试消息内容')
    })

    it('应显示标题（如果提供）', async () => {
      wrapper.vm.addToast({ title: '测试标题', message: '测试消息' })
      await wrapper.vm.$nextTick()
      
      const title = wrapper.find('.toast-title')
      expect(title.exists()).toBe(true)
      expect(title.text()).toBe('测试标题')
    })

    it('无标题时不应显示标题元素', async () => {
      wrapper.vm.addToast({ message: '测试消息' })
      await wrapper.vm.$nextTick()
      
      const title = wrapper.find('.toast-title')
      expect(title.exists()).toBe(false)
    })

    it('应返回 toast ID', () => {
      const id = wrapper.vm.addToast({ message: '测试' })
      expect(id).toBeDefined()
      expect(typeof id).toBe('number')
    })

    it('连续添加应返回递增的 ID', () => {
      const id1 = wrapper.vm.addToast({ message: '测试1' })
      const id2 = wrapper.vm.addToast({ message: '测试2' })
      expect(id2).toBeGreaterThan(id1)
    })
  })

  describe('Toast 类型', () => {
    it('success 类型应有正确的类名', async () => {
      wrapper.vm.addToast({ type: 'success', message: '成功' })
      await wrapper.vm.$nextTick()
      
      const toast = wrapper.find('.toast-item')
      expect(toast.classes()).toContain('toast--success')
    })

    it('error 类型应有正确的类名', async () => {
      wrapper.vm.addToast({ type: 'error', message: '错误' })
      await wrapper.vm.$nextTick()
      
      const toast = wrapper.find('.toast-item')
      expect(toast.classes()).toContain('toast--error')
    })

    it('warning 类型应有正确的类名', async () => {
      wrapper.vm.addToast({ type: 'warning', message: '警告' })
      await wrapper.vm.$nextTick()
      
      const toast = wrapper.find('.toast-item')
      expect(toast.classes()).toContain('toast--warning')
    })

    it('info 类型应有正确的类名', async () => {
      wrapper.vm.addToast({ type: 'info', message: '信息' })
      await wrapper.vm.$nextTick()
      
      const toast = wrapper.find('.toast-item')
      expect(toast.classes()).toContain('toast--info')
    })

    it('默认类型应为 info', async () => {
      wrapper.vm.addToast({ message: '默认' })
      await wrapper.vm.$nextTick()
      
      const toast = wrapper.find('.toast-item')
      expect(toast.classes()).toContain('toast--info')
    })
  })

  describe('Toast 图标', () => {
    it('success 类型应显示 SVG 图标', async () => {
      wrapper.vm.addToast({ type: 'success', message: '成功' })
      await wrapper.vm.$nextTick()
      
      const iconSymbol = wrapper.find('.icon-symbol')
      expect(iconSymbol.exists()).toBe(true)
      expect(iconSymbol.find('svg').exists()).toBe(true)
    })

    it('error 类型应显示 SVG 图标', async () => {
      wrapper.vm.addToast({ type: 'error', message: '错误' })
      await wrapper.vm.$nextTick()
      
      const iconSymbol = wrapper.find('.icon-symbol')
      expect(iconSymbol.exists()).toBe(true)
      expect(iconSymbol.find('svg').exists()).toBe(true)
    })

    it('warning 类型应显示 SVG 图标', async () => {
      wrapper.vm.addToast({ type: 'warning', message: '警告' })
      await wrapper.vm.$nextTick()
      
      const iconSymbol = wrapper.find('.icon-symbol')
      expect(iconSymbol.exists()).toBe(true)
      expect(iconSymbol.find('svg').exists()).toBe(true)
    })

    it('info 类型应显示 SVG 图标', async () => {
      wrapper.vm.addToast({ type: 'info', message: '信息' })
      await wrapper.vm.$nextTick()
      
      const iconSymbol = wrapper.find('.icon-symbol')
      expect(iconSymbol.exists()).toBe(true)
      expect(iconSymbol.find('svg').exists()).toBe(true)
    })
  })

  describe('移除 Toast', () => {
    it('removeToast 应移除指定的 toast', async () => {
      const id = wrapper.vm.addToast({ message: '测试', duration: 0 })
      await wrapper.vm.$nextTick()
      
      expect(wrapper.findAll('.toast-item').length).toBe(1)
      
      wrapper.vm.removeToast(id)
      await wrapper.vm.$nextTick()
      
      expect(wrapper.findAll('.toast-item').length).toBe(0)
    })

    it('点击 toast 应移除它', async () => {
      wrapper.vm.addToast({ message: '测试', duration: 0 })
      await wrapper.vm.$nextTick()
      
      const toast = wrapper.find('.toast-item')
      await toast.trigger('click')
      await wrapper.vm.$nextTick()
      
      expect(wrapper.findAll('.toast-item').length).toBe(0)
    })

    it('移除不存在的 ID 不应报错', () => {
      expect(() => {
        wrapper.vm.removeToast(99999)
      }).not.toThrow()
    })
  })

  describe('自动消失', () => {
    it('toast 应在指定时间后自动消失', async () => {
      vi.useFakeTimers()
      
      wrapper.vm.addToast({ message: '测试', duration: 1000 })
      await wrapper.vm.$nextTick()
      
      expect(wrapper.findAll('.toast-item').length).toBe(1)
      
      vi.advanceTimersByTime(1000)
      await wrapper.vm.$nextTick()
      
      expect(wrapper.findAll('.toast-item').length).toBe(0)
      
      vi.useRealTimers()
    })

    it('duration 为 0 时不应自动消失', async () => {
      vi.useFakeTimers()
      
      wrapper.vm.addToast({ message: '测试', duration: 0 })
      await wrapper.vm.$nextTick()
      
      vi.advanceTimersByTime(10000)
      await wrapper.vm.$nextTick()
      
      expect(wrapper.findAll('.toast-item').length).toBe(1)
      
      vi.useRealTimers()
    })
  })

  describe('多个 Toast', () => {
    it('应支持同时显示多个 toast', async () => {
      wrapper.vm.addToast({ message: '消息1', duration: 0 })
      wrapper.vm.addToast({ message: '消息2', duration: 0 })
      wrapper.vm.addToast({ message: '消息3', duration: 0 })
      await wrapper.vm.$nextTick()
      
      expect(wrapper.findAll('.toast-item').length).toBe(3)
    })

    it('移除一个不应影响其他', async () => {
      const id1 = wrapper.vm.addToast({ message: '消息1', duration: 0 })
      wrapper.vm.addToast({ message: '消息2', duration: 0 })
      await wrapper.vm.$nextTick()
      
      wrapper.vm.removeToast(id1)
      await wrapper.vm.$nextTick()
      
      expect(wrapper.findAll('.toast-item').length).toBe(1)
    })
  })

  describe('全局 $toast', () => {
    it('挂载后应在 window 上注册 $toast', () => {
      expect(window.$toast).toBeDefined()
    })

    it('$toast.success 应添加 success 类型的 toast', async () => {
      window.$toast.success('成功消息')
      await wrapper.vm.$nextTick()
      
      const toast = wrapper.find('.toast-item')
      expect(toast.classes()).toContain('toast--success')
    })

    it('$toast.error 应添加 error 类型的 toast', async () => {
      window.$toast.error('错误消息')
      await wrapper.vm.$nextTick()
      
      const toast = wrapper.find('.toast-item')
      expect(toast.classes()).toContain('toast--error')
    })

    it('$toast.warning 应添加 warning 类型的 toast', async () => {
      window.$toast.warning('警告消息')
      await wrapper.vm.$nextTick()
      
      const toast = wrapper.find('.toast-item')
      expect(toast.classes()).toContain('toast--warning')
    })

    it('$toast.info 应添加 info 类型的 toast', async () => {
      window.$toast.info('信息消息')
      await wrapper.vm.$nextTick()
      
      const toast = wrapper.find('.toast-item')
      expect(toast.classes()).toContain('toast--info')
    })
  })

  describe('进度条', () => {
    it('toast 应包含进度条', async () => {
      wrapper.vm.addToast({ message: '测试', duration: 3000 })
      await wrapper.vm.$nextTick()
      
      const progress = wrapper.find('.toast-progress')
      expect(progress.exists()).toBe(true)
    })

    it('进度条动画时长应与 duration 匹配', async () => {
      wrapper.vm.addToast({ message: '测试', duration: 5000 })
      await wrapper.vm.$nextTick()
      
      const progress = wrapper.find('.toast-progress')
      const style = progress.attributes('style')
      expect(style).toContain('5000ms')
    })
  })
})
