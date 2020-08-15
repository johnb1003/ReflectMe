package com.reflectme.server.service;

import com.reflectme.server.model.Cardio;
import com.reflectme.server.model.Strength;
import com.reflectme.server.model.Week;
import com.reflectme.server.repository.CardioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.Optional;

@Transactional
@Service
public class CardioService {

    private CardioRepository cardioRepository;

    @Autowired
    public CardioService(CardioRepository cardioRepository) {
        this.cardioRepository = cardioRepository;
    }

    public ResponseEntity createEvent(Cardio cardio) {
        try {
            return Optional
                    .ofNullable(cardioRepository.createEvent(cardio))
                    .map(cardioEvent -> ResponseEntity.ok().body(cardio.setcardioid(cardioEvent)))
                    .orElseGet(() -> ResponseEntity.notFound().build());
        }
        catch (Exception e){
            System.out.println(e.toString());
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Error: Event could not be created.");
        }
    }

    public boolean updateEvent(Cardio event) {
        try {
            return cardioRepository.updateEvent(event);
        }
        catch (Exception e){
            System.out.println(e.toString());
            return false;
        }
    }

    public boolean deleteEvent(Cardio event) {
        try {
            return cardioRepository.deleteEvent(event);
        }
        catch (Exception e){
            System.out.println(e.toString());
            return false;
        }
    }

    public ResponseEntity getWeekEvents(Cardio cardio) {
        try {
            return Optional
                    .ofNullable(cardioRepository.getWeekEvents(cardio))
                    .map(cardioList -> ResponseEntity.ok().body(cardioList))
                    .orElseGet(() -> ResponseEntity.notFound().build());
        }
        catch (Exception e){
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Error: Week events not found.");
        }
    }

    public ResponseEntity getMonthEvents(long userid, LocalDate date) {
        try {
            return Optional
                    .ofNullable(cardioRepository.getMonthEvents(userid, date))
                    .map(list -> ResponseEntity.ok().body(list))
                    .orElseGet(() -> ResponseEntity.notFound().build());
        }
        catch (Exception e){
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Error: Month events not found.");
        }
    }
}
