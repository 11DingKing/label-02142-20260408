<template>
  <div class="background-module">
    <!-- 背景图片层 -->
    <Transition name="bg-fade" mode="out-in">
      <div 
        class="background-image"
        :key="store.backgroundImage"
        :style="backgroundStyle"
      ></div>
    </Transition>
    
    <!-- 渐变遮罩层 -->
    <div class="background-overlay"></div>
    
    <!-- 噪点纹理 -->
    <div class="background-noise"></div>
    
    <!-- 网格装饰 -->
    <div class="background-grid"></div>
    
    <!-- 加载动画 - 只在角落显示小指示器 -->
    <div v-if="store.backgroundLoading" class="background-loading">
      <div class="loading-dot"></div>
    </div>
  </div>
</template>

<script setup>
/**
 * 背景模块组件
 * 负责显示随机背景图片和磨砂玻璃效果
 */
import { computed, onMounted } from 'vue'
import { useAppStore } from '@/stores/app'
import config from '@/config/app.config.js'

const store = useAppStore()

// 背景样式
const backgroundStyle = computed(() => {
  const bgConfig = config.background
  return {
    backgroundImage: store.backgroundImage 
      ? `url(${store.backgroundImage})` 
      : 'none',
    filter: bgConfig.blurAmount > 0 
      ? `blur(${bgConfig.blurAmount}px)` 
      : 'none'
  }
})

// 组件挂载时初始化
onMounted(() => {
  store.initializeApp()
})
</script>

<style lang="scss" scoped>
.background-module {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  overflow: hidden;
}

.background-image {
  position: absolute;
  top: -20px;
  left: -20px;
  right: -20px;
  bottom: -20px;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  animation: slowZoom 60s ease-in-out infinite alternate;
  will-change: transform;
}

@keyframes slowZoom {
  0% {
    transform: scale(1) rotate(0deg);
  }
  100% {
    transform: scale(1.1) rotate(0.5deg);
  }
}

.background-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: 
    linear-gradient(180deg, 
      rgba(10, 10, 20, 0.75) 0%,
      rgba(10, 10, 20, 0.35) 30%,
      rgba(10, 10, 20, 0.35) 70%,
      rgba(10, 10, 20, 0.85) 100%
    );
  
  // 渐变光晕
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: 
      radial-gradient(ellipse 100% 60% at 10% 10%, rgba(99, 102, 241, 0.18) 0%, transparent 50%),
      radial-gradient(ellipse 80% 50% at 90% 90%, rgba(139, 92, 246, 0.12) 0%, transparent 50%),
      radial-gradient(ellipse 60% 40% at 50% 50%, rgba(6, 182, 212, 0.08) 0%, transparent 50%);
    animation: auroraShift 20s ease-in-out infinite;
  }
}

@keyframes auroraShift {
  0%, 100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.8;
    transform: scale(1.05);
  }
}

.background-noise {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0.025;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
  pointer-events: none;
  animation: noiseShift 0.5s steps(5) infinite;
}

@keyframes noiseShift {
  0% { transform: translate(0, 0); }
  20% { transform: translate(-2%, 2%); }
  40% { transform: translate(2%, -2%); }
  60% { transform: translate(-1%, -1%); }
  80% { transform: translate(1%, 1%); }
  100% { transform: translate(0, 0); }
}

.background-grid {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: 
    linear-gradient(rgba(255, 255, 255, 0.015) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.015) 1px, transparent 1px);
  background-size: 80px 80px;
  pointer-events: none;
  opacity: 0.6;
  animation: gridPulse 10s ease-in-out infinite;
}

@keyframes gridPulse {
  0%, 100% { opacity: 0.6; }
  50% { opacity: 0.4; }
}

.background-loading {
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 10;
}

.loading-dot {
  width: 8px;
  height: 8px;
  background: var(--primary-color);
  border-radius: 50%;
  animation: pulse 1s ease-in-out infinite;
  opacity: 0.6;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); opacity: 0.6; }
  50% { transform: scale(1.5); opacity: 1; }
}

// 过渡动画
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.8s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.bg-fade-enter-active,
.bg-fade-leave-active {
  transition: opacity 2s ease;
}

.bg-fade-enter-from,
.bg-fade-leave-to {
  opacity: 0;
}
</style>
