package com.reflectme.server.repository;

import com.reflectme.server.model.Cardio;
import com.reflectme.server.model.CardioWeek;
import org.springframework.data.jpa.repository.Query;

import java.util.ArrayList;

public interface CardioRepositoryCustom {

    @Query(value = "INSERT INTO cardio_week(userID, active, name) " +
            "VALUES(:userID, :active, :name)", nativeQuery = true)
    public CardioWeek createWeek(CardioWeek week);

    @Query(value = "select * " +
            "from Cardio c where c.userID = :id and status = \"completed\" " +
            "order by c.date", nativeQuery = true)
    public ArrayList<Cardio> getCompletedCardioListForUser(long id);

    @Query(value = "select * " +
            "from Cardio c where c.userID = :id and status = \"scheduled\" " +
            "order by c.dayOfWeek", nativeQuery = true)
    public ArrayList<Cardio> getScheduledCardioListForUser(long id);
}
