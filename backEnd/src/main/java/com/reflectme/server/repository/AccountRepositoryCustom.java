package com.reflectme.server.repository;

import com.reflectme.server.model.Account;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;

public interface AccountRepositoryCustom {

    @Query(value = "select * " +
            "from Account a " +
            "where a.email = :email", nativeQuery = true)
    public Optional<Account> getAccountByEmail(String email);
}
