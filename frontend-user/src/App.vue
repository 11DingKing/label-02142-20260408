<template>
  <div class="app" @click="handleRipple">
    <!-- 背景层 -->
    <BackgroundModule />
    
    <!-- 装饰元素 -->
    <div class="decorations">
      <div class="decoration decoration--1"></div>
      <div class="decoration decoration--2"></div>
      <div class="decoration decoration--3"></div>
    </div>
    
    <!-- 主内容区 -->
    <main class="main-content">
      <div class="content-wrapper">
        <!-- 顶部区域：时间天气 + 搜索 -->
        <header class="header-section">
          <TimeWeatherModule class="animate-fade-in-down animate-delay-1" />
          <SearchModule class="animate-fade-in-down animate-delay-2" />
        </header>
        
        <!-- 中间区域：每日一言 + 话术文案 -->
        <section class="quote-section">
          <DailyQuoteModule class="animate-fade-in-scale animate-delay-3" />
          <MottoModule class="animate-fade-in animate-delay-4" />
        </section>
        
        <!-- 网站链接区域 -->
        <section class="links-section animate-fade-in-up animate-delay-5">
          <WebsiteLinksModule />
        </section>
        
        <!-- 底部区域：服务器信息 -->
        <footer class="footer-section animate-fade-in-up animate-delay-6">
          <ServerInfoModule />
        </footer>
      </div>
    </main>
    
    <!-- Toast 通知 -->
    <Toast ref="toastRef" />
  </div>
</template>

<script setup>
/**
 * 应用根组件
 * 负责整体布局和模块组织
 */
import { ref, onMounted } from 'vue'
import BackgroundModule from '@/components/BackgroundModule.vue'
import TimeWeatherModule from '@/components/TimeWeatherModule.vue'
import SearchModule from '@/components/SearchModule.vue'
import DailyQuoteModule from '@/components/DailyQuoteModule.vue'
import MottoModule from '@/components/MottoModule.vue'
import WebsiteLinksModule from '@/components/WebsiteLinksModule.vue'
import ServerInfoModule from '@/components/ServerInfoModule.vue'
import Toast from '@/components/Toast.vue'

const toastRef = ref(null)

// 涟漪效果
function handleRipple(e) {
  // 可选：全局点击涟漪效果
}

onMounted(() => {
  // 欢迎提示
  setTimeout(() => {
    if (window.$toast) {
      window.$toast.info('欢迎回来！祝你有美好的一天 ✨')
    }
  }, 1500)
})
</script>

<style lang="scss" scoped>
.app {
  min-height: 100vh;
  position: relative;
  overflow: hidden;
}

// 装饰元素
.decorations {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 0;
  overflow: hidden;
}

.decoration {
  position: absolute;
  border-radius: 50%;
  filter: blur(100px);
  opacity: 0.35;
  will-change: transform;
  
  &--1 {
    width: 700px;
    height: 700px;
    background: radial-gradient(circle, rgba(99, 102, 241, 0.5) 0%, transparent 70%);
    top: -250px;
    left: -250px;
    animation: floatDecoration1 25s ease-in-out infinite;
  }
  
  &--2 {
    width: 600px;
    height: 600px;
    background: radial-gradient(circle, rgba(139, 92, 246, 0.4) 0%, transparent 70%);
    bottom: -200px;
    right: -200px;
    animation: floatDecoration2 30s ease-in-out infinite;
  }
  
  &--3 {
    width: 500px;
    height: 500px;
    background: radial-gradient(circle, rgba(6, 182, 212, 0.3) 0%, transparent 70%);
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    animation: floatDecoration3 20s ease-in-out infinite;
  }
}

@keyframes floatDecoration1 {
  0%, 100% {
    transform: translate(0, 0) scale(1);
  }
  25% {
    transform: translate(50px, 30px) scale(1.05);
  }
  50% {
    transform: translate(20px, 60px) scale(0.95);
  }
  75% {
    transform: translate(-30px, 20px) scale(1.02);
  }
}

@keyframes floatDecoration2 {
  0%, 100% {
    transform: translate(0, 0) scale(1);
  }
  33% {
    transform: translate(-40px, -30px) scale(1.08);
  }
  66% {
    transform: translate(30px, -50px) scale(0.92);
  }
}

@keyframes floatDecoration3 {
  0%, 100% {
    transform: translate(-50%, -50%) scale(1);
    opacity: 0.3;
  }
  50% {
    transform: translate(-50%, -50%) scale(1.2);
    opacity: 0.4;
  }
}

.main-content {
  position: relative;
  z-index: 1;
  min-height: 100vh;
  padding: var(--content-padding);
  display: flex;
  flex-direction: column;
  
  @media (min-width: 768px) {
    padding: var(--spacing-xl);
  }
  
  @media (min-width: 1024px) {
    padding: var(--spacing-2xl);
  }
}

.content-wrapper {
  max-width: var(--max-width);
  width: 100%;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xl);
  flex: 1;
  
  @media (min-width: 1024px) {
    gap: var(--spacing-2xl);
  }
}

.header-section {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
  
  @media (min-width: 768px) {
    flex-direction: row;
    justify-content: space-between;
    align-items: flex-start;
  }
}

.quote-section {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
  text-align: center;
  padding: var(--spacing-2xl) 0;
  position: relative;
  
  // 装饰线
  &::before,
  &::after {
    content: '';
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    width: 100px;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(99, 102, 241, 0.3), transparent);
  }
  
  &::before {
    top: 0;
  }
  
  &::after {
    bottom: 0;
  }
  
  @media (min-width: 1024px) {
    padding: var(--spacing-3xl) 0;
  }
}

.links-section {
  flex: 1;
}

.footer-section {
  margin-top: auto;
}
</style>
