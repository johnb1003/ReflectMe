package com.reflectme.server.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.reflectme.server.model.CardioWeek;

@Repository
public interface CardioWeekRepository extends JpaRepository<CardioWeek, Long>, CardioWeekRepositoryCustom{

}
