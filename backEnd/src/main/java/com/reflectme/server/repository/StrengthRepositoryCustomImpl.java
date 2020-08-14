package com.reflectme.server.repository;

import com.reflectme.server.model.Cardio;
import com.reflectme.server.model.Strength;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.namedparam.BeanPropertySqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.jdbc.core.namedparam.SqlParameterSource;
import org.springframework.jdbc.core.simple.SimpleJdbcInsert;
import org.springframework.orm.jpa.LocalContainerEntityManagerFactoryBean;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import java.time.LocalDate;
import java.util.ArrayList;
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
    public boolean updateEvent(Strength event) {
        entityManager = emf.getObject().createEntityManager();
        entityManager.getTransaction().begin();

        String sql = "UPDATE strength " +
                "SET date=:date, dayofweek=:dayofweek, strengthtype=:strengthtype, " +
                "status=:status, lifts=:lifts, weekid=:weekid " +
                "WHERE strengthid=:strengthid";

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

    @Override
    public ArrayList<Strength> getWeekEvents(Strength event) {
        entityManager = emf.getObject().createEntityManager();
        entityManager.getTransaction().begin();

        String sql = "SELECT * FROM strength WHERE weekid=:weekid AND userid=:userid";

        ArrayList<Strength> result = null;

        SqlParameterSource parameters = new BeanPropertySqlParameterSource(event);

        try {
            result = new ArrayList<Strength>(namedParameterJdbcTemplate.query(sql, parameters,
                    new BeanPropertyRowMapper(Strength.class)));
        }
        catch (Exception e) {
            System.out.println(e.toString());
        }

        entityManager.close();

        return result;
    }

    @Override
    public ArrayList<Strength> getAllWeekEvents(long userid) {
        entityManager = emf.getObject().createEntityManager();
        entityManager.getTransaction().begin();

        String sql = "SELECT * FROM strength WHERE weekid IS NOT NULL AND userid=:userid ORDER BY weekid ASC";

        ArrayList<Strength> result = null;

        Map<String, Object> parameters = new HashMap<String, Object>();
        parameters.put("userid", userid);

        try {
            result = new ArrayList<Strength>(namedParameterJdbcTemplate.query(sql, parameters,
                    new BeanPropertyRowMapper(Strength.class)));
        }
        catch (Exception e) {
            System.out.println(e.toString());
        }

        entityManager.close();

        return result;
    }

    @Override
    public ArrayList<Strength> getMonthEvents(long userid, LocalDate date) {

        entityManager = emf.getObject().createEntityManager();
        entityManager.getTransaction().begin();

        String sql = "SELECT * from strength " +
                "where userid=:userid AND weekid IS NULL " +
                "AND (date_part('year', date)=date_part('year', :date) " +
                "AND date_part('month', date)=date_part('month', :date)) " +
                "ORDER BY date ASC";

        ArrayList<Strength> result = null;

        Map<String, Object> parameters = new HashMap<String, Object>();
        parameters.put("userid", userid);
        parameters.put("date", date);

        try {
            result = new ArrayList<Strength>(namedParameterJdbcTemplate.query(sql, parameters,
                    new BeanPropertyRowMapper(Strength.class)));
        }
        catch (Exception e) {
            System.out.println(e.toString());
        }

        entityManager.close();

        return result;
    }
}
