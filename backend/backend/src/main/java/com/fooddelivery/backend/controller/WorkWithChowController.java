package com.fooddelivery.backend.controller;

import com.fooddelivery.backend.dto.WorkWithChowRequest;
import com.fooddelivery.backend.service.WorkWithChowEmailService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/work-with-chow")
public class WorkWithChowController {

    private final WorkWithChowEmailService emailService;

    public WorkWithChowController(WorkWithChowEmailService emailService) {
        this.emailService = emailService;
    }

    @PostMapping
    public ResponseEntity<Map<String, String>> submit(
            @RequestBody WorkWithChowRequest request) {
        emailService.sendEnquiry(request);

        return ResponseEntity.ok(Map.of(
                "message",
                "Thanks for reaching out. Your enquiry has been submitted."
        ));
    }
}
