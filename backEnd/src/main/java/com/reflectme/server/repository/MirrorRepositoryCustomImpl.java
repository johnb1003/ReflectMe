package com.reflectme.server.repository;

import com.reflectme.server.model.Mirror;
import com.reflectme.server.repository.MirrorRepositoryCustom;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.jdbc.core.simple.SimpleJdbcInsert;
import org.springframework.orm.jpa.LocalContainerEntityManagerFactoryBean;
import org.springframework.stereotype.Repository;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;


@Repository
public class MirrorRepositoryCustomImpl implements MirrorRepositoryCustom {

    @PersistenceContext
    private EntityManager entityManager;

    @Autowired
    private LocalContainerEntityManagerFactoryBean emf;

    @Autowired
    SimpleJdbcInsert simpleJdbcInsertMirror;

    @Autowired
    NamedParameterJdbcTemplate namedParameterJdbcTemplate;

    @Override
    public long registerMirror(Mirror mirror) {
        entityManager = emf.getObject().createEntityManager();

        Number result = null;

        Map<String, Object> parameters = new HashMap<String, Object>();
        parameters.put("userid", mirror.getUserid());
        parameters.put("name", mirror.getName());

        try {
            result = simpleJdbcInsertMirror.executeAndReturnKey(parameters);
            System.out.println("Generated id - " + result.longValue());
        }
        catch (Exception e) {
            System.out.println(e.toString());
        }

        entityManager.close();

        return result.longValue();
    }
}
