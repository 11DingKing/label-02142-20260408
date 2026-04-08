package com.navigation.service;

import com.navigation.dto.ServerInfoDTO;
import com.navigation.service.impl.ServerInfoServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

/**
 * 服务器信息服务测试
 * 集成测试 - 测试真实的系统信息获取
 */
class ServerInfoServiceTest {

    private ServerInfoService serverInfoService;

    @BeforeEach
    void setUp() {
        serverInfoService = new ServerInfoServiceImpl();
        // 手动调用 init 方法初始化
        ((ServerInfoServiceImpl) serverInfoService).init();
    }

    @Nested
    @DisplayName("getServerInfo 测试")
    class GetServerInfoTests {

        @Test
        @DisplayName("获取服务器综合信息 - 所有字段应不为空")
        void testGetServerInfo() {
            ServerInfoDTO info = serverInfoService.getServerInfo();

            assertNotNull(info, "服务器信息不应为空");
            assertNotNull(info.getCpu(), "CPU 信息不应为空");
            assertNotNull(info.getMemory(), "内存信息不应为空");
            assertNotNull(info.getDisk(), "磁盘信息不应为空");
            assertNotNull(info.getNetwork(), "网络信息不应为空");
            assertNotNull(info.getUptime(), "运行时间不应为空");
            assertNotNull(info.getOsName(), "操作系统名称不应为空");
        }

        @Test
        @DisplayName("获取服务器信息 - 主机名应不为空")
        void testGetServerInfoHostname() {
            ServerInfoDTO info = serverInfoService.getServerInfo();
            assertNotNull(info.getHostname(), "主机名不应为空");
        }

        @Test
        @DisplayName("获取服务器信息 - 运行时间应为正数")
        void testGetServerInfoUptime() {
            ServerInfoDTO info = serverInfoService.getServerInfo();
            assertTrue(info.getUptime() >= 0, "运行时间应大于等于 0");
        }
    }

    @Nested
    @DisplayName("getCpuInfo 测试")
    class GetCpuInfoTests {

        @Test
        @DisplayName("获取 CPU 信息 - 使用率应在 0-100 之间")
        void testGetCpuInfo() {
            ServerInfoDTO.CpuInfo cpuInfo = serverInfoService.getCpuInfo();

            assertNotNull(cpuInfo, "CPU 信息不应为空");
            assertNotNull(cpuInfo.getUsage(), "CPU 使用率不应为空");
            assertTrue(cpuInfo.getUsage() >= 0 && cpuInfo.getUsage() <= 100,
                    "CPU 使用率应在 0-100 之间，实际值: " + cpuInfo.getUsage());
        }

        @Test
        @DisplayName("获取 CPU 信息 - 核心数应大于 0")
        void testGetCpuInfoCores() {
            ServerInfoDTO.CpuInfo cpuInfo = serverInfoService.getCpuInfo();
            assertTrue(cpuInfo.getCores() > 0, "CPU 核心数应大于 0");
        }

        @Test
        @DisplayName("获取 CPU 信息 - 型号不应为空")
        void testGetCpuInfoModel() {
            ServerInfoDTO.CpuInfo cpuInfo = serverInfoService.getCpuInfo();
            assertNotNull(cpuInfo.getModel(), "CPU 型号不应为空");
            assertFalse(cpuInfo.getModel().isEmpty(), "CPU 型号不应为空字符串");
        }
    }

    @Nested
    @DisplayName("getMemoryInfo 测试")
    class GetMemoryInfoTests {

        @Test
        @DisplayName("获取内存信息 - 数值应合理")
        void testGetMemoryInfo() {
            ServerInfoDTO.MemoryInfo memoryInfo = serverInfoService.getMemoryInfo();

            assertNotNull(memoryInfo, "内存信息不应为空");
            assertTrue(memoryInfo.getTotal() > 0, "总内存应大于 0");
            assertTrue(memoryInfo.getUsed() >= 0, "已用内存应大于等于 0");
            assertTrue(memoryInfo.getAvailable() >= 0, "可用内存应大于等于 0");
            assertTrue(memoryInfo.getUsagePercent() >= 0 && memoryInfo.getUsagePercent() <= 100,
                    "内存使用率应在 0-100 之间");
        }

        @Test
        @DisplayName("获取内存信息 - 数值一致性验证")
        void testGetMemoryInfoConsistency() {
            ServerInfoDTO.MemoryInfo memoryInfo = serverInfoService.getMemoryInfo();
            
            // 验证数值一致性
            assertEquals(memoryInfo.getTotal(), 
                    memoryInfo.getUsed() + memoryInfo.getAvailable(),
                    memoryInfo.getTotal() * 0.01, // 允许 1% 误差
                    "总内存应等于已用 + 可用");
        }

        @Test
        @DisplayName("获取内存信息 - 已用内存不应超过总内存")
        void testGetMemoryInfoUsedNotExceedTotal() {
            ServerInfoDTO.MemoryInfo memoryInfo = serverInfoService.getMemoryInfo();
            assertTrue(memoryInfo.getUsed() <= memoryInfo.getTotal(),
                    "已用内存不应超过总内存");
        }
    }

    @Nested
    @DisplayName("getDiskInfo 测试")
    class GetDiskInfoTests {

        @Test
        @DisplayName("获取磁盘信息 - 数值应合理")
        void testGetDiskInfo() {
            ServerInfoDTO.DiskInfo diskInfo = serverInfoService.getDiskInfo();

            assertNotNull(diskInfo, "磁盘信息不应为空");
            assertTrue(diskInfo.getTotal() >= 0, "总磁盘空间应大于等于 0");
            assertTrue(diskInfo.getUsed() >= 0, "已用磁盘空间应大于等于 0");
            assertTrue(diskInfo.getAvailable() >= 0, "可用磁盘空间应大于等于 0");
            assertTrue(diskInfo.getUsagePercent() >= 0 && diskInfo.getUsagePercent() <= 100,
                    "磁盘使用率应在 0-100 之间");
        }

        @Test
        @DisplayName("获取磁盘信息 - 已用空间不应超过总空间")
        void testGetDiskInfoUsedNotExceedTotal() {
            ServerInfoDTO.DiskInfo diskInfo = serverInfoService.getDiskInfo();
            assertTrue(diskInfo.getUsed() <= diskInfo.getTotal(),
                    "已用磁盘空间不应超过总空间");
        }
    }

    @Nested
    @DisplayName("getNetworkInfo 测试")
    class GetNetworkInfoTests {

        @Test
        @DisplayName("获取网络信息 - 数值应非负")
        void testGetNetworkInfo() {
            ServerInfoDTO.NetworkInfo networkInfo = serverInfoService.getNetworkInfo();

            assertNotNull(networkInfo, "网络信息不应为空");
            assertTrue(networkInfo.getTxBytes() >= 0, "发送字节数应大于等于 0");
            assertTrue(networkInfo.getRxBytes() >= 0, "接收字节数应大于等于 0");
            assertTrue(networkInfo.getTxPackets() >= 0, "发送数据包数应大于等于 0");
            assertTrue(networkInfo.getRxPackets() >= 0, "接收数据包数应大于等于 0");
        }
    }

    @Nested
    @DisplayName("多次调用测试")
    class MultipleCalls {

        @Test
        @DisplayName("多次调用应返回更新的数据")
        void testMultipleCalls() throws InterruptedException {
            ServerInfoDTO.CpuInfo firstCall = serverInfoService.getCpuInfo();
            
            // 等待一小段时间让系统状态变化
            Thread.sleep(100);
            
            ServerInfoDTO.CpuInfo secondCall = serverInfoService.getCpuInfo();

            assertNotNull(firstCall, "第一次调用结果不应为空");
            assertNotNull(secondCall, "第二次调用结果不应为空");
            // CPU 使用率可能相同也可能不同，但都应该是有效值
            assertTrue(firstCall.getUsage() >= 0 && firstCall.getUsage() <= 100);
            assertTrue(secondCall.getUsage() >= 0 && secondCall.getUsage() <= 100);
        }

        @Test
        @DisplayName("连续调用不应抛出异常")
        void testConsecutiveCalls() {
            assertDoesNotThrow(() -> {
                for (int i = 0; i < 10; i++) {
                    serverInfoService.getServerInfo();
                }
            }, "连续调用不应抛出异常");
        }
    }

    @Nested
    @DisplayName("性能测试")
    class PerformanceTests {

        @Test
        @DisplayName("获取服务器信息应在合理时间内完成")
        void testGetServerInfoPerformance() {
            long startTime = System.currentTimeMillis();
            serverInfoService.getServerInfo();
            long endTime = System.currentTimeMillis();
            
            long duration = endTime - startTime;
            assertTrue(duration < 5000, "获取服务器信息应在 5 秒内完成，实际耗时: " + duration + "ms");
        }
    }
}
