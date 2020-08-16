package com.reflectme.server.controller;

import java.security.Principal;
import java.time.LocalDate;
import java.util.HashMap;
import java.util.Map;

import javax.validation.Valid;

import com.reflectme.server.model.Strength;
import com.reflectme.server.model.Week;
import com.reflectme.server.repository.StrengthRepository;
import com.reflectme.server.repository.WeekRepository;
import com.reflectme.server.service.CardioService;
import com.reflectme.server.service.EventsService;
import com.reflectme.server.service.StrengthService;
import com.reflectme.server.service.WeekService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.reflectme.server.exception.ResourceNotFoundException;
import com.reflectme.server.model.Cardio;
import com.reflectme.server.repository.CardioRepository;

@RestController
@RequestMapping("/v1/events")
public class EventsController {

    @Autowired
    private WeekRepository weekRepository;

    @Autowired
    private WeekService weekService;

    @Autowired
    private CardioRepository cardioRepository;

    @Autowired
    private CardioService cardioService;

    @Autowired
    private StrengthRepository strengthRepository;

    @Autowired
    private StrengthService strengthService;

    @Autowired
    private EventsService eventsService;

    
    /***********************************
            WEEK EVENT HANDLERS
     **********************************/

    @PostMapping("/week")
    public ResponseEntity createCardioWeek(@Valid @RequestBody Week week, Principal principal) {
        week.setUserid(Long.parseLong(principal.getName()));
        return weekService.createWeek(week);
    }

    @PatchMapping("/week")
    public Map<String, Boolean> updateWeek(@Valid @RequestBody Week week, Principal principal) {
        week.setUserid(Long.parseLong(principal.getName()));

        Map<String, Boolean> response = new HashMap<>();

        boolean updated = weekService.updateWeek(week);
        if(updated) {
            response.put("updated", Boolean.TRUE);
        }
        else {
            response.put("updated", Boolean.FALSE);
        }
        return response;
    }

    @DeleteMapping("/week/{weekid}")
    public Map<String, Boolean> deleteWeek(@PathVariable(value = "weekid") Long weekid, Principal principal) {
        Map<String, Boolean> response = new HashMap<>();

        Week event = new Week(weekid.longValue(), Long.parseLong(principal.getName()));
        boolean deleted = weekService.deleteEvent(event);
        if(deleted) {
            response.put("deleted", Boolean.TRUE);
        }
        else {
            response.put("deleted", Boolean.FALSE);
        }
        return response;
    }

    // Return JSON of all user Weeks and corresponding events
    @GetMapping("/weeks")
    public ResponseEntity<Week> getUserWeeks(Principal principal) {

        return weekService.getUserWeeks(Long.parseLong(principal.getName()));
    }



    /***********************************
            CARDIO EVENT HANDLERS
     **********************************/

    @PostMapping("/cardio")
    public ResponseEntity createCardioEvent(@Valid @RequestBody Cardio cardio, Principal principal) {
        cardio.setuserid(Long.parseLong(principal.getName()));
        return cardioService.createEvent(cardio);
    }

    @PatchMapping("/cardio")
    public Map<String, Boolean> updateCardioEvent(@Valid @RequestBody Cardio cardio, Principal principal) {
        cardio.setuserid(Long.parseLong(principal.getName()));

        Map<String, Boolean> response = new HashMap<>();

        boolean updated = cardioService.updateEvent(cardio);
        if(updated) {
            response.put("updated", Boolean.TRUE);
        }
        else {
            response.put("updated", Boolean.FALSE);
        }
        return response;
    }

    @DeleteMapping("/cardio/{cardioid}")
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



    /***********************************
           STRENGTH EVENT HANDLERS
     **********************************/

    @PostMapping("/strength")
    public ResponseEntity createStrengthEvent(@Valid @RequestBody Strength strength, Principal principal) {
        strength.setuserid(Long.parseLong(principal.getName()));
        return strengthService.createEvent(strength);
    }

    @PatchMapping("/strength")
    public Map<String, Boolean> updateStrengthEvent(@Valid @RequestBody Strength strength, Principal principal) {
        strength.setuserid(Long.parseLong(principal.getName()));

        Map<String, Boolean> response = new HashMap<>();

        boolean updated = strengthService.updateEvent(strength);
        if(updated) {
            response.put("updated", Boolean.TRUE);
        }
        else {
            response.put("updated", Boolean.FALSE);
        }
        return response;
    }

    @DeleteMapping("/strength/{strengthid}")
    public Map<String, Boolean> deleteStrength(@PathVariable(value = "strengthid") Long strengthid, Principal principal) {
        Map<String, Boolean> response = new HashMap<>();

        Strength event = new Strength(strengthid.longValue(), Long.parseLong(principal.getName()));
        boolean deleted = strengthService.deleteEvent(event);
        if(deleted) {
            response.put("deleted", Boolean.TRUE);
        }
        else {
            response.put("deleted", Boolean.FALSE);
        }
        return response;
    }



    /***********************************
        COMBINATION EVENT HANDLERS
     **********************************/

    @GetMapping("/month/{date}")
    public ResponseEntity getMonthEvents(@PathVariable(value = "date")String date, Principal principal) {

        return eventsService.getMonthEvents(Long.parseLong(principal.getName()), LocalDate.parse(date));
    }

    @GetMapping("/all/{date}")
    public ResponseEntity getAllMonthEvents(@PathVariable(value = "date")String date, Principal principal) {

        return eventsService.getAllMonthEvents(Long.parseLong(principal.getName()), LocalDate.parse(date));
    }
}
