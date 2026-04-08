<template>
  <div class="search-module" v-if="config.search.enabled" ref="moduleRef">
    <div class="search-container glass-card glass-card--no-hover" :class="{ 'is-focused': inputFocused }">
      <!-- 搜索引擎选择 -->
      <div class="engine-selector" @click.stop="toggleEngineDropdown">
        <span class="engine-icon">{{ currentEngineIcon }}</span>
        <span class="engine-name">{{ currentEngine.name }}</span>
        <span class="dropdown-arrow" :class="{ 'is-open': showDropdown }">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </span>
      </div>
      
      <!-- 搜索输入框 -->
      <div class="input-wrapper">
        <input 
          type="text"
          class="search-input"
          v-model="searchQuery"
          :placeholder="config.search.placeholder"
          @keyup.enter="handleSearch"
          @focus="handleFocus"
          @blur="handleBlur"
          ref="inputRef"
        />
        <Transition name="fade">
          <button 
            v-if="searchQuery" 
            class="clear-button"
            @click="clearSearch"
            type="button"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M10.5 3.5L3.5 10.5M3.5 3.5L10.5 10.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
            </svg>
          </button>
        </Transition>
      </div>
      
      <!-- 搜索按钮 -->
      <button 
        class="search-button" 
        @click="handleSearch" 
        :disabled="!searchQuery.trim()"
        :class="{ 'is-ready': searchQuery.trim() }"
      >
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
          <circle cx="8" cy="8" r="5.5" stroke="currentColor" stroke-width="2"/>
          <path d="M12 12L16 16" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        </svg>
      </button>
    </div>
    
    <!-- 搜索引擎下拉菜单 - 移到外层 -->
    <Teleport to="body">
      <Transition name="dropdown">
        <div 
          v-if="showDropdown" 
          class="engine-dropdown"
          :style="dropdownStyle"
          @click.stop
        >
          <div 
            v-for="engine in config.search.engines" 
            :key="engine.key"
            class="engine-option"
            :class="{ 'is-active': engine.key === selectedEngine }"
            @click="selectEngine(engine.key)"
          >
            <span class="option-icon">{{ getEngineIcon(engine.key) }}</span>
            <span class="option-name">{{ engine.name }}</span>
            <span class="option-check" v-if="engine.key === selectedEngine">✓</span>
          </div>
        </div>
      </Transition>
    </Teleport>
    
    <!-- 快捷搜索提示 -->
    <div class="search-hint" v-if="inputFocused && !searchQuery">
      <span class="hint-text">按 Enter 搜索</span>
      <span class="hint-divider">·</span>
      <span class="hint-text">Tab 切换引擎</span>
    </div>
  </div>
</template>

<script setup>
/**
 * 搜索模块组件
 * 提供多搜索引擎切换和搜索功能
 */
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
import config from '@/config/app.config.js'

// 状态
const searchQuery = ref('')
const selectedEngine = ref(config.search.defaultEngine)
const showDropdown = ref(false)
const inputFocused = ref(false)
const inputRef = ref(null)
const moduleRef = ref(null)
const dropdownPosition = ref({ top: 0, left: 0 })

// 当前选中的搜索引擎
const currentEngine = computed(() => {
  return config.search.engines.find(e => e.key === selectedEngine.value) 
    || config.search.engines[0]
})

// 当前搜索引擎图标
const currentEngineIcon = computed(() => {
  return getEngineIcon(selectedEngine.value)
})

// 下拉框位置样式
const dropdownStyle = computed(() => ({
  position: 'fixed',
  top: `${dropdownPosition.value.top}px`,
  left: `${dropdownPosition.value.left}px`,
  zIndex: 9999,
  visibility: dropdownPosition.value.top === 0 ? 'hidden' : 'visible'
}))

/**
 * 获取搜索引擎图标
 */
function getEngineIcon(key) {
  const icons = {
    google: '🔍',
    bing: '🅱️',
    baidu: '🐾',
    github: '🐙'
  }
  return icons[key] || '🔍'
}

/**
 * 更新下拉框位置
 */
function updateDropdownPosition() {
  if (!moduleRef.value) return
  const selector = moduleRef.value.querySelector('.engine-selector')
  if (!selector) return
  
  const rect = selector.getBoundingClientRect()
  dropdownPosition.value = {
    top: rect.bottom + 8,
    left: rect.left
  }
}

/**
 * 切换下拉菜单
 */
async function toggleEngineDropdown() {
  if (!showDropdown.value) {
    // 先计算位置再显示
    updateDropdownPosition()
    await nextTick()
    showDropdown.value = true
  } else {
    showDropdown.value = false
  }
}

/**
 * 选择搜索引擎
 */
function selectEngine(key) {
  selectedEngine.value = key
  showDropdown.value = false
  
  // Toast 提示
  if (window.$toast) {
    const engine = config.search.engines.find(e => e.key === key)
    window.$toast.success(`已切换到 ${engine?.name || key}`)
  }
  
  // 聚焦输入框
  inputRef.value?.focus()
}

/**
 * 处理搜索
 */
function handleSearch() {
  const query = searchQuery.value.trim()
  if (!query) return
  
  const url = currentEngine.value.url + encodeURIComponent(query)
  window.open(url, '_blank')
  
  // Toast 提示
  if (window.$toast) {
    window.$toast.info(`正在 ${currentEngine.value.name} 搜索...`)
  }
}

/**
 * 清空搜索
 */
function clearSearch() {
  searchQuery.value = ''
  inputRef.value?.focus()
}

/**
 * 处理聚焦
 */
function handleFocus() {
  inputFocused.value = true
}

/**
 * 处理失焦
 */
function handleBlur() {
  inputFocused.value = false
}

/**
 * 点击外部关闭下拉框
 */
function handleClickOutside(e) {
  if (showDropdown.value && moduleRef.value && !moduleRef.value.contains(e.target)) {
    showDropdown.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
  window.addEventListener('scroll', () => {
    if (showDropdown.value) updateDropdownPosition()
  }, true)
  window.addEventListener('resize', () => {
    if (showDropdown.value) updateDropdownPosition()
  })
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style lang="scss" scoped>
.search-module {
  width: 100%;
  max-width: 520px;
  position: relative;
  
  @media (min-width: 768px) {
    width: auto;
    min-width: 420px;
  }
}

.search-container {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-xs);
  background: var(--glass-bg);
  border-radius: var(--radius-lg);
  border: 2px solid transparent;
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  
  &.is-focused {
    border-color: var(--primary-color);
    background: var(--glass-bg-hover);
    box-shadow: 
      0 0 0 4px rgba(99, 102, 241, 0.15),
      0 20px 40px rgba(0, 0, 0, 0.2);
    transform: translateY(-2px);
  }
}

.engine-selector {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  padding: var(--spacing-sm) var(--spacing-md);
  background: var(--glass-bg);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  white-space: nowrap;
  border: 1px solid transparent;
  
  &:hover {
    background: var(--glass-bg-hover);
    border-color: var(--glass-border);
    transform: scale(1.02);
  }
  
  &:active {
    transform: scale(0.98);
  }
}

.engine-icon {
  font-size: 1.125rem;
  transition: transform 0.3s;
  
  .engine-selector:hover & {
    transform: scale(1.15) rotate(5deg);
  }
}

.engine-name {
  font-size: var(--font-size-sm);
  font-weight: 500;
  color: var(--text-secondary);
  
  @media (max-width: 480px) {
    display: none;
  }
}

.dropdown-arrow {
  color: var(--text-muted);
  transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  display: flex;
  
  &.is-open {
    transform: rotate(180deg);
  }
}

.input-wrapper {
  flex: 1;
  position: relative;
  display: flex;
  align-items: center;
}

.search-input {
  width: 100%;
  background: transparent;
  border: none;
  padding: var(--spacing-sm) var(--spacing-md);
  padding-right: 36px;
  font-size: var(--font-size-base);
  color: var(--text-primary);
  
  &::placeholder {
    color: var(--text-hint);
    transition: color 0.3s;
  }
  
  &:focus::placeholder {
    color: var(--text-muted);
  }
}

.clear-button {
  position: absolute;
  right: 8px;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-muted);
  border-radius: var(--radius-sm);
  transition: all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
  
  &:hover {
    color: var(--text-primary);
    background: var(--glass-bg);
    transform: scale(1.1) rotate(90deg);
  }
}

.search-button {
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--glass-bg);
  border-radius: var(--radius-md);
  color: var(--text-muted);
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  position: relative;
  overflow: hidden;
  
  &.is-ready {
    background: var(--primary-gradient);
    color: white;
    box-shadow: 0 4px 20px rgba(99, 102, 241, 0.5);
    
    &:hover {
      transform: scale(1.08);
      box-shadow: 0 8px 30px rgba(99, 102, 241, 0.6);
    }
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
}

.search-hint {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-sm);
  margin-top: var(--spacing-sm);
  animation: fadeIn 0.3s ease;
}

.hint-text {
  font-size: var(--font-size-xs);
  color: var(--text-hint);
}

.hint-divider {
  color: var(--text-hint);
}

.fade-enter-active,
.fade-leave-active {
  transition: all 0.2s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: scale(0.8);
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-5px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>

<style lang="scss">
/* 全局样式 - 下拉框 */
.engine-dropdown {
  background: rgba(20, 20, 35, 0.98);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  overflow: hidden;
  min-width: 180px;
  box-shadow: 
    0 20px 50px rgba(0, 0, 0, 0.5),
    0 0 0 1px rgba(255, 255, 255, 0.05) inset;
}

.engine-option {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
  color: rgba(255, 255, 255, 0.9);
  
  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 3px;
    background: linear-gradient(135deg, #6366f1, #8b5cf6);
    transform: scaleY(0);
    transition: transform 0.2s;
  }
  
  &:hover {
    background: rgba(255, 255, 255, 0.08);
    padding-left: 20px;
    
    &::before {
      transform: scaleY(1);
    }
  }
  
  &.is-active {
    background: rgba(99, 102, 241, 0.2);
    
    &::before {
      transform: scaleY(1);
    }
    
    .option-name {
      color: #a5b4fc;
    }
  }
}

.option-icon {
  font-size: 1.125rem;
}

.option-name {
  flex: 1;
  font-size: 14px;
  font-weight: 500;
}

.option-check {
  color: #a5b4fc;
  font-weight: 600;
}

/* 下拉动画 */
.dropdown-enter-active,
.dropdown-leave-active {
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-12px) scale(0.95);
}
</style>
