package com.reflectme.server.service;

import com.reflectme.server.exception.ResourceNotFoundException;
import com.reflectme.server.model.Account;
import com.reflectme.server.model.AccountLogin;
import com.reflectme.server.model.FullAccount;
import com.reflectme.server.repository.AccountLoginRepository;
import com.reflectme.server.repository.AccountRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.bcrypt.BCrypt;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AccountService {

    private AccountRepository accountRepo;
    private AccountLoginRepository accountLoginRepo;

    @Autowired
    private PasswordEncoder encoder = new PasswordEncoder() {
        @Override
        public String encode(CharSequence charSequence) {
            return BCrypt.hashpw(charSequence.toString(), BCrypt.gensalt(4));
        }

        @Override
        public boolean matches(CharSequence charSequence, String s) {
            return BCrypt.checkpw(charSequence.toString(), s);
        }
    };

    public AccountService(AccountRepository accountRepo, AccountLoginRepository accountLoginRepo) {
        this.accountRepo = accountRepo;
        this.accountLoginRepo = accountLoginRepo;
    }

    public Account createAccount(FullAccount fullAccount) {
        AccountLogin encodedLogin = new AccountLogin(fullAccount.getLogin().getEmail(),
                encoder.encode(fullAccount.getLogin().getPassword()));
        accountLoginRepo.save(encodedLogin);
        return accountRepo.save(fullAccount.getAccount());
    }

    public Account verifyLogin(AccountLogin login) throws ResourceNotFoundException{
        AccountLogin correctLogin = accountLoginRepo.getLogin(login.getEmail()).orElseThrow(() ->
                new ResourceNotFoundException("Account not found for this email: " + login.getEmail()));

        if(encoder.matches((CharSequence) correctLogin.getPassword(), login.getPassword())) {
            return accountRepo.getAccountByEmail(login.getEmail()).get();
        }
        else {
            return new Account();
        }
    }
}
