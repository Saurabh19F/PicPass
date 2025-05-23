package com.example.graphicalauth.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.Transient;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Document
public class UploadedFile {

    @Id
    private String id;

    private String userId;
    private String fileName;
    private String fileType;
    private long fileSize;
    private String uploadTime;
    private String fileExtension;

    @Transient
    private String fileUrl;

    public String getFileUrl() {
        return "/uploads/" + fileName;
    }
}
