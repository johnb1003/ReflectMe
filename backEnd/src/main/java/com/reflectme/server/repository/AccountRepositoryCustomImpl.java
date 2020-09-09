package com.reflectme.server.repository;

import com.reflectme.server.JPAUtil;
import com.reflectme.server.model.Account;
import com.reflectme.server.model.Cardio;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.jdbc.core.simple.SimpleJdbcInsert;
import org.springframework.orm.jpa.LocalContainerEntityManagerFactoryBean;
import org.springframework.stereotype.Repository;

import javax.persistence.EntityManager;
import javax.persistence.EntityManagerFactory;
import javax.persistence.PersistenceContext;
import javax.persistence.Query;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Repository
public class AccountRepositoryCustomImpl implements AccountRepositoryCustom{

    @PersistenceContext
    private EntityManager entityManager;

    @Autowired
    private LocalContainerEntityManagerFactoryBean emf;

    @Autowired
    private SimpleJdbcInsert simpleJdbcInsertAccount;

    @Override
    public Account getAccountByEmail(String email) {
        //entityManager = JPAUtil.getEntityManagerFactory().createEntityManager();
        entityManager = emf.getObject().createEntityManager();
        //entityManager.getTransaction().begin();

        String queryString = "select * " +
                             "from Account a " +
                             "where a.email = :email";

        Query query = entityManager.createNativeQuery(queryString, Account.class);
        query.setParameter("email", email);

        Account account = (Account)query.getResultList()
                .stream().findFirst().orElse(null);

        entityManager.close();

        return account.dropPassword();
    }

    @Override
    public Account getFullAccountByEmail(String email) {
        entityManager = emf.getObject().createEntityManager();
        //entityManager = JPAUtil.getEntityManagerFactory().createEntityManager();
        //entityManager.getTransaction().begin();

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

    @Override
    public Account getAccountById(long id) {
        entityManager = emf.getObject().createEntityManager();
        //entityManager = JPAUtil.getEntityManagerFactory().createEntityManager();
        //entityManager.getTransaction().begin();

        String queryString = "select * " +
                "from Account a " +
                "where a.userID = :id";

        Query query = entityManager.createNativeQuery(queryString, Account.class);
        query.setParameter("id", id);

        Account account = (Account)query.getResultList()
                .stream().findFirst().orElse(null);

        entityManager.close();

        return account.dropPassword();
    }

    @Override
    public Account getFullAccountById(String id) {
        entityManager = emf.getObject().createEntityManager();
        //entityManager = JPAUtil.getEntityManagerFactory().createEntityManager();
        //entityManager.getTransaction().begin();

        String queryString = "select * " +
                "from Account a " +
                "where a.userID = :id";

        Query query = entityManager.createNativeQuery(queryString, Account.class);
        query.setParameter("id", id);

        Account account = (Account)query.getResultList()
                .stream().findFirst().orElse(null);

        entityManager.close();

        return account;
    }

    @Override
    public String getPassword(String email) {
        entityManager = emf.getObject().createEntityManager();
        //entityManager = JPAUtil.getEntityManagerFactory().createEntityManager();
        //entityManager.getTransaction().begin();

        String queryString = "select a.password " +
                "from Account a " +
                "where a.email = :email";

        Query query = entityManager.createNativeQuery(queryString, String.class);
        query.setParameter("email", email);

        String password = (String)query.getResultList()
                .stream().findFirst().orElse(null);

        entityManager.close();

        return password;
    }

    @Override
    public int saveAccount(String fname, String lname, String email, String phonenum, String password) {
        entityManager = emf.getObject().createEntityManager();

        String queryString = "INSERT INTO account (fname, lname, email, phonenum, password) " +
                "VALUES(:fname, :lname, :email, :phonenum, :password)";

        Query query = entityManager.createNativeQuery(queryString, Account.class);
        query.setParameter("fname", fname);
        query.setParameter("lname", lname);
        query.setParameter("email", email);
        query.setParameter("phonenum", phonenum);
        query.setParameter("password", password);
        int rows = query.executeUpdate();

        entityManager.close();

        return rows;
    }

    @Override
    public long saveAccount(Account account) {
        entityManager = emf.getObject().createEntityManager();

        Map<String, Object> parameters = new HashMap<String, Object>();

        parameters.put("fname", account.getfName());
        parameters.put("lname", account.getlName());
        parameters.put("email", account.getEmail());
        parameters.put("phonenum", account.getPhoneNum());
        parameters.put("password", account.getPassword());

        Number result = simpleJdbcInsertAccount.executeAndReturnKey(parameters);
        //System.out.println("Generated id - " + result.longValue());

        entityManager.close();

        return result.longValue();
    }
}
