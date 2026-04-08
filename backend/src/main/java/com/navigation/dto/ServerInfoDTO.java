package com.navigation.dto;

import lombok.Data;
import lombok.Builder;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

/**
 * 服务器信息 DTO
 * 包含 CPU、内存、磁盘、网络等信息
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ServerInfoDTO {
    
    /**
     * CPU 信息
     */
    private CpuInfo cpu;
    
    /**
     * 内存信息
     */
    private MemoryInfo memory;
    
    /**
     * 磁盘信息
     */
    private DiskInfo disk;
    
    /**
     * 网络信息
     */
    private NetworkInfo network;
    
    /**
     * 系统运行时间（秒）
     */
    private Long uptime;
    
    /**
     * 操作系统信息
     */
    private String osName;
    
    /**
     * 主机名
     */
    private String hostname;
    
    /**
     * CPU 信息内部类
     */
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CpuInfo {
        /**
         * CPU 使用率（百分比）
         */
        private Double usage;
        
        /**
         * CPU 核心数
         */
        private Integer cores;
        
        /**
         * CPU 型号
         */
        private String model;
    }
    
    /**
     * 内存信息内部类
     */
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class MemoryInfo {
        /**
         * 总内存（字节）
         */
        private Long total;
        
        /**
         * 已用内存（字节）
         */
        private Long used;
        
        /**
         * 可用内存（字节）
         */
        private Long available;
        
        /**
         * 使用率（百分比）
         */
        private Double usagePercent;
    }
    
    /**
     * 磁盘信息内部类
     */
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class DiskInfo {
        /**
         * 总空间（字节）
         */
        private Long total;
        
        /**
         * 已用空间（字节）
         */
        private Long used;
        
        /**
         * 可用空间（字节）
         */
        private Long available;
        
        /**
         * 使用率（百分比）
         */
        private Double usagePercent;
    }
    
    /**
     * 网络信息内部类
     */
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class NetworkInfo {
        /**
         * 发送字节数（每秒）
         */
        private Long txBytes;
        
        /**
         * 接收字节数（每秒）
         */
        private Long rxBytes;
        
        /**
         * 发送数据包数
         */
        private Long txPackets;
        
        /**
         * 接收数据包数
         */
        private Long rxPackets;
    }
}
