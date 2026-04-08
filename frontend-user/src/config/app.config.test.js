import { describe, it, expect } from 'vitest'
import config from './app.config.js'

/**
 * 配置文件测试
 * 验证配置结构和默认值的正确性
 */
describe('App Config', () => {
  describe('background 配置', () => {
    it('应包含必要的背景配置项', () => {
      expect(config.background).toBeDefined()
      expect(config.background.type).toBeDefined()
      expect(['unsplash', 'bing', 'local', 'picsum']).toContain(config.background.type)
    })

    it('刷新间隔应为正数', () => {
      expect(config.background.refreshInterval).toBeGreaterThan(0)
    })

    it('遮罩透明度应在 0-1 之间', () => {
      expect(config.background.overlayOpacity).toBeGreaterThanOrEqual(0)
      expect(config.background.overlayOpacity).toBeLessThanOrEqual(1)
    })
  })

  describe('weather 配置', () => {
    it('应包含天气配置', () => {
      expect(config.weather).toBeDefined()
      expect(config.weather.enabled).toBeDefined()
      expect(config.weather.defaultCity).toBeDefined()
    })

    it('温度单位应为 metric 或 imperial', () => {
      expect(['metric', 'imperial']).toContain(config.weather.unit)
    })
  })

  describe('datetime 配置', () => {
    it('应包含时间格式配置', () => {
      expect(config.datetime).toBeDefined()
      expect(['24h', '12h']).toContain(config.datetime.timeFormat)
    })

    it('应包含有效的 locale', () => {
      expect(config.datetime.locale).toBeDefined()
      expect(typeof config.datetime.locale).toBe('string')
    })
  })

  describe('dailyQuote 配置', () => {
    it('应包含每日一言配置', () => {
      expect(config.dailyQuote).toBeDefined()
      expect(config.dailyQuote.enabled).toBeDefined()
      expect(config.dailyQuote.type).toBeDefined()
    })

    it('刷新间隔应为正数', () => {
      expect(config.dailyQuote.refreshInterval).toBeGreaterThan(0)
    })
  })

  describe('websites 配置', () => {
    it('应包含网站链接配置', () => {
      expect(config.websites).toBeDefined()
      expect(config.websites.enabled).toBeDefined()
      expect(config.websites.categories).toBeDefined()
      expect(Array.isArray(config.websites.categories)).toBe(true)
    })

    it('每个分类应包含名称和链接列表', () => {
      config.websites.categories.forEach(category => {
        expect(category.name).toBeDefined()
        expect(category.links).toBeDefined()
        expect(Array.isArray(category.links)).toBe(true)
      })
    })

    it('每个链接应包含必要字段', () => {
      config.websites.categories.forEach(category => {
        category.links.forEach(link => {
          expect(link.name).toBeDefined()
          expect(link.url).toBeDefined()
          expect(link.icon).toBeDefined()
        })
      })
    })

    it('链接 URL 应为有效格式', () => {
      config.websites.categories.forEach(category => {
        category.links.forEach(link => {
          expect(link.url).toMatch(/^https?:\/\//)
        })
      })
    })
  })

  describe('mottos 配置', () => {
    it('应包含话术文案配置', () => {
      expect(config.mottos).toBeDefined()
      expect(config.mottos.enabled).toBeDefined()
      expect(config.mottos.list).toBeDefined()
      expect(Array.isArray(config.mottos.list)).toBe(true)
    })

    it('话术列表不应为空', () => {
      expect(config.mottos.list.length).toBeGreaterThan(0)
    })

    it('切换间隔应为正数', () => {
      expect(config.mottos.switchInterval).toBeGreaterThan(0)
    })
  })

  describe('serverInfo 配置', () => {
    it('应包含服务器信息配置', () => {
      expect(config.serverInfo).toBeDefined()
      expect(config.serverInfo.enabled).toBeDefined()
      expect(config.serverInfo.refreshInterval).toBeDefined()
    })

    it('刷新间隔应为正数', () => {
      expect(config.serverInfo.refreshInterval).toBeGreaterThan(0)
    })

    it('应包含显示项配置', () => {
      expect(config.serverInfo.showItems).toBeDefined()
      expect(config.serverInfo.showItems.cpu).toBeDefined()
      expect(config.serverInfo.showItems.memory).toBeDefined()
      expect(config.serverInfo.showItems.disk).toBeDefined()
      expect(config.serverInfo.showItems.network).toBeDefined()
    })
  })

  describe('search 配置', () => {
    it('应包含搜索配置', () => {
      expect(config.search).toBeDefined()
      expect(config.search.enabled).toBeDefined()
      expect(config.search.defaultEngine).toBeDefined()
      expect(config.search.engines).toBeDefined()
    })

    it('搜索引擎列表不应为空', () => {
      expect(config.search.engines.length).toBeGreaterThan(0)
    })

    it('每个搜索引擎应包含必要字段', () => {
      config.search.engines.forEach(engine => {
        expect(engine.key).toBeDefined()
        expect(engine.name).toBeDefined()
        expect(engine.url).toBeDefined()
        expect(engine.url).toMatch(/^https?:\/\//)
      })
    })

    it('默认搜索引擎应在列表中', () => {
      const engineKeys = config.search.engines.map(e => e.key)
      expect(engineKeys).toContain(config.search.defaultEngine)
    })
  })

  describe('theme 配置', () => {
    it('应包含主题配置', () => {
      expect(config.theme).toBeDefined()
      expect(config.theme.primaryColor).toBeDefined()
      expect(config.theme.glassOpacity).toBeDefined()
      expect(config.theme.glassBlur).toBeDefined()
    })

    it('磨砂玻璃透明度应在 0-1 之间', () => {
      expect(config.theme.glassOpacity).toBeGreaterThanOrEqual(0)
      expect(config.theme.glassOpacity).toBeLessThanOrEqual(1)
    })

    it('模糊程度应为正数', () => {
      expect(config.theme.glassBlur).toBeGreaterThan(0)
    })
  })

  describe('layout 配置', () => {
    it('应包含布局配置', () => {
      expect(config.layout).toBeDefined()
      expect(config.layout.maxWidth).toBeDefined()
      expect(config.layout.padding).toBeDefined()
      expect(config.layout.gap).toBeDefined()
    })

    it('布局数值应为正数', () => {
      expect(config.layout.maxWidth).toBeGreaterThan(0)
      expect(config.layout.padding).toBeGreaterThan(0)
      expect(config.layout.gap).toBeGreaterThan(0)
    })
  })
})
