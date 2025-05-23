package com.example.graphicalauth.model;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Document(collection = "activity_logs")
public class ActivityLog {
    @Id
    private String id;

    private String userId;

    private String username; // ✅ Optional but helpful for filtering/logging

    private String action;       // e.g., "LOGIN", "UPLOAD", "DELETE", "PASSWORD_CHANGE"
    private String actionType;   // e.g., "AUTH", "FILE", "MFA", "SECURITY" (optional categorization)
    private String actionDetails; // e.g., file name, IP info, etc.
    private String actionStatus;  // e.g., "SUCCESS", "FAILURE"
    private String actionResult;  // e.g., "User logged in", "File uploaded"
    private String actionError;   // e.g., error message if failed

    private String ipAddress;

    private String actionTimeZone;        // e.g., "Asia/Kolkata"
    private String actionTimeOffset;      // e.g., "+05:30"
    private String actionTimeOffsetValue; // Optional: raw numeric offset
    private LocalDateTime timestamp = LocalDateTime.now();
}
