package com.reflectme.server.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.reflectme.server.model.Cardio;
import com.reflectme.server.model.Strength;
import com.reflectme.server.repository.CardioRepository;
import com.reflectme.server.repository.StrengthRepository;
import com.reflectme.server.repository.WeekRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Optional;

@Service
public class EventsService {

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
    private ObjectMapper objectMapper;

    public ResponseEntity getMonthEvents(long userID, LocalDate date) {

        ObjectNode eventsNode = objectMapper.createObjectNode();
        ArrayNode cardioArrNode = eventsNode.putArray("cardio");
        ArrayNode strengthArrNode = eventsNode.putArray("strength");

        try {
            ArrayList<Cardio> cardio = cardioRepository.getMonthEvents(userID, date);
            while(!cardio.isEmpty()) {
                cardioArrNode.addPOJO(cardio.remove(0));
            }

            ArrayList<Strength> strength = strengthRepository.getMonthEvents(userID, date);
            while(!strength.isEmpty()) {
                strengthArrNode.addPOJO(strength.remove(0));
            }

            return Optional
                    .ofNullable(eventsNode)
                    .map(list -> ResponseEntity.ok().body(eventsNode))
                    .orElseGet(() -> ResponseEntity.notFound().build());
        }
        catch (Exception e){
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Error: Month events not found.");
        }
    }
}
