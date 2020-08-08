package com.reflectme.server.repository;

import com.reflectme.server.JPAUtil;
import com.reflectme.server.model.CardioWeek;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.Query;
import java.util.ArrayList;

@Repository
public class CardioWeekRepositoryCustomImpl implements CardioWeekRepositoryCustom{

    @PersistenceContext
    private EntityManager entityManager;

    @Transactional
    @Modifying(clearAutomatically = true)
    @Override
    public CardioWeek createWeek(long userID, boolean active, String name) {
        entityManager = JPAUtil.getEntityManagerFactory().createEntityManager();
        entityManager.getTransaction().begin();

        String queryString = "INSERT INTO cardio_week(userID, active, name) " +
                "VALUES(:userID, :active, :name) " +
                "RETURNING *";

        Query query = entityManager.createNativeQuery(queryString, CardioWeek.class);
        query.setParameter("userID", userID);
        query.setParameter("active", active);
        query.setParameter("name", name);

        CardioWeek newWeek = (CardioWeek)query.getResultList()
                .stream().findFirst().orElse(null);

        entityManager.close();

        return newWeek;
    }
}
