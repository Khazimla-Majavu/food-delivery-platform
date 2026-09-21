package com.fooddelivery.backend.controller;

import com.fooddelivery.backend.model.FinancialRecord;
import com.fooddelivery.backend.service.FinancialRecordService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/financial-records")
public class FinancialRecordController {

    private final FinancialRecordService financialRecordService;

    public FinancialRecordController(
            FinancialRecordService financialRecordService
    ) {
        this.financialRecordService = financialRecordService;
    }

    @GetMapping("/order/{orderId}")
    public FinancialRecord getFinancialRecord(
            @PathVariable Long orderId
    ) {
        return financialRecordService.getFinancialRecord(orderId);
    }
}
