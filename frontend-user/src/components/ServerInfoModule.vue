<template>
  <div class="server-info-module glass-card glass-card--no-hover" v-if="config.serverInfo.enabled">
    <div class="module-header">
      <div class="header-left">
        <div class="header-icon">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <rect x="2" y="3" width="16" height="6" rx="1" stroke="currentColor" stroke-width="1.5"/>
            <rect x="2" y="11" width="16" height="6" rx="1" stroke="currentColor" stroke-width="1.5"/>
            <circle cx="5" cy="6" r="1" fill="currentColor"/>
            <circle cx="5" cy="14" r="1" fill="currentColor"/>
          </svg>
        </div>
        <h3 class="module-title">服务器状态</h3>
      </div>
      <div class="status-badge" :class="statusClass">
        <span class="status-dot"></span>
        <span class="status-text">{{ statusText }}</span>
      </div>
    </div>
    
    <!-- 加载状态 -->
    <div v-if="store.serverInfoLoading && !store.serverInfo" class="loading-state">
      <div class="info-grid">
        <div v-for="i in 4" :key="i" class="info-item info-item--skeleton">
          <div class="skeleton" style="width: 48px; height: 48px; border-radius: 12px;"></div>
          <div class="skeleton-content">
            <div class="skeleton" style="width: 60px; height: 14px;"></div>
            <div class="skeleton" style="width: 100%; height: 6px; margin-top: 8px;"></div>
            <div class="skeleton" style="width: 80px; height: 12px; margin-top: 6px;"></div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 错误状态 -->
    <div v-else-if="store.serverInfoError" class="error-state">
      <div class="error-icon">
        <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
          <circle cx="24" cy="24" r="20" stroke="currentColor" stroke-width="2" stroke-dasharray="4 4"/>
          <path d="M24 16V26" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          <circle cx="24" cy="32" r="1.5" fill="currentColor"/>
        </svg>
      </div>
      <div class="error-content">
        <p class="error-title">无法连接到服务器</p>
        <p class="error-desc">请检查后端服务是否正常运行</p>
      </div>
      <button class="retry-button btn btn--ghost" @click="handleRetry">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M13 8C13 10.7614 10.7614 13 8 13C5.23858 13 3 10.7614 3 8C3 5.23858 5.23858 3 8 3C9.65685 3 11.1046 3.8044 12 5.05025" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
          <path d="M10 5H13V2" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        重新连接
      </button>
    </div>
    
    <!-- 服务器信息 -->
    <div v-else-if="store.serverInfo" class="info-grid">
      <!-- CPU -->
      <div class="info-item" v-if="config.serverInfo.showItems.cpu">
        <div class="item-icon" :class="getStatusClass(store.serverInfo.cpu?.usage)">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <rect x="4" y="4" width="12" height="12" rx="2" stroke="currentColor" stroke-width="1.5"/>
            <rect x="7" y="7" width="6" height="6" rx="1" fill="currentColor"/>
            <path d="M8 2V4M12 2V4M8 16V18M12 16V18M2 8H4M2 12H4M16 8H18M16 12H18" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
          </svg>
        </div>
        <div class="item-content">
          <div class="item-header">
            <span class="item-label">CPU</span>
            <span class="item-value">{{ store.serverInfo.cpu?.usage || 0 }}%</span>
          </div>
          <div class="progress-bar">
            <div 
              class="progress-fill" 
              :style="{ width: `${store.serverInfo.cpu?.usage || 0}%` }"
              :class="getProgressClass(store.serverInfo.cpu?.usage)"
            ></div>
          </div>
          <div class="item-detail">{{ store.serverInfo.cpu?.cores || 0 }} 核心</div>
        </div>
      </div>
      
      <!-- 内存 -->
      <div class="info-item" v-if="config.serverInfo.showItems.memory">
        <div class="item-icon" :class="getStatusClass(store.serverInfo.memory?.usagePercent)">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <rect x="3" y="5" width="14" height="10" rx="2" stroke="currentColor" stroke-width="1.5"/>
            <path d="M6 8V12M9 8V12M12 8V12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
            <path d="M17 8H18V12H17" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
        <div class="item-content">
          <div class="item-header">
            <span class="item-label">内存</span>
            <span class="item-value">{{ store.serverInfo.memory?.usagePercent || 0 }}%</span>
          </div>
          <div class="progress-bar">
            <div 
              class="progress-fill" 
              :style="{ width: `${store.serverInfo.memory?.usagePercent || 0}%` }"
              :class="getProgressClass(store.serverInfo.memory?.usagePercent)"
            ></div>
          </div>
          <div class="item-detail">
            {{ formatBytes(store.serverInfo.memory?.used) }} / {{ formatBytes(store.serverInfo.memory?.total) }}
          </div>
        </div>
      </div>
      
      <!-- 磁盘 -->
      <div class="info-item" v-if="config.serverInfo.showItems.disk">
        <div class="item-icon" :class="getStatusClass(store.serverInfo.disk?.usagePercent)">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <circle cx="10" cy="10" r="7" stroke="currentColor" stroke-width="1.5"/>
            <circle cx="10" cy="10" r="2" fill="currentColor"/>
            <path d="M10 5V7" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
          </svg>
        </div>
        <div class="item-content">
          <div class="item-header">
            <span class="item-label">磁盘</span>
            <span class="item-value">{{ store.serverInfo.disk?.usagePercent || 0 }}%</span>
          </div>
          <div class="progress-bar">
            <div 
              class="progress-fill" 
              :style="{ width: `${store.serverInfo.disk?.usagePercent || 0}%` }"
              :class="getProgressClass(store.serverInfo.disk?.usagePercent)"
            ></div>
          </div>
          <div class="item-detail">
            {{ formatBytes(store.serverInfo.disk?.used) }} / {{ formatBytes(store.serverInfo.disk?.total) }}
          </div>
        </div>
      </div>
      
      <!-- 网络 -->
      <div class="info-item info-item--network" v-if="config.serverInfo.showItems.network">
        <div class="item-icon item-icon--network">
          <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
            <circle cx="10" cy="10" r="7" stroke="currentColor" stroke-width="1.5"/>
            <path d="M3 10H17M10 3C12 5 13 7.5 13 10C13 12.5 12 15 10 17M10 3C8 5 7 7.5 7 10C7 12.5 8 15 10 17" stroke="currentColor" stroke-width="1.5"/>
          </svg>
        </div>
        <div class="item-content">
          <div class="item-header">
            <span class="item-label">网络</span>
          </div>
          <div class="network-compact">
            <span class="net-up">↑ {{ formatSpeed(store.serverInfo.network?.txBytes) }}</span>
            <span class="net-down">↓ {{ formatSpeed(store.serverInfo.network?.rxBytes) }}</span>
          </div>
        </div>
      </div>
      
      <!-- 运行时间 -->
      <div class="info-item info-item--uptime" v-if="config.serverInfo.showItems.uptime">
        <div class="item-icon item-icon--uptime">
          <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
            <circle cx="10" cy="10" r="7" stroke="currentColor" stroke-width="1.5"/>
            <path d="M10 6V10L13 12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
        <div class="item-content">
          <div class="item-header">
            <span class="item-label">运行时间</span>
          </div>
          <div class="uptime-compact">{{ formatUptime(store.serverInfo.uptime) }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
/**
 * 服务器信息模块组件
 * 显示服务器的 CPU、内存、磁盘、网络等信息
 */
import { computed } from 'vue'
import { useAppStore } from '@/stores/app'
import config from '@/config/app.config.js'

const store = useAppStore()

// 状态指示器样式
const statusClass = computed(() => {
  if (store.serverInfoLoading) return 'is-loading'
  if (store.serverInfoError) return 'is-error'
  return 'is-online'
})

// 状态文字
const statusText = computed(() => {
  if (store.serverInfoLoading) return '连接中'
  if (store.serverInfoError) return '离线'
  return '在线'
})

/**
 * 格式化字节数
 */
function formatBytes(bytes) {
  if (!bytes || bytes === 0) return '0 B'
  
  const units = ['B', 'KB', 'MB', 'GB', 'TB']
  const k = 1024
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + units[i]
}

/**
 * 格式化网速（更紧凑）
 */
function formatSpeed(bytes) {
  if (!bytes || bytes === 0) return '0 B/s'
  
  const units = ['B/s', 'KB/s', 'MB/s', 'GB/s']
  const k = 1024
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + units[i]
}

/**
 * 格式化运行时间
 */
function formatUptime(seconds) {
  if (!seconds) return '--'
  
  const days = Math.floor(seconds / 86400)
  const hours = Math.floor((seconds % 86400) / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  
  if (days > 0) return `${days}天 ${hours}时 ${minutes}分`
  if (hours > 0) return `${hours}时 ${minutes}分`
  return `${minutes}分`
}

/**
 * 获取进度条样式类
 */
function getProgressClass(percent) {
  if (!percent) return 'is-normal'
  if (percent >= 90) return 'is-danger'
  if (percent >= 70) return 'is-warning'
  return 'is-normal'
}

/**
 * 获取状态样式类
 */
function getStatusClass(percent) {
  if (!percent) return ''
  if (percent >= 90) return 'is-danger'
  if (percent >= 70) return 'is-warning'
  return 'is-normal'
}

/**
 * 重试连接
 */
function handleRetry() {
  store.loadServerInfo()
  if (window.$toast) {
    window.$toast.info('正在重新连接服务器...')
  }
}
</script>

<style lang="scss" scoped>
.server-info-module {
  padding: var(--spacing-xl);
  position: relative;
  overflow: hidden;
  
  // 背景装饰
  &::before {
    content: '';
    position: absolute;
    top: -50%;
    right: -20%;
    width: 300px;
    height: 300px;
    background: radial-gradient(circle, rgba(99, 102, 241, 0.08) 0%, transparent 70%);
    pointer-events: none;
  }
}

.module-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-xl);
  position: relative;
  z-index: 1;
}

.header-left {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.header-icon {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.15), rgba(139, 92, 246, 0.15));
  border: 1px solid rgba(99, 102, 241, 0.3);
  border-radius: var(--radius-md);
  color: var(--primary-light);
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  
  &:hover {
    transform: scale(1.1) rotate(5deg);
    box-shadow: 0 8px 20px rgba(99, 102, 241, 0.3);
  }
  
  svg {
    animation: serverPulse 3s ease-in-out infinite;
  }
}

@keyframes serverPulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
}

.module-title {
  font-size: var(--font-size-base);
  font-weight: 600;
  color: var(--text-primary);
  letter-spacing: 0.5px;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.4);
}

.status-badge {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-xs) var(--spacing-md);
  border-radius: var(--radius-full);
  font-size: var(--font-size-xs);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  transition: all 0.3s ease;
  
  &.is-online {
    background: rgba(16, 185, 129, 0.15);
    color: #10b981;
    box-shadow: 0 0 20px rgba(16, 185, 129, 0.2);
    
    .status-dot {
      background: #10b981;
      box-shadow: 0 0 12px #10b981;
      animation: onlinePulse 2s ease-in-out infinite;
    }
  }
  
  &.is-loading {
    background: rgba(245, 158, 11, 0.15);
    color: #f59e0b;
    
    .status-dot {
      background: #f59e0b;
      animation: loadingPulse 1s ease-in-out infinite;
    }
  }
  
  &.is-error {
    background: rgba(239, 68, 68, 0.15);
    color: #ef4444;
    
    .status-dot {
      background: #ef4444;
      animation: errorBlink 0.5s ease-in-out infinite;
    }
  }
}

@keyframes onlinePulse {
  0%, 100% { transform: scale(1); box-shadow: 0 0 12px #10b981; }
  50% { transform: scale(1.2); box-shadow: 0 0 20px #10b981; }
}

@keyframes loadingPulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.5; transform: scale(0.8); }
}

@keyframes errorBlink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.3; }
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: var(--spacing-sm);
  position: relative;
  z-index: 1;
  
  @media (max-width: 1024px) {
    grid-template-columns: repeat(3, 1fr);
  }
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
}

.info-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-sm) var(--spacing-md);
  background: var(--glass-bg);
  border: 1px solid var(--glass-border);
  border-radius: var(--radius-lg);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  
  &:hover {
    background: var(--glass-bg-hover);
    border-color: var(--glass-border-hover);
    transform: translateY(-2px);
  }
  
  &--skeleton {
    .skeleton-content {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: var(--spacing-xs);
    }
  }
  
  &--network,
  &--uptime {
    background: var(--glass-bg);
  }
}

.item-icon {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--glass-bg);
  border-radius: var(--radius-md);
  color: var(--text-muted);
  flex-shrink: 0;
  transition: all 0.3s ease;
  
  &.is-normal {
    color: var(--success-color);
    background: rgba(16, 185, 129, 0.12);
  }
  
  &.is-warning {
    color: var(--warning-color);
    background: rgba(245, 158, 11, 0.12);
  }
  
  &.is-danger {
    color: var(--error-color);
    background: rgba(239, 68, 68, 0.12);
  }
  
  &--network {
    color: var(--info-color);
    background: rgba(59, 130, 246, 0.12);
  }
  
  &--uptime {
    color: var(--primary-light);
    background: rgba(99, 102, 241, 0.12);
  }
}

.item-content {
  flex: 1;
  min-width: 0;
}

.item-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-sm);
}

.item-label {
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
  font-weight: 500;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}

.item-value {
  font-size: var(--font-size-sm);
  font-weight: 700;
  color: var(--text-primary);
  font-variant-numeric: tabular-nums;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}

.progress-bar {
  height: 8px;
  background: rgba(255, 255, 255, 0.08);
  border-radius: var(--radius-full);
  overflow: hidden;
  position: relative;
  
  // 背景条纹动画
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: repeating-linear-gradient(
      90deg,
      transparent,
      transparent 10px,
      rgba(255, 255, 255, 0.03) 10px,
      rgba(255, 255, 255, 0.03) 20px
    );
  }
}

.progress-fill {
  height: 100%;
  border-radius: var(--radius-full);
  transition: width 0.8s cubic-bezier(0.16, 1, 0.3, 1);
  position: relative;
  overflow: hidden;
  
  // 光泽动画
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
    animation: progressShine 2s ease-in-out infinite;
  }
  
  &.is-normal {
    background: linear-gradient(90deg, #10b981, #34d399);
    box-shadow: 0 0 10px rgba(16, 185, 129, 0.4);
  }
  
  &.is-warning {
    background: linear-gradient(90deg, #f59e0b, #fbbf24);
    box-shadow: 0 0 10px rgba(245, 158, 11, 0.4);
  }
  
  &.is-danger {
    background: linear-gradient(90deg, #ef4444, #f87171);
    box-shadow: 0 0 10px rgba(239, 68, 68, 0.4);
    animation: dangerGlow 1s ease-in-out infinite;
  }
}

@keyframes progressShine {
  0% { left: -100%; }
  50%, 100% { left: 100%; }
}

@keyframes dangerGlow {
  0%, 100% { box-shadow: 0 0 10px rgba(239, 68, 68, 0.4); }
  50% { box-shadow: 0 0 20px rgba(239, 68, 68, 0.6); }
}

.item-detail {
  font-size: var(--font-size-xs);
  color: var(--text-muted);
  margin-top: var(--spacing-xs);
}

// 网络紧凑样式
.network-compact {
  display: flex;
  gap: var(--spacing-md);
  margin-top: 4px;
  
  .net-up, .net-down {
    font-size: 12px;
    font-weight: 500;
    white-space: nowrap;
  }
  
  .net-up {
    color: #10b981;
  }
  
  .net-down {
    color: #3b82f6;
  }
}

// 运行时间紧凑样式
.uptime-compact {
  font-size: 14px;
  font-weight: 600;
  color: var(--primary-light);
  margin-top: 4px;
  white-space: nowrap;
}

.error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-lg);
  padding: var(--spacing-2xl);
  text-align: center;
}

.error-icon {
  color: var(--text-muted);
  opacity: 0.5;
  animation: errorFloat 3s ease-in-out infinite;
}

@keyframes errorFloat {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

.error-content {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}

.error-title {
  font-size: var(--font-size-base);
  font-weight: 600;
  color: var(--text-secondary);
}

.error-desc {
  font-size: var(--font-size-sm);
  color: var(--text-muted);
}

.retry-button {
  margin-top: var(--spacing-sm);
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
    transition: left 0.5s;
  }
  
  &:hover::before {
    left: 100%;
  }
}

.loading-state {
  .info-item {
    &:hover {
      background: var(--glass-bg);
      border-color: var(--glass-border);
      transform: none;
    }
  }
}
</style>
