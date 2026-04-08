package com.navigation.service.impl;

import com.navigation.dto.ServerInfoDTO;
import com.navigation.service.ServerInfoService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import oshi.SystemInfo;
import oshi.hardware.CentralProcessor;
import oshi.hardware.GlobalMemory;
import oshi.hardware.HardwareAbstractionLayer;
import oshi.hardware.NetworkIF;
import oshi.software.os.FileSystem;
import oshi.software.os.OSFileStore;
import oshi.software.os.OperatingSystem;

import jakarta.annotation.PostConstruct;
import java.util.List;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.atomic.AtomicLong;

/**
 * 服务器信息服务实现类
 * 使用 oshi-core 库获取系统信息
 * 支持异步执行和缓存
 */
@Slf4j
@Service
public class ServerInfoServiceImpl implements ServerInfoService {

    private SystemInfo systemInfo;
    private HardwareAbstractionLayer hardware;
    private OperatingSystem os;
    
    // 用于计算网络速率的上一次采样值
    private AtomicLong lastTxBytes = new AtomicLong(0);
    private AtomicLong lastRxBytes = new AtomicLong(0);
    private long lastSampleTime = 0;
    
    // 用于计算 CPU 使用率的上一次采样值
    private long[] prevTicks;

    @PostConstruct
    public void init() {
        log.info("[ServerInfoService] 初始化系统信息采集器...");
        try {
            this.systemInfo = new SystemInfo();
            this.hardware = systemInfo.getHardware();
            this.os = systemInfo.getOperatingSystem();
            this.prevTicks = hardware.getProcessor().getSystemCpuLoadTicks();
            
            // 初始化网络采样
            initNetworkSample();
            
            log.info("[ServerInfoService] 系统信息采集器初始化完成 - OS: {}, CPU: {}, Memory: {} GB",
                    os.getFamily(),
                    hardware.getProcessor().getProcessorIdentifier().getName(),
                    hardware.getMemory().getTotal() / (1024 * 1024 * 1024));
        } catch (Exception e) {
            log.error("[ServerInfoService] 系统信息采集器初始化失败: {}", e.getMessage(), e);
            throw e;
        }
    }

    /**
     * 初始化网络采样数据
     */
    private void initNetworkSample() {
        List<NetworkIF> networkIFs = hardware.getNetworkIFs();
        long totalTx = 0;
        long totalRx = 0;
        
        for (NetworkIF net : networkIFs) {
            net.updateAttributes();
            totalTx += net.getBytesSent();
            totalRx += net.getBytesRecv();
        }
        
        lastTxBytes.set(totalTx);
        lastRxBytes.set(totalRx);
        lastSampleTime = System.currentTimeMillis();
    }

    @Override
    public ServerInfoDTO getServerInfo() {
        log.debug("[ServerInfoService] 获取服务器综合信息");
        try {
            ServerInfoDTO info = ServerInfoDTO.builder()
                    .cpu(getCpuInfo())
                    .memory(getMemoryInfo())
                    .disk(getDiskInfo())
                    .network(getNetworkInfo())
                    .uptime(os.getSystemUptime())
                    .osName(os.toString())
                    .hostname(os.getNetworkParams().getHostName())
                    .build();
            log.debug("[ServerInfoService] 服务器信息获取成功 - CPU: {}%, Memory: {}%, Disk: {}%",
                    info.getCpu().getUsage(),
                    info.getMemory().getUsagePercent(),
                    info.getDisk().getUsagePercent());
            return info;
        } catch (Exception e) {
            log.error("[ServerInfoService] 获取服务器信息失败: {}", e.getMessage(), e);
            throw e;
        }
    }

    @Override
    @Async("serverInfoExecutor")
    @Cacheable(value = "serverInfo", key = "'all'", sync = true)
    public CompletableFuture<ServerInfoDTO> getServerInfoAsync() {
        log.debug("[ServerInfoService] 异步获取服务器综合信息");
        try {
            // 并行获取各个信息
            CompletableFuture<ServerInfoDTO.CpuInfo> cpuFuture = getCpuInfoAsync();
            CompletableFuture<ServerInfoDTO.MemoryInfo> memoryFuture = getMemoryInfoAsync();
            CompletableFuture<ServerInfoDTO.DiskInfo> diskFuture = getDiskInfoAsync();
            CompletableFuture<ServerInfoDTO.NetworkInfo> networkFuture = getNetworkInfoAsync();
            
            // 等待所有任务完成
            CompletableFuture.allOf(cpuFuture, memoryFuture, diskFuture, networkFuture).join();
            
            ServerInfoDTO info = ServerInfoDTO.builder()
                    .cpu(cpuFuture.get())
                    .memory(memoryFuture.get())
                    .disk(diskFuture.get())
                    .network(networkFuture.get())
                    .uptime(os.getSystemUptime())
                    .osName(os.toString())
                    .hostname(os.getNetworkParams().getHostName())
                    .build();
            
            log.info("[ServerInfoService] 异步获取服务器信息成功 - CPU: {}%, Memory: {}%",
                    info.getCpu().getUsage(),
                    info.getMemory().getUsagePercent());
            
            return CompletableFuture.completedFuture(info);
        } catch (Exception e) {
            log.error("[ServerInfoService] 异步获取服务器信息失败: {}", e.getMessage(), e);
            return CompletableFuture.failedFuture(e);
        }
    }

    @Override
    public ServerInfoDTO.CpuInfo getCpuInfo() {
        log.trace("[ServerInfoService] 获取 CPU 信息");
        try {
            CentralProcessor processor = hardware.getProcessor();
            
            // 计算 CPU 使用率
            long[] ticks = processor.getSystemCpuLoadTicks();
            double cpuLoad = processor.getSystemCpuLoadBetweenTicks(prevTicks) * 100;
            prevTicks = ticks;
            
            ServerInfoDTO.CpuInfo cpuInfo = ServerInfoDTO.CpuInfo.builder()
                    .usage(Math.round(cpuLoad * 10.0) / 10.0)
                    .cores(processor.getLogicalProcessorCount())
                    .model(processor.getProcessorIdentifier().getName())
                    .build();
            
            log.trace("[ServerInfoService] CPU 信息: usage={}%, cores={}", cpuInfo.getUsage(), cpuInfo.getCores());
            return cpuInfo;
        } catch (Exception e) {
            log.error("[ServerInfoService] 获取 CPU 信息失败: {}", e.getMessage(), e);
            throw e;
        }
    }

    @Override
    @Async("serverInfoExecutor")
    @Cacheable(value = "cpuInfo", key = "'cpu'", sync = true)
    public CompletableFuture<ServerInfoDTO.CpuInfo> getCpuInfoAsync() {
        log.debug("[ServerInfoService] 异步获取 CPU 信息");
        try {
            ServerInfoDTO.CpuInfo cpuInfo = getCpuInfo();
            log.debug("[ServerInfoService] 异步获取 CPU 信息成功: usage={}%", cpuInfo.getUsage());
            return CompletableFuture.completedFuture(cpuInfo);
        } catch (Exception e) {
            log.error("[ServerInfoService] 异步获取 CPU 信息失败: {}", e.getMessage(), e);
            return CompletableFuture.failedFuture(e);
        }
    }

    @Override
    public ServerInfoDTO.MemoryInfo getMemoryInfo() {
        log.trace("[ServerInfoService] 获取内存信息");
        try {
            GlobalMemory memory = hardware.getMemory();
            
            long total = memory.getTotal();
            long available = memory.getAvailable();
            long used = total - available;
            double usagePercent = (double) used / total * 100;
            
            ServerInfoDTO.MemoryInfo memoryInfo = ServerInfoDTO.MemoryInfo.builder()
                    .total(total)
                    .used(used)
                    .available(available)
                    .usagePercent(Math.round(usagePercent * 10.0) / 10.0)
                    .build();
            
            log.trace("[ServerInfoService] 内存信息: used={} MB, total={} MB, usage={}%",
                    used / (1024 * 1024), total / (1024 * 1024), memoryInfo.getUsagePercent());
            return memoryInfo;
        } catch (Exception e) {
            log.error("[ServerInfoService] 获取内存信息失败: {}", e.getMessage(), e);
            throw e;
        }
    }

    @Override
    @Async("serverInfoExecutor")
    @Cacheable(value = "memoryInfo", key = "'memory'", sync = true)
    public CompletableFuture<ServerInfoDTO.MemoryInfo> getMemoryInfoAsync() {
        log.debug("[ServerInfoService] 异步获取内存信息");
        try {
            ServerInfoDTO.MemoryInfo memoryInfo = getMemoryInfo();
            log.debug("[ServerInfoService] 异步获取内存信息成功: usage={}%", memoryInfo.getUsagePercent());
            return CompletableFuture.completedFuture(memoryInfo);
        } catch (Exception e) {
            log.error("[ServerInfoService] 异步获取内存信息失败: {}", e.getMessage(), e);
            return CompletableFuture.failedFuture(e);
        }
    }

    @Override
    public ServerInfoDTO.DiskInfo getDiskInfo() {
        log.trace("[ServerInfoService] 获取磁盘信息");
        try {
            FileSystem fileSystem = os.getFileSystem();
            List<OSFileStore> fileStores = fileSystem.getFileStores();
            
            long totalSpace = 0;
            long usableSpace = 0;
            
            for (OSFileStore store : fileStores) {
                totalSpace += store.getTotalSpace();
                usableSpace += store.getUsableSpace();
            }
            
            long usedSpace = totalSpace - usableSpace;
            double usagePercent = totalSpace > 0 ? (double) usedSpace / totalSpace * 100 : 0;
            
            ServerInfoDTO.DiskInfo diskInfo = ServerInfoDTO.DiskInfo.builder()
                    .total(totalSpace)
                    .used(usedSpace)
                    .available(usableSpace)
                    .usagePercent(Math.round(usagePercent * 10.0) / 10.0)
                    .build();
            
            log.trace("[ServerInfoService] 磁盘信息: used={} GB, total={} GB, usage={}%",
                    usedSpace / (1024 * 1024 * 1024), totalSpace / (1024 * 1024 * 1024), diskInfo.getUsagePercent());
            return diskInfo;
        } catch (Exception e) {
            log.error("[ServerInfoService] 获取磁盘信息失败: {}", e.getMessage(), e);
            throw e;
        }
    }

    @Override
    @Async("serverInfoExecutor")
    @Cacheable(value = "diskInfo", key = "'disk'", sync = true)
    public CompletableFuture<ServerInfoDTO.DiskInfo> getDiskInfoAsync() {
        log.debug("[ServerInfoService] 异步获取磁盘信息");
        try {
            ServerInfoDTO.DiskInfo diskInfo = getDiskInfo();
            log.debug("[ServerInfoService] 异步获取磁盘信息成功: usage={}%", diskInfo.getUsagePercent());
            return CompletableFuture.completedFuture(diskInfo);
        } catch (Exception e) {
            log.error("[ServerInfoService] 异步获取磁盘信息失败: {}", e.getMessage(), e);
            return CompletableFuture.failedFuture(e);
        }
    }

    @Override
    public ServerInfoDTO.NetworkInfo getNetworkInfo() {
        log.trace("[ServerInfoService] 获取网络信息");
        try {
            List<NetworkIF> networkIFs = hardware.getNetworkIFs();
            
            long currentTx = 0;
            long currentRx = 0;
            long txPackets = 0;
            long rxPackets = 0;
            
            for (NetworkIF net : networkIFs) {
                net.updateAttributes();
                currentTx += net.getBytesSent();
                currentRx += net.getBytesRecv();
                txPackets += net.getPacketsSent();
                rxPackets += net.getPacketsRecv();
            }
            
            // 计算速率（字节/秒）
            long currentTime = System.currentTimeMillis();
            long timeDiff = currentTime - lastSampleTime;
            
            long txRate = 0;
            long rxRate = 0;
            
            if (timeDiff > 0) {
                txRate = (currentTx - lastTxBytes.get()) * 1000 / timeDiff;
                rxRate = (currentRx - lastRxBytes.get()) * 1000 / timeDiff;
            }
            
            // 更新采样值
            lastTxBytes.set(currentTx);
            lastRxBytes.set(currentRx);
            lastSampleTime = currentTime;
            
            ServerInfoDTO.NetworkInfo networkInfo = ServerInfoDTO.NetworkInfo.builder()
                    .txBytes(Math.max(0, txRate))
                    .rxBytes(Math.max(0, rxRate))
                    .txPackets(txPackets)
                    .rxPackets(rxPackets)
                    .build();
            
            log.trace("[ServerInfoService] 网络信息: tx={} B/s, rx={} B/s", txRate, rxRate);
            return networkInfo;
        } catch (Exception e) {
            log.error("[ServerInfoService] 获取网络信息失败: {}", e.getMessage(), e);
            throw e;
        }
    }

    @Override
    @Async("serverInfoExecutor")
    @Cacheable(value = "networkInfo", key = "'network'", sync = true)
    public CompletableFuture<ServerInfoDTO.NetworkInfo> getNetworkInfoAsync() {
        log.debug("[ServerInfoService] 异步获取网络信息");
        try {
            ServerInfoDTO.NetworkInfo networkInfo = getNetworkInfo();
            log.debug("[ServerInfoService] 异步获取网络信息成功: tx={} B/s, rx={} B/s",
                    networkInfo.getTxBytes(), networkInfo.getRxBytes());
            return CompletableFuture.completedFuture(networkInfo);
        } catch (Exception e) {
            log.error("[ServerInfoService] 异步获取网络信息失败: {}", e.getMessage(), e);
            return CompletableFuture.failedFuture(e);
        }
    }
}
