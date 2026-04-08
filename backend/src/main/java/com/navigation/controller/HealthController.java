package com.navigation.controller;

import com.navigation.common.Result;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

/**
 * 健康检查控制器
 * 用于 Docker 健康检查和服务状态监控
 */
@Slf4j
@RestController
@RequestMapping("/api")
public class HealthController {

    /**
     * 健康检查接口
     * 
     * @return 健康状态
     */
    @GetMapping("/health")
    public Result<Map<String, Object>> health() {
        log.debug("[HealthController] 收到健康检查请求");
        Map<String, Object> data = new HashMap<>();
        data.put("status", "UP");
        data.put("timestamp", System.currentTimeMillis());
        log.info("[HealthController] 健康检查完成 - 状态: UP");
        return Result.success(data);
    }
}
