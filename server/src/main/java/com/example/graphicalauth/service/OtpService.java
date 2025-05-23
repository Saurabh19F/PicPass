package com.example.graphicalauth.service;

import com.twilio.Twilio;
import com.twilio.rest.api.v2010.account.Message;
import com.twilio.type.PhoneNumber;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class OtpService {

    @Value("${twilio.account.sid}")
    private String accountSid;

    @Value("${twilio.auth.token}")
    private String authToken;

    @Value("${twilio.phone.number}")
    private String twilioNumber;

    @PostConstruct
    public void init() {
        System.out.println("📦 Twilio initialization starting...");
        Twilio.init(accountSid, authToken);
        System.out.println("✅ Twilio initialized with SID: " + accountSid);
    }

    public void sendOtp(String to, String otp) {
        try {
            // ✅ Add country code if missing
            if (!to.startsWith("+")) {
                to = "+91" + to;
            }

            System.out.println("📲 Sending OTP to: " + to);
            System.out.println("🧪 OTP for debugging: " + otp);

            Message message = Message.creator(
                    new PhoneNumber(to),
                    new PhoneNumber(twilioNumber),
                    "Your OTP is: " + otp
            ).create();

            System.out.println("✅ Twilio message SID: " + message.getSid());
            System.out.println("✅ Twilio message status: " + message.getStatus());

        } catch (Exception e) {
            System.err.println("❌ Failed to send OTP: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("OTP delivery failed: " + e.getMessage());
        }
    }
}
