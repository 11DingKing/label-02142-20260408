package com.navigation.config;

import com.github.benmanes.caffeine.cache.Caffeine;
import org.springframework.cache.CacheManager;
import org.springframework.cache.caffeine.CaffeineCacheManager;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.concurrent.TimeUnit;

/**
 * 缓存配置类
 * 使用 Caffeine 作为本地缓存实现
 */
@Configuration
public class CacheConfig {

    /**
     * 配置 Caffeine 缓存管理器
     * 
     * @return CacheManager 缓存管理器
     */
    @Bean
    public CacheManager cacheManager() {
        CaffeineCacheManager cacheManager = new CaffeineCacheManager();
        
        // 配置默认缓存规格
        cacheManager.setCaffeine(Caffeine.newBuilder()
                .initialCapacity(100)
                .maximumSize(1000)
                .expireAfterWrite(30, TimeUnit.SECONDS)
                .recordStats());
        
        return cacheManager;
    }

    /**
     * 服务器信息专用缓存（30秒过期）
     * 
     * @return Caffeine 缓存构建器
     */
    @Bean
    public Caffeine<Object, Object> serverInfoCache() {
        return Caffeine.newBuilder()
                .initialCapacity(10)
                .maximumSize(100)
                .expireAfterWrite(30, TimeUnit.SECONDS)
                .recordStats();
    }
}
