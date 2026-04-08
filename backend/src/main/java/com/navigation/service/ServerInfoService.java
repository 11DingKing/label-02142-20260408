package com.navigation.service;

import com.navigation.dto.ServerInfoDTO;

import java.util.concurrent.CompletableFuture;

/**
 * 服务器信息服务接口
 */
public interface ServerInfoService {
    
    /**
     * 获取服务器综合信息
     * 
     * @return 服务器信息
     */
    ServerInfoDTO getServerInfo();
    
    /**
     * 异步获取服务器综合信息
     * 
     * @return CompletableFuture<ServerInfoDTO> 服务器信息
     */
    CompletableFuture<ServerInfoDTO> getServerInfoAsync();
    
    /**
     * 获取 CPU 信息
     * 
     * @return CPU 信息
     */
    ServerInfoDTO.CpuInfo getCpuInfo();
    
    /**
     * 异步获取 CPU 信息
     * 
     * @return CompletableFuture<ServerInfoDTO.CpuInfo> CPU 信息
     */
    CompletableFuture<ServerInfoDTO.CpuInfo> getCpuInfoAsync();
    
    /**
     * 获取内存信息
     * 
     * @return 内存信息
     */
    ServerInfoDTO.MemoryInfo getMemoryInfo();
    
    /**
     * 异步获取内存信息
     * 
     * @return CompletableFuture<ServerInfoDTO.MemoryInfo> 内存信息
     */
    CompletableFuture<ServerInfoDTO.MemoryInfo> getMemoryInfoAsync();
    
    /**
     * 获取磁盘信息
     * 
     * @return 磁盘信息
     */
    ServerInfoDTO.DiskInfo getDiskInfo();
    
    /**
     * 异步获取磁盘信息
     * 
     * @return CompletableFuture<ServerInfoDTO.DiskInfo> 磁盘信息
     */
    CompletableFuture<ServerInfoDTO.DiskInfo> getDiskInfoAsync();
    
    /**
     * 获取网络信息
     * 
     * @return 网络信息
     */
    ServerInfoDTO.NetworkInfo getNetworkInfo();
    
    /**
     * 异步获取网络信息
     * 
     * @return CompletableFuture<ServerInfoDTO.NetworkInfo> 网络信息
     */
    CompletableFuture<ServerInfoDTO.NetworkInfo> getNetworkInfoAsync();
}
