package com.reflectme.server;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.instrument.classloading.InstrumentationLoadTimeWeaver;
import org.springframework.instrument.classloading.ReflectiveLoadTimeWeaver;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.jdbc.core.simple.SimpleJdbcInsert;
import org.springframework.orm.hibernate5.LocalSessionFactoryBean;
import org.springframework.orm.jpa.LocalContainerEntityManagerFactoryBean;
import org.springframework.orm.jpa.vendor.HibernateJpaVendorAdapter;

import javax.persistence.EntityManagerFactory;
import javax.sql.DataSource;
import java.util.Properties;

@Configuration
public class PersistenceConfig {
    @Autowired
    DataSource dataSource;

    @Bean
    public LocalContainerEntityManagerFactoryBean entityManagerFactory() {
        //JpaVendorAdapteradapter can be autowired as well if it's configured in application properties.
        HibernateJpaVendorAdapter vendorAdapter = new HibernateJpaVendorAdapter();
        vendorAdapter.setGenerateDdl(false);

        LocalContainerEntityManagerFactoryBean factory = new LocalContainerEntityManagerFactoryBean();
        factory.setJpaVendorAdapter(vendorAdapter);
        //Add package to scan for entities.
        factory.setPackagesToScan("com.reflectme.server");
        factory.setDataSource(dataSource);
        return factory;
    }

    @Bean
    public SimpleJdbcInsert simpleJdbcInsertAccount(){
        return new SimpleJdbcInsert(dataSource).withTableName("account")
                .usingGeneratedKeyColumns("userid");
    }

    @Bean
    public SimpleJdbcInsert simpleJdbcInsertCardio(){
        return new SimpleJdbcInsert(dataSource).withTableName("cardio")
                .usingGeneratedKeyColumns("cardioid");
    }

    @Bean
    public SimpleJdbcInsert simpleJdbcInsertStrength(){
        return new SimpleJdbcInsert(dataSource).withTableName("strength")
                .usingGeneratedKeyColumns("strengthid");
    }

    @Bean
    public SimpleJdbcInsert simpleJdbcInsertWeek(){
        return new SimpleJdbcInsert(dataSource).withTableName("weeks")
                .usingGeneratedKeyColumns("weekid");
    }

    @Bean
    public SimpleJdbcInsert simpleJdbcInsertMirror(){
        return new SimpleJdbcInsert(dataSource).withTableName("mirrors")
                .usingGeneratedKeyColumns("mirrorid");
    }

    @Bean
    public NamedParameterJdbcTemplate namedParameterJdbcTemplateJdbcTemplate(){
        return new NamedParameterJdbcTemplate(dataSource);
    }
}
