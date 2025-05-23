package com.example.graphicalauth.controller;

import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.apache.hc.client5.http.classic.methods.HttpGet;
import org.apache.hc.client5.http.impl.classic.CloseableHttpClient;
import org.apache.hc.client5.http.impl.classic.HttpClients;
import org.apache.hc.core5.http.ClassicHttpResponse;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/proxy")
public class ProxyController {

    @GetMapping("/totalusers")
    public ResponseEntity<String> proxyTotalUsers() {
        String url = "https://sc.ecombullet.com/api/dashboard/totalusers";

        try (CloseableHttpClient client = HttpClients.createDefault()) {
            HttpGet request = new HttpGet(url);
            ClassicHttpResponse response = client.executeOpen(null, request, null);

            String body = new BufferedReader(new InputStreamReader(response.getEntity().getContent()))
                    .lines().collect(Collectors.joining("\n"));

            return ResponseEntity.ok(body);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_GATEWAY)
                    .body("Failed to fetch: " + e.getMessage());
        }
    }
}
