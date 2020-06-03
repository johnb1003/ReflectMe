package com.reflectme.server.repository;

import com.reflectme.server.JPAUtil;
import com.reflectme.server.model.Account;
import com.reflectme.server.model.AccountLogin;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.Query;
import java.util.Optional;

public class AccountLoginRepositoryCustomImpl implements AccountLoginRepositoryCustom{

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public AccountLogin getLogin(String email) {
        entityManager = JPAUtil.getEntityManagerFactory().createEntityManager();
        entityManager.getTransaction().begin();

        String queryString = "select * " +
                "from AccountLogin al " +
                "where al.email = :email";

        Query query = entityManager.createNativeQuery(queryString, Account.class);
        query.setParameter("email", email);

        AccountLogin login = (AccountLogin)query.getResultList()
                .stream().findFirst().orElse(null);

        entityManager.close();

        return login;
    }
}
