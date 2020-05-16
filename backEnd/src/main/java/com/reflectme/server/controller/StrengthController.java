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
@RequestMapping("/api/v1")
public class StrengthController {

    @Autowired
    private com.reflectme.server.repository.StrengthRepository StrengthRepository;

    @GetMapping("/strength")
    public List<Strength> getAllEmployees() {
        return StrengthRepository.findAll();
    }

    @GetMapping("/strength/{userID}")
    public ResponseEntity<Strength> getStrengthById(@PathVariable(value = "userID") Long userID)
            throws ResourceNotFoundException {
        Strength strengthLog = StrengthRepository.findById(userID).orElseThrow(() ->
                new ResourceNotFoundException("Strength logs not found for this id :: " + userID));
        return ResponseEntity.ok().body(strengthLog);
    }

    @PostMapping("/strength")
    public Strength createStrength(@Valid @RequestBody Strength strengthLog) {
        return StrengthRepository.save(strengthLog);
    }

    @PutMapping("/strength/{userID}")
    public ResponseEntity<Strength> updateStrength(@PathVariable(value = "userID") Long userID,
                                               @Valid @RequestBody Strength StrengthDetails) throws ResourceNotFoundException {
        Strength strengthLog = StrengthRepository.findById(userID)
                .orElseThrow(() -> new ResourceNotFoundException("Strength log not found for this id :: " + userID));

        strengthLog.setDate(StrengthDetails.getDate());
        strengthLog.setdayOfWeek(StrengthDetails.getdayOfWeek());
        strengthLog.setStrengthType(StrengthDetails.getStrengthType());
        strengthLog.setstatus(StrengthDetails.getstatus());
        final Strength updatedStrength = StrengthRepository.save(strengthLog);
        return ResponseEntity.ok(updatedStrength);
    }

    @DeleteMapping("/strength/{userID}")
    public Map<String, Boolean> deleteStrength(@PathVariable(value = "userID") Long userID)
            throws ResourceNotFoundException {
        Strength StrengthLog = StrengthRepository.findById(userID)
                .orElseThrow(() -> new ResourceNotFoundException("Strength log not found for this id :: " + userID));

        StrengthRepository.delete(StrengthLog);
        Map<String, Boolean> response = new HashMap<>();
        response.put("deleted", Boolean.TRUE);
        return response;
    }
}
