package com.navigation.service;

import com.navigation.dto.ServerInfoDTO;

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
     * 获取 CPU 信息
     * 
     * @return CPU 信息
     */
    ServerInfoDTO.CpuInfo getCpuInfo();
    
    /**
     * 获取内存信息
     * 
     * @return 内存信息
     */
    ServerInfoDTO.MemoryInfo getMemoryInfo();
    
    /**
     * 获取磁盘信息
     * 
     * @return 磁盘信息
     */
    ServerInfoDTO.DiskInfo getDiskInfo();
    
    /**
     * 获取网络信息
     * 
     * @return 网络信息
     */
    ServerInfoDTO.NetworkInfo getNetworkInfo();
}
