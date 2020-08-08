package com.reflectme.server.model;

import com.fasterxml.jackson.annotation.JsonFormat;
import org.postgresql.util.PGInterval;

import javax.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "cardio")
public class Cardio {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long userID;

    @JsonFormat(pattern = "yyyy-MM-dd")
    @Column(name = "date", nullable=true)
    private LocalDate date;

    @Column(name = "dayOfWeek", nullable=false)
    private String dayOfWeek;

    @Column(name = "cardioType", nullable=false)
    private String cardioType;

    @Column(name = "distance", nullable=false)
    private double distance;

    @Column(name = "time", nullable=true)
    private PGInterval time;

    @Column(name = "status", nullable=false)
    private String status;

    public Cardio() {

    }

    public Cardio(LocalDate date, String dayOfWeek, String cardioType, double distance, PGInterval time, String status) {
        this.date = date;
        this.dayOfWeek = dayOfWeek;
        this.cardioType = cardioType;
        this.distance = distance;
        this.time = time;
        this.status = status;
    }


    public long getUserID() {
        return this.getUserID();
    }

    public void setUserID(long userID) {
        this.userID = userID;
    }

    public LocalDate getDate() {
        return this.date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public String getdayOfWeek() {
        return this.dayOfWeek;
    }

    public void setdayOfWeek(String dayOfWeek) {
        this.dayOfWeek = dayOfWeek;
    }

    public String getcardioType() {
        return this.cardioType;
    }

    public void setcardioType(String cardioType) {
        this.cardioType = cardioType;
    }

    public double getdistance() {
        return this.distance;
    }

    public void setdistance(double distance) {
        this.distance = distance;
    }

    public PGInterval gettime() {
        return this.time;
    }

    public void settime(PGInterval time) {
        this.time = time;
    }

    public String getstatus() {
        return this.status;
    }

    public void setstatus(String status) {
        this.status = status;
    }
}
