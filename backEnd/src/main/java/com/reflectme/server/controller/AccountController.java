package com.reflectme.server.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.validation.Valid;

import com.reflectme.server.model.AccountLogin;
import com.reflectme.server.model.FullAccount;
import com.reflectme.server.service.AccountService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.reflectme.server.exception.ResourceNotFoundException;
import com.reflectme.server.model.Account;
import com.reflectme.server.repository.AccountRepository;

@RestController
@RequestMapping("/api/v1")
public class AccountController {

    @Autowired
    private AccountRepository accountRepository;

    @Autowired
    private AccountService accountService;

    @GetMapping("/accounts")
    public List<Account> getAllEmployees() {
        return accountRepository.findAll();
    }

    @GetMapping("/accounts/{email}")
    public ResponseEntity<Account> getAccountByEmail(@PathVariable(value = "email") String email)
            throws ResourceNotFoundException {
        Account account = accountRepository.getAccountByEmail(email).orElseThrow(() ->
                new ResourceNotFoundException("Account not found for this email: " + email));
        return ResponseEntity.ok().body(account);
    }

    @PostMapping("/accounts/signup")
    public ResponseEntity<Account> createAccount(@Valid @RequestBody FullAccount fullAccount) {
        return ResponseEntity.ok(accountService.createAccount(fullAccount));
    }

    @GetMapping("/accounts/login")
    public ResponseEntity<Account> verifyLogin(@Valid @RequestBody AccountLogin login)
            throws ResourceNotFoundException {
        return ResponseEntity.ok(accountService.verifyLogin(login));
    }

    @PutMapping("/accounts/{userID}")
    public ResponseEntity<Account> updateAccount(@PathVariable(value = "userID") Long userID,
                                                 @Valid @RequestBody Account accountDetails) throws ResourceNotFoundException {
        Account account = accountRepository.findById(userID)
                .orElseThrow(() -> new ResourceNotFoundException("Account not found for this id :: " + userID));

        account.setfName(accountDetails.getfName());
        account.setlName(accountDetails.getlName());
        account.setemail(accountDetails.getemail());
        account.setphoneNum(accountDetails.getphoneNum());
        final Account updatedAccount = accountRepository.save(account);
        return ResponseEntity.ok(updatedAccount);
    }

    @DeleteMapping("/accounts/{userID}")
    public Map<String, Boolean> deleteAccount(@PathVariable(value = "userID") Long userID)
            throws ResourceNotFoundException {
        Account account = accountRepository.findById(userID)
                .orElseThrow(() -> new ResourceNotFoundException("Account not found for this id :: " + userID));

        accountRepository.delete(account);
        Map<String, Boolean> response = new HashMap<>();
        response.put("deleted", Boolean.TRUE);
        return response;
    }
}
