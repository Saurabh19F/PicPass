package com.example.graphicalauth.model;

import lombok.Data;
import java.util.List;

@Data
public class SignupRequest {
    private String firstName;
    private String lastName;
    private String username;
    private String email;
    private String password;
    private String phone;
    private boolean mfaEnabled;
    private String backupEmail;
    private String uploadedImageUrl;
    private List<Integer> selectedSegments;
}

