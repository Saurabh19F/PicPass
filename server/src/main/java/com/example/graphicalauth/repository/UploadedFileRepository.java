package com.example.graphicalauth.repository;

import com.example.graphicalauth.model.UploadedFile;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface UploadedFileRepository extends MongoRepository<UploadedFile, String> {
    List<UploadedFile> findByUserId(String userId);
}




