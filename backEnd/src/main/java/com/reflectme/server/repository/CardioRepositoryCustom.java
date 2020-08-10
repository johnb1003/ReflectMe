package com.reflectme.server.repository;

import com.reflectme.server.model.Cardio;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDate;
import java.util.ArrayList;

public interface CardioRepositoryCustom {

    @Query(value = "INSERT INTO Cardio(userid, date, dayofweek, cardiotype, distance, " +
                           "time, status, weekid) " +
            "VALUES(:userid, :date, :dayofweek, :cardiotype, :distance, " +
                           ":time, :status, :weekid) " +
            "RETURNING *")
    public Cardio createEvent(long userid, LocalDate date, int dayofweek, String cardiotype,
                              double distance, int time, String status, long weekid);

    @Query(value = "select * " +
            "from Cardio c where c.userID = :id and status = \"completed\" " +
            "order by c.date", nativeQuery = true)
    public ArrayList<Cardio> getCompletedCardioListForUser(long id);

    @Query(value = "select * " +
            "from Cardio c where c.userID = :id and status = \"scheduled\" " +
            "order by c.dayOfWeek", nativeQuery = true)
    public ArrayList<Cardio> getScheduledCardioListForUser(long id);
}
