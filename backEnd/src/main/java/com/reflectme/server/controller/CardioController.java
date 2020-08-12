package com.reflectme.server.controller;

import java.security.Principal;
import java.util.HashMap;
import java.util.Map;

import javax.validation.Valid;

import com.reflectme.server.service.CardioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
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
    private CardioRepository cardioRepository;

    @Autowired
    private CardioService cardioService;

    @PostMapping("/event")
    public ResponseEntity createCardioEvent(@Valid @RequestBody Cardio cardioLog, Principal principal) {
        cardioLog.setuserid(Long.parseLong(principal.getName()));
        return cardioService.createEvent(cardioLog);
    }

    @DeleteMapping("/delete/{cardioid}")
    public Map<String, Boolean> deleteCardio(@PathVariable(value = "cardioid") Long cardioid, Principal principal) {
        Map<String, Boolean> response = new HashMap<>();

        Cardio event = new Cardio(cardioid.longValue(), Long.parseLong(principal.getName()));
        boolean deleted = cardioService.deleteEvent(event);
        if(deleted) {
            response.put("deleted: ", Boolean.TRUE);
        }
        else {
            response.put("deleted: ", Boolean.FALSE);
        }
        return response;
    }

    @PutMapping("/{userID}")
    public ResponseEntity<Cardio> updateCardio(@PathVariable(value = "userID") Long userID,
                                                 @Valid @RequestBody Cardio cardioDetails) throws ResourceNotFoundException {
        Cardio cardioLog = cardioRepository.findById(userID)
                .orElseThrow(() -> new ResourceNotFoundException("Cardio log not found for this id :: " + userID));

        cardioLog.setdate(cardioDetails.getdate());
        cardioLog.setdayofweek(cardioDetails.getdayofweek());
        cardioLog.setcardiotype(cardioDetails.getcardiotype());
        cardioLog.setdistance(cardioDetails.getdistance());
        cardioLog.settime(cardioDetails.gettime());
        cardioLog.setstatus(cardioDetails.getstatus());
        final Cardio updatedCardio = cardioRepository.save(cardioLog);
        return ResponseEntity.ok(updatedCardio);
    }
}
