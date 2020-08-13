package com.reflectme.server.repository;

import com.reflectme.server.JPAUtil;
import com.reflectme.server.model.Account;
import com.reflectme.server.model.Cardio;
import com.reflectme.server.model.Strength;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.namedparam.BeanPropertySqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.jdbc.core.namedparam.SqlParameterSource;
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

    @Autowired
    NamedParameterJdbcTemplate namedParameterJdbcTemplate;

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
    public boolean deleteEvent(Cardio event) {
        entityManager = emf.getObject().createEntityManager();
        entityManager.getTransaction().begin();

        String sql = "DELETE FROM cardio WHERE cardioid=:cardioid AND userid=:userid";

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
    public ArrayList<Cardio> getWeekEvents(Cardio event) {
        entityManager = emf.getObject().createEntityManager();
        entityManager.getTransaction().begin();

        String sql = "SELECT * FROM cardio WHERE weekid=:weekid AND userid=:userid ORDER BY weekid";

        ArrayList<Cardio> result = null;

        SqlParameterSource parameters = new BeanPropertySqlParameterSource(event);

        try {
            result = new ArrayList<Cardio>(namedParameterJdbcTemplate.query(sql, parameters,
                    new BeanPropertyRowMapper(Cardio.class)));
        }
        catch (Exception e) {
            System.out.println(e.toString());
        }

        entityManager.close();

        return result;
    }

    @Override
    public ArrayList<Cardio> getAllWeekEvents(long userid) {
        entityManager = emf.getObject().createEntityManager();
        entityManager.getTransaction().begin();

        String sql = "SELECT * FROM cardio WHERE weekid IS NOT NULL AND userid=:userid ORDER BY weekid ASC";

        ArrayList<Cardio> result = null;

        Map<String, Object> parameters = new HashMap<String, Object>();
        parameters.put("userid", userid);

        try {
            result = new ArrayList<Cardio>(namedParameterJdbcTemplate.query(sql, parameters,
                    new BeanPropertyRowMapper(Cardio.class)));
        }
        catch (Exception e) {
            System.out.println(e.toString());
        }

        entityManager.close();

        return result;
    }

    @Override
    public ArrayList<Cardio> getMonthEvents(long userid, LocalDate date) {
        entityManager = emf.getObject().createEntityManager();
        entityManager.getTransaction().begin();

        String sql = "SELECT * from cardio " +
                "where userid=:userid AND weekid IS NULL " +
                "AND (date_part('year', date)=date_part('year', :date) " +
                "AND date_part('month', date)=date_part('month', :date)) " +
                "ORDER BY date ASC";

        ArrayList<Cardio> result = null;

        Map<String, Object> parameters = new HashMap<String, Object>();
        parameters.put("userid", userid);
        parameters.put("date", date);

        try {
            result = new ArrayList<Cardio>(namedParameterJdbcTemplate.query(sql, parameters,
                    new BeanPropertyRowMapper(Cardio.class)));
        }
        catch (Exception e) {
            System.out.println(e.toString());
        }

        entityManager.close();

        return result;
    }
}
