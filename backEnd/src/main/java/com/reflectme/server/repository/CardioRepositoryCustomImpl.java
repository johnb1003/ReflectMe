package com.reflectme.server.repository;

import com.reflectme.server.JPAUtil;
import com.reflectme.server.model.Cardio;
import org.springframework.stereotype.Repository;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.Query;
import java.util.ArrayList;

@Repository
public class CardioRepositoryCustomImpl implements CardioRepositoryCustom{

    @PersistenceContext
    private EntityManager entityManager;

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
