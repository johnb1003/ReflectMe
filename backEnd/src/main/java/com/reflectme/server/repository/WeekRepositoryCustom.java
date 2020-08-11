package com.reflectme.server.repository;

import com.reflectme.server.model.Week;
import org.springframework.data.jpa.repository.Query;

public interface WeekRepositoryCustom {

    public long createWeek(Week week);

    @Query(value = "DELETE FROM weeks " +
            "WHERE weekid=:weekID AND userID=:userID" +
            "RETURNING *", nativeQuery = true)
    public Week deleteWeek(long weekID, long userID);
}