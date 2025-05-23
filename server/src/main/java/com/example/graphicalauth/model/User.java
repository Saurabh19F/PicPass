package com.example.graphicalauth.model;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Document(collection = "users")
public class User {
    @Id
    private String id;

    private String firstName;
    private String lastName;
    private String username;
    private String email;
    private String password;

    private String phone;
    private boolean mfaEnabled;
    private String backupEmail;
    private String uploadedImageUrl;
    private String lastLogin;
    private String avatarPath;


    private LocalDateTime createdAt = LocalDateTime.now();
}

