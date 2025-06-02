package com.abdallah.ElectornicApp_online_backend.aop;

import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import java.time.LocalTime;

@Component
@Aspect

public class LoggingAspect {


    private static final Logger LOGGER = LoggerFactory.getLogger(LoggingAspect.class);
    private static int countHelloCalled = 0;

    public static String getCurrentHourAndMinute() {
        LocalTime currentTime = LocalTime.now();
        int hour = currentTime.getHour();
        int minute = currentTime.getMinute();
        String timeForHoursAndMinutes = hour + ":" + minute;
        return timeForHoursAndMinutes;
    }

    //return type , class name. method name(args)
    @Before("execution(* com.abdallah.ElectornicApp_online_backend.controllers.productController.products(..)) ")
    public void logMethodCall(JoinPoint jp) {
        String currentTime = getCurrentHourAndMinute();
        LOGGER.info("The method "+jp.getSignature().getName()+" in HomeController called :" + ++countHelloCalled + " Times \n" +
                "at : " + currentTime);

    }

    @Before("execution(* com.abdallah.ElectornicApp_online_backend.controllers.productController.*(..)) ")
    public void productLogBeforeMethodCall(JoinPoint jp) {
        String currentTime = getCurrentHourAndMinute();
        LOGGER.info("Method " + jp.getSignature().getName() + "called before executing \n" +
                "at time: " + currentTime);

    }

    @After("execution(* com.abdallah.ElectornicApp_online_backend.controllers.productController.*(..)) ")
    public void productLogAfterMethodCall(JoinPoint jp) {
        String currentTime = getCurrentHourAndMinute();
        LOGGER.info("Method " + jp.getSignature().getName() + "called after executing \n" +
                "at time : " + currentTime);

    }

    @AfterThrowing("execution(* com.abdallah.ElectornicApp_online_backend.controllers.productController.*(..)) ")
    public void productLogAfterThrowingMethodCall(JoinPoint jp) {
        String currentTime = getCurrentHourAndMinute();
        LOGGER.info("Method " + jp.getSignature().getName() + "called and has some issues \n" +
                "at time : " + currentTime);

    }

    @AfterReturning("execution(* com.abdallah.StoreApp.controller.productController.*(..)) ")
    public void productLogAfterReturningMethodCall(JoinPoint jp) {
        String currentTime = getCurrentHourAndMinute();
        LOGGER.info("Method " + jp.getSignature().getName() + "called and executed successfully\n" +
                "at time : " + currentTime);

    }

}
