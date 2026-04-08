package com.navigation.controller;

import com.navigation.dto.ServerInfoDTO;
import com.navigation.service.ServerInfoService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * 服务器信息控制器测试
 * 全面测试所有 API 端点
 */
@WebMvcTest(ServerInfoController.class)
class ServerInfoControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private ServerInfoService serverInfoService;

    private ServerInfoDTO mockServerInfo;
    private ServerInfoDTO.CpuInfo mockCpuInfo;
    private ServerInfoDTO.MemoryInfo mockMemoryInfo;
    private ServerInfoDTO.DiskInfo mockDiskInfo;
    private ServerInfoDTO.NetworkInfo mockNetworkInfo;

    @BeforeEach
    void setUp() {
        // 准备 Mock 数据
        mockCpuInfo = ServerInfoDTO.CpuInfo.builder()
                .usage(25.5)
                .cores(8)
                .model("Intel Core i7")
                .build();

        mockMemoryInfo = ServerInfoDTO.MemoryInfo.builder()
                .total(16L * 1024 * 1024 * 1024)
                .used(8L * 1024 * 1024 * 1024)
                .available(8L * 1024 * 1024 * 1024)
                .usagePercent(50.0)
                .build();

        mockDiskInfo = ServerInfoDTO.DiskInfo.builder()
                .total(500L * 1024 * 1024 * 1024)
                .used(200L * 1024 * 1024 * 1024)
                .available(300L * 1024 * 1024 * 1024)
                .usagePercent(40.0)
                .build();

        mockNetworkInfo = ServerInfoDTO.NetworkInfo.builder()
                .txBytes(1024L)
                .rxBytes(2048L)
                .txPackets(100L)
                .rxPackets(200L)
                .build();

        mockServerInfo = ServerInfoDTO.builder()
                .cpu(mockCpuInfo)
                .memory(mockMemoryInfo)
                .disk(mockDiskInfo)
                .network(mockNetworkInfo)
                .uptime(86400L)
                .osName("Linux")
                .hostname("test-server")
                .build();
    }

    @Nested
    @DisplayName("GET /api/server/info 测试")
    class GetServerInfoTests {

        @Test
        @DisplayName("应返回完整的服务器信息")
        void testGetServerInfo() throws Exception {
            when(serverInfoService.getServerInfo()).thenReturn(mockServerInfo);

            mockMvc.perform(get("/api/server/info")
                            .contentType(MediaType.APPLICATION_JSON))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.cpu.usage").value(25.5))
                    .andExpect(jsonPath("$.cpu.cores").value(8))
                    .andExpect(jsonPath("$.memory.usagePercent").value(50.0))
                    .andExpect(jsonPath("$.disk.usagePercent").value(40.0))
                    .andExpect(jsonPath("$.uptime").value(86400))
                    .andExpect(jsonPath("$.hostname").value("test-server"));
        }

        @Test
        @DisplayName("应包含所有必要字段")
        void testGetServerInfoAllFields() throws Exception {
            when(serverInfoService.getServerInfo()).thenReturn(mockServerInfo);

            mockMvc.perform(get("/api/server/info")
                            .contentType(MediaType.APPLICATION_JSON))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.cpu").exists())
                    .andExpect(jsonPath("$.memory").exists())
                    .andExpect(jsonPath("$.disk").exists())
                    .andExpect(jsonPath("$.network").exists())
                    .andExpect(jsonPath("$.uptime").exists())
                    .andExpect(jsonPath("$.osName").exists())
                    .andExpect(jsonPath("$.hostname").exists());
        }

        @Test
        @DisplayName("应调用服务层方法")
        void testGetServerInfoCallsService() throws Exception {
            when(serverInfoService.getServerInfo()).thenReturn(mockServerInfo);

            mockMvc.perform(get("/api/server/info")
                            .contentType(MediaType.APPLICATION_JSON))
                    .andExpect(status().isOk());

            verify(serverInfoService, times(1)).getServerInfo();
        }
    }

    @Nested
    @DisplayName("GET /api/server/cpu 测试")
    class GetCpuInfoTests {

        @Test
        @DisplayName("应返回 CPU 信息")
        void testGetCpuInfo() throws Exception {
            when(serverInfoService.getCpuInfo()).thenReturn(mockCpuInfo);

            mockMvc.perform(get("/api/server/cpu")
                            .contentType(MediaType.APPLICATION_JSON))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.code").value(200))
                    .andExpect(jsonPath("$.data.usage").value(25.5))
                    .andExpect(jsonPath("$.data.cores").value(8))
                    .andExpect(jsonPath("$.data.model").value("Intel Core i7"));
        }

        @Test
        @DisplayName("应返回正确的响应结构")
        void testGetCpuInfoResponseStructure() throws Exception {
            when(serverInfoService.getCpuInfo()).thenReturn(mockCpuInfo);

            mockMvc.perform(get("/api/server/cpu")
                            .contentType(MediaType.APPLICATION_JSON))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.code").exists())
                    .andExpect(jsonPath("$.message").exists())
                    .andExpect(jsonPath("$.data").exists())
                    .andExpect(jsonPath("$.timestamp").exists());
        }
    }

    @Nested
    @DisplayName("GET /api/server/memory 测试")
    class GetMemoryInfoTests {

        @Test
        @DisplayName("应返回内存信息")
        void testGetMemoryInfo() throws Exception {
            when(serverInfoService.getMemoryInfo()).thenReturn(mockMemoryInfo);

            mockMvc.perform(get("/api/server/memory")
                            .contentType(MediaType.APPLICATION_JSON))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.code").value(200))
                    .andExpect(jsonPath("$.data.usagePercent").value(50.0));
        }

        @Test
        @DisplayName("应包含所有内存字段")
        void testGetMemoryInfoAllFields() throws Exception {
            when(serverInfoService.getMemoryInfo()).thenReturn(mockMemoryInfo);

            mockMvc.perform(get("/api/server/memory")
                            .contentType(MediaType.APPLICATION_JSON))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.data.total").exists())
                    .andExpect(jsonPath("$.data.used").exists())
                    .andExpect(jsonPath("$.data.available").exists())
                    .andExpect(jsonPath("$.data.usagePercent").exists());
        }
    }

    @Nested
    @DisplayName("GET /api/server/disk 测试")
    class GetDiskInfoTests {

        @Test
        @DisplayName("应返回磁盘信息")
        void testGetDiskInfo() throws Exception {
            when(serverInfoService.getDiskInfo()).thenReturn(mockDiskInfo);

            mockMvc.perform(get("/api/server/disk")
                            .contentType(MediaType.APPLICATION_JSON))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.code").value(200))
                    .andExpect(jsonPath("$.data.usagePercent").value(40.0));
        }

        @Test
        @DisplayName("应包含所有磁盘字段")
        void testGetDiskInfoAllFields() throws Exception {
            when(serverInfoService.getDiskInfo()).thenReturn(mockDiskInfo);

            mockMvc.perform(get("/api/server/disk")
                            .contentType(MediaType.APPLICATION_JSON))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.data.total").exists())
                    .andExpect(jsonPath("$.data.used").exists())
                    .andExpect(jsonPath("$.data.available").exists())
                    .andExpect(jsonPath("$.data.usagePercent").exists());
        }
    }

    @Nested
    @DisplayName("GET /api/server/network 测试")
    class GetNetworkInfoTests {

        @Test
        @DisplayName("应返回网络信息")
        void testGetNetworkInfo() throws Exception {
            when(serverInfoService.getNetworkInfo()).thenReturn(mockNetworkInfo);

            mockMvc.perform(get("/api/server/network")
                            .contentType(MediaType.APPLICATION_JSON))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.code").value(200))
                    .andExpect(jsonPath("$.data.txBytes").value(1024))
                    .andExpect(jsonPath("$.data.rxBytes").value(2048));
        }

        @Test
        @DisplayName("应包含所有网络字段")
        void testGetNetworkInfoAllFields() throws Exception {
            when(serverInfoService.getNetworkInfo()).thenReturn(mockNetworkInfo);

            mockMvc.perform(get("/api/server/network")
                            .contentType(MediaType.APPLICATION_JSON))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.data.txBytes").exists())
                    .andExpect(jsonPath("$.data.rxBytes").exists())
                    .andExpect(jsonPath("$.data.txPackets").exists())
                    .andExpect(jsonPath("$.data.rxPackets").exists());
        }
    }

    @Nested
    @DisplayName("边界条件测试")
    class EdgeCaseTests {

        @Test
        @DisplayName("CPU 使用率为 0 时应正常返回")
        void testZeroCpuUsage() throws Exception {
            ServerInfoDTO.CpuInfo zeroCpu = ServerInfoDTO.CpuInfo.builder()
                    .usage(0.0)
                    .cores(4)
                    .model("Test CPU")
                    .build();
            when(serverInfoService.getCpuInfo()).thenReturn(zeroCpu);

            mockMvc.perform(get("/api/server/cpu")
                            .contentType(MediaType.APPLICATION_JSON))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.data.usage").value(0.0));
        }

        @Test
        @DisplayName("CPU 使用率为 100 时应正常返回")
        void testFullCpuUsage() throws Exception {
            ServerInfoDTO.CpuInfo fullCpu = ServerInfoDTO.CpuInfo.builder()
                    .usage(100.0)
                    .cores(4)
                    .model("Test CPU")
                    .build();
            when(serverInfoService.getCpuInfo()).thenReturn(fullCpu);

            mockMvc.perform(get("/api/server/cpu")
                            .contentType(MediaType.APPLICATION_JSON))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.data.usage").value(100.0));
        }

        @Test
        @DisplayName("网络流量为 0 时应正常返回")
        void testZeroNetworkTraffic() throws Exception {
            ServerInfoDTO.NetworkInfo zeroNetwork = ServerInfoDTO.NetworkInfo.builder()
                    .txBytes(0L)
                    .rxBytes(0L)
                    .txPackets(0L)
                    .rxPackets(0L)
                    .build();
            when(serverInfoService.getNetworkInfo()).thenReturn(zeroNetwork);

            mockMvc.perform(get("/api/server/network")
                            .contentType(MediaType.APPLICATION_JSON))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.data.txBytes").value(0))
                    .andExpect(jsonPath("$.data.rxBytes").value(0));
        }
    }
}
