package com.reflectme.server.repository;

import com.reflectme.server.model.Cardio;

public interface CardioRepositoryCustom {

    public long createEvent(Cardio event);

    public boolean deleteEvent(Cardio event);
}
