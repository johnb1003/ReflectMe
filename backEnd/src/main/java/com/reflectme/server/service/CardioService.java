package com.reflectme.server.service;

import com.reflectme.server.model.Cardio;
import com.reflectme.server.model.CardioWeek;
import com.reflectme.server.repository.CardioRepository;
import com.reflectme.server.repository.CardioWeekRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.ReactiveAdapterRegistry;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class CardioService {

    private CardioRepository cardioRepository;
    private CardioWeekRepository cardioWeekRepository;

    @Autowired
    public CardioService(CardioRepository cardioRepository, CardioWeekRepository cardioWeekRepository) {
        this.cardioRepository = cardioRepository;
        this.cardioWeekRepository = cardioWeekRepository;
    }

    public ResponseEntity createEvent(Cardio cardio) {
        try {
            return Optional
                    .ofNullable(cardioRepository.save(cardio))
                    .map(cardioEvent -> ResponseEntity.ok().body(cardioEvent))
                    .orElseGet(() -> ResponseEntity.notFound().build());
        }
        catch (Exception e){
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Error: Event could not be created.");
        }
    }

    public ResponseEntity createWeek(CardioWeek cardioWeek) {
        ResponseEntity response;
        System.out.println(cardioWeek.getUserid()+", "+
                cardioWeek.getActive()+", "+cardioWeek.getName());
        try {
            response = Optional
                    .ofNullable(cardioWeekRepository.createWeek(cardioWeek.getUserid(),
                            cardioWeek.getActive(), cardioWeek.getName()))
                    .map(week -> ResponseEntity.ok().body(week))
                    .orElseGet(() -> ResponseEntity.notFound().build());
        }
        catch (Exception e){
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Error: Week could not be created.");
        }

        // Create individual Day Events

        return response;
    }
}
