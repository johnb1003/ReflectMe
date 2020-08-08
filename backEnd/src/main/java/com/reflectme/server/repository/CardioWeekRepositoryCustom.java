package com.reflectme.server.repository;

import com.reflectme.server.model.CardioWeek;
import org.springframework.data.jpa.repository.Query;

public interface CardioWeekRepositoryCustom {

    @Query(value = "INSERT INTO cardio_week(userID, active, name) " +
            "VALUES(:userID, :active, :name)", nativeQuery = true)
    public CardioWeek createWeek(long userID, boolean active, String name);

}