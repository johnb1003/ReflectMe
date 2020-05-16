package com.reflectme.server.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.reflectme.server.model.Strength;

@Repository
public interface StrengthRepository extends JpaRepository<Strength, Long>{

}
