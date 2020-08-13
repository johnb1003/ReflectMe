package com.reflectme.server.repository;

import com.reflectme.server.model.Cardio;
import com.reflectme.server.model.Strength;

import java.util.ArrayList;

public interface CardioRepositoryCustom {

    public long createEvent(Cardio event);

    public boolean deleteEvent(Cardio event);

    public ArrayList<Cardio> getWeekEvents(Cardio event);

    public ArrayList<Cardio> getAllWeekEvents(long userid);

    public ArrayList<Cardio> getMonthEvents(Cardio event);
}
