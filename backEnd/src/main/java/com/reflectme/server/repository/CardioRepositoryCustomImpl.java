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


    @Override
    public long createEvent(Cardio event) {
        entityManager = emf.getObject().createEntityManager();
        entityManager.getTransaction().begin();

        Map<String, Object> parameters = new HashMap<String, Object>();
        parameters.put("userid", event.getuserid());
        parameters.put("date", event.getdate());
        parameters.put("dayofweek", event.getdayofweek());
        parameters.put("cardiotype", event.getcardiotype());
        parameters.put("distance", event.getdistance());
        parameters.put("time", event.gettime());
        parameters.put("status", event.getstatus());
        parameters.put("weekid", event.getweekid());

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
