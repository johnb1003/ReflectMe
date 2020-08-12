package com.reflectme.server.repository;

import com.reflectme.server.model.Strength;

public interface StrengthRepositoryCustom {

    public long createEvent(Strength event);

    public boolean deleteEvent(Strength event);
}
