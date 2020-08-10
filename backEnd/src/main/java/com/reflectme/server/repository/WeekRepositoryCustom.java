package com.reflectme.server.repository;

import com.reflectme.server.model.Week;
import org.springframework.data.jpa.repository.Query;

public interface WeekRepositoryCustom {

    @Query(value = "INSERT INTO cardio_week(userID, active, name) " +
            "VALUES(:userID, :active, :name) " +
            "RETURNING *", nativeQuery = true)
    public Week createWeek(long userID, boolean active, String name);

}