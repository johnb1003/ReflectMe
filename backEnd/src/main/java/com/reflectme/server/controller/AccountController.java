package com.reflectme.server.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.reflectme.server.exception.ResourceNotFoundException;
import com.reflectme.server.model.Account;
import com.reflectme.server.repository.AccountRepository;

@RestController
@RequestMapping("/api/v1")
public class AccountController {

    @Autowired
    private AccountRepository accountRepository;

    @GetMapping("/accounts")
    public List<Account> getAllEmployees() {
        return accountRepository.findAll();
    }

    @GetMapping("/accounts/{userID}")
    public ResponseEntity<Account> getAccountById(@PathVariable(value = "userID") Long userID)
            throws ResourceNotFoundException {
        Account account = accountRepository.findById(userID).orElseThrow(() ->
                new ResourceNotFoundException("Account not found for this id :: " + userID));
        return ResponseEntity.ok().body(account);
    }

    @PostMapping("/accounts")
    public Account createAccount(@Valid @RequestBody Account account) {
        return accountRepository.save(account);
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
