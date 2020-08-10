package com.reflectme.server.controller;

import java.security.Principal;

import javax.validation.Valid;

import com.reflectme.server.model.Week;
import com.reflectme.server.repository.WeekRepository;
import com.reflectme.server.service.WeekService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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
}
