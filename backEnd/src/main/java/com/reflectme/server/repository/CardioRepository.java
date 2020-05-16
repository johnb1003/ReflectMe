package com.reflectme.server.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.reflectme.server.model.Cardio;

@Repository
public interface CardioRepository extends JpaRepository<Cardio, Long>{

}
