package com.reflectme.server.repository;

import com.reflectme.server.model.Account;
import com.reflectme.server.model.AccountLogin;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AccountLoginRepository extends JpaRepository<AccountLogin, Long>, AccountLoginRepositoryCustom {
}
