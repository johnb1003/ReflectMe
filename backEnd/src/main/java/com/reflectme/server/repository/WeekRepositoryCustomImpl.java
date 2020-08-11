package com.reflectme.server.repository;

import com.reflectme.server.JPAUtil;
import com.reflectme.server.model.Week;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.jdbc.core.simple.SimpleJdbcInsert;
import org.springframework.orm.jpa.LocalContainerEntityManagerFactoryBean;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.Query;
import java.util.HashMap;
import java.util.Map;

@Repository
public class WeekRepositoryCustomImpl implements WeekRepositoryCustom {

    @PersistenceContext
    private EntityManager entityManager;

    @Autowired
    private LocalContainerEntityManagerFactoryBean emf;

    @Autowired
    SimpleJdbcInsert simpleJdbcInsertWeek;

    @Override
    public long createWeek(Week week) {
        entityManager = emf.getObject().createEntityManager();
        entityManager.getTransaction().begin();

        Number result = null;

        Map<String, Object> parameters = new HashMap<String, Object>();
        parameters.put("userid", week.getUserid());
        parameters.put("active", week.getActive());
        parameters.put("name", week.getName());

        try {
            result = simpleJdbcInsertWeek.executeAndReturnKey(parameters);
            System.out.println("Generated id - " + result.longValue());
        }
        catch (Exception e) {
            System.out.println(e.toString());
        }

        entityManager.close();

        return result.longValue();
    }

    @Modifying(clearAutomatically = true)
    @Override
    public Week deleteWeek(long weekID, long userID) {
        entityManager = JPAUtil.getEntityManagerFactory().createEntityManager();
        entityManager.getTransaction().begin();

        String queryString = "DELETE FROM weeks " +
                "WHERE weekid=:weekID AND userID=:userID" +
                "RETURNING *";

        Query query = entityManager.createNativeQuery(queryString, Week.class);
        query.setParameter("weekID", weekID);
        query.setParameter("userID", userID);

        Week deletedWeek = (Week)query.getResultList()
                .stream().findFirst().orElse(null);

        entityManager.close();

        return deletedWeek;
    }
}
