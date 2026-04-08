import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import SearchModule from './SearchModule.vue'

/**
 * 搜索模块组件测试
 */
describe('SearchModule', () => {
  let wrapper

  beforeEach(() => {
    wrapper = mount(SearchModule)
  })

  it('应正确渲染组件', () => {
    expect(wrapper.exists()).toBe(true)
  })

  it('应显示搜索输入框', () => {
    const input = wrapper.find('.search-input')
    expect(input.exists()).toBe(true)
  })

  it('应显示搜索按钮', () => {
    const button = wrapper.find('.search-button')
    expect(button.exists()).toBe(true)
  })

  it('应显示搜索引擎选择器', () => {
    const selector = wrapper.find('.engine-selector')
    expect(selector.exists()).toBe(true)
  })

  it('搜索按钮在输入为空时应禁用', () => {
    const button = wrapper.find('.search-button')
    expect(button.attributes('disabled')).toBeDefined()
  })

  it('输入内容后搜索按钮应启用', async () => {
    const input = wrapper.find('.search-input')
    await input.setValue('test query')
    
    const button = wrapper.find('.search-button')
    expect(button.attributes('disabled')).toBeUndefined()
  })

  it('点击搜索引擎选择器应显示下拉菜单', async () => {
    const selector = wrapper.find('.engine-selector')
    await selector.trigger('click')
    
    const dropdown = wrapper.find('.engine-dropdown')
    expect(dropdown.exists()).toBe(true)
  })

  it('选择搜索引擎后下拉菜单应关闭', async () => {
    const selector = wrapper.find('.engine-selector')
    await selector.trigger('click')
    
    const option = wrapper.find('.engine-option')
    await option.trigger('click')
    
    // 等待 DOM 更新
    await wrapper.vm.$nextTick()
    
    // 下拉菜单应该关闭（可能需要等待 setTimeout）
    expect(wrapper.vm.showDropdown).toBe(false)
  })

  it('按 Enter 键应触发搜索', async () => {
    // Mock window.open
    const openSpy = vi.spyOn(window, 'open').mockImplementation(() => {})
    
    const input = wrapper.find('.search-input')
    await input.setValue('test query')
    await input.trigger('keyup.enter')
    
    expect(openSpy).toHaveBeenCalled()
    
    openSpy.mockRestore()
  })

  it('搜索应打开正确的 URL', async () => {
    const openSpy = vi.spyOn(window, 'open').mockImplementation(() => {})
    
    const input = wrapper.find('.search-input')
    await input.setValue('hello world')
    
    const button = wrapper.find('.search-button')
    await button.trigger('click')
    
    expect(openSpy).toHaveBeenCalledWith(
      expect.stringContaining('hello%20world'),
      '_blank'
    )
    
    openSpy.mockRestore()
  })

  it('应有磨砂玻璃效果类', () => {
    expect(wrapper.find('.glass-card').exists()).toBe(true)
  })

  it('输入框应有 placeholder', () => {
    const input = wrapper.find('.search-input')
    expect(input.attributes('placeholder')).toBeDefined()
  })
})
