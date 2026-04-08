package com.navigation.common;

import com.navigation.dto.ServerInfoDTO;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

/**
 * 统一响应结果测试
 * 全面测试 Result 类的各种场景
 */
class ResultTest {

    @Nested
    @DisplayName("成功响应测试")
    class SuccessTests {

        @Test
        @DisplayName("success() - 无数据成功响应")
        void testSuccessWithoutData() {
            Result<Void> result = Result.success();

            assertEquals(200, result.getCode());
            assertEquals("success", result.getMessage());
            assertNull(result.getData());
            assertTrue(result.getTimestamp() > 0);
        }

        @Test
        @DisplayName("success(data) - 带数据成功响应")
        void testSuccessWithData() {
            String testData = "test data";
            Result<String> result = Result.success(testData);

            assertEquals(200, result.getCode());
            assertEquals("success", result.getMessage());
            assertEquals(testData, result.getData());
        }

        @Test
        @DisplayName("success(data) - 带复杂对象数据")
        void testSuccessWithComplexData() {
            ServerInfoDTO.CpuInfo cpuInfo = ServerInfoDTO.CpuInfo.builder()
                    .usage(50.0)
                    .cores(8)
                    .model("Test CPU")
                    .build();

            Result<ServerInfoDTO.CpuInfo> result = Result.success(cpuInfo);

            assertEquals(200, result.getCode());
            assertNotNull(result.getData());
            assertEquals(50.0, result.getData().getUsage());
        }

        @Test
        @DisplayName("success(null) - 数据为 null")
        void testSuccessWithNullData() {
            Result<String> result = Result.success(null);

            assertEquals(200, result.getCode());
            assertEquals("success", result.getMessage());
            assertNull(result.getData());
        }
    }

    @Nested
    @DisplayName("失败响应测试")
    class ErrorTests {

        @Test
        @DisplayName("error(message) - 默认错误码错误响应")
        void testErrorWithMessage() {
            String errorMessage = "Something went wrong";
            Result<Void> result = Result.error(errorMessage);

            assertEquals(500, result.getCode());
            assertEquals(errorMessage, result.getMessage());
            assertNull(result.getData());
        }

        @Test
        @DisplayName("error(code, message) - 自定义错误码错误响应")
        void testErrorWithCodeAndMessage() {
            int errorCode = 400;
            String errorMessage = "Bad request";
            Result<Void> result = Result.error(errorCode, errorMessage);

            assertEquals(errorCode, result.getCode());
            assertEquals(errorMessage, result.getMessage());
            assertNull(result.getData());
        }

        @Test
        @DisplayName("error(404, message) - 404 错误")
        void testError404() {
            Result<Void> result = Result.error(404, "Resource not found");

            assertEquals(404, result.getCode());
            assertEquals("Resource not found", result.getMessage());
        }

        @Test
        @DisplayName("error(401, message) - 401 未授权错误")
        void testError401() {
            Result<Void> result = Result.error(401, "Unauthorized");

            assertEquals(401, result.getCode());
            assertEquals("Unauthorized", result.getMessage());
        }

        @Test
        @DisplayName("error(403, message) - 403 禁止访问错误")
        void testError403() {
            Result<Void> result = Result.error(403, "Forbidden");

            assertEquals(403, result.getCode());
            assertEquals("Forbidden", result.getMessage());
        }
    }

    @Nested
    @DisplayName("时间戳测试")
    class TimestampTests {

        @Test
        @DisplayName("Result 应包含时间戳")
        void testTimestamp() {
            long before = System.currentTimeMillis();
            Result<Void> result = Result.success();
            long after = System.currentTimeMillis();

            assertTrue(result.getTimestamp() >= before);
            assertTrue(result.getTimestamp() <= after);
        }

        @Test
        @DisplayName("错误响应也应包含时间戳")
        void testErrorTimestamp() {
            long before = System.currentTimeMillis();
            Result<Void> result = Result.error("error");
            long after = System.currentTimeMillis();

            assertTrue(result.getTimestamp() >= before);
            assertTrue(result.getTimestamp() <= after);
        }
    }

    @Nested
    @DisplayName("Setter 测试")
    class SetterTests {

        @Test
        @DisplayName("setCode 测试")
        void testSetCode() {
            Result<Void> result = new Result<>();
            result.setCode(201);
            assertEquals(201, result.getCode());
        }

        @Test
        @DisplayName("setMessage 测试")
        void testSetMessage() {
            Result<Void> result = new Result<>();
            result.setMessage("custom message");
            assertEquals("custom message", result.getMessage());
        }

        @Test
        @DisplayName("setData 测试")
        void testSetData() {
            Result<String> result = new Result<>();
            result.setData("test data");
            assertEquals("test data", result.getData());
        }

        @Test
        @DisplayName("setTimestamp 测试")
        void testSetTimestamp() {
            Result<Void> result = new Result<>();
            long timestamp = 1234567890L;
            result.setTimestamp(timestamp);
            assertEquals(timestamp, result.getTimestamp());
        }
    }

    @Nested
    @DisplayName("泛型测试")
    class GenericTests {

        @Test
        @DisplayName("Integer 类型数据")
        void testIntegerData() {
            Result<Integer> result = Result.success(42);
            assertEquals(42, result.getData());
        }

        @Test
        @DisplayName("Long 类型数据")
        void testLongData() {
            Result<Long> result = Result.success(123456789L);
            assertEquals(123456789L, result.getData());
        }

        @Test
        @DisplayName("Boolean 类型数据")
        void testBooleanData() {
            Result<Boolean> result = Result.success(true);
            assertTrue(result.getData());
        }

        @Test
        @DisplayName("数组类型数据")
        void testArrayData() {
            String[] data = {"a", "b", "c"};
            Result<String[]> result = Result.success(data);
            assertArrayEquals(data, result.getData());
        }
    }

    @Nested
    @DisplayName("构造函数测试")
    class ConstructorTests {

        @Test
        @DisplayName("无参构造函数")
        void testNoArgsConstructor() {
            Result<Void> result = new Result<>();
            assertNotNull(result);
            assertEquals(0, result.getCode());
            assertNull(result.getMessage());
            assertNull(result.getData());
        }

        @Test
        @DisplayName("全参构造函数")
        void testAllArgsConstructor() {
            long timestamp = System.currentTimeMillis();
            Result<String> result = new Result<>(200, "success", "data", timestamp);

            assertEquals(200, result.getCode());
            assertEquals("success", result.getMessage());
            assertEquals("data", result.getData());
            assertEquals(timestamp, result.getTimestamp());
        }
    }
}
