package com.reflectme.server.service;

import com.reflectme.server.exception.ResourceNotFoundException;
import com.reflectme.server.model.Account;
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
import org.springframework.security.crypto.bcrypt.BCrypt;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.keygen.KeyGenerators;
import org.springframework.security.crypto.keygen.StringKeyGenerator;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.sql.SQLException;
import java.util.Optional;

@Service
public class AccountService {

    private AccountRepository accountRepo;
    private MirrorRepository mirrorRepository;
    private BCryptPasswordEncoder bCryptPasswordEncoder;

    @Autowired
    public AccountService(AccountRepository accountRepo, MirrorRepository mirrorRepository,
                          BCryptPasswordEncoder bCryptPasswordEncoder) {
        this.accountRepo = accountRepo;
        this.mirrorRepository = mirrorRepository;
        this.bCryptPasswordEncoder = bCryptPasswordEncoder;
    }

    public ResponseEntity createAccount(Account rawAccount) {
        try {
            rawAccount.setPassword(bCryptPasswordEncoder.encode(rawAccount.getPassword()));
            return Optional
                    .ofNullable(accountRepo.saveAccount(rawAccount))
                    .map(account -> ResponseEntity.ok().body(rawAccount.dropPassword()))
                    .orElseGet(() -> ResponseEntity.notFound().build());
        }
        catch(DataIntegrityViolationException e) {      // Catch exception for when email already exists
            if (e.getMostSpecificCause().getClass().getName().equals("org.postgresql.util.PSQLException") &&
                    ((SQLException) e.getMostSpecificCause()).getSQLState().equals("23505")) {
                return ResponseEntity.status(HttpStatus.CONFLICT).body("Error: Email already linked to account");
            }
            else {
                return ResponseEntity.status(HttpStatus.CONFLICT).body("Error: Account was not created");
            }
        }
    }

    public Account verifyLogin(Account acc) {
        // Catch if email doesn't exist
        String rawPassword = acc.getPassword();
        String encryptedPassword = "";
        try {
            encryptedPassword = accountRepo.getPassword(acc.getEmail());
        }
        catch (Exception e){
            //return ResponseEntity.status(HttpStatus.CONFLICT).body("Error: Email not linked to an account");
            return null;
        }

        if(encryptedPassword == null) {
            //return ResponseEntity.status(HttpStatus.CONFLICT).body("Error: Email not linked to an account");
            return null;
        }
        //
        else if(bCryptPasswordEncoder.matches(acc.getPassword(), encryptedPassword)) {
            /*
            return Optional
                    .ofNullable(accountRepo.getAccountByEmail(acc.getEmail()))
                    .map( account -> ResponseEntity.ok().body(account.dropPassword()) )
                    .orElseGet( () -> ResponseEntity.notFound().build() );
             */
            return acc.dropPassword();
        }
        else {
            //return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Error: Incorrect password");
            return null;
        }
    }

    public ResponseEntity getAccountByID(long id) {
        return Optional
                .ofNullable(accountRepo.getAccountById(id))
                .map( account -> ResponseEntity.ok().body(account.dropPassword()) )
                .orElseGet( () -> ResponseEntity.notFound().build() );
    }

    public ResponseEntity getAccountByEmail(String email) {
        return Optional
                .ofNullable(accountRepo.getAccountByEmail(email))
                .map( account -> ResponseEntity.ok().body(account.dropPassword()) )
                .orElseGet( () -> ResponseEntity.notFound().build() );
    }

    public String emailExists(String email) {
        Account response = accountRepo.getAccountByEmail(email);
        if (response != null) {
            return "true";
        }
        else {
            return "false";
        }
    }
}
