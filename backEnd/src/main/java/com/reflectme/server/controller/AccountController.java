package com.reflectme.server.controller;

import javax.validation.Valid;

import com.reflectme.server.service.AccountService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.reflectme.server.exception.ResourceNotFoundException;
import com.reflectme.server.model.Account;
import com.reflectme.server.repository.AccountRepository;

import java.security.Principal;

@RestController
@RequestMapping(value = "/v1/accounts")
public class AccountController {

    @Autowired
    private AccountRepository accountRepository;

    @Autowired
    private AccountService accountService;

    @GetMapping("/test")
    public String testEndpoint() {
        return "It works!";
    }

    @GetMapping("/index")
    public String index() {
        return "index";
    }

    @PostMapping("/signup")
    public ResponseEntity createAccount(@Valid @RequestBody Account acc) {
        return accountService.createAccount(acc);
    }

    @GetMapping("/email")
    public String checkEmail(@RequestParam("email") String email) {
        return accountService.emailExists(email);
    }

    @GetMapping("/info")
    public ResponseEntity getAccount(Principal principal) {
        // HOW TO ACCESS ACCOUNT EMAIL FROM JWT
        return accountService.getAccountByID(Long.parseLong(principal.getName()));
    }

    public AccountService getAccountService() {
        return accountService;
    }
}
