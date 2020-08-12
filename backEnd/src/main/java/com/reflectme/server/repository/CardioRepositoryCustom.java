package com.reflectme.server.repository;

import com.reflectme.server.model.Cardio;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.ArrayList;

public interface CardioRepositoryCustom {

    public long createEvent(Cardio event);
}
