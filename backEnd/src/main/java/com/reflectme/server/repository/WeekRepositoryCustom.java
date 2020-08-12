package com.reflectme.server.repository;

import com.reflectme.server.model.Strength;
import com.reflectme.server.model.Week;
import org.springframework.data.jpa.repository.Query;

public interface WeekRepositoryCustom {

    public long createWeek(Week week);

    public boolean deleteEvent(Week event);
}