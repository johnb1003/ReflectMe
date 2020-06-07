package com.reflectme.server.security;

public class Constants {
    public static final String SECRET = System.getenv("REFLECTME_HMAC_SECRET");
    public static final long EXPIRATION_TIME = 3_600_000; // in ms (1 hour)
    public static final String TOKEN_PREFIX = "Bearer ";
    public static final String HEADER_STRING = "Authorization";
    public static final String SIGNUP_URL = "/api/v1/accounts/signup";
    public static final String LOGIN_URL = "/api/v1/accounts/login";
}
