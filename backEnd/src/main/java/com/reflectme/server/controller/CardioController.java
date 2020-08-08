package com.reflectme.server.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.reflectme.server.exception.ResourceNotFoundException;
import com.reflectme.server.model.Cardio;
import com.reflectme.server.repository.CardioRepository;

@RestController
@RequestMapping("/v1/cardio")
public class CardioController {

    @Autowired
    private CardioRepository CardioRepository;

    @PostMapping("/")
    public Cardio createCardio(@Valid @RequestBody Cardio cardioLog) {
        return CardioRepository.save(cardioLog);
    }

    @PutMapping("/{userID}")
    public ResponseEntity<Cardio> updateCardio(@PathVariable(value = "userID") Long userID,
                                                 @Valid @RequestBody Cardio cardioDetails) throws ResourceNotFoundException {
        Cardio cardioLog = CardioRepository.findById(userID)
                .orElseThrow(() -> new ResourceNotFoundException("Cardio log not found for this id :: " + userID));

        cardioLog.setDate(cardioDetails.getDate());
        cardioLog.setdayOfWeek(cardioDetails.getdayOfWeek());
        cardioLog.setcardioType(cardioDetails.getcardioType());
        cardioLog.setdistance(cardioDetails.getdistance());
        cardioLog.settime(cardioDetails.gettime());
        cardioLog.setstatus(cardioDetails.getstatus());
        final Cardio updatedCardio = CardioRepository.save(cardioLog);
        return ResponseEntity.ok(updatedCardio);
    }

    @DeleteMapping("/{userID}")
    public Map<String, Boolean> deleteCardio(@PathVariable(value = "userID") Long userID)
            throws ResourceNotFoundException {
        Cardio cardioLog = CardioRepository.findById(userID)
                .orElseThrow(() -> new ResourceNotFoundException("Cardio log not found for this id :: " + userID));

        CardioRepository.delete(cardioLog);
        Map<String, Boolean> response = new HashMap<>();
        response.put("deleted", Boolean.TRUE);
        return response;
    }
}
