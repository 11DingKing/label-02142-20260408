import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import WebsiteLinksModule from './WebsiteLinksModule.vue'

/**
 * 网站链接模块组件测试
 */
describe('WebsiteLinksModule', () => {
  let wrapper

  beforeEach(() => {
    wrapper = mount(WebsiteLinksModule)
  })

  it('应正确渲染组件', () => {
    expect(wrapper.exists()).toBe(true)
  })

  it('应显示分类标签', () => {
    const tabs = wrapper.findAll('.category-tab')
    expect(tabs.length).toBeGreaterThan(0)
  })

  it('第一个分类标签应默认激活', () => {
    const tabs = wrapper.findAll('.category-tab')
    expect(tabs[0].classes()).toContain('is-active')
  })

  it('点击分类标签应切换激活状态', async () => {
    const tabs = wrapper.findAll('.category-tab')
    
    if (tabs.length > 1) {
      await tabs[1].trigger('click')
      expect(tabs[1].classes()).toContain('is-active')
      expect(tabs[0].classes()).not.toContain('is-active')
    }
  })

  it('应显示链接卡片', () => {
    const cards = wrapper.findAll('.link-card')
    expect(cards.length).toBeGreaterThan(0)
  })

  it('链接卡片应包含图标', () => {
    const icons = wrapper.findAll('.link-icon')
    expect(icons.length).toBeGreaterThan(0)
  })

  it('链接卡片应包含名称', () => {
    const names = wrapper.findAll('.link-name')
    expect(names.length).toBeGreaterThan(0)
    expect(names[0].text()).toBeTruthy()
  })

  it('链接卡片应包含描述', () => {
    const descriptions = wrapper.findAll('.link-description')
    expect(descriptions.length).toBeGreaterThan(0)
  })

  it('链接应有正确的 href 属性', () => {
    const cards = wrapper.findAll('.link-card')
    cards.forEach(card => {
      const href = card.attributes('href')
      expect(href).toMatch(/^https?:\/\//)
    })
  })

  it('链接应在新标签页打开', () => {
    const cards = wrapper.findAll('.link-card')
    cards.forEach(card => {
      expect(card.attributes('target')).toBe('_blank')
    })
  })

  it('链接应有 noopener noreferrer 安全属性', () => {
    const cards = wrapper.findAll('.link-card')
    cards.forEach(card => {
      expect(card.attributes('rel')).toContain('noopener')
      expect(card.attributes('rel')).toContain('noreferrer')
    })
  })

  it('切换分类后应显示对应的链接', async () => {
    const tabs = wrapper.findAll('.category-tab')
    
    if (tabs.length > 1) {
      const firstCategoryLinks = wrapper.findAll('.link-card').length
      
      await tabs[1].trigger('click')
      await wrapper.vm.$nextTick()
      
      const secondCategoryLinks = wrapper.findAll('.link-card').length
      
      // 不同分类可能有不同数量的链接
      expect(secondCategoryLinks).toBeGreaterThan(0)
    }
  })

  it('链接卡片应有磨砂玻璃效果', () => {
    const cards = wrapper.findAll('.link-card')
    cards.forEach(card => {
      expect(card.classes()).toContain('glass-card')
    })
  })
})
