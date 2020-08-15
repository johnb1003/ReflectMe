package com.reflectme.server.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.reflectme.server.model.Cardio;
import com.reflectme.server.model.Strength;
import com.reflectme.server.model.Week;
import com.reflectme.server.repository.CardioRepository;
import com.reflectme.server.repository.StrengthRepository;
import com.reflectme.server.repository.WeekRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Optional;

@Transactional
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

    public ResponseEntity getAllMonthEvents(long userID, LocalDate date) {

        ObjectNode allNode = objectMapper.createObjectNode();

        ObjectNode eventsNode = objectMapper.createObjectNode();

        ObjectNode scheduledEventsNode = objectMapper.createObjectNode();
        ObjectNode completedEventsNode = objectMapper.createObjectNode();

        ArrayNode scheduledCardioEventArrNode = scheduledEventsNode.putArray("cardio");
        ArrayNode scheduledStrengthEventArrNode = scheduledEventsNode.putArray("strength");
        ArrayNode completedCardioEventArrNode = completedEventsNode.putArray("cardio");
        ArrayNode completedStrengthEventArrNode = completedEventsNode.putArray("strength");

        ArrayNode weeksArrNode = objectMapper.createArrayNode();

        allNode.set("weeks", weeksArrNode);
        allNode.set("events", eventsNode);
        eventsNode.set("scheduled", scheduledEventsNode);
        eventsNode.set("completed", completedEventsNode);

        try {
            ArrayList<Week> weeks = weekRepository.getUserWeeks(userID);

            ArrayList<Cardio> cardioWeeks = cardioRepository.getAllWeekEvents(userID);
            ArrayList<Strength> strengthWeeks = strengthRepository.getAllWeekEvents(userID);

            boolean cardioEvent = false;
            boolean strengthEvent = false;

            for(int i=0; i<weeks.size(); i++) {
                Week currWeek = weeks.get(i);
                long currID = currWeek.getWeekid();
                ObjectNode currWeekNode = objectMapper.createObjectNode();
                cardioEvent = false;
                strengthEvent = false;
                currWeekNode.put("weekID", currID);
                currWeekNode.put("weekName", currWeek.getName());
                currWeekNode.put("active", currWeek.getActive());
                ArrayNode cardioWeekArrNode = currWeekNode.putArray("cardio");
                ArrayNode strengthWeekArrNode = currWeekNode.putArray("strength");

                while(!cardioWeeks.isEmpty() && cardioWeeks.get(0).getweekid().longValue() == currID) {
                    cardioWeekArrNode.addPOJO(cardioWeeks.remove(0));
                    cardioEvent = true;
                }

                while(!strengthWeeks.isEmpty() && strengthWeeks.get(0).getweekid().longValue() == currID) {
                    strengthWeekArrNode.addPOJO(strengthWeeks.remove(0));
                    strengthEvent = true;
                }

                if(cardioEvent || strengthEvent) {
                    weeksArrNode.add(currWeekNode);
                }
            }

            ArrayList<Cardio> cardioEvents = cardioRepository.getMonthEvents(userID, date);
            while(!cardioEvents.isEmpty()) {
                if(cardioEvents.get(0).getstatus().toLowerCase().equals("scheduled")) {
                    scheduledCardioEventArrNode.addPOJO(cardioEvents.remove(0));
                }
                else if(cardioEvents.get(0).getstatus().toLowerCase().equals("completed")) {
                    completedCardioEventArrNode.addPOJO(cardioEvents.remove(0));
                }
            }

            ArrayList<Strength> strengthEvents = strengthRepository.getMonthEvents(userID, date);
            while(!strengthEvents.isEmpty()) {
                if(strengthEvents.get(0).getstatus().toLowerCase().equals("scheduled")) {
                    scheduledStrengthEventArrNode.addPOJO(strengthEvents.remove(0));
                }
                else if(strengthEvents.get(0).getstatus().toLowerCase().equals("completed")) {
                    completedStrengthEventArrNode.addPOJO(strengthEvents.remove(0));
                }
            }

            return Optional
                    .ofNullable(allNode)
                    .map(list -> ResponseEntity.ok().body(allNode))
                    .orElseGet(() -> ResponseEntity.notFound().build());
        }
        catch (Exception e){
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Error: Month events not found.");
        }
    }

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
