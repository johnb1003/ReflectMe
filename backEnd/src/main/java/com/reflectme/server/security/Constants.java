package com.reflectme.server.security;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

public class Constants {
    public static final String HMAC = System.getenv("HMAC_SECRET");
    public static final long EXPIRATION_TIME = 36_000_000; // in ms (10 hours)
    public static final String TOKEN_PREFIX = "Bearer ";
    public static final String HEADER_STRING = "Authorization";
    public static final String SIGNUP_URL = "/v1/accounts/signup";
    public static final String LOGIN_URL = "/v1/accounts/login";
}
