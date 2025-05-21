package com.abdallah.ElectornicApp_online_backend.aop;

import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;


@Aspect
@Component
public class ValidationAspect {
    private static final Logger LOGGER = LoggerFactory.getLogger(ValidationAspect.class);

    @Around("execution(* com.abdallah.StoreApp.controller.productController.getProductById(..)) && args(postId)")
    public Object validateAndUpdate(ProceedingJoinPoint proceedingJoinPoint, int postId) throws Throwable {
        if(postId<0){
            LOGGER.info("PostId is negative , updating it");
            postId=-postId;
            LOGGER.info("New value "+ postId);
        }
        Object obj=proceedingJoinPoint.proceed(new Object[]{postId});

        return obj;
    }
}
