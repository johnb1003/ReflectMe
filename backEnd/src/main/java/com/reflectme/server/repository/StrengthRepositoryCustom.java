package com.reflectme.server.repository;

import com.reflectme.server.model.Cardio;
import com.reflectme.server.model.Strength;

import java.time.LocalDate;
import java.util.ArrayList;

public interface StrengthRepositoryCustom {

    public long createEvent(Strength event);

    public boolean deleteEvent(Strength event);

    public ArrayList<Strength> getWeekEvents(Strength event);

    public ArrayList<Strength> getAllWeekEvents(long userid);

    public ArrayList<Strength> getMonthEvents(long userid, LocalDate date);
}
