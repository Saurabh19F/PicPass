package com.example.graphicalauth.repository;

import com.example.graphicalauth.model.GraphicalPassword;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface GraphicalPasswordRepository extends MongoRepository<GraphicalPassword, String> {
    Optional<GraphicalPassword> findByUserId(String userId);
}


