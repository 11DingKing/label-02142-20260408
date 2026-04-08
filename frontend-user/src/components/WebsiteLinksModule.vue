<template>
  <div class="website-links-module" v-if="config.websites.enabled">
    <!-- 模块标题 -->
    <div class="module-header">
      <h2 class="module-title">
        <span class="title-icon">🔗</span>
        快捷导航
      </h2>
      <div class="title-decoration"></div>
    </div>
    
    <!-- 分类标签 -->
    <div class="category-tabs">
      <button 
        v-for="(category, index) in config.websites.categories"
        :key="category.name"
        class="category-tab"
        :class="{ 'is-active': activeCategory === index }"
        @click="switchCategory(index)"
      >
        <span class="tab-indicator" v-if="activeCategory === index"></span>
        {{ category.name }}
      </button>
    </div>
    
    <!-- 链接网格 -->
    <div class="links-grid">
      <a 
        v-for="link in currentLinks"
        :key="link.url"
        :href="link.url"
        target="_blank"
        rel="noopener noreferrer"
        class="link-card glass-card glass-card--interactive"
        @click="handleLinkClick(link)"
      >
        <div class="link-icon-wrapper">
          <span class="link-icon">{{ link.icon }}</span>
        </div>
        <div class="link-info">
          <div class="link-name">{{ link.name }}</div>
          <div class="link-description">{{ link.description }}</div>
        </div>
        <div class="link-arrow">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M6 4L10 8L6 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
        
        <!-- Hover 光效 -->
        <div class="link-glow"></div>
      </a>
    </div>
  </div>
</template>

<script setup>
/**
 * 网站链接模块组件
 * 分类展示配置的网站链接
 */
import { ref, computed } from 'vue'
import config from '@/config/app.config.js'

// 当前激活的分类索引
const activeCategory = ref(0)

// 当前分类的链接列表
const currentLinks = computed(() => {
  const category = config.websites.categories[activeCategory.value]
  return category ? category.links : []
})

/**
 * 切换分类
 */
function switchCategory(index) {
  if (activeCategory.value === index) return
  activeCategory.value = index
}

/**
 * 处理链接点击
 */
function handleLinkClick(link) {
  if (window.$toast) {
    window.$toast.info(`正在跳转到 ${link.name}...`)
  }
}
</script>

<style lang="scss" scoped>
.website-links-module {
  width: 100%;
}

.module-header {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-xl);
}

.module-title {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  font-size: var(--font-size-xl);
  font-weight: 600;
  color: var(--text-primary);
  white-space: nowrap;
  text-shadow: 0 2px 6px rgba(0, 0, 0, 0.5);
}

.title-icon {
  font-size: 1.25rem;
  animation: float 3s ease-in-out infinite;
  filter: drop-shadow(0 0 8px rgba(99, 102, 241, 0.4));
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-4px); }
}

.title-decoration {
  flex: 1;
  height: 2px;
  background: linear-gradient(
    90deg,
    rgba(99, 102, 241, 0.5),
    transparent
  );
  border-radius: var(--radius-full);
}

.category-tabs {
  display: flex;
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-xl);
  flex-wrap: wrap;
  
  @media (max-width: 768px) {
    justify-content: center;
  }
}

.category-tab {
  position: relative;
  padding: var(--spacing-sm) var(--spacing-lg);
  font-size: var(--font-size-sm);
  font-weight: 500;
  color: var(--text-muted);
  background: var(--glass-bg);
  border: 1px solid var(--glass-border);
  border-radius: var(--radius-full);
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  overflow: hidden;
  
  &:hover {
    color: var(--text-secondary);
    background: var(--glass-bg-hover);
    border-color: var(--glass-border-hover);
    transform: translateY(-2px);
  }
  
  &.is-active {
    color: white;
    background: var(--primary-gradient);
    border-color: transparent;
    box-shadow: 
      0 4px 20px rgba(99, 102, 241, 0.4),
      0 0 0 1px rgba(255, 255, 255, 0.1) inset;
    transform: translateY(-2px);
  }
}

.tab-indicator {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    180deg,
    rgba(255, 255, 255, 0.25) 0%,
    transparent 100%
  );
  animation: tabShine 2s ease-in-out infinite;
}

@keyframes tabShine {
  0%, 100% { opacity: 0.5; }
  50% { opacity: 1; }
}

.links-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: var(--spacing-md);
  
  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
}

.link-card {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  padding: var(--spacing-lg);
  text-decoration: none;
  position: relative;
  
  // 顶部高光
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 20%;
    right: 20%;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
    opacity: 0;
    transition: opacity 0.3s;
  }
  
  &:hover {
    &::before {
      opacity: 1;
    }
    
    .link-arrow {
      opacity: 1;
      transform: translateX(0);
    }
    
    .link-icon-wrapper {
      transform: scale(1.15) rotate(8deg);
      box-shadow: 0 12px 30px rgba(99, 102, 241, 0.4);
      border-color: rgba(99, 102, 241, 0.5);
    }
    
    .link-glow {
      opacity: 1;
    }
    
    .link-name {
      color: var(--primary-light);
    }
  }
}

.link-icon-wrapper {
  width: 56px;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(139, 92, 246, 0.1));
  border: 1px solid var(--glass-border);
  border-radius: var(--radius-lg);
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
  flex-shrink: 0;
  position: relative;
  overflow: hidden;
  
  // 内部光晕
  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(circle at center, rgba(255, 255, 255, 0.1) 0%, transparent 70%);
    opacity: 0;
    transition: opacity 0.3s;
  }
  
  .link-card:hover &::after {
    opacity: 1;
  }
}

.link-icon {
  font-size: 1.5rem;
  transition: transform 0.3s;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
  
  .link-card:hover & {
    transform: scale(1.1);
  }
}

.link-info {
  flex: 1;
  min-width: 0;
}

.link-name {
  font-size: var(--font-size-base);
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: var(--spacing-xs);
  transition: color 0.3s;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.4);
}

.link-description {
  font-size: var(--font-size-sm);
  color: var(--text-muted);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}

.link-arrow {
  color: var(--primary-light);
  opacity: 0;
  transform: translateX(-12px);
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  
  svg {
    filter: drop-shadow(0 0 4px rgba(99, 102, 241, 0.5));
  }
}

.link-glow {
  position: absolute;
  top: 50%;
  left: 20px;
  width: 80px;
  height: 80px;
  background: radial-gradient(circle, rgba(99, 102, 241, 0.25) 0%, transparent 70%);
  border-radius: 50%;
  transform: translateY(-50%);
  opacity: 0;
  transition: opacity 0.4s;
  pointer-events: none;
  filter: blur(10px);
}
</style>
