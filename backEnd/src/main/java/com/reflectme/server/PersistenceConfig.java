package com.reflectme.server;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.instrument.classloading.InstrumentationLoadTimeWeaver;
import org.springframework.instrument.classloading.ReflectiveLoadTimeWeaver;
import org.springframework.orm.jpa.LocalContainerEntityManagerFactoryBean;

import javax.persistence.EntityManagerFactory;
import javax.sql.DataSource;
import java.util.Properties;

@Configuration
public class PersistenceConfig {
    @Autowired
    DataSource dataSource;

    @Bean
    public LocalContainerEntityManagerFactoryBean emf(){

        LocalContainerEntityManagerFactoryBean emf = new LocalContainerEntityManagerFactoryBean();
        emf.setPersistenceProviderClass(org.hibernate.jpa.HibernatePersistenceProvider.class); //If your using eclipse or change it to whatever you're using
        emf.setPackagesToScan("com.reflectme.server"); //The packages to search for Entities, line required to avoid looking into the persistence.xml
        emf.setPersistenceUnitName("PERSISTENCE");
        emf.setDataSource(dataSource);
        emf.setLoadTimeWeaver(new InstrumentationLoadTimeWeaver()); //required unless you know what your doing
        return emf;
    }

}
