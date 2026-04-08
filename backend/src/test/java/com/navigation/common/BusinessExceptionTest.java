package com.navigation.common;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

/**
 * 业务异常测试
 * 全面测试 BusinessException 类
 */
class BusinessExceptionTest {

    @Nested
    @DisplayName("构造函数测试")
    class ConstructorTests {

        @Test
        @DisplayName("构造函数 - 仅消息")
        void testConstructorWithMessage() {
            String message = "业务错误";
            BusinessException exception = new BusinessException(message);

            assertEquals(400, exception.getCode());
            assertEquals(message, exception.getMessage());
            assertNull(exception.getCause());
        }

        @Test
        @DisplayName("构造函数 - 错误码和消息")
        void testConstructorWithCodeAndMessage() {
            int code = 404;
            String message = "资源不存在";
            BusinessException exception = new BusinessException(code, message);

            assertEquals(code, exception.getCode());
            assertEquals(message, exception.getMessage());
            assertNull(exception.getCause());
        }

        @Test
        @DisplayName("构造函数 - 消息和原因")
        void testConstructorWithMessageAndCause() {
            String message = "业务错误";
            Throwable cause = new RuntimeException("原始错误");
            BusinessException exception = new BusinessException(message, cause);

            assertEquals(400, exception.getCode());
            assertEquals(message, exception.getMessage());
            assertEquals(cause, exception.getCause());
        }
    }

    @Nested
    @DisplayName("继承关系测试")
    class InheritanceTests {

        @Test
        @DisplayName("BusinessException 应该是 RuntimeException 的子类")
        void testIsRuntimeException() {
            BusinessException exception = new BusinessException("test");
            assertTrue(exception instanceof RuntimeException);
        }

        @Test
        @DisplayName("BusinessException 应该是 Exception 的子类")
        void testIsException() {
            BusinessException exception = new BusinessException("test");
            assertTrue(exception instanceof Exception);
        }

        @Test
        @DisplayName("BusinessException 应该是 Throwable 的子类")
        void testIsThrowable() {
            BusinessException exception = new BusinessException("test");
            assertTrue(exception instanceof Throwable);
        }
    }

    @Nested
    @DisplayName("错误码测试")
    class ErrorCodeTests {

        @Test
        @DisplayName("默认错误码应为 400")
        void testDefaultErrorCode() {
            BusinessException exception = new BusinessException("test");
            assertEquals(400, exception.getCode());
        }

        @Test
        @DisplayName("自定义错误码 - 401")
        void testCustomErrorCode401() {
            BusinessException exception = new BusinessException(401, "Unauthorized");
            assertEquals(401, exception.getCode());
        }

        @Test
        @DisplayName("自定义错误码 - 403")
        void testCustomErrorCode403() {
            BusinessException exception = new BusinessException(403, "Forbidden");
            assertEquals(403, exception.getCode());
        }

        @Test
        @DisplayName("自定义错误码 - 404")
        void testCustomErrorCode404() {
            BusinessException exception = new BusinessException(404, "Not Found");
            assertEquals(404, exception.getCode());
        }

        @Test
        @DisplayName("自定义错误码 - 500")
        void testCustomErrorCode500() {
            BusinessException exception = new BusinessException(500, "Internal Server Error");
            assertEquals(500, exception.getCode());
        }
    }

    @Nested
    @DisplayName("消息测试")
    class MessageTests {

        @Test
        @DisplayName("空消息")
        void testEmptyMessage() {
            BusinessException exception = new BusinessException("");
            assertEquals("", exception.getMessage());
        }

        @Test
        @DisplayName("中文消息")
        void testChineseMessage() {
            String message = "这是一个中文错误消息";
            BusinessException exception = new BusinessException(message);
            assertEquals(message, exception.getMessage());
        }

        @Test
        @DisplayName("特殊字符消息")
        void testSpecialCharacterMessage() {
            String message = "Error: <script>alert('xss')</script>";
            BusinessException exception = new BusinessException(message);
            assertEquals(message, exception.getMessage());
        }

        @Test
        @DisplayName("长消息")
        void testLongMessage() {
            String message = "A".repeat(1000);
            BusinessException exception = new BusinessException(message);
            assertEquals(message, exception.getMessage());
        }
    }

    @Nested
    @DisplayName("异常链测试")
    class CauseTests {

        @Test
        @DisplayName("无原因异常")
        void testNoCause() {
            BusinessException exception = new BusinessException("test");
            assertNull(exception.getCause());
        }

        @Test
        @DisplayName("带原因异常")
        void testWithCause() {
            RuntimeException cause = new RuntimeException("root cause");
            BusinessException exception = new BusinessException("test", cause);
            assertEquals(cause, exception.getCause());
        }

        @Test
        @DisplayName("嵌套异常链")
        void testNestedCause() {
            Exception rootCause = new Exception("root");
            RuntimeException middleCause = new RuntimeException("middle", rootCause);
            BusinessException exception = new BusinessException("top", middleCause);

            assertEquals(middleCause, exception.getCause());
            assertEquals(rootCause, exception.getCause().getCause());
        }
    }

    @Nested
    @DisplayName("抛出和捕获测试")
    class ThrowCatchTests {

        @Test
        @DisplayName("可以被抛出和捕获")
        void testThrowAndCatch() {
            assertThrows(BusinessException.class, () -> {
                throw new BusinessException("test error");
            });
        }

        @Test
        @DisplayName("可以被 RuntimeException 捕获")
        void testCatchAsRuntimeException() {
            assertThrows(RuntimeException.class, () -> {
                throw new BusinessException("test error");
            });
        }

        @Test
        @DisplayName("捕获后可以获取错误码")
        void testGetCodeAfterCatch() {
            try {
                throw new BusinessException(404, "Not Found");
            } catch (BusinessException e) {
                assertEquals(404, e.getCode());
                assertEquals("Not Found", e.getMessage());
            }
        }
    }

    @Nested
    @DisplayName("Getter 测试")
    class GetterTests {

        @Test
        @DisplayName("getCode 测试")
        void testGetCode() {
            BusinessException exception = new BusinessException(422, "Unprocessable Entity");
            assertEquals(422, exception.getCode());
        }

        @Test
        @DisplayName("getMessage 测试")
        void testGetMessage() {
            String message = "Test message";
            BusinessException exception = new BusinessException(message);
            assertEquals(message, exception.getMessage());
        }
    }
}
