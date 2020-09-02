package com.reflectme.server.service;

import com.auth0.jwt.JWT;
import com.reflectme.server.exception.ResourceNotFoundException;
import com.reflectme.server.model.Account;
import com.reflectme.server.model.Mirror;
import com.reflectme.server.repository.AccountRepository;
import com.reflectme.server.repository.MirrorRepository;
import org.postgresql.util.PSQLException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;
import org.springframework.context.annotation.AnnotationConfigApplicationContext;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.crypto.bcrypt.BCrypt;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.keygen.KeyGenerators;
import org.springframework.security.crypto.keygen.StringKeyGenerator;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;

import javax.validation.Valid;
import java.security.Principal;
import java.security.SecureRandom;
import java.sql.SQLException;
import java.util.Optional;

import static com.auth0.jwt.algorithms.Algorithm.HMAC512;
import static com.reflectme.server.security.Constants.*;

@Service
public class MirrorService {

    private AccountRepository accountRepository;
    private MirrorRepository mirrorRepository;

    private AccountService accountService;

    @Autowired
    public MirrorService(AccountRepository accountRepository,
                         MirrorRepository mirrorRepository, AccountService accountService) {
        this.accountRepository = accountRepository;
        this.mirrorRepository = mirrorRepository;
        this.accountService = accountService;
    }

    /*
    public ResponseEntity createMirror(Mirror mirror) {
        return Optional
                .ofNullable(mirrorRepository.createMirror(mirror))
                .map( newMirror -> ResponseEntity.ok().body(newMirror) )
                .orElseGet( () -> ResponseEntity.notFound().build() );
    }


    public ResponseEntity connectMirror(Account account, long mirrorID) {
        // Authenticate
        boolean validAccount = false;
        long userID = 0;
        try {
            // if account has valid email / password
            Account acc = accountRepository.getFullAccountByEmail(account.getEmail());
            if (acc.getPassword().equals(account.getPassword())) {
                userID = acc.getUserID();
                validAccount = true;
            } else {
                // Incorrect password
                return ResponseEntity.status(401).build();
            }
        }
        catch(Exception e) {
            // Email doesn't exist
            return ResponseEntity.notFound().build();
        }
        // Once authenticated, connect to mirror
        if(validAccount) {
            boolean successfulConnect = mirrorRepository.connectMirror(mirrorID);

            if(successfulConnect) {
                // Create and return JWT with mirror role
                String token = JWT.create()
                        .withSubject(String.valueOf(userID))
                        .withClaim("role", "MIRROR")
                        .sign(HMAC512(HMAC.getBytes()));
                return ResponseEntity.ok().header(HEADER_STRING, TOKEN_PREFIX + token).build();
            }
        }

        return ResponseEntity.notFound().build();
    }

    public ResponseEntity getAllMirrors(long userID) {
        return Optional
                .ofNullable(mirrorRepository.getAllMirrors(userID))
                .map( mirrorList -> ResponseEntity.ok().body(mirrorList) )
                .orElseGet( () -> ResponseEntity.notFound().build() );
    }

    public ResponseEntity getAvailableMirrors(Account account) {
        Account validAccount = accountService.verifyLogin(account);
        if(validAccount != null) {
            return Optional
                    .ofNullable(mirrorRepository.getAvailableMirrors(validAccount.getUserID()))
                    .map( mirrorList -> ResponseEntity.ok().body(mirrorList) )
                    .orElseGet( () -> ResponseEntity.notFound().build() );
        }
        return ResponseEntity.notFound().build();
    }

     */
}
