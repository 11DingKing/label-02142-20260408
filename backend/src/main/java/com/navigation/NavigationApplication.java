package com.navigation;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.scheduling.annotation.EnableAsync;

/**
 * 个人导航首页后端应用入口
 * 
 * @author Navigation Team
 * @version 1.0.0
 */
@SpringBootApplication
@EnableAsync
@EnableCaching
public class NavigationApplication {

    public static void main(String[] args) {
        SpringApplication.run(NavigationApplication.class, args);
    }
}
