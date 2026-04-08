package com.navigation.controller;

import com.navigation.common.Result;
import com.navigation.dto.ServerInfoDTO;
import com.navigation.service.ServerInfoService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.TimeoutException;

/**
 * 服务器信息控制器
 * 提供服务器状态监控 API
 * 支持异步执行和缓存
 */
@Slf4j
@RestController
@RequestMapping("/api/server")
@RequiredArgsConstructor
public class ServerInfoController {

    private final ServerInfoService serverInfoService;
    
    // 异步调用超时时间（秒）
    private static final int ASYNC_TIMEOUT = 10;

    /**
     * 获取服务器综合信息
     * 使用异步执行和缓存
     * 
     * @return 服务器信息
     */
    @GetMapping("/info")
    public Result<ServerInfoDTO> getServerInfo() {
        log.debug("[ServerInfoController] 收到获取服务器综合信息请求");
        long startTime = System.currentTimeMillis();
        
        try {
            CompletableFuture<ServerInfoDTO> future = serverInfoService.getServerInfoAsync();
            ServerInfoDTO info = future.get(ASYNC_TIMEOUT, TimeUnit.SECONDS);
            
            log.info("[ServerInfoController] 服务器信息获取成功 - 耗时: {}ms, CPU: {}%, Memory: {}%",
                    System.currentTimeMillis() - startTime,
                    info.getCpu() != null ? info.getCpu().getUsage() : "N/A",
                    info.getMemory() != null ? info.getMemory().getUsagePercent() : "N/A");
            
            return Result.success(info);
        } catch (TimeoutException e) {
            log.error("[ServerInfoController] 获取服务器信息超时 - 耗时: {}ms",
                    System.currentTimeMillis() - startTime);
            return Result.error("获取服务器信息超时，请稍后重试");
        } catch (InterruptedException | ExecutionException e) {
            log.error("[ServerInfoController] 获取服务器信息失败 - 耗时: {}ms, 错误: {}",
                    System.currentTimeMillis() - startTime, e.getMessage(), e);
            return Result.error("获取服务器信息失败: " + e.getMessage());
        }
    }

    /**
     * 获取 CPU 信息
     * 使用异步执行和缓存（30秒过期）
     * 
     * @return CPU 信息
     */
    @GetMapping("/cpu")
    public Result<ServerInfoDTO.CpuInfo> getCpuInfo() {
        log.debug("[ServerInfoController] 收到获取 CPU 信息请求");
        long startTime = System.currentTimeMillis();
        
        try {
            CompletableFuture<ServerInfoDTO.CpuInfo> future = serverInfoService.getCpuInfoAsync();
            ServerInfoDTO.CpuInfo cpuInfo = future.get(ASYNC_TIMEOUT, TimeUnit.SECONDS);
            
            log.info("[ServerInfoController] CPU 信息获取成功 - 耗时: {}ms, 使用率: {}%, 核心数: {}",
                    System.currentTimeMillis() - startTime,
                    cpuInfo.getUsage(),
                    cpuInfo.getCores());
            
            return Result.success(cpuInfo);
        } catch (TimeoutException e) {
            log.error("[ServerInfoController] 获取 CPU 信息超时 - 耗时: {}ms",
                    System.currentTimeMillis() - startTime);
            return Result.error("获取 CPU 信息超时，请稍后重试");
        } catch (InterruptedException | ExecutionException e) {
            log.error("[ServerInfoController] 获取 CPU 信息失败 - 耗时: {}ms, 错误: {}",
                    System.currentTimeMillis() - startTime, e.getMessage(), e);
            return Result.error("获取 CPU 信息失败: " + e.getMessage());
        }
    }

    /**
     * 获取内存信息
     * 使用异步执行和缓存（30秒过期）
     * 
     * @return 内存信息
     */
    @GetMapping("/memory")
    public Result<ServerInfoDTO.MemoryInfo> getMemoryInfo() {
        log.debug("[ServerInfoController] 收到获取内存信息请求");
        long startTime = System.currentTimeMillis();
        
        try {
            CompletableFuture<ServerInfoDTO.MemoryInfo> future = serverInfoService.getMemoryInfoAsync();
            ServerInfoDTO.MemoryInfo memoryInfo = future.get(ASYNC_TIMEOUT, TimeUnit.SECONDS);
            
            log.info("[ServerInfoController] 内存信息获取成功 - 耗时: {}ms, 使用率: {}%",
                    System.currentTimeMillis() - startTime,
                    memoryInfo.getUsagePercent());
            
            return Result.success(memoryInfo);
        } catch (TimeoutException e) {
            log.error("[ServerInfoController] 获取内存信息超时 - 耗时: {}ms",
                    System.currentTimeMillis() - startTime);
            return Result.error("获取内存信息超时，请稍后重试");
        } catch (InterruptedException | ExecutionException e) {
            log.error("[ServerInfoController] 获取内存信息失败 - 耗时: {}ms, 错误: {}",
                    System.currentTimeMillis() - startTime, e.getMessage(), e);
            return Result.error("获取内存信息失败: " + e.getMessage());
        }
    }

    /**
     * 获取磁盘信息
     * 使用异步执行和缓存
     * 
     * @return 磁盘信息
     */
    @GetMapping("/disk")
    public Result<ServerInfoDTO.DiskInfo> getDiskInfo() {
        log.debug("[ServerInfoController] 收到获取磁盘信息请求");
        long startTime = System.currentTimeMillis();
        
        try {
            CompletableFuture<ServerInfoDTO.DiskInfo> future = serverInfoService.getDiskInfoAsync();
            ServerInfoDTO.DiskInfo diskInfo = future.get(ASYNC_TIMEOUT, TimeUnit.SECONDS);
            
            log.info("[ServerInfoController] 磁盘信息获取成功 - 耗时: {}ms, 使用率: {}%",
                    System.currentTimeMillis() - startTime,
                    diskInfo.getUsagePercent());
            
            return Result.success(diskInfo);
        } catch (TimeoutException e) {
            log.error("[ServerInfoController] 获取磁盘信息超时 - 耗时: {}ms",
                    System.currentTimeMillis() - startTime);
            return Result.error("获取磁盘信息超时，请稍后重试");
        } catch (InterruptedException | ExecutionException e) {
            log.error("[ServerInfoController] 获取磁盘信息失败 - 耗时: {}ms, 错误: {}",
                    System.currentTimeMillis() - startTime, e.getMessage(), e);
            return Result.error("获取磁盘信息失败: " + e.getMessage());
        }
    }

    /**
     * 获取网络信息
     * 使用异步执行和缓存
     * 
     * @return 网络信息
     */
    @GetMapping("/network")
    public Result<ServerInfoDTO.NetworkInfo> getNetworkInfo() {
        log.debug("[ServerInfoController] 收到获取网络信息请求");
        long startTime = System.currentTimeMillis();
        
        try {
            CompletableFuture<ServerInfoDTO.NetworkInfo> future = serverInfoService.getNetworkInfoAsync();
            ServerInfoDTO.NetworkInfo networkInfo = future.get(ASYNC_TIMEOUT, TimeUnit.SECONDS);
            
            log.info("[ServerInfoController] 网络信息获取成功 - 耗时: {}ms, 上传: {} B/s, 下载: {} B/s",
                    System.currentTimeMillis() - startTime,
                    networkInfo.getTxBytes(),
                    networkInfo.getRxBytes());
            
            return Result.success(networkInfo);
        } catch (TimeoutException e) {
            log.error("[ServerInfoController] 获取网络信息超时 - 耗时: {}ms",
                    System.currentTimeMillis() - startTime);
            return Result.error("获取网络信息超时，请稍后重试");
        } catch (InterruptedException | ExecutionException e) {
            log.error("[ServerInfoController] 获取网络信息失败 - 耗时: {}ms, 错误: {}",
                    System.currentTimeMillis() - startTime, e.getMessage(), e);
            return Result.error("获取网络信息失败: " + e.getMessage());
        }
    }
}
