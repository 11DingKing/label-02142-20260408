package com.navigation.common;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * 全局异常处理器测试
 * 测试各种异常情况的处理
 */
@WebMvcTest(GlobalExceptionHandlerTest.TestController.class)
class GlobalExceptionHandlerTest {

    @Autowired
    private MockMvc mockMvc;

    /**
     * 测试用控制器
     */
    @RestController
    @RequestMapping("/test")
    static class TestController {

        @GetMapping("/business-exception")
        public void throwBusinessException() {
            throw new BusinessException("业务异常测试");
        }

        @GetMapping("/business-exception-with-code")
        public void throwBusinessExceptionWithCode() {
            throw new BusinessException(404, "资源不存在");
        }

        @GetMapping("/runtime-exception")
        public void throwRuntimeException() {
            throw new RuntimeException("运行时异常测试");
        }

        @GetMapping("/exception")
        public void throwException() throws Exception {
            throw new Exception("普通异常测试");
        }

        @GetMapping("/null-pointer")
        public void throwNullPointer() {
            throw new NullPointerException("空指针异常");
        }
    }

    @Nested
    @DisplayName("业务异常处理测试")
    class BusinessExceptionTests {

        @Test
        @DisplayName("应正确处理业务异常")
        void testHandleBusinessException() throws Exception {
            mockMvc.perform(get("/test/business-exception")
                            .contentType(MediaType.APPLICATION_JSON))
                    .andExpect(status().isBadRequest())
                    .andExpect(jsonPath("$.code").value(400))
                    .andExpect(jsonPath("$.message").value("业务异常测试"));
        }

        @Test
        @DisplayName("应正确处理带错误码的业务异常")
        void testHandleBusinessExceptionWithCode() throws Exception {
            mockMvc.perform(get("/test/business-exception-with-code")
                            .contentType(MediaType.APPLICATION_JSON))
                    .andExpect(status().isBadRequest())
                    .andExpect(jsonPath("$.code").value(404))
                    .andExpect(jsonPath("$.message").value("资源不存在"));
        }
    }

    @Nested
    @DisplayName("运行时异常处理测试")
    class RuntimeExceptionTests {

        @Test
        @DisplayName("应正确处理运行时异常")
        void testHandleRuntimeException() throws Exception {
            mockMvc.perform(get("/test/runtime-exception")
                            .contentType(MediaType.APPLICATION_JSON))
                    .andExpect(status().isInternalServerError())
                    .andExpect(jsonPath("$.code").value(500))
                    .andExpect(jsonPath("$.message").value("服务器内部错误"));
        }

        @Test
        @DisplayName("应正确处理空指针异常")
        void testHandleNullPointerException() throws Exception {
            mockMvc.perform(get("/test/null-pointer")
                            .contentType(MediaType.APPLICATION_JSON))
                    .andExpect(status().isInternalServerError())
                    .andExpect(jsonPath("$.code").value(500));
        }
    }

    @Nested
    @DisplayName("普通异常处理测试")
    class ExceptionTests {

        @Test
        @DisplayName("应正确处理普通异常")
        void testHandleException() throws Exception {
            mockMvc.perform(get("/test/exception")
                            .contentType(MediaType.APPLICATION_JSON))
                    .andExpect(status().isInternalServerError())
                    .andExpect(jsonPath("$.code").value(500))
                    .andExpect(jsonPath("$.message").value("系统异常，请稍后重试"));
        }
    }

    @Nested
    @DisplayName("响应结构测试")
    class ResponseStructureTests {

        @Test
        @DisplayName("异常响应应包含时间戳")
        void testExceptionResponseHasTimestamp() throws Exception {
            mockMvc.perform(get("/test/business-exception")
                            .contentType(MediaType.APPLICATION_JSON))
                    .andExpect(status().isBadRequest())
                    .andExpect(jsonPath("$.timestamp").exists());
        }

        @Test
        @DisplayName("异常响应数据应为空")
        void testExceptionResponseDataIsNull() throws Exception {
            mockMvc.perform(get("/test/business-exception")
                            .contentType(MediaType.APPLICATION_JSON))
                    .andExpect(status().isBadRequest())
                    .andExpect(jsonPath("$.data").doesNotExist());
        }
    }
}
