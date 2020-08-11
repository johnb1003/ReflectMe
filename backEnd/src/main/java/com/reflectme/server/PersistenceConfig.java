package com.reflectme.server;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.instrument.classloading.InstrumentationLoadTimeWeaver;
import org.springframework.instrument.classloading.ReflectiveLoadTimeWeaver;
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

    /*
    @Bean
    public EntityManagerFactory entityManagerFactory(){
        Properties properties = new Properties();

        System.out.print(System.getenv("DB_USER"));
        System.out.print(System.getenv("DB_PASSWORD"));
        System.out.print(System.getenv("DB_PORT"));
        System.out.print(System.getenv("DB_ADDRESS"));

        properties.put("javax.persistence.jdbc.driver", "org.postgresql.Driver");
        properties.put("javax.persistence.jdbc.url", "jdbc:postgresql://"+System.getenv("DB_ADDRESS")+":"+System.getenv("DB_PORT")+"/reflectme");
        properties.put("javax.persistence.jdbc.user", System.getenv("DB_USER"));
        properties.put("javax.persistence.jdbc.password", System.getenv("DB_PASSWORD"));

        LocalContainerEntityManagerFactoryBean emf = new LocalContainerEntityManagerFactoryBean();
        emf.setPersistenceProviderClass(org.hibernate.jpa.HibernatePersistenceProvider.class);
        emf.setPackagesToScan("com.reflectme.server");
        emf.setPersistenceUnitName("PERSISTENCE");
        emf.setJpaProperties(properties);
        emf.setDataSource(dataSource);
        emf.setLoadTimeWeaver(new InstrumentationLoadTimeWeaver());
        return emf.getObject();
    }
     */
}
