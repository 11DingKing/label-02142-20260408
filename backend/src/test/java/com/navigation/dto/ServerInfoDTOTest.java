package com.navigation.dto;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

/**
 * 服务器信息 DTO 测试
 * 全面测试 DTO 的构建和数据完整性
 */
class ServerInfoDTOTest {

    @Nested
    @DisplayName("ServerInfoDTO 测试")
    class ServerInfoDTOTests {

        @Test
        @DisplayName("Builder 模式测试")
        void testServerInfoDTOBuilder() {
            ServerInfoDTO.CpuInfo cpuInfo = ServerInfoDTO.CpuInfo.builder()
                    .usage(50.0)
                    .cores(8)
                    .model("Test CPU")
                    .build();

            ServerInfoDTO.MemoryInfo memoryInfo = ServerInfoDTO.MemoryInfo.builder()
                    .total(16L * 1024 * 1024 * 1024)
                    .used(8L * 1024 * 1024 * 1024)
                    .available(8L * 1024 * 1024 * 1024)
                    .usagePercent(50.0)
                    .build();

            ServerInfoDTO dto = ServerInfoDTO.builder()
                    .cpu(cpuInfo)
                    .memory(memoryInfo)
                    .uptime(3600L)
                    .osName("Linux")
                    .hostname("test-host")
                    .build();

            assertNotNull(dto);
            assertEquals(50.0, dto.getCpu().getUsage());
            assertEquals(8, dto.getCpu().getCores());
            assertEquals("Test CPU", dto.getCpu().getModel());
            assertEquals(50.0, dto.getMemory().getUsagePercent());
            assertEquals(3600L, dto.getUptime());
            assertEquals("Linux", dto.getOsName());
            assertEquals("test-host", dto.getHostname());
        }

        @Test
        @DisplayName("NoArgsConstructor 测试")
        void testNoArgsConstructor() {
            ServerInfoDTO dto = new ServerInfoDTO();
            assertNotNull(dto);
            assertNull(dto.getCpu());
            assertNull(dto.getMemory());
            assertNull(dto.getDisk());
            assertNull(dto.getNetwork());
            assertNull(dto.getUptime());
            assertNull(dto.getOsName());
            assertNull(dto.getHostname());
        }

        @Test
        @DisplayName("AllArgsConstructor 测试")
        void testAllArgsConstructor() {
            ServerInfoDTO.CpuInfo cpu = ServerInfoDTO.CpuInfo.builder().usage(50.0).build();
            ServerInfoDTO.MemoryInfo memory = ServerInfoDTO.MemoryInfo.builder().usagePercent(60.0).build();
            ServerInfoDTO.DiskInfo disk = ServerInfoDTO.DiskInfo.builder().usagePercent(70.0).build();
            ServerInfoDTO.NetworkInfo network = ServerInfoDTO.NetworkInfo.builder().txBytes(1024L).build();

            ServerInfoDTO dto = new ServerInfoDTO(cpu, memory, disk, network, 3600L, "Linux", "host");

            assertEquals(cpu, dto.getCpu());
            assertEquals(memory, dto.getMemory());
            assertEquals(disk, dto.getDisk());
            assertEquals(network, dto.getNetwork());
            assertEquals(3600L, dto.getUptime());
            assertEquals("Linux", dto.getOsName());
            assertEquals("host", dto.getHostname());
        }

        @Test
        @DisplayName("Setter 方法测试")
        void testSetters() {
            ServerInfoDTO dto = new ServerInfoDTO();
            dto.setHostname("new-host");
            dto.setOsName("Windows");
            dto.setUptime(7200L);

            assertEquals("new-host", dto.getHostname());
            assertEquals("Windows", dto.getOsName());
            assertEquals(7200L, dto.getUptime());
        }

        @Test
        @DisplayName("equals 和 hashCode 测试")
        void testEqualsAndHashCode() {
            ServerInfoDTO dto1 = ServerInfoDTO.builder()
                    .hostname("host1")
                    .osName("Linux")
                    .uptime(3600L)
                    .build();

            ServerInfoDTO dto2 = ServerInfoDTO.builder()
                    .hostname("host1")
                    .osName("Linux")
                    .uptime(3600L)
                    .build();

            assertEquals(dto1, dto2);
            assertEquals(dto1.hashCode(), dto2.hashCode());
        }

        @Test
        @DisplayName("toString 测试")
        void testToString() {
            ServerInfoDTO dto = ServerInfoDTO.builder()
                    .hostname("test-host")
                    .osName("Linux")
                    .build();

            String str = dto.toString();
            assertNotNull(str);
            assertTrue(str.contains("test-host"));
            assertTrue(str.contains("Linux"));
        }
    }

    @Nested
    @DisplayName("CpuInfo 测试")
    class CpuInfoTests {

        @Test
        @DisplayName("Builder 测试")
        void testCpuInfoBuilder() {
            ServerInfoDTO.CpuInfo cpuInfo = ServerInfoDTO.CpuInfo.builder()
                    .usage(75.5)
                    .cores(16)
                    .model("AMD Ryzen 9")
                    .build();

            assertEquals(75.5, cpuInfo.getUsage());
            assertEquals(16, cpuInfo.getCores());
            assertEquals("AMD Ryzen 9", cpuInfo.getModel());
        }

        @Test
        @DisplayName("NoArgsConstructor 测试")
        void testNoArgsConstructor() {
            ServerInfoDTO.CpuInfo cpuInfo = new ServerInfoDTO.CpuInfo();
            assertNotNull(cpuInfo);
            assertNull(cpuInfo.getUsage());
            assertNull(cpuInfo.getCores());
            assertNull(cpuInfo.getModel());
        }

        @Test
        @DisplayName("AllArgsConstructor 测试")
        void testAllArgsConstructor() {
            ServerInfoDTO.CpuInfo cpuInfo = new ServerInfoDTO.CpuInfo(50.0, 8, "Intel i7");
            assertEquals(50.0, cpuInfo.getUsage());
            assertEquals(8, cpuInfo.getCores());
            assertEquals("Intel i7", cpuInfo.getModel());
        }

        @Test
        @DisplayName("边界值测试 - 0% 使用率")
        void testZeroUsage() {
            ServerInfoDTO.CpuInfo cpuInfo = ServerInfoDTO.CpuInfo.builder()
                    .usage(0.0)
                    .cores(4)
                    .build();
            assertEquals(0.0, cpuInfo.getUsage());
        }

        @Test
        @DisplayName("边界值测试 - 100% 使用率")
        void testFullUsage() {
            ServerInfoDTO.CpuInfo cpuInfo = ServerInfoDTO.CpuInfo.builder()
                    .usage(100.0)
                    .cores(4)
                    .build();
            assertEquals(100.0, cpuInfo.getUsage());
        }
    }

    @Nested
    @DisplayName("MemoryInfo 测试")
    class MemoryInfoTests {

        @Test
        @DisplayName("Builder 测试")
        void testMemoryInfoBuilder() {
            long total = 32L * 1024 * 1024 * 1024;
            long used = 16L * 1024 * 1024 * 1024;
            long available = 16L * 1024 * 1024 * 1024;

            ServerInfoDTO.MemoryInfo memoryInfo = ServerInfoDTO.MemoryInfo.builder()
                    .total(total)
                    .used(used)
                    .available(available)
                    .usagePercent(50.0)
                    .build();

            assertEquals(total, memoryInfo.getTotal());
            assertEquals(used, memoryInfo.getUsed());
            assertEquals(available, memoryInfo.getAvailable());
            assertEquals(50.0, memoryInfo.getUsagePercent());
        }

        @Test
        @DisplayName("NoArgsConstructor 测试")
        void testNoArgsConstructor() {
            ServerInfoDTO.MemoryInfo memoryInfo = new ServerInfoDTO.MemoryInfo();
            assertNotNull(memoryInfo);
            assertNull(memoryInfo.getTotal());
            assertNull(memoryInfo.getUsed());
        }

        @Test
        @DisplayName("大内存值测试")
        void testLargeMemoryValues() {
            long total = 128L * 1024 * 1024 * 1024; // 128 GB
            ServerInfoDTO.MemoryInfo memoryInfo = ServerInfoDTO.MemoryInfo.builder()
                    .total(total)
                    .build();
            assertEquals(total, memoryInfo.getTotal());
        }
    }

    @Nested
    @DisplayName("DiskInfo 测试")
    class DiskInfoTests {

        @Test
        @DisplayName("Builder 测试")
        void testDiskInfoBuilder() {
            ServerInfoDTO.DiskInfo diskInfo = ServerInfoDTO.DiskInfo.builder()
                    .total(1000L * 1024 * 1024 * 1024)
                    .used(400L * 1024 * 1024 * 1024)
                    .available(600L * 1024 * 1024 * 1024)
                    .usagePercent(40.0)
                    .build();

            assertEquals(40.0, diskInfo.getUsagePercent());
        }

        @Test
        @DisplayName("NoArgsConstructor 测试")
        void testNoArgsConstructor() {
            ServerInfoDTO.DiskInfo diskInfo = new ServerInfoDTO.DiskInfo();
            assertNotNull(diskInfo);
            assertNull(diskInfo.getTotal());
        }

        @Test
        @DisplayName("大磁盘值测试")
        void testLargeDiskValues() {
            long total = 10L * 1024 * 1024 * 1024 * 1024; // 10 TB
            ServerInfoDTO.DiskInfo diskInfo = ServerInfoDTO.DiskInfo.builder()
                    .total(total)
                    .build();
            assertEquals(total, diskInfo.getTotal());
        }
    }

    @Nested
    @DisplayName("NetworkInfo 测试")
    class NetworkInfoTests {

        @Test
        @DisplayName("Builder 测试")
        void testNetworkInfoBuilder() {
            ServerInfoDTO.NetworkInfo networkInfo = ServerInfoDTO.NetworkInfo.builder()
                    .txBytes(1024L)
                    .rxBytes(2048L)
                    .txPackets(100L)
                    .rxPackets(200L)
                    .build();

            assertEquals(1024L, networkInfo.getTxBytes());
            assertEquals(2048L, networkInfo.getRxBytes());
            assertEquals(100L, networkInfo.getTxPackets());
            assertEquals(200L, networkInfo.getRxPackets());
        }

        @Test
        @DisplayName("NoArgsConstructor 测试")
        void testNoArgsConstructor() {
            ServerInfoDTO.NetworkInfo networkInfo = new ServerInfoDTO.NetworkInfo();
            assertNotNull(networkInfo);
            assertNull(networkInfo.getTxBytes());
        }

        @Test
        @DisplayName("零流量测试")
        void testZeroTraffic() {
            ServerInfoDTO.NetworkInfo networkInfo = ServerInfoDTO.NetworkInfo.builder()
                    .txBytes(0L)
                    .rxBytes(0L)
                    .txPackets(0L)
                    .rxPackets(0L)
                    .build();

            assertEquals(0L, networkInfo.getTxBytes());
            assertEquals(0L, networkInfo.getRxBytes());
        }

        @Test
        @DisplayName("高流量测试")
        void testHighTraffic() {
            long highTraffic = 1024L * 1024 * 1024 * 10; // 10 GB/s
            ServerInfoDTO.NetworkInfo networkInfo = ServerInfoDTO.NetworkInfo.builder()
                    .txBytes(highTraffic)
                    .rxBytes(highTraffic)
                    .build();

            assertEquals(highTraffic, networkInfo.getTxBytes());
            assertEquals(highTraffic, networkInfo.getRxBytes());
        }
    }
}
