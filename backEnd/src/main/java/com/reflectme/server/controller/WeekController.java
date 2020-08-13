package com.reflectme.server.controller;

import java.security.Principal;
import java.util.HashMap;
import java.util.Map;

import javax.validation.Valid;

import com.reflectme.server.model.Strength;
import com.reflectme.server.model.Week;
import com.reflectme.server.repository.WeekRepository;
import com.reflectme.server.service.WeekService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.reflectme.server.exception.ResourceNotFoundException;
import com.reflectme.server.model.Cardio;
import com.reflectme.server.repository.CardioRepository;

@RestController
@RequestMapping("/v1/week")
public class WeekController {

    @Autowired
    private WeekRepository weekRepository;

    @Autowired
    private WeekService weekService;

    @PostMapping("")
    public ResponseEntity createCardioWeek(@Valid @RequestBody Week week, Principal principal) {
        week.setUserid(Long.parseLong(principal.getName()));
        return weekService.createWeek(week);
    }

    @DeleteMapping("/delete/{weekid}")
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

    @GetMapping("/all")
    public ResponseEntity<Week> getUserWeeks(Principal principal) {

        return weekService.getUserWeeks(Long.parseLong(principal.getName()));
    }
}
