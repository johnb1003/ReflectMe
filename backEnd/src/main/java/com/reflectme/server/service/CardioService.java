package com.reflectme.server.service;

import com.reflectme.server.model.Cardio;
import com.reflectme.server.model.Week;
import com.reflectme.server.repository.CardioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class CardioService {

    private CardioRepository cardioRepository;

    @Autowired
    public CardioService(CardioRepository cardioRepository) {
        this.cardioRepository = cardioRepository;
    }

    public ResponseEntity createEvent(Cardio cardio) {
        System.out.println("HERE SERVICE");
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

}
