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

import java.util.ArrayList;
import java.util.Optional;

@Service
public class WeekService {

    private WeekRepository weekRepository;

    private CardioRepository cardioRepository;

    private StrengthRepository strengthRepository;

    private ObjectMapper objectMapper;

    @Autowired
    public WeekService(WeekRepository weekRepository, CardioRepository cardioRepository,
                       StrengthRepository strengthRepository, ObjectMapper objectMapper) {
        this.weekRepository = weekRepository;
        this.cardioRepository = cardioRepository;
        this.strengthRepository = strengthRepository;
        this.objectMapper = objectMapper;
    }

    public ResponseEntity createWeek(Week week) {
        ResponseEntity response;
        System.out.println(week.getUserid()+", "+
                week.getActive()+", "+week.getName());
        try {
            response = Optional
                    .ofNullable(weekRepository.createWeek(week))
                    .map(weekid -> ResponseEntity.ok().body(week.setWeekid(weekid)))
                    .orElseGet(() -> ResponseEntity.notFound().build());
        }
        catch (Exception e){
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Error: Week could not be created.");
        }

        return response;
    }

    public boolean updateWeek(Week week) {
        try {
            return weekRepository.updateWeek(week);
        }
        catch (Exception e){
            System.out.println(e.toString());
            return false;
        }
    }

    public boolean deleteEvent(Week event) {
        return weekRepository.deleteEvent(event);
    }

    public ResponseEntity getUserWeeks(long userid) {
        ResponseEntity response;

        ObjectNode weeksNode = objectMapper.createObjectNode();
        ArrayNode weeksArrNode = weeksNode.putArray("weeks");

        try {
            ArrayList<Week> weeks = weekRepository.getUserWeeks(userid);

            ArrayList<Cardio> cardios = cardioRepository.getAllWeekEvents(userid);
            ArrayList<Strength> strengths = strengthRepository.getAllWeekEvents(userid);

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
                ArrayNode cardioArrNode = currWeekNode.putArray("cardio");
                ArrayNode strengthArrNode = currWeekNode.putArray("strength");

                while(!cardios.isEmpty() && cardios.get(0).getweekid().longValue() == currID) {
                    cardioArrNode.addPOJO(cardios.remove(0));
                    cardioEvent = true;
                }

                while(!strengths.isEmpty() && strengths.get(0).getweekid().longValue() == currID) {
                    strengthArrNode.addPOJO(strengths.remove(0));
                    strengthEvent = true;
                }

                if(cardioEvent || strengthEvent) {
                    weeksArrNode.add(currWeekNode);
                }
            }

            response = Optional
                    .ofNullable(weeksNode)
                    .map(data -> ResponseEntity.ok().body(weeksNode))
                    .orElseGet(() -> ResponseEntity.notFound().build());
        }
        catch (Exception e){
            System.out.println(e.toString());
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Error: Weeks could not be fetched.");
        }

        return response;
    }
}