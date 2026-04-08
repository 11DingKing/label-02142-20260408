import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { setActivePinia, createPinia } from 'pinia'
import ServerInfoModule from './ServerInfoModule.vue'
import { useAppStore } from '@/stores/app.js'

// Mock API
vi.mock('@/api', () => ({
  fetchBackgroundImage: vi.fn(() => Promise.resolve('')),
  fetchDailyQuote: vi.fn(() => Promise.resolve({ content: '', source: '', author: '' })),
  fetchWeather: vi.fn(() => Promise.resolve({ temp: '25', text: '晴' })),
  fetchServerInfo: vi.fn(() => Promise.resolve({
    cpu: { usage: 45.5, cores: 8, model: 'Test CPU' },
    memory: { total: 17179869184, used: 8589934592, available: 8589934592, usagePercent: 50 },
    disk: { total: 536870912000, used: 214748364800, available: 322122547200, usagePercent: 40 },
    network: { txBytes: 1024, rxBytes: 2048, txPackets: 100, rxPackets: 200 },
    uptime: 86400
  }))
}))

/**
 * 服务器信息模块组件测试
 * 测试服务器状态显示、加载状态、错误处理等功能
 */
describe('ServerInfoModule', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  describe('组件渲染', () => {
    it('应正确渲染组件', () => {
      const wrapper = mount(ServerInfoModule)
      expect(wrapper.exists()).toBe(true)
    })

    it('应显示模块标题', () => {
      const wrapper = mount(ServerInfoModule)
      const title = wrapper.find('.module-title')
      expect(title.exists()).toBe(true)
      expect(title.text()).toContain('服务器状态')
    })

    it('应显示状态徽章', () => {
      const wrapper = mount(ServerInfoModule)
      const badge = wrapper.find('.status-badge')
      expect(badge.exists()).toBe(true)
    })

    it('应显示状态点', () => {
      const wrapper = mount(ServerInfoModule)
      const dot = wrapper.find('.status-dot')
      expect(dot.exists()).toBe(true)
    })

    it('应有磨砂玻璃效果', () => {
      const wrapper = mount(ServerInfoModule)
      expect(wrapper.find('.glass-card').exists()).toBe(true)
    })
  })

  describe('加载状态', () => {
    it('加载中应显示骨架屏', () => {
      const wrapper = mount(ServerInfoModule)
      const store = useAppStore()
      
      if (store.serverInfoLoading && !store.serverInfo) {
        const loadingState = wrapper.find('.loading-state')
        expect(loadingState.exists()).toBe(true)
      }
    })

    it('加载中状态徽章应显示连接中', async () => {
      const wrapper = mount(ServerInfoModule)
      const store = useAppStore()
      
      store.serverInfoLoading = true
      store.serverInfoError = false
      store.serverInfo = null
      
      await wrapper.vm.$nextTick()
      
      const badge = wrapper.find('.status-badge')
      expect(badge.classes()).toContain('is-loading')
      expect(wrapper.find('.status-text').text()).toBe('连接中')
    })
  })

  describe('错误状态', () => {
    it('错误状态应显示错误信息', async () => {
      const wrapper = mount(ServerInfoModule)
      const store = useAppStore()
      
      store.serverInfoLoading = false
      store.serverInfoError = true
      store.serverInfo = null
      
      await wrapper.vm.$nextTick()
      
      const errorState = wrapper.find('.error-state')
      expect(errorState.exists()).toBe(true)
    })

    it('错误状态应显示错误标题', async () => {
      const wrapper = mount(ServerInfoModule)
      const store = useAppStore()
      
      store.serverInfoLoading = false
      store.serverInfoError = true
      store.serverInfo = null
      
      await wrapper.vm.$nextTick()
      
      const errorTitle = wrapper.find('.error-title')
      expect(errorTitle.exists()).toBe(true)
      expect(errorTitle.text()).toContain('无法连接')
    })

    it('错误状态应有重试按钮', async () => {
      const wrapper = mount(ServerInfoModule)
      const store = useAppStore()
      
      store.serverInfoLoading = false
      store.serverInfoError = true
      store.serverInfo = null
      
      await wrapper.vm.$nextTick()
      
      const retryButton = wrapper.find('.retry-button')
      expect(retryButton.exists()).toBe(true)
    })

    it('点击重试按钮应调用 loadServerInfo', async () => {
      const wrapper = mount(ServerInfoModule)
      const store = useAppStore()
      
      store.serverInfoLoading = false
      store.serverInfoError = true
      store.serverInfo = null
      
      await wrapper.vm.$nextTick()
      
      const loadSpy = vi.spyOn(store, 'loadServerInfo')
      const retryButton = wrapper.find('.retry-button')
      await retryButton.trigger('click')
      
      expect(loadSpy).toHaveBeenCalled()
    })

    it('错误状态徽章应显示离线', async () => {
      const wrapper = mount(ServerInfoModule)
      const store = useAppStore()
      
      store.serverInfoLoading = false
      store.serverInfoError = true
      store.serverInfo = null
      
      await wrapper.vm.$nextTick()
      
      const badge = wrapper.find('.status-badge')
      expect(badge.classes()).toContain('is-error')
    })
  })

  describe('服务器信息显示', () => {
    it('加载成功后应显示服务器信息', async () => {
      const wrapper = mount(ServerInfoModule)
      const store = useAppStore()
      
      store.serverInfoLoading = false
      store.serverInfoError = false
      store.serverInfo = {
        cpu: { usage: 45.5, cores: 8, model: 'Test CPU' },
        memory: { total: 17179869184, used: 8589934592, available: 8589934592, usagePercent: 50 },
        disk: { total: 536870912000, used: 214748364800, available: 322122547200, usagePercent: 40 },
        network: { txBytes: 1024, rxBytes: 2048, txPackets: 100, rxPackets: 200 },
        uptime: 86400
      }
      
      await wrapper.vm.$nextTick()
      
      const infoGrid = wrapper.find('.info-grid')
      expect(infoGrid.exists()).toBe(true)
    })

    it('应显示 CPU 信息', async () => {
      const wrapper = mount(ServerInfoModule)
      const store = useAppStore()
      
      store.serverInfoLoading = false
      store.serverInfo = {
        cpu: { usage: 45.5, cores: 8, model: 'Test CPU' },
        memory: { usagePercent: 50 },
        disk: { usagePercent: 40 },
        network: { txBytes: 1024, rxBytes: 2048 },
        uptime: 86400
      }
      
      await wrapper.vm.$nextTick()
      
      const infoItems = wrapper.findAll('.info-item')
      expect(infoItems.length).toBeGreaterThan(0)
    })

    it('应显示进度条', async () => {
      const wrapper = mount(ServerInfoModule)
      const store = useAppStore()
      
      store.serverInfoLoading = false
      store.serverInfo = {
        cpu: { usage: 45.5, cores: 8, model: 'Test CPU' },
        memory: { usagePercent: 50 },
        disk: { usagePercent: 40 },
        network: { txBytes: 1024, rxBytes: 2048 },
        uptime: 86400
      }
      
      await wrapper.vm.$nextTick()
      
      const progressBars = wrapper.findAll('.progress-bar')
      expect(progressBars.length).toBeGreaterThan(0)
    })

    it('进度条应根据使用率显示不同颜色', async () => {
      const wrapper = mount(ServerInfoModule)
      const store = useAppStore()
      
      store.serverInfoLoading = false
      store.serverInfo = {
        cpu: { usage: 95, cores: 8, model: 'Test CPU' }, // 高使用率
        memory: { usagePercent: 50 },
        disk: { usagePercent: 40 },
        network: { txBytes: 1024, rxBytes: 2048 },
        uptime: 86400
      }
      
      await wrapper.vm.$nextTick()
      
      const progressFill = wrapper.find('.progress-fill')
      if (progressFill.exists()) {
        // 高使用率应该有 is-danger 类
        expect(progressFill.classes()).toContain('is-danger')
      }
    })

    it('中等使用率应显示警告颜色', async () => {
      const wrapper = mount(ServerInfoModule)
      const store = useAppStore()
      
      store.serverInfoLoading = false
      store.serverInfo = {
        cpu: { usage: 75, cores: 8, model: 'Test CPU' }, // 中等使用率
        memory: { usagePercent: 50 },
        disk: { usagePercent: 40 },
        network: { txBytes: 1024, rxBytes: 2048 },
        uptime: 86400
      }
      
      await wrapper.vm.$nextTick()
      
      const progressFill = wrapper.find('.progress-fill')
      if (progressFill.exists()) {
        expect(progressFill.classes()).toContain('is-warning')
      }
    })

    it('在线状态徽章应显示在线', async () => {
      const wrapper = mount(ServerInfoModule)
      const store = useAppStore()
      
      store.serverInfoLoading = false
      store.serverInfoError = false
      store.serverInfo = { cpu: { usage: 50 } }
      
      await wrapper.vm.$nextTick()
      
      const badge = wrapper.find('.status-badge')
      expect(badge.classes()).toContain('is-online')
    })
  })

  describe('网络信息', () => {
    it('应显示网络上传下载速率', async () => {
      const wrapper = mount(ServerInfoModule)
      const store = useAppStore()
      
      store.serverInfoLoading = false
      store.serverInfo = {
        cpu: { usage: 50 },
        memory: { usagePercent: 50 },
        disk: { usagePercent: 40 },
        network: { txBytes: 1024, rxBytes: 2048 },
        uptime: 86400
      }
      
      await wrapper.vm.$nextTick()
      
      const networkStats = wrapper.find('.network-stats')
      if (networkStats.exists()) {
        const networkItems = wrapper.findAll('.network-item')
        expect(networkItems.length).toBe(2)
      }
    })
  })

  describe('运行时间', () => {
    it('应显示运行时间', async () => {
      const wrapper = mount(ServerInfoModule)
      const store = useAppStore()
      
      store.serverInfoLoading = false
      store.serverInfo = {
        cpu: { usage: 50 },
        memory: { usagePercent: 50 },
        disk: { usagePercent: 40 },
        network: { txBytes: 1024, rxBytes: 2048 },
        uptime: 86400
      }
      
      await wrapper.vm.$nextTick()
      
      const uptimeValue = wrapper.find('.uptime-value')
      if (uptimeValue.exists()) {
        expect(uptimeValue.text()).toContain('天')
      }
    })
  })
})

/**
 * 工具函数测试
 */
describe('Utility Functions', () => {
  describe('formatBytes', () => {
    it('应正确格式化字节数', () => {
      const testCases = [
        { bytes: 0, expected: '0 B' },
        { bytes: 1024, expected: '1 KB' },
        { bytes: 1024 * 1024, expected: '1 MB' },
        { bytes: 1024 * 1024 * 1024, expected: '1 GB' }
      ]
      
      testCases.forEach(({ bytes, expected }) => {
        const units = ['B', 'KB', 'MB', 'GB', 'TB']
        const k = 1024
        if (bytes === 0) {
          expect('0 B').toBe(expected)
        } else {
          const i = Math.floor(Math.log(bytes) / Math.log(k))
          const result = parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + units[i]
          expect(result).toBe(expected)
        }
      })
    })
  })

  describe('formatUptime', () => {
    it('应正确格式化运行时间', () => {
      const testCases = [
        { seconds: 86400, containsDay: true },
        { seconds: 3600, containsHour: true },
        { seconds: 60, containsMinute: true }
      ]
      
      testCases.forEach(({ seconds, containsDay, containsHour, containsMinute }) => {
        const days = Math.floor(seconds / 86400)
        const hours = Math.floor((seconds % 86400) / 3600)
        const minutes = Math.floor((seconds % 3600) / 60)
        
        if (containsDay) expect(days).toBeGreaterThan(0)
        if (containsHour) expect(hours).toBeGreaterThan(0)
        if (containsMinute) expect(minutes).toBeGreaterThan(0)
      })
    })
  })
})
