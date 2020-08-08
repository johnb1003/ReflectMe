package com.reflectme.server.model;

import com.fasterxml.jackson.annotation.JsonFormat;
import org.postgresql.util.PGInterval;

import javax.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "cardio")
public class Cardio {

    @Id
    private long userid;

    @JsonFormat(pattern = "yyyy-MM-dd")
    @Column(name = "date", nullable=true)
    private LocalDate date;

    @Column(name = "dayofweek", nullable=false)
    private String dayofweek;

    @Column(name = "cardiotype", nullable=false)
    private String cardiotype;

    @Column(name = "distance", nullable=false)
    private double distance;

    @Column(name = "time", nullable=true)
    private int time;

    @Column(name = "status", nullable=false)
    private String status;

    public Cardio() {

    }

    public Cardio(long userid, LocalDate date, String dayofweek, String cardiotype, double distance, int time, String status) {
        this.userid = userid;
        this.date = date;
        this.dayofweek = dayofweek;
        this.cardiotype = cardiotype;
        this.distance = distance;
        this.time = time;
        this.status = status;
    }


    public Long getuserid() { return new Long(this.userid); }

    public void setuserid(long userid) { this.userid = userid; }

    public LocalDate getdate() {
        return this.date;
    }

    public void setdate(LocalDate date) {
        this.date = date;
    }

    public String getdayofweek() {
        return this.dayofweek;
    }

    public void setdayofweek(String dayofweek) {
        this.dayofweek = dayofweek;
    }

    public String getcardiotype() {
        return this.cardiotype;
    }

    public void setcardiotype(String cardiotype) {
        this.cardiotype = cardiotype;
    }

    public double getdistance() {
        return this.distance;
    }

    public void setdistance(double distance) {
        this.distance = distance;
    }

    public int gettime() {
        return this.time;
    }

    public void settime(int time) {
        this.time = time;
    }

    public String getstatus() {
        return this.status;
    }

    public void setstatus(String status) {
        this.status = status;
    }
}
