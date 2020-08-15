package com.reflectme.server.repository;

import com.reflectme.server.JPAUtil;
import com.reflectme.server.model.Cardio;
import com.reflectme.server.model.Strength;
import com.reflectme.server.model.Week;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.namedparam.BeanPropertySqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.jdbc.core.namedparam.SqlParameterSource;
import org.springframework.jdbc.core.simple.SimpleJdbcInsert;
import org.springframework.orm.jpa.LocalContainerEntityManagerFactoryBean;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.Query;
import java.util.ArrayList;
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

    @Autowired
    NamedParameterJdbcTemplate namedParameterJdbcTemplate;

    @Modifying
    @Transactional
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

    @Modifying
    @Transactional
    @Override
    public boolean deleteEvent(Week event) {
        entityManager = emf.getObject().createEntityManager();
        entityManager.getTransaction().begin();

        String sql = "DELETE FROM weeks WHERE weekid=:weekid AND userid=:userid";

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

    @Override
    public ArrayList<Week> getUserWeeks(long userid) {
        entityManager = emf.getObject().createEntityManager();
        entityManager.getTransaction().begin();

        ArrayList<Week> result = null;

        String sql = "SELECT * FROM weeks WHERE userid=:userid ORDER BY weekid ASC";

        Map<String, Object> parameters = new HashMap<String, Object>();
        parameters.put("userid", userid);

        try {
            System.out.println("HERE 3");
            result = new ArrayList<Week>(namedParameterJdbcTemplate.query(sql, parameters,
                    new BeanPropertyRowMapper(Week.class)));
        }
        catch (Exception e) {
            System.out.println(e.toString());
        }

        entityManager.close();

        return result;
    }
}
