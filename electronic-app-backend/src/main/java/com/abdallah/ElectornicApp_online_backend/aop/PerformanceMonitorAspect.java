package com.abdallah.ElectornicApp_online_backend.aop;

import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

@Aspect
@Component
public class PerformanceMonitorAspect {
    private static final Logger LOGGER = LoggerFactory.getLogger(PerformanceMonitorAspect.class);

    @Around("execution(* com.abdallah.ElectornicApp_online_backend.controllers.productController.*(..)) ")
    public Object monitorTime( ProceedingJoinPoint proceedingJoinPoint) throws Throwable {
        Long start = System.currentTimeMillis();
        Object obj = proceedingJoinPoint.proceed();
        Long end = System.currentTimeMillis();
        LOGGER.info("Time taken : " + (end - start) + "ms ");

        return obj;
    }

}
