package com.reflectme.server.model;

import com.fasterxml.jackson.annotation.JsonFormat;

import javax.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "cardio")
public class Cardio {

    @Id
    private long cardioid;

    @Column(name="userid", nullable=false)
    private long userid;

    @JsonFormat(pattern = "yyyy-MM-dd")
    @Column(name = "date", nullable=true)
    private LocalDate date;

    @Column(name = "dayofweek", nullable=false)
    private int dayofweek;

    @Column(name = "cardiotype", nullable=false)
    private String cardiotype;

    @Column(name = "distance", nullable=false)
    private double distance;

    @Column(name = "time", nullable=true)
    private int time;

    @Column(name = "status", nullable=false)
    private String status;

    @Column(name = "weekid", nullable=true)
    private Long weekid;

    public Cardio() {

    }

    public Cardio(long cardioid, long userid) {
        this.cardioid = cardioid;
        this.userid = userid;
    }

    public Cardio(long userid, LocalDate date, int dayofweek, String cardiotype,
                  double distance, int time, String status, long weekid, long cardioid) {
        this.userid = userid;
        this.date = date;
        this.dayofweek = dayofweek;
        this.cardiotype = cardiotype;
        this.distance = distance;
        this.time = time;
        this.status = status;
        this.weekid = weekid;
        this.cardioid = cardioid;
    }


    public long getuserid() { return this.userid; }

    public void setuserid(long userid) { this.userid = userid; }

    public LocalDate getdate() {
        return this.date;
    }

    public void setdate(LocalDate date) {
        this.date = date;
    }

    public int getdayofweek() {
        return this.dayofweek;
    }

    public void setdayofweek(int dayofweek) {
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

    public long getweekid() { return this.weekid.longValue(); }

    public void setweekid(Long weekid) {
        if(weekid != null) {
            this.weekid = new Long(weekid);
        }
        else {
            this.weekid = new Long(-1);
        }
    }

    public long getcardioid() { return cardioid; }

    public Cardio setcardioid(long cardioid) { this.cardioid = cardioid;
        return this;}
}
