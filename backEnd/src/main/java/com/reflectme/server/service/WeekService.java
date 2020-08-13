package com.reflectme.server.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.reflectme.server.model.Cardio;
import com.reflectme.server.model.Strength;
import com.reflectme.server.model.Week;
import com.reflectme.server.repository.CardioRepository;
import com.reflectme.server.repository.StrengthRepository;
import com.reflectme.server.repository.WeekRepository;
import com.reflectme.server.repository.WeekRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.ReactiveAdapterRegistry;
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

    public boolean deleteEvent(Week event) {
        return weekRepository.deleteEvent(event);
    }

    public ResponseEntity getUserWeeks(long userid) {
        ResponseEntity response;

        ObjectNode weeksNode = objectMapper.createObjectNode();

        ArrayList<Cardio> cardioSet;
        ArrayList<Strength> strengthSet;
        try {
            System.out.println("HERE 1");
            ArrayList<Long> weekIDs = weekRepository.getUserWeeks(userid);

            ArrayList<Cardio> cardios = cardioRepository.getAllWeekEvents(userid);
            ArrayList<Strength> strengths = strengthRepository.getAllWeekEvents(userid);

            System.out.println("HERE 5");
            for(int i=0; i<weekIDs.size(); i++) {
                long currID = weekIDs.get(i).longValue();
                ObjectNode currWeekNode = objectMapper.createObjectNode();
                ArrayList<Cardio> weekCardios = new ArrayList<Cardio>();
                ArrayList<Strength> weekStrengths = new ArrayList<Strength>();

                while(cardios.get(0).getweekid().longValue() == currID) {
                    weekCardios.add(cardios.remove(0));
                }

                if(!weekCardios.isEmpty()) {
                    currWeekNode.put("cardio", cardios.toString());
                }

                while(strengths.get(0).getweekid().longValue() == currID) {
                    weekStrengths.add(strengths.remove(0));
                }

                if(!weekStrengths.isEmpty()) {
                    currWeekNode.put("strength", strengths.toString());
                }
                weeksNode.put(""+currID, currWeekNode.toPrettyString());
            }

            System.out.println("HERE 2");

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