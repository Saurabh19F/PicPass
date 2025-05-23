package com.example.graphicalauth.model;

import lombok.Data;
import java.util.List;

@Data
public class OtpVerifyRequest {
    private String phone;
    private String otp;
    private String ip;
    private String username;
    private List<Integer> segments; // ✅ required for image verification
}



