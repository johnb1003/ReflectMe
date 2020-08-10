package com.reflectme.server.service;

import com.reflectme.server.model.Week;
import com.reflectme.server.repository.WeekRepository;
import com.reflectme.server.repository.WeekRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.ReactiveAdapterRegistry;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class WeekService {

    private WeekRepository weekRepository;

    @Autowired
    public WeekService(WeekRepository weekRepository) {
        this.weekRepository = weekRepository;
    }

    public ResponseEntity createWeek(Week week) {
        ResponseEntity response;
        System.out.println(week.getUserid()+", "+
                week.getActive()+", "+week.getName());
        try {
            response = Optional
                    .ofNullable(weekRepository.createWeek(week.getUserid(),
                            week.getActive(), week.getName()))
                    .map(newWeek -> ResponseEntity.ok().body(newWeek))
                    .orElseGet(() -> ResponseEntity.notFound().build());
        }
        catch (Exception e){
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Error: Week could not be created.");
        }

        return response;
    }
}