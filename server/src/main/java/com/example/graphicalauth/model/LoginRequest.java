package com.example.graphicalauth.model;

import lombok.Data;
import java.util.List;

@Data
public class LoginRequest {
    private String username;
    private String password;
    private List<Integer> selectedSegments;
    private String ip;
}
