package com.abdallah.ElectornicApp_online_backend.controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.Arrays;
import java.util.List;

@RestController
public class MessagesController {

    @GetMapping("/messages")
    public ResponseEntity<List<String>> messages() {
        System.out.println("Method Called ");

        return ResponseEntity.ok(Arrays.asList("first", "second"));
    }
}
