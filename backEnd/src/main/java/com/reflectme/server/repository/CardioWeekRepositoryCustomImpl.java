package com.reflectme.server.repository;

import com.reflectme.server.JPAUtil;
import com.reflectme.server.model.CardioWeek;
import org.springframework.stereotype.Repository;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.Query;
import java.util.ArrayList;

@Repository
public class CardioWeekRepositoryCustomImpl implements CardioWeekRepositoryCustom{

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public CardioWeek createWeek(CardioWeek week) {
        entityManager = JPAUtil.getEntityManagerFactory().createEntityManager();
        entityManager.getTransaction().begin();

        String queryString = "INSERT INTO cardio_week(userID, active, name) " +
                "VALUES(:userID, :active, :name)";

        Query query = entityManager.createNativeQuery(queryString, CardioWeek.class);
        query.setParameter("userID", week.getUserid());
        query.setParameter("active", week.getActive());
        query.setParameter("name", week.getName());

        CardioWeek newWeek = (CardioWeek)query.getResultList()
                .stream().findFirst().orElse(null);

        entityManager.close();

        return newWeek;
    }
}
