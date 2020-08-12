package com.reflectme.server.controller;

import java.security.Principal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.validation.Valid;

import com.reflectme.server.model.Strength;
import com.reflectme.server.model.Strength;
import com.reflectme.server.repository.StrengthRepository;
import com.reflectme.server.service.StrengthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.reflectme.server.exception.ResourceNotFoundException;
import com.reflectme.server.model.Strength;
import com.reflectme.server.repository.StrengthRepository;

@RestController
@RequestMapping("/v1/strength")
public class StrengthController {

    @Autowired
    private StrengthRepository strengthRepository;

    @Autowired
    private StrengthService strengthService;

    @GetMapping("/{userID}")
    public ResponseEntity<Strength> getStrengthById(@PathVariable(value = "userID") Long userID)
            throws ResourceNotFoundException {
        Strength strengthLog = strengthRepository.findById(userID).orElseThrow(() ->
                new ResourceNotFoundException("Strength logs not found for this id :: " + userID));
        return ResponseEntity.ok().body(strengthLog);
    }

    @PostMapping("/event")
    public ResponseEntity createStrengthEvent(@Valid @RequestBody Strength strength, Principal principal) {
        strength.setuserid(Long.parseLong(principal.getName()));
        return strengthService.createEvent(strength);
    }


    @DeleteMapping("/delete/{strengthid}")
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
}
