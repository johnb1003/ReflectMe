package com.reflectme.server.service;

import com.reflectme.server.model.Strength;
import com.reflectme.server.repository.StrengthRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.ReactiveAdapterRegistry;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class StrengthService {

    private StrengthRepository StrengthRepository;

    @Autowired
    public StrengthService(StrengthRepository StrengthRepository) {
        this.StrengthRepository = StrengthRepository;
    }

    public ResponseEntity createEvent(Strength Strength) {
        try {
            return Optional
                    .ofNullable(StrengthRepository.save(Strength))
                    .map(StrengthEvent -> ResponseEntity.ok().body(StrengthEvent))
                    .orElseGet(() -> ResponseEntity.notFound().build());
        }
        catch (Exception e){
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Error: Event could not be created.");
        }
    }

}

