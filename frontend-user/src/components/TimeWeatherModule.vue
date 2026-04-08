<template>
  <div class="time-weather-module glass-card glass-card--no-hover">
    <!-- 时间显示 -->
    <div class="time-section">
      <div class="greeting-wrapper">
        <span class="greeting-emoji">{{ greetingEmoji }}</span>
        <span class="greeting">{{ store.greeting }}</span>
      </div>
      <div class="time-display">
        <span
          class="time-digit"
          v-for="(char, index) in timeChars"
          :key="index"
        >
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
      <!-- 加载状态 -->
      <template v-if="store.weatherLoading">
        <div class="weather-loading">
          <div class="weather-skeleton">
            <div class="skeleton-icon skeleton"></div>
            <div class="skeleton-content">
              <div class="skeleton-temp skeleton"></div>
              <div class="skeleton-text skeleton"></div>
            </div>
          </div>
          <div class="skeleton-location skeleton"></div>
          <div class="skeleton-details">
            <div class="skeleton-detail skeleton"></div>
            <div class="skeleton-detail skeleton"></div>
          </div>
        </div>
      </template>

      <!-- 错误状态 -->
      <template v-else-if="weatherError">
        <div class="weather-error">
          <div class="error-icon-wrapper">
            <span class="error-emoji">⚠️</span>
          </div>
          <div class="error-info">
            <p class="error-title">天气信息加载失败</p>
            <p class="error-desc">{{ weatherErrorMessage }}</p>
          </div>
          <button class="retry-btn btn btn--ghost" @click="handleRetry">
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
              <path
                d="M13 8C13 10.7614 10.7614 13 8 13C5.23858 13 3 10.7614 3 8C3 5.23858 5.23858 3 8 3C9.65685 3 11.1046 3.8044 12 5.05025"
                stroke="currentColor"
                stroke-width="1.5"
                stroke-linecap="round"
              />
              <path
                d="M10 5H13V2"
                stroke="currentColor"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
            重试
          </button>
        </div>
      </template>

      <!-- 正常状态 -->
      <template v-else>
        <div class="weather-main">
          <div class="weather-icon-wrapper">
            <span class="weather-icon">{{
              getWeatherEmoji(store.weather.text)
            }}</span>
          </div>
          <div class="weather-info">
            <span class="weather-temp"
              >{{ store.weather.temp }}<span class="temp-unit">°C</span></span
            >
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
      </template>
    </div>
  </div>
</template>

<script setup>
/**
 * 时间天气模块组件
 * 显示当前时间、日期、问候语和天气信息
 */
import { computed, ref, watch } from "vue";
import { useAppStore } from "@/stores/app";

const store = useAppStore();

// 天气错误状态
const weatherError = ref(false);
const weatherErrorMessage = ref("");

// 监听天气加载状态变化
watch(
  () => store.weatherLoading,
  (loading) => {
    if (!loading) {
      // 加载完成后检查是否是错误状态（模拟数据）
      if (store.weather.temp === "--" && store.weather.text === "晴") {
        // 这可能是模拟数据，不显示错误
        weatherError.value = false;
      }
    }
  },
);

// 时间字符数组（用于动画）
const timeChars = computed(() => {
  return store.formattedTime.split("");
});

// 问候语对应的 emoji
const greetingEmoji = computed(() => {
  const hour = store.currentTime.getHours();
  if (hour < 6) return "🌙";
  if (hour < 9) return "🌅";
  if (hour < 12) return "☀️";
  if (hour < 14) return "🌞";
  if (hour < 18) return "🌤️";
  if (hour < 22) return "🌆";
  return "🌙";
});

/**
 * 根据天气文字获取对应的 emoji
 */
function getWeatherEmoji(text) {
  const weatherMap = {
    晴: "☀️",
    多云: "⛅",
    阴: "☁️",
    小雨: "🌧️",
    中雨: "🌧️",
    大雨: "⛈️",
    暴雨: "⛈️",
    雷阵雨: "⛈️",
    小雪: "🌨️",
    中雪: "🌨️",
    大雪: "❄️",
    雾: "🌫️",
    霾: "🌫️",
    沙尘: "🌪️",
    加载中: "⏳",
  };

  for (const [key, emoji] of Object.entries(weatherMap)) {
    if (text && text.includes(key)) {
      return emoji;
    }
  }

  return "🌤️";
}

/**
 * 重试加载天气
 */
function handleRetry() {
  weatherError.value = false;
  weatherErrorMessage.value = "";
  store.loadWeather();
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
    content: "";
    position: absolute;
    top: 0;
    left: 10%;
    right: 10%;
    height: 1px;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(99, 102, 241, 0.5),
      transparent
    );
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

  &:nth-child(3),
  &:nth-child(6) {
    animation:
      morphGradient 4s ease infinite,
      blink 1s ease-in-out infinite;
  }

  @media (max-width: 768px) {
    font-size: 2.5rem;
  }

  @media (max-width: 480px) {
    font-size: 2rem;
  }
}

@keyframes blink {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.3;
  }
}

@keyframes morphGradient {
  0%,
  100% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
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
  0%,
  100% {
    box-shadow: 0 0 16px rgba(99, 102, 241, 0.6);
    transform: scale(1);
  }
  50% {
    box-shadow: 0 0 24px rgba(99, 102, 241, 0.9);
    transform: scale(1.2);
  }
}

.weather-section {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: var(--spacing-md);
  min-height: 120px;

  @media (max-width: 768px) {
    align-items: center;
  }
}

// 加载状态样式
.weather-loading {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.weather-skeleton {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
}

.skeleton-icon {
  width: 50px;
  height: 50px;
  border-radius: var(--radius-lg);
}

.skeleton-content {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}

.skeleton-temp {
  width: 80px;
  height: 28px;
  border-radius: var(--radius-sm);
}

.skeleton-text {
  width: 60px;
  height: 14px;
  border-radius: var(--radius-sm);
}

.skeleton-location {
  width: 100px;
  height: 16px;
  border-radius: var(--radius-sm);
}

.skeleton-details {
  display: flex;
  gap: var(--spacing-sm);
}

.skeleton-detail {
  width: 60px;
  height: 40px;
  border-radius: var(--radius-md);
}

// 错误状态样式
.weather-error {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-md);
  padding: var(--spacing-md);
  text-align: center;
}

.error-icon-wrapper {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(239, 68, 68, 0.1);
  border-radius: var(--radius-lg);
  border: 1px solid rgba(239, 68, 68, 0.2);
  animation: errorFloat 3s ease-in-out infinite;
}

@keyframes errorFloat {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-8px);
  }
}

.error-emoji {
  font-size: 1.5rem;
}

.error-info {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}

.error-title {
  font-size: var(--font-size-sm);
  font-weight: 600;
  color: var(--text-secondary);
}

.error-desc {
  font-size: var(--font-size-xs);
  color: var(--text-muted);
}

.retry-btn {
  padding: var(--spacing-xs) var(--spacing-md);
  font-size: var(--font-size-xs);
  gap: var(--spacing-xs);

  &:hover {
    svg {
      transform: rotate(180deg);
    }
  }

  svg {
    transition: transform 0.3s;
  }
}

// 正常状态样式
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
  background: linear-gradient(
    135deg,
    rgba(99, 102, 241, 0.1),
    rgba(139, 92, 246, 0.1)
  );
  border-radius: var(--radius-lg);
  border: 1px solid var(--glass-border);
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
  position: relative;
  overflow: hidden;
  flex-shrink: 0;

  &::before {
    content: "";
    position: absolute;
    inset: 0;
    background: radial-gradient(
      circle at center,
      rgba(99, 102, 241, 0.2) 0%,
      transparent 70%
    );
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
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-3px);
  }
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

@keyframes float {
  0%,
  100% {
    transform: translateY(0) rotate(0deg);
  }
  25% {
    transform: translateY(-6px) rotate(1deg);
  }
  75% {
    transform: translateY(6px) rotate(-1deg);
  }
}
</style>
