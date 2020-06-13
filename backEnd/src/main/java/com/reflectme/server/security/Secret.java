package com.reflectme.server.security;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class Secret {

    public static String HMAC;

    @Value("${HMAC_SECRET}")
    public void setDatabase(String hmac) {
        HMAC = hmac;
    }

}
