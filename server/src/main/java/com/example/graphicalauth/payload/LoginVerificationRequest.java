package com.example.graphicalauth.payload;

import lombok.Data;
import java.util.List;

@Data
public class LoginVerificationRequest {
    private String username;
    private String otp;
    private List<Integer> segments; // List of selected graphical segments
}

