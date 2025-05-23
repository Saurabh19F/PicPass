package com.example.graphicalauth.controller;

import com.example.graphicalauth.model.ActivityLog;
import com.example.graphicalauth.model.UploadedFile;
import com.example.graphicalauth.model.User;
import com.example.graphicalauth.repository.ActivityLogRepository;
import com.example.graphicalauth.repository.UploadedFileRepository;
import com.example.graphicalauth.repository.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.*;
import java.time.Instant;
import java.time.LocalDateTime;
import java.util.*;

@RestController
@RequestMapping("/dashboard")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class DashboardController {

    @Autowired
    private UploadedFileRepository uploadedFileRepository;

    @Autowired
    private ActivityLogRepository activityLogRepository;

    @Autowired
    private UserRepository userRepository;

    private final String UPLOAD_DIR = "uploads/";

    @GetMapping("/profile")
    public User getProfile(@RequestParam String username) {
        return userRepository.findByUsername(username).orElse(null);
    }

    @GetMapping("/files")
    public List<UploadedFile> getFiles(@RequestParam String username) {
        return userRepository.findByUsername(username)
                .map(user -> {
                    List<UploadedFile> files = uploadedFileRepository.findByUserId(user.getId());
                    files.forEach(file -> {
                        if (file.getFileUrl() == null || file.getFileUrl().isBlank()) {
                            file.setFileUrl("/uploads/" + file.getFileName());
                        }
                    });
                    return files;
                })
                .orElseGet(ArrayList::new);
    }

    @GetMapping("/activity")
    public List<ActivityLog> getActivity(@RequestParam String username) {
        return userRepository.findByUsername(username)
                .map(user -> activityLogRepository.findByUserId(user.getId()))
                .orElseGet(ArrayList::new);
    }

    @PostMapping("/upload")
    public String uploadFiles(
            @RequestParam("username") String username,
            @RequestParam("files") List<MultipartFile> files) {

        Optional<User> userOpt = userRepository.findByUsername(username);
        if (userOpt.isEmpty()) return "❌ User not found.";

        User user = userOpt.get();
        List<UploadedFile> uploadedFiles = new ArrayList<>();

        for (MultipartFile file : files) {
            try {
                File dir = new File(UPLOAD_DIR);
                if (!dir.exists()) dir.mkdirs();

                Path filePath = Paths.get(UPLOAD_DIR + file.getOriginalFilename());
                Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

                String fileName = file.getOriginalFilename();
                String extension = (fileName != null && fileName.contains("."))
                        ? fileName.substring(fileName.lastIndexOf('.') + 1)
                        : "unknown";

                UploadedFile uploadedFile = new UploadedFile();
                uploadedFile.setUserId(user.getId());
                uploadedFile.setFileName(fileName);
                uploadedFile.setFileType(file.getContentType());
                uploadedFile.setFileSize(file.getSize());
                uploadedFile.setUploadTime(Instant.now().toString());
                uploadedFile.setFileExtension(extension);
                uploadedFile.setFileUrl("/uploads/" + fileName);

                uploadedFiles.add(uploadedFile);
                uploadedFileRepository.save(uploadedFile);

                ActivityLog log = new ActivityLog();
                log.setUserId(user.getId());
                log.setAction("Uploaded file: " + fileName);
                log.setTimestamp(LocalDateTime.now());
                log.setIpAddress("127.0.0.1");
                activityLogRepository.save(log);

            } catch (IOException e) {
                e.printStackTrace();
                return "❌ Failed to upload: " + file.getOriginalFilename();
            }
        }

        return "✅ Uploaded " + uploadedFiles.size() + " files!";
    }

    @DeleteMapping("/delete")
    public ResponseEntity<?> deleteFile(@RequestParam String fileId) {
        Optional<UploadedFile> fileOpt = uploadedFileRepository.findById(fileId);
        if (fileOpt.isEmpty()) {
            return ResponseEntity.status(404).body("File not found.");
        }

        UploadedFile file = fileOpt.get();
        Path filePath = Paths.get(UPLOAD_DIR, file.getFileName());

        try {
            Files.deleteIfExists(filePath);
        } catch (IOException e) {
            return ResponseEntity.status(500).body("Failed to delete file from disk.");
        }

        uploadedFileRepository.deleteById(fileId);

        ActivityLog log = new ActivityLog();
        log.setUserId(file.getUserId());
        log.setAction("Deleted file: " + file.getFileName());
        log.setTimestamp(LocalDateTime.now());
        log.setIpAddress("127.0.0.1");
        activityLogRepository.save(log);

        return ResponseEntity.ok("✅ File deleted successfully.");
    }

    @GetMapping("/fix-missing-fileUrls")
    public String fixMissingFileUrls() {
        List<UploadedFile> files = uploadedFileRepository.findAll();
        int fixed = 0;
        for (UploadedFile file : files) {
            if (file.getFileUrl() == null || file.getFileUrl().isBlank()) {
                file.setFileUrl("/uploads/" + file.getFileName());
                uploadedFileRepository.save(file);
                fixed++;
            }
        }
        return "✅ Fixed " + fixed + " missing fileUrl entries.";
    }

    @PostMapping(value = "/upload-avatar", consumes = "multipart/form-data")
    public ResponseEntity<?> uploadAvatar(
            @RequestParam("username") String username,
            @RequestParam("avatar") MultipartFile avatarFile) {

        Optional<User> userOpt = userRepository.findByUsername(username);
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(404).body("User not found");
        }

        try {
            String original = avatarFile.getOriginalFilename();
            if (original == null || original.isBlank()) {
                return ResponseEntity.status(400).body("Invalid file name");
            }

            String avatarDir = "uploads/avatars";
            File dir = new File(avatarDir);
            if (!dir.exists()) dir.mkdirs();

            String fileName = username + "_" + original;
            Path path = Paths.get(avatarDir, fileName);
            Files.copy(avatarFile.getInputStream(), path, StandardCopyOption.REPLACE_EXISTING);

            User user = userOpt.get();
            user.setAvatarPath("/uploads/avatars/" + fileName);
            userRepository.save(user);

            return ResponseEntity.ok(Map.of("avatarPath", "/uploads/avatars/" + fileName));
        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Failed to upload avatar");
        }
    }

    @PostMapping("/change-password")
    public ResponseEntity<?> changePassword(
            @RequestParam String username,
            @RequestParam String newPassword) {

        Optional<User> userOpt = userRepository.findByUsername(username);
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(404).body("User not found.");
        }

        User user = userOpt.get();
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        user.setPassword(encoder.encode(newPassword));
        userRepository.save(user);

        return ResponseEntity.ok("Password updated successfully");
    }

    @GetMapping("/fix-missing-fileExtensions")
    public String fixMissingFileExtensions() {
        List<UploadedFile> files = uploadedFileRepository.findAll();
        int fixed = 0;
        for (UploadedFile file : files) {
            if (file.getFileExtension() == null || file.getFileExtension().isBlank()) {
                String name = file.getFileName();
                if (name != null && name.contains(".")) {
                    String ext = name.substring(name.lastIndexOf('.') + 1);
                    file.setFileExtension(ext);
                    uploadedFileRepository.save(file);
                    fixed++;
                }
            }
        }
        return "✅ Fixed " + fixed + " missing fileExtension entries.";
    }
}
