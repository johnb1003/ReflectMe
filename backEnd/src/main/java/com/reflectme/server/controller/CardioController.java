package com.reflectme.server.controller;

import java.security.Principal;
import java.time.LocalDate;
import java.util.HashMap;
import java.util.Map;

import javax.validation.Valid;

import com.reflectme.server.model.Strength;
import com.reflectme.server.service.CardioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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
            response.put("deleted", Boolean.TRUE);
        }
        else {
            response.put("deleted", Boolean.FALSE);
        }
        return response;
    }

    @GetMapping("/week/{weekid}")
    public ResponseEntity<Strength> getWeekEvents(@PathVariable(value = "weekid") Long userID, Principal principal) {
        Cardio event = new Cardio();
        event.setuserid(Long.parseLong(principal.getName()));
        event.setweekid(userID.longValue());

        return cardioService.getWeekEvents(event);
    }

    @GetMapping("/month/{date}")
    public ResponseEntity<Strength> getWeekEvents(@PathVariable(value = "date")String date, Principal principal) {
        Cardio event = new Cardio();
        event.setuserid(Long.parseLong(principal.getName()));
        event.setdate(LocalDate.parse(date));

        return cardioService.getMonthEvents(event);
    }
}
