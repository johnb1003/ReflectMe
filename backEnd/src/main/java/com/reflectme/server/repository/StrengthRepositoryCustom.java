package com.reflectme.server.repository;

import com.reflectme.server.model.Cardio;
import com.reflectme.server.model.Strength;

import java.util.ArrayList;

public interface StrengthRepositoryCustom {

    public long createEvent(Strength event);

    public boolean deleteEvent(Strength event);

    public ArrayList<Strength> getWeekEvents(Strength event);

    public ArrayList<Strength> getMonthEvents(Strength event);
}
