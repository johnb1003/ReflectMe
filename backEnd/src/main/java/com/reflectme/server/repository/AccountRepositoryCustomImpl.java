package com.reflectme.server.repository;

import com.reflectme.server.JPAUtil;
import com.reflectme.server.model.Account;
import com.reflectme.server.model.Cardio;
import org.springframework.stereotype.Repository;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.Query;
import java.util.Optional;

@Repository
public class AccountRepositoryCustomImpl implements AccountRepositoryCustom{

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public Account getAccountByEmail(String email) {
        entityManager = JPAUtil.getEntityManagerFactory().createEntityManager();
        entityManager.getTransaction().begin();

        String queryString = "select * " +
                             "from Account a " +
                             "where a.email = :email";

        Query query = entityManager.createNativeQuery(queryString, Account.class);
        query.setParameter("email", email);

        Account account = (Account)query.getResultList()
                .stream().findFirst().orElse(null);

        entityManager.close();

        return account;
    }
}
