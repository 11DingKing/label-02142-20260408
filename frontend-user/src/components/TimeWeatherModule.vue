<template>
  <div class="time-weather-module glass-card glass-card--no-hover">
    <!-- 时间显示 -->
    <div class="time-section">
      <div class="greeting-wrapper">
        <span class="greeting-emoji">{{ greetingEmoji }}</span>
        <span class="greeting">{{ store.greeting }}</span>
      </div>
      <div class="time-display">
        <span class="time-digit" v-for="(char, index) in timeChars" :key="index">
          {{ char }}
        </span>
      </div>
      <div class="date">
        <span class="date-icon">📅</span>
        {{ store.formattedDate }}
      </div>
    </div>
    
    <!-- 分隔线 -->
    <div class="divider">
      <div class="divider-line"></div>
      <div class="divider-dot"></div>
      <div class="divider-line"></div>
    </div>
    
    <!-- 天气显示 -->
    <div class="weather-section">
      <div class="weather-main">
        <div class="weather-icon-wrapper">
          <span class="weather-icon">{{ getWeatherEmoji(store.weather.text) }}</span>
        </div>
        <div class="weather-info">
          <span class="weather-temp">{{ store.weather.temp }}<span class="temp-unit">°C</span></span>
          <span class="weather-text">{{ store.weather.text }}</span>
        </div>
      </div>
      <div class="weather-location">
        <span class="location-pin">📍</span>
        <span class="location-name">{{ store.currentCity }}</span>
      </div>
      <div class="weather-details" v-if="store.weather.humidity !== '--'">
        <div class="detail-item">
          <span class="detail-icon">💧</span>
          <span class="detail-value">{{ store.weather.humidity }}%</span>
          <span class="detail-label">湿度</span>
        </div>
        <div class="detail-item">
          <span class="detail-icon">🌬️</span>
          <span class="detail-value">{{ store.weather.windScale }}级</span>
          <span class="detail-label">{{ store.weather.windDir }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
/**
 * 时间天气模块组件
 * 显示当前时间、日期、问候语和天气信息
 */
import { computed } from 'vue'
import { useAppStore } from '@/stores/app'

const store = useAppStore()

// 时间字符数组（用于动画）
const timeChars = computed(() => {
  return store.formattedTime.split('')
})

// 问候语对应的 emoji
const greetingEmoji = computed(() => {
  const hour = store.currentTime.getHours()
  if (hour < 6) return '🌙'
  if (hour < 9) return '🌅'
  if (hour < 12) return '☀️'
  if (hour < 14) return '🌞'
  if (hour < 18) return '🌤️'
  if (hour < 22) return '🌆'
  return '🌙'
})

/**
 * 根据天气文字获取对应的 emoji
 */
function getWeatherEmoji(text) {
  const weatherMap = {
    '晴': '☀️',
    '多云': '⛅',
    '阴': '☁️',
    '小雨': '🌧️',
    '中雨': '🌧️',
    '大雨': '⛈️',
    '暴雨': '⛈️',
    '雷阵雨': '⛈️',
    '小雪': '🌨️',
    '中雪': '🌨️',
    '大雪': '❄️',
    '雾': '🌫️',
    '霾': '🌫️',
    '沙尘': '🌪️',
    '加载中': '⏳'
  }
  
  for (const [key, emoji] of Object.entries(weatherMap)) {
    if (text && text.includes(key)) {
      return emoji
    }
  }
  
  return '🌤️'
}
</script>

<style lang="scss" scoped>
.time-weather-module {
  display: flex;
  align-items: stretch;
  gap: var(--spacing-lg);
  padding: var(--spacing-lg);
  position: relative;
  overflow: hidden;
  
  // 顶部渐变光效
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 10%;
    right: 10%;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(99, 102, 241, 0.5), transparent);
  }
  
  @media (max-width: 768px) {
    flex-direction: column;
    width: 100%;
    gap: var(--spacing-md);
    padding: var(--spacing-md);
  }
  
  @media (max-width: 480px) {
    padding: var(--spacing-sm);
  }
}

.time-section {
  display: flex;
  flex-direction: column;
  justify-content: center;
  
  @media (max-width: 768px) {
    align-items: center;
    text-align: center;
  }
}

.greeting-wrapper {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-sm);
}

.greeting-emoji {
  font-size: 1.25rem;
  animation: float 3s ease-in-out infinite;
  filter: drop-shadow(0 0 8px rgba(255, 255, 255, 0.3));
}

.greeting {
  font-size: var(--font-size-lg);
  color: var(--text-secondary);
  font-weight: 500;
  letter-spacing: 0.5px;
  animation: fadeInUp 0.6s ease-out;
  text-shadow: 0 2px 6px rgba(0, 0, 0, 0.5);
}

.time-display {
  display: flex;
  gap: 2px;
  margin-bottom: var(--spacing-sm);
  perspective: 500px;
}

.time-digit {
  font-size: 3rem;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
  background-size: 200% 200%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  line-height: 1;
  min-width: 0.6em;
  text-align: center;
  animation: morphGradient 4s ease infinite;
  transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.5));
  
  &:hover {
    transform: scale(1.1) rotateY(10deg);
  }
  
  &:nth-child(3), &:nth-child(6) {
    animation: morphGradient 4s ease infinite, blink 1s ease-in-out infinite;
  }
  
  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
  
  @media (max-width: 480px) {
    font-size: 2rem;
  }
}

@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.3; }
}

@keyframes morphGradient {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}

@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.date {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  font-size: var(--font-size-sm);
  color: var(--text-muted);
  padding: var(--spacing-xs) var(--spacing-sm);
  background: var(--glass-bg);
  border-radius: var(--radius-full);
  border: 1px solid var(--glass-border);
  transition: all 0.3s ease;
  
  &:hover {
    background: var(--glass-bg-hover);
    border-color: var(--glass-border-hover);
    transform: translateY(-2px);
  }
}

.date-icon {
  font-size: 0.875rem;
  animation: float 4s ease-in-out infinite;
}

.divider {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-sm);
  padding: 0 var(--spacing-sm);
  
  @media (max-width: 768px) {
    flex-direction: row;
    padding: var(--spacing-sm) 0;
  }
}

.divider-line {
  width: 2px;
  height: 40px;
  background: linear-gradient(
    to bottom,
    transparent,
    var(--glass-border),
    transparent
  );
  border-radius: var(--radius-full);
  
  @media (max-width: 768px) {
    width: 40px;
    height: 2px;
    background: linear-gradient(
      to right,
      transparent,
      var(--glass-border),
      transparent
    );
  }
}

.divider-dot {
  width: 8px;
  height: 8px;
  background: var(--primary-gradient);
  border-radius: 50%;
  box-shadow: 0 0 16px rgba(99, 102, 241, 0.6);
  animation: glow 2s ease-in-out infinite;
}

@keyframes glow {
  0%, 100% { box-shadow: 0 0 16px rgba(99, 102, 241, 0.6); transform: scale(1); }
  50% { box-shadow: 0 0 24px rgba(99, 102, 241, 0.9); transform: scale(1.2); }
}

.weather-section {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: var(--spacing-md);
  
  @media (max-width: 768px) {
    align-items: center;
  }
}

.weather-main {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
}

.weather-icon-wrapper {
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(139, 92, 246, 0.1));
  border-radius: var(--radius-lg);
  border: 1px solid var(--glass-border);
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
  position: relative;
  overflow: hidden;
  flex-shrink: 0;
  
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(circle at center, rgba(99, 102, 241, 0.2) 0%, transparent 70%);
    opacity: 0;
    transition: opacity 0.3s;
  }
  
  &:hover {
    transform: scale(1.1) rotate(5deg);
    border-color: rgba(99, 102, 241, 0.4);
    box-shadow: 0 8px 24px rgba(99, 102, 241, 0.3);
    
    &::before {
      opacity: 1;
    }
  }
  
  @media (max-width: 480px) {
    width: 40px;
    height: 40px;
  }
}

.weather-icon {
  font-size: 1.5rem;
  animation: float 4s ease-in-out infinite;
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2));
  
  @media (max-width: 480px) {
    font-size: 1.25rem;
  }
}

.weather-info {
  display: flex;
  flex-direction: column;
}

.weather-temp {
  font-size: 1.75rem;
  font-weight: 700;
  line-height: 1;
  color: var(--text-primary);
  display: flex;
  align-items: flex-start;
  transition: transform 0.3s ease;
  text-shadow: 0 2px 6px rgba(0, 0, 0, 0.5);
  
  &:hover {
    transform: scale(1.05);
  }
  
  @media (max-width: 480px) {
    font-size: 1.5rem;
  }
}

.temp-unit {
  font-size: 1rem;
  font-weight: 500;
  color: var(--text-secondary);
  margin-left: 2px;
  
  @media (max-width: 480px) {
    font-size: 0.875rem;
  }
}

.weather-text {
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
  margin-top: var(--spacing-xs);
  padding: 2px 8px;
  background: var(--glass-bg);
  border-radius: var(--radius-sm);
  display: inline-block;
  width: fit-content;
}

.weather-location {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  font-size: var(--font-size-sm);
  color: var(--text-muted);
  transition: color 0.3s;
  
  &:hover {
    color: var(--text-secondary);
  }
}

.location-pin {
  font-size: 0.875rem;
  animation: bounce 2s ease-in-out infinite;
}

@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-3px); }
}

.weather-details {
  display: flex;
  gap: var(--spacing-sm);
  
  @media (max-width: 480px) {
    gap: var(--spacing-xs);
  }
}

.detail-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  padding: var(--spacing-xs) var(--spacing-sm);
  background: var(--glass-bg);
  border-radius: var(--radius-md);
  border: 1px solid var(--glass-border);
  min-width: 60px;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  
  &:hover {
    background: var(--glass-bg-hover);
    border-color: var(--glass-border-hover);
    transform: translateY(-4px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
  }
  
  @media (max-width: 480px) {
    min-width: 50px;
    padding: var(--spacing-xs);
  }
}

.detail-icon {
  font-size: 1rem;
  transition: transform 0.3s;
  
  .detail-item:hover & {
    transform: scale(1.2);
  }
}

.detail-value {
  font-size: var(--font-size-sm);
  font-weight: 600;
  color: var(--text-primary);
}

.detail-label {
  font-size: var(--font-size-xs);
  color: var(--text-muted);
}
</style>
