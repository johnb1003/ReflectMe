package com.reflectme.server.repository;

import com.reflectme.server.JPAUtil;
import com.reflectme.server.model.Account;
import com.reflectme.server.model.Cardio;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.simple.SimpleJdbcInsert;
import org.springframework.orm.jpa.LocalContainerEntityManagerFactoryBean;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.EntityManager;
import javax.persistence.EntityManagerFactory;
import javax.persistence.PersistenceContext;
import javax.persistence.Query;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

@Repository
public class CardioRepositoryCustomImpl implements CardioRepositoryCustom{

    @PersistenceContext
    private EntityManager entityManager;

    @Autowired
    private LocalContainerEntityManagerFactoryBean emf;

    @Autowired
    SimpleJdbcInsert simpleJdbcInsertCardio;


    @Modifying
    @Transactional
    @Override
    public long createEvent(long userid, LocalDate date, int dayofweek, String cardiotype,
                              double distance, int time, String status, long weekid) {
        entityManager = emf.getObject().createEntityManager();
        entityManager.getTransaction().begin();

        System.out.println("HERE REPO");

        String queryString = "INSERT INTO cardio (userid, date, dayofweek, cardiotype, distance, time, status, weekid) "+
                "VALUES(:userid, :date, :dayofweek, :cardiotype, :distance, :time, :status, :weekid)";

        /*
        Query query = entityManager.createNativeQuery(queryString, Cardio.class);
        query.setParameter("userid", userid);
        query.setParameter("date", date);
        query.setParameter("dayofweek", dayofweek);
        query.setParameter("cardiotype", cardiotype);
        query.setParameter("distance", distance);
        query.setParameter("time", time);
        query.setParameter("status", status);
        query.setParameter("weekid", weekid);

        Cardio cardio = (Cardio)query.getSingleResult();
         */

        Map<String, Object> parameters = new HashMap<String, Object>();
        parameters.put("userid", userid);
        parameters.put("date", date);
        parameters.put("dayofweek", dayofweek);
        parameters.put("cardiotype", cardiotype);
        parameters.put("distance", distance);
        parameters.put("time", time);
        parameters.put("status", status);
        parameters.put("weekid", weekid);

        Number result = simpleJdbcInsertCardio.executeAndReturnKey(parameters);
        System.out.println("Generated id - " + result.longValue());

        entityManager.close();

        return result.longValue();
    }


    @Override
    public ArrayList<Cardio> getCompletedCardioListForUser(long id) {
        entityManager = JPAUtil.getEntityManagerFactory().createEntityManager();
        entityManager.getTransaction().begin();

        ArrayList<Cardio> cardioList;

        String queryString = "select * " +
                "from Cardio c where c.userID = :id and status = \"completed\" " +
                "order by c.date";

        Query query = entityManager.createNativeQuery(queryString, Cardio.class);
        query.setParameter("id", Long.toString(id));

        cardioList = new ArrayList<Cardio>(query.getResultList());

        entityManager.close();

        return cardioList;
    }

    @Override
    public ArrayList<Cardio> getScheduledCardioListForUser(long id) {
        entityManager = JPAUtil.getEntityManagerFactory().createEntityManager();
        entityManager.getTransaction().begin();

        ArrayList<Cardio> cardioList;

        String queryString = "select * " +
                "from Cardio c where c.userID = :id and status = \"scheduled\" " +
                "order by c.dayOfWeek";

        Query query = entityManager.createNativeQuery(queryString, Cardio.class);

        cardioList = new ArrayList<Cardio>(query.getResultList());

        entityManager.close();

        return cardioList;
    }
}
