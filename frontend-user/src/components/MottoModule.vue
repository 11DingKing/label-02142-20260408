<template>
  <div class="motto-module" v-if="config.mottos.enabled">
    <Transition name="motto" mode="out-in">
      <p class="motto-text" :key="store.currentMotto">
        <span class="motto-icon">✨</span>
        {{ store.currentMotto }}
        <span class="motto-icon">✨</span>
      </p>
    </Transition>
  </div>
</template>

<script setup>
/**
 * 话术文案模块组件
 * 轮播展示配置的话术文案
 */
import { useAppStore } from '@/stores/app'
import config from '@/config/app.config.js'

const store = useAppStore()
</script>

<style lang="scss" scoped>
.motto-module {
  padding: var(--spacing-sm) 0;
}

.motto-text {
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-sm);
  font-size: var(--font-size-base);
  color: var(--text-secondary);
  font-weight: 400;
  letter-spacing: 2px;
  padding: var(--spacing-sm) var(--spacing-lg);
  background: var(--glass-bg);
  border-radius: var(--radius-full);
  border: 1px solid var(--glass-border);
  text-shadow: 0 1px 4px rgba(0, 0, 0, 0.5);
}

.motto-icon {
  font-size: 0.875rem;
  animation: float 2s ease-in-out infinite;
  
  &:last-child {
    animation-delay: -1s;
  }
}

// 切换动画
.motto-enter-active,
.motto-leave-active {
  transition: all 0.5s var(--easing-spring);
}

.motto-enter-from {
  opacity: 0;
  transform: translateY(8px) scale(0.95);
}

.motto-leave-to {
  opacity: 0;
  transform: translateY(-8px) scale(0.95);
}
</style>
