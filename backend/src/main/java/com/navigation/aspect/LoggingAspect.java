package com.navigation.aspect;

import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Pointcut;
import org.springframework.stereotype.Component;

import java.util.Arrays;

/**
 * 日志切面
 * 记录 Controller 层的请求日志
 */
@Slf4j
@Aspect
@Component
public class LoggingAspect {

    /**
     * 定义切点：所有 Controller 类的公共方法
     */
    @Pointcut("execution(public * com.navigation.controller..*.*(..))")
    public void controllerPointcut() {
    }

    /**
     * 环绕通知：记录请求和响应日志
     */
    @Around("controllerPointcut()")
    public Object logAround(ProceedingJoinPoint joinPoint) throws Throwable {
        String className = joinPoint.getSignature().getDeclaringTypeName();
        String methodName = joinPoint.getSignature().getName();
        Object[] args = joinPoint.getArgs();
        
        // 记录请求日志
        log.info("==> 请求: {}.{}(), 参数: {}", 
                className, methodName, Arrays.toString(args));
        
        long startTime = System.currentTimeMillis();
        
        try {
            // 执行目标方法
            Object result = joinPoint.proceed();
            
            long duration = System.currentTimeMillis() - startTime;
            
            // 记录响应日志
            log.info("<== 响应: {}.{}(), 耗时: {}ms", 
                    className, methodName, duration);
            
            return result;
        } catch (Exception e) {
            long duration = System.currentTimeMillis() - startTime;
            
            // 记录异常日志
            log.error("<== 异常: {}.{}(), 耗时: {}ms, 错误: {}", 
                    className, methodName, duration, e.getMessage());
            
            throw e;
        }
    }
}
