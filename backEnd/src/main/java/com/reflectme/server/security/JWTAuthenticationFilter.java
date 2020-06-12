package com.reflectme.server.security;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.reflectme.server.model.Account;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Date;
import java.util.Enumeration;

import static com.reflectme.server.security.Constants.EXPIRATION_TIME;
import static com.reflectme.server.security.Constants.SECRET;
import static com.reflectme.server.security.Constants.HEADER_STRING;
import static com.reflectme.server.security.Constants.TOKEN_PREFIX;

import com.auth0.jwt.JWT;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;

import static com.auth0.jwt.algorithms.Algorithm.HMAC512;

public class JWTAuthenticationFilter extends UsernamePasswordAuthenticationFilter {
    private AuthenticationManager authenticationManager;

    public JWTAuthenticationFilter(AuthenticationManager authenticationManager, String loginURL) {
        this.authenticationManager = authenticationManager;
        this.setFilterProcessesUrl(loginURL);
    }

    @Override
    public Authentication attemptAuthentication(HttpServletRequest req,
                                                HttpServletResponse res) throws AuthenticationException {
        try {
            Account account = new ObjectMapper()
                    .readValue(req.getInputStream(), Account.class);

            
            // Print request headers
            Enumeration headerNames = req.getHeaderNames();
            while (headerNames.hasMoreElements()) {

                String headerName = (String) headerNames.nextElement();

                System.out.println(headerName + ": " + req.getHeader(headerName));
            }

            return authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            account.getEmail(),
                            account.getPassword(),
                            new ArrayList<>())
            );
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    protected void successfulAuthentication(HttpServletRequest req,
                                            HttpServletResponse res,
                                            FilterChain chain,
                                            Authentication auth) throws IOException, ServletException {

        String token = JWT.create()
                .withSubject(((User) auth.getPrincipal()).getUsername())
                .withExpiresAt(new Date(System.currentTimeMillis() + (long) EXPIRATION_TIME))
                .sign(HMAC512(SECRET.getBytes()));
        res.addHeader(HEADER_STRING, TOKEN_PREFIX + token);
    }
}
