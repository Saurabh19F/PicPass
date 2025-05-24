package com.example.graphicalauth.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;

@RestController
public class ProxyController {

    @GetMapping("/proxy/totalusers")
    public ResponseEntity<?> proxyTotalUsers() {
        try {
            HttpClient client = HttpClient.newHttpClient();
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create("https://sc.ecombullet.com/api/dashboard/totalusers"))
                    .GET()
                    .build();

            HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());

            return ResponseEntity
                    .status(response.statusCode())
                    .body(response.body());

        } catch (Exception e) {
            return ResponseEntity.status(500).body("Proxy failed: " + e.getMessage());
        }
    }
}
