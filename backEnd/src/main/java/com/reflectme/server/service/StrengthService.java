package com.reflectme.server.service;

import com.reflectme.server.model.Cardio;
import com.reflectme.server.model.Strength;
import com.reflectme.server.repository.StrengthRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.Optional;

@Service
public class StrengthService {

    private StrengthRepository strengthRepository;

    @Autowired
    public StrengthService(StrengthRepository StrengthRepository) {
        this.strengthRepository = StrengthRepository;
    }

    public ResponseEntity createEvent(Strength strength) {
        try {
            return Optional
                    .ofNullable(strengthRepository.createEvent(strength))
                    .map(strengthID -> ResponseEntity.ok().body(strength.setstrengthid(strengthID)))
                    .orElseGet(() -> ResponseEntity.notFound().build());
        }
        catch (Exception e){
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Error: Event could not be created.");
        }
    }

    public boolean deleteEvent(Strength event) {
        return strengthRepository.deleteEvent(event);
    }

    public ResponseEntity getWeekEvents(Strength event) {
        try {
            return Optional
                    .ofNullable(strengthRepository.getWeekEvents(event))
                    .map(strengthList -> ResponseEntity.ok().body(strengthList))
                    .orElseGet(() -> ResponseEntity.notFound().build());
        }
        catch (Exception e){
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Error: Week events not found.");
        }
    }

    public ResponseEntity getMonthEvents(long userid, LocalDate date) {
        try {
            return Optional
                    .ofNullable(strengthRepository.getMonthEvents(userid, date))
                    .map(list -> ResponseEntity.ok().body(list))
                    .orElseGet(() -> ResponseEntity.notFound().build());
        }
        catch (Exception e){
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Error: Month events not found.");
        }
    }
}

