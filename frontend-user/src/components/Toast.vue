<template>
  <Teleport to="body">
    <TransitionGroup 
      name="toast" 
      tag="div" 
      class="toast-container"
    >
      <div 
        v-for="toast in toasts" 
        :key="toast.id"
        class="toast-item"
        :class="[`toast--${toast.type}`, { 'toast--with-title': toast.title }]"
        @click="removeToast(toast.id)"
        @mouseenter="pauseTimer(toast.id)"
        @mouseleave="resumeTimer(toast.id)"
      >
        <!-- 背景光效 -->
        <div class="toast-glow"></div>
        
        <!-- 图标 -->
        <div class="toast-icon">
          <div class="icon-ring"></div>
          <span class="icon-symbol">
            <svg v-if="toast.type === 'success'" viewBox="0 0 24 24" fill="none">
              <path d="M20 6L9 17L4 12" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <svg v-else-if="toast.type === 'error'" viewBox="0 0 24 24" fill="none">
              <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>
            </svg>
            <svg v-else-if="toast.type === 'warning'" viewBox="0 0 24 24" fill="none">
              <path d="M12 9V13M12 17H12.01M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
            <svg v-else viewBox="0 0 24 24" fill="none">
              <path d="M12 16V12M12 8H12.01M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
          </span>
        </div>
        
        <!-- 内容 -->
        <div class="toast-content">
          <div class="toast-title" v-if="toast.title">{{ toast.title }}</div>
          <div class="toast-message">{{ toast.message }}</div>
        </div>
        
        <!-- 关闭按钮 -->
        <button class="toast-close" @click.stop="removeToast(toast.id)">
          <svg viewBox="0 0 24 24" fill="none">
            <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
        </button>
        
        <!-- 进度条 -->
        <div class="toast-progress-wrapper">
          <div 
            class="toast-progress" 
            :style="{ animationDuration: `${toast.duration}ms`, animationPlayState: toast.paused ? 'paused' : 'running' }"
          ></div>
        </div>
      </div>
    </TransitionGroup>
  </Teleport>
</template>

<script setup>
/**
 * Toast 通知组件 - 高级版
 * 提供全局消息提示功能，支持多种类型和丰富动画
 */
import { ref, onMounted, onUnmounted } from 'vue'

const toasts = ref([])
let toastId = 0
const timers = new Map()

/**
 * 添加 Toast
 */
function addToast({ type = 'info', title = '', message = '', duration = 2000 }) {
  const id = ++toastId
  const toast = { id, type, title, message, duration, paused: false }
  toasts.value.push(toast)
  
  if (duration > 0) {
    const timer = setTimeout(() => removeToast(id), duration)
    timers.set(id, { timer, remaining: duration, start: Date.now() })
  }
  
  // 限制最多显示 3 个
  if (toasts.value.length > 3) {
    const oldest = toasts.value[0]
    removeToast(oldest.id)
  }
  
  return id
}

/**
 * 移除 Toast
 */
function removeToast(id) {
  const index = toasts.value.findIndex(t => t.id === id)
  if (index > -1) {
    toasts.value.splice(index, 1)
    const timerData = timers.get(id)
    if (timerData) {
      clearTimeout(timerData.timer)
      timers.delete(id)
    }
  }
}

/**
 * 暂停计时器
 */
function pauseTimer(id) {
  const toast = toasts.value.find(t => t.id === id)
  const timerData = timers.get(id)
  if (toast && timerData) {
    toast.paused = true
    clearTimeout(timerData.timer)
    timerData.remaining -= Date.now() - timerData.start
  }
}

/**
 * 恢复计时器
 */
function resumeTimer(id) {
  const toast = toasts.value.find(t => t.id === id)
  const timerData = timers.get(id)
  if (toast && timerData && timerData.remaining > 0) {
    toast.paused = false
    timerData.start = Date.now()
    timerData.timer = setTimeout(() => removeToast(id), timerData.remaining)
  }
}

// 暴露方法供全局使用
defineExpose({ addToast, removeToast })

// 全局事件监听
onMounted(() => {
  window.$toast = {
    success: (message, title) => addToast({ type: 'success', message, title, duration: 1500 }),
    error: (message, title) => addToast({ type: 'error', message, title, duration: 3000 }),
    warning: (message, title) => addToast({ type: 'warning', message, title, duration: 2500 }),
    info: (message, title) => addToast({ type: 'info', message, title, duration: 1500 })
  }
})

onUnmounted(() => {
  timers.forEach((data) => clearTimeout(data.timer))
  timers.clear()
  delete window.$toast
})
</script>

<style lang="scss" scoped>
.toast-container {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 10000;
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-width: 300px;
  width: calc(100vw - 40px);
  pointer-events: none;
  
  @media (max-width: 480px) {
    top: 12px;
    right: 12px;
    width: calc(100vw - 24px);
    max-width: 280px;
  }
}

.toast-item {
  position: relative;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 14px;
  background: rgba(20, 20, 35, 0.95);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
  cursor: pointer;
  pointer-events: auto;
  overflow: hidden;
  transition: all 0.2s ease;
  
  &:hover {
    transform: translateX(-2px);
  }
  
  &:active {
    transform: scale(0.98);
  }
}

// Toast 类型样式
.toast--success {
  border-color: rgba(34, 197, 94, 0.3);
  
  .toast-glow {
    background: radial-gradient(ellipse at top left, rgba(34, 197, 94, 0.2) 0%, transparent 60%);
  }
  
  .toast-icon {
    color: #22c55e;
    
    .icon-ring {
      border-color: rgba(34, 197, 94, 0.3);
      box-shadow: 0 0 20px rgba(34, 197, 94, 0.3);
    }
  }
  
  .toast-progress {
    background: linear-gradient(90deg, #22c55e, #4ade80);
  }
}

.toast--error {
  border-color: rgba(244, 63, 94, 0.3);
  
  .toast-glow {
    background: radial-gradient(ellipse at top left, rgba(244, 63, 94, 0.2) 0%, transparent 60%);
  }
  
  .toast-icon {
    color: #f43f5e;
    
    .icon-ring {
      border-color: rgba(244, 63, 94, 0.3);
      box-shadow: 0 0 20px rgba(244, 63, 94, 0.3);
      animation: errorPulse 1.5s ease-in-out infinite;
    }
  }
  
  .toast-progress {
    background: linear-gradient(90deg, #f43f5e, #fb7185);
  }
}

.toast--warning {
  border-color: rgba(251, 191, 36, 0.3);
  
  .toast-glow {
    background: radial-gradient(ellipse at top left, rgba(251, 191, 36, 0.2) 0%, transparent 60%);
  }
  
  .toast-icon {
    color: #fbbf24;
    
    .icon-ring {
      border-color: rgba(251, 191, 36, 0.3);
      box-shadow: 0 0 20px rgba(251, 191, 36, 0.3);
    }
  }
  
  .toast-progress {
    background: linear-gradient(90deg, #fbbf24, #fcd34d);
  }
}

.toast--info {
  border-color: rgba(56, 189, 248, 0.3);
  
  .toast-glow {
    background: radial-gradient(ellipse at top left, rgba(56, 189, 248, 0.2) 0%, transparent 60%);
  }
  
  .toast-icon {
    color: #38bdf8;
    
    .icon-ring {
      border-color: rgba(56, 189, 248, 0.3);
      box-shadow: 0 0 20px rgba(56, 189, 248, 0.3);
    }
  }
  
  .toast-progress {
    background: linear-gradient(90deg, #38bdf8, #7dd3fc);
  }
}

// 背景光效
.toast-glow {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  opacity: 0.8;
}

// 图标区域
.toast-icon {
  position: relative;
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.icon-ring {
  position: absolute;
  inset: 0;
  border: 1.5px solid;
  border-radius: 8px;
}

.icon-symbol {
  position: relative;
  z-index: 1;
  width: 16px;
  height: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  
  svg {
    width: 100%;
    height: 100%;
  }
}

// 内容区域
.toast-content {
  flex: 1;
  min-width: 0;
  padding-right: 20px;
}

.toast-title {
  font-size: 12px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.95);
  margin-bottom: 2px;
  line-height: 1.3;
}

.toast-message {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.4;
  word-break: break-word;
}

.toast--with-title .toast-message {
  font-size: 11px;
  color: rgba(255, 255, 255, 0.6);
}

// 关闭按钮
.toast-close {
  position: absolute;
  top: 8px;
  right: 8px;
  width: 18px;
  height: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(255, 255, 255, 0.4);
  border-radius: 4px;
  transition: all 0.2s ease;
  
  svg {
    width: 10px;
    height: 10px;
  }
  
  &:hover {
    color: rgba(255, 255, 255, 0.9);
    background: rgba(255, 255, 255, 0.1);
  }
}

// 进度条
.toast-progress-wrapper {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: rgba(255, 255, 255, 0.1);
  overflow: hidden;
  border-radius: 0 0 10px 10px;
}

.toast-progress {
  height: 100%;
  width: 100%;
  transform-origin: left;
  animation: progressShrink linear forwards;
  border-radius: 0 0 10px 10px;
}

// 动画关键帧
@keyframes progressShrink {
  from {
    transform: scaleX(1);
  }
  to {
    transform: scaleX(0);
  }
}

@keyframes iconRingPulse {
  0%, 100% {
    opacity: 0.6;
    transform: scale(1);
  }
  50% {
    opacity: 1;
    transform: scale(1.05);
  }
}

@keyframes errorPulse {
  0%, 100% {
    opacity: 0.6;
    box-shadow: 0 0 20px rgba(244, 63, 94, 0.3);
  }
  50% {
    opacity: 1;
    box-shadow: 0 0 30px rgba(244, 63, 94, 0.5);
  }
}

// 进入/离开动画
.toast-enter-active {
  animation: toastEnter 0.25s ease-out;
}

.toast-leave-active {
  animation: toastLeave 0.2s ease-in;
}

.toast-move {
  transition: transform 0.25s ease;
}

@keyframes toastEnter {
  0% {
    opacity: 0;
    transform: translateX(50px);
  }
  100% {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes toastLeave {
  0% {
    opacity: 1;
    transform: translateX(0);
  }
  100% {
    opacity: 0;
    transform: translateX(30px);
  }
}
</style>
