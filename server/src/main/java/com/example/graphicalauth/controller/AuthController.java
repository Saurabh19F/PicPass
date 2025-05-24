package com.example.graphicalauth.controller;

import com.example.graphicalauth.model.*;
import com.example.graphicalauth.repository.*;
import com.example.graphicalauth.service.OtpService;
import com.example.graphicalauth.service.ImageStorageService;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.mongodb.client.gridfs.GridFSBucket;

import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

import org.bson.types.ObjectId;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.Files;
import java.time.LocalDateTime;
import java.util.*;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UserRepository userRepo;
    private final GraphicalPasswordRepository passwordRepo;
    private final ActivityLogRepository activityRepo;
    private final OtpService otpService;
    private final ImageStorageService imageStorageService;
    private final GridFSBucket gridFSBucket;

    // In-memory OTP storage
    private static class OtpEntry {
        String otp;
        long expiresAt;
    }
    private final Map<String, OtpEntry> otpStore = new HashMap<>();

    @PostMapping(value = "/signup", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> signup(
            @RequestParam("firstName") String firstName,
            @RequestParam("lastName") String lastName,
            @RequestParam("username") String username,
            @RequestParam("email") String email,
            @RequestParam("password") String password,
            @RequestParam("phone") String phone,
            @RequestParam("mfaEnabled") boolean mfaEnabled,
            @RequestParam("backupEmail") String backupEmail,
            @RequestParam("segments") String segmentsJson,
            @RequestPart("image") MultipartFile imageFile
    ) {
        try {
            if (userRepo.findByEmail(email).isPresent())
                return ResponseEntity.badRequest().body("Email already exists.");
            if (userRepo.findByUsername(username).isPresent())
                return ResponseEntity.badRequest().body("Username already exists.");

            ObjectMapper mapper = new ObjectMapper();
            List<Integer> selectedSegments = mapper.readValue(segmentsJson, new TypeReference<>() {});
            String imageId = imageStorageService.storeImage(imageFile);
            String uploadedImageUrl = "/auth/image/" + imageId;

            BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

            User user = new User();
            user.setFirstName(firstName);
            user.setLastName(lastName);
            user.setUsername(username);
            user.setEmail(email);
            user.setPassword(encoder.encode(password));
            user.setPhone(phone);
            user.setMfaEnabled(mfaEnabled);
            user.setBackupEmail(backupEmail);
            user.setUploadedImageUrl(uploadedImageUrl);
            User savedUser = userRepo.save(user);

            GraphicalPassword graphicalPassword = new GraphicalPassword();
            graphicalPassword.setUserId(savedUser.getId());
            graphicalPassword.setSelectedSegments(selectedSegments);
            passwordRepo.save(graphicalPassword);

            return ResponseEntity.ok(Map.of("message", "User created successfully."));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Signup failed: " + e.getMessage());
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        Optional<User> userOpt = userRepo.findByUsername(request.getUsername());
        if (userOpt.isEmpty()) return ResponseEntity.status(404).body("User not found.");

        User user = userOpt.get();
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        if (!encoder.matches(request.getPassword(), user.getPassword())) {
            return ResponseEntity.badRequest().body("Invalid password.");
        }

        user.setLastLogin(LocalDateTime.now().toString());
        userRepo.save(user);

        String otp = generateOtp();
        OtpEntry entry = new OtpEntry();
        entry.otp = otp;
        entry.expiresAt = System.currentTimeMillis() + 5 * 60 * 1000;
        otpStore.put(user.getPhone(), entry);
        otpService.sendOtp(user.getPhone(), otp);

        return ResponseEntity.ok("OTP_SENT");
    }

    @PostMapping("/verify-otp-grid")
    public ResponseEntity<?> verifyOtpAndGrid(@RequestBody OtpVerifyRequest request) {
        OtpEntry entry = otpStore.get(request.getPhone());
        if (entry == null || !entry.otp.equals(request.getOtp())) {
            return ResponseEntity.badRequest().body("Invalid or expired OTP.");
        }
        otpStore.remove(request.getPhone());

        Optional<User> userOpt = userRepo.findByUsername(request.getUsername());
        if (userOpt.isEmpty()) return ResponseEntity.status(404).body("User not found.");
        User user = userOpt.get();

        Optional<GraphicalPassword> passOpt = passwordRepo.findByUserId(user.getId());
        if (passOpt.isEmpty()) return ResponseEntity.badRequest().body("Graphical password not set.");

        List<Integer> savedSegments = passOpt.get().getSelectedSegments();
        if (!savedSegments.equals(request.getSegments())) {
            return ResponseEntity.badRequest().body("Incorrect graphical password.");
        }

        logActivity(user.getId(), "LOGIN", request.getIp());

        Map<String, Object> response = new HashMap<>();
        response.put("message", "LOGIN_SUCCESS");
        response.put("username", user.getUsername());
        response.put("email", user.getEmail());
        response.put("uploadedImageUrl", user.getUploadedImageUrl());
        response.put("mfaEnabled", user.isMfaEnabled());

        return ResponseEntity.ok(response);
    }

    @GetMapping("/user-phone/{identifier}")
    public ResponseEntity<?> getPhoneByUsernameOrEmail(@PathVariable String identifier) {
        Optional<User> userOpt = userRepo.findByUsername(identifier);
        if (userOpt.isEmpty()) {
            userOpt = userRepo.findByEmail(identifier);
            if (userOpt.isEmpty()) {
                return ResponseEntity.status(404).body("User not found.");
            }
        }
        String phone = userOpt.get().getPhone();
        if (phone == null || phone.isBlank()) {
            return ResponseEntity.status(400).body("Phone number is missing.");
        }
        return ResponseEntity.ok(Map.of("phone", phone));
    }

    @GetMapping("/image/{id}")
    public void getImage(@PathVariable String id, HttpServletResponse response) throws IOException {
        response.setContentType("image/jpeg");
        gridFSBucket.downloadToStream(new ObjectId(id), response.getOutputStream());
    }

    @GetMapping("/user-image/{username}")
    public ResponseEntity<?> getUserImageUrl(@PathVariable String username) {
        Optional<User> userOpt = userRepo.findByUsername(username);
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(404).body("User not found.");
        }
        String imageUrl = userOpt.get().getUploadedImageUrl();
        return ResponseEntity.ok(Map.of("imageUrl", imageUrl));
    }

    @PostMapping(value = "/upload-avatar", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> uploadAvatar(
            @RequestParam("username") String username,
            @RequestParam("avatar") MultipartFile avatarFile) {

        Optional<User> userOpt = userRepo.findByUsername(username);
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(404).body("User not found");
        }

        try {
            String avatarDir = "uploads/avatars";
            File dir = new File(avatarDir);
            if (!dir.exists()) dir.mkdirs();

            String fileName = username + "_" + avatarFile.getOriginalFilename();
            Path path = Paths.get(avatarDir, fileName);
            Files.copy(avatarFile.getInputStream(), path);

            User user = userOpt.get();
            user.setAvatarPath("/uploads/avatars/" + fileName);
            userRepo.save(user);

            return ResponseEntity.ok(Map.of("avatarPath", user.getAvatarPath()));
        } catch (IOException e) {
            return ResponseEntity.status(500).body("Failed to upload avatar");
        }
    }

    @PostMapping("/change-password")
    public ResponseEntity<?> changePassword(
            @RequestParam String username,
            @RequestParam String newPassword) {

        Optional<User> userOpt = userRepo.findByUsername(username);
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(404).body("User not found.");
        }

        User user = userOpt.get();
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        user.setPassword(encoder.encode(newPassword));
        userRepo.save(user);

        return ResponseEntity.ok("Password updated successfully");
    }

    // Utility Methods
    private String generateOtp() {
        return String.valueOf(new Random().nextInt(900000) + 100000);
    }

    private void logActivity(String userId, String action, String ip) {
        ActivityLog log = new ActivityLog();
        log.setUserId(userId);
        log.setAction(action);
        log.setIpAddress(ip);
        log.setTimestamp(LocalDateTime.now());
        activityRepo.save(log);
    }
}
