package com.reflectme.server.service;

import com.reflectme.server.model.Account;
import com.reflectme.server.model.Cardio;
import com.reflectme.server.model.CardioWeek;
import com.reflectme.server.repository.AccountRepository;
import com.reflectme.server.repository.CardioRepository;
import com.reflectme.server.repository.CardioWeekRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import java.sql.SQLException;
import java.util.Optional;

public class CardioService {

    private CardioRepository cardioRepo;
    private CardioWeekRepository cardioWeekRepo;

    @Autowired
    public CardioService(CardioRepository cardioRepo, CardioWeekRepository cardioWeekRepo) {
        this.cardioRepo = cardioRepo;
        this.cardioWeekRepo = cardioWeekRepo;
    }

    public ResponseEntity createEvent(Cardio cardio) {
        try {
            return Optional
                    .ofNullable(cardioRepo.save(cardio))
                    .map(cardioEvent -> ResponseEntity.ok().body(cardioEvent))
                    .orElseGet(() -> ResponseEntity.notFound().build());
        }
        catch (Exception e){
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Error: Event could not be created.");
        }
    }

    public ResponseEntity createWeek(CardioWeek cardioWeek) {
        ResponseEntity response;
        try {
            response = Optional
                    .ofNullable(cardioWeekRepo.createWeek(cardioWeek))
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
