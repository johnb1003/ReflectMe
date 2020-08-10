package com.reflectme.server.model;

import com.fasterxml.jackson.annotation.JsonFormat;

import javax.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "strength")
public class Strength {

    @Id
    private long userid;

    @JsonFormat(pattern = "yyyy-MM-dd")
    @Column(name = "date", nullable=true)
    private LocalDate date;

    @Column(name = "dayofweek", nullable=false)
    private int dayofweek;

    @Column(name = "strengthtype", nullable=false)
    private String strengthtype;

    @Column(name = "lifts", nullable=false)
    private String lifts;

    @Column(name = "status", nullable=false)
    private String status;

    @Column(name = "weekid", nullable=true)
    private long weekid;

    public Strength() {

    }

    public Strength(long userid, LocalDate date, int dayofweek, String strengthtype, String lifts, double distance, int time, String status, long weekid) {
        this.userid = userid;
        this.date = date;
        this.dayofweek = dayofweek;
        this.strengthtype = strengthtype;
        this.lifts = lifts;
        this.status = status;
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

    public String getstrengthtype() {
        return this.strengthtype;
    }

    public void setstrengthtype(String strengthtype) {
        this.strengthtype = strengthtype;
    }

    public String getlifts() {
        return this.lifts;
    }

    public void setlifts(double distance) {
        this.lifts = lifts;
    }

    public String getstatus() {
        return this.status;
    }

    public void setstatus(String status) {
        this.status = status;
    }

    public long getweekid() { return weekid; }

    public void setweekid(long weekid) { this.weekid = weekid; }
}

