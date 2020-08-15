package com.reflectme.server.repository;

import com.reflectme.server.model.Account;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

public interface AccountRepositoryCustom {

    @Query(value = "select * " +
            "from Account a " +
            "where a.email = :email", nativeQuery = true)
    public Account getAccountByEmail(String email);

    @Query(value = "select * " +
            "from Account a " +
            "where a.email = :email", nativeQuery = true)
    public Account getFullAccountByEmail(String email);

    @Query(value = "select * " +
            "from Account a " +
            "where a.userID = :id", nativeQuery = true)
    public Account getAccountById(String id);

    @Query(value = "select * " +
            "from Account a " +
            "where a.userID = :id", nativeQuery = true)
    public Account getFullAccountById(String id);

    @Query(value = "select a.password " +
            "from Account a " +
            "where a.email = :email", nativeQuery = true)
    public String getPassword(String email);
    
    @Query(value = "INSERT INTO account (fname, lname, email, phonenum, password) " +
            "VALUES(:fname, :lname, :email, :phonenum, :password)", nativeQuery = true)
    public int saveAccount(String fname, String lname, String email, String phonenum, String password);
}
