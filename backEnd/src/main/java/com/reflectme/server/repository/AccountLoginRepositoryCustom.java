package com.reflectme.server.repository;

import com.reflectme.server.model.AccountLogin;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;

public interface AccountLoginRepositoryCustom {
    @Query(value = "select * " +
            "from AccountLogin al " +
            "where al.email = :email", nativeQuery = true)
    public AccountLogin getLogin(String email);
}
