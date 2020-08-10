package com.reflectme.server.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.validation.Valid;

import com.reflectme.server.model.Strength;
import com.reflectme.server.repository.StrengthRepository;
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
import com.reflectme.server.model.Strength;
import com.reflectme.server.repository.StrengthRepository;

@RestController
@RequestMapping("/v1/strength")
public class StrengthController {

    @Autowired
    private StrengthRepository strengthRepository;

    @GetMapping("/{userID}")
    public ResponseEntity<Strength> getStrengthById(@PathVariable(value = "userID") Long userID)
            throws ResourceNotFoundException {
        Strength strengthLog = strengthRepository.findById(userID).orElseThrow(() ->
                new ResourceNotFoundException("Strength logs not found for this id :: " + userID));
        return ResponseEntity.ok().body(strengthLog);
    }

    @PostMapping("/event")
    public Strength createStrength(@Valid @RequestBody Strength strengthLog) {
        return strengthRepository.save(strengthLog);
    }
    

    @DeleteMapping("/{userID}")
    public Map<String, Boolean> deleteStrength(@PathVariable(value = "userID") Long userID)
            throws ResourceNotFoundException {
        Strength StrengthLog = strengthRepository.findById(userID)
                .orElseThrow(() -> new ResourceNotFoundException("Strength log not found for this id :: " + userID));

        strengthRepository.delete(StrengthLog);
        Map<String, Boolean> response = new HashMap<>();
        response.put("deleted", Boolean.TRUE);
        return response;
    }
}
