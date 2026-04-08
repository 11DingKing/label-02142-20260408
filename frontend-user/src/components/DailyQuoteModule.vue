<template>
  <div class="daily-quote-module" v-if="config.dailyQuote.enabled">
    <!-- 装饰引号 -->
    <span class="quote-mark quote-mark--left" v-show="!isLoading">"</span>
    <span class="quote-mark quote-mark--right" v-show="!isLoading">"</span>
    
    <!-- 内容区域 -->
    <div class="quote-body">
      <!-- 加载中 -->
      <template v-if="isLoading">
        <div class="loading-spinner"></div>
      </template>
      
      <!-- 已加载 -->
      <template v-else>
        <p class="quote-text">{{ store.dailyQuote.content }}</p>
        
        <div class="quote-footer">
          <span class="quote-source">
            — {{ store.dailyQuote.author || '' }}
            <template v-if="store.dailyQuote.author && store.dailyQuote.source"> · </template>
            「{{ store.dailyQuote.source }}」
          </span>
          
          <button class="refresh-btn" @click="handleRefresh" :disabled="isLoading">
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
              <path d="M13 8C13 10.7614 10.7614 13 8 13C5.23858 13 3 10.7614 3 8C3 5.23858 5.23858 3 8 3C9.65685 3 11.1046 3.8044 12 5.05025" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
              <path d="M10 5H13V2" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            换一句
          </button>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import { useAppStore } from '@/stores/app'
import config from '@/config/app.config.js'

const store = useAppStore()

// 本地加载状态，确保状态同步
const isLoading = ref(true)

// 监听 store 的加载状态
watch(() => store.quoteLoading, (loading) => {
  isLoading.value = loading
}, { immediate: true })

// 初始化时检查是否已有内容
onMounted(() => {
  if (store.dailyQuote.content && !store.quoteLoading) {
    isLoading.value = false
  }
})

function handleRefresh() {
  isLoading.value = true
  store.loadDailyQuote()
}
</script>

<style lang="scss" scoped>
.daily-quote-module {
  position: relative;
  padding: 40px 24px;
  max-width: 800px;
  margin: 0 auto;
  min-height: 120px;
  text-align: center;
}

.quote-mark {
  position: absolute;
  font-size: 4rem;
  font-family: Georgia, serif;
  color: var(--primary-color);
  opacity: 0.15;
  line-height: 1;
  user-select: none;
  
  &--left {
    top: 8px;
    left: 8px;
  }
  
  &--right {
    bottom: 8px;
    right: 8px;
  }
}

.quote-body {
  position: relative;
  z-index: 1;
  min-height: 80px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.loading-spinner {
  width: 28px;
  height: 28px;
  border: 2px solid rgba(99, 102, 241, 0.2);
  border-top-color: var(--primary-color);
  border-radius: 50%;
  animation: spin 0.5s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.quote-text {
  font-size: 1.25rem;
  font-weight: 300;
  line-height: 1.8;
  color: var(--text-primary);
  margin-bottom: 16px;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.6);
}

.quote-footer {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  flex-wrap: wrap;
}

.quote-source {
  font-size: 13px;
  color: var(--text-muted);
  text-shadow: 0 1px 4px rgba(0, 0, 0, 0.5);
}

.refresh-btn {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 10px;
  font-size: 12px;
  color: var(--text-muted);
  background: transparent;
  border: 1px solid var(--glass-border);
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover:not(:disabled) {
    color: var(--primary-light);
    border-color: var(--primary-color);
    
    svg {
      transform: rotate(180deg);
    }
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  svg {
    transition: transform 0.3s;
  }
}
</style>
