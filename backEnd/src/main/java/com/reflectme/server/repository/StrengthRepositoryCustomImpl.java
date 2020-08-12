package com.reflectme.server.repository;

import com.reflectme.server.model.Cardio;
import com.reflectme.server.model.Strength;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.namedparam.BeanPropertySqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.jdbc.core.namedparam.SqlParameterSource;
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

    @Autowired
    NamedParameterJdbcTemplate namedParameterJdbcTemplate;

    @Override
    public long createEvent(Strength event) {
        entityManager = emf.getObject().createEntityManager();
        entityManager.getTransaction().begin();

        Number result = null;

        Map<String, Object> parameters = new HashMap<String, Object>();
        parameters.put("userid", event.getuserid());
        parameters.put("date", event.getdate());
        parameters.put("dayofweek", event.getdayofweek());
        parameters.put("strengthtype", event.getstrengthtype());
        parameters.put("status", event.getstatus());
        parameters.put("lifts", event.getlifts());
        parameters.put("weekid", event.getweekid());

        try {
            result = simpleJdbcInsertStrength.executeAndReturnKey(parameters);
            System.out.println("Generated id - " + result.longValue());
        }
        catch (Exception e) {
            System.out.println(e.toString());
        }

        entityManager.close();

        return result.longValue();
    }

    @Override
    public boolean deleteEvent(Strength event) {
        entityManager = emf.getObject().createEntityManager();
        entityManager.getTransaction().begin();

        String sql = "DELETE FROM strength WHERE strengthid=:strengthid AND userid=:userid";

        int result = 0;

        SqlParameterSource parameters = new BeanPropertySqlParameterSource(event);

        try {
            result = namedParameterJdbcTemplate.update(sql, parameters);
        }
        catch (Exception e) {
            System.out.println(e.toString());
        }

        entityManager.close();

        return result == 1;
    }
}
