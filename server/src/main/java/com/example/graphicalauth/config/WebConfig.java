package com.example.graphicalauth.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.nio.file.Paths;

@Configuration
public class WebConfig {

    @Bean
    public WebMvcConfigurer customConfigurer() {
        return new WebMvcConfigurer() {

            // ✅ 1. CORS Settings for Local and Render Deployment
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/**")
                        .allowedOrigins(
                                "http://localhost:5173",                          // Local Vite React
                                "https://picpass-client.onrender.com"            // Deployed frontend
                        )
                        .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                        .allowedHeaders("*")
                        .allowCredentials(true)
                        .maxAge(3600);
            }

            // ✅ 2. Static File Mapping: /uploads/** → /uploads folder
            @Override
            public void addResourceHandlers(ResourceHandlerRegistry registry) {
                String uploadPath = Paths.get("uploads").toAbsolutePath().toUri().toString();
                registry.addResourceHandler("/uploads/**")
                        .addResourceLocations("file:" + uploadPath);
            }
        };
    }
}
