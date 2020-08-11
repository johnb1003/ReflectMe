package com.reflectme.server.repository;

import com.reflectme.server.model.Cardio;
import com.reflectme.server.model.Strength;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.simple.SimpleJdbcInsert;
import org.springframework.orm.jpa.LocalContainerEntityManagerFactoryBean;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import java.util.HashMap;
import java.util.Map;

public class StrengthRepositoryCustomImpl implements StrengthRepositoryCustom{

    @PersistenceContext
    private EntityManager entityManager;

    @Autowired
    private LocalContainerEntityManagerFactoryBean emf;

    @Autowired
    SimpleJdbcInsert simpleJdbcInsertStrength;

    @Override
    public long createEvent(Strength event) {
        entityManager = emf.getObject().createEntityManager();
        entityManager.getTransaction().begin();

        Map<String, Object> parameters = new HashMap<String, Object>();
        parameters.put("userid", event.getuserid());
        parameters.put("date", event.getdate());
        parameters.put("dayofweek", event.getdayofweek());
        parameters.put("strengthtype", event.getstrengthtype());
        parameters.put("status", event.getstatus());
        parameters.put("lifts", event.getlifts());
        parameters.put("weekid", event.getweekid());

        try {
            Number result = simpleJdbcInsertStrength.executeAndReturnKey(parameters);
            System.out.println("Generated id - " + result.longValue());
        }
        catch (Exception e) {
            System.out.println(e.toString());
        }

        entityManager.close();

        return result.longValue();
    }
}
