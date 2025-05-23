package com.example.graphicalauth.model;


import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Document(collection = "graphical_passwords")
public class GraphicalPassword {
    @Id
    private String id;
    private String userId;
    private List<Integer> selectedSegments;
}


