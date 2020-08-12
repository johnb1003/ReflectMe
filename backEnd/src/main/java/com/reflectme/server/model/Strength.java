package com.reflectme.server.model;

import com.fasterxml.jackson.annotation.JsonFormat;

import javax.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "strength")
public class Strength {

    @Id
    private long strengthid;

    @Column(name = "userid", nullable=false)
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
    private Long weekid;

    public Strength() {

    }

    public Strength(long strengthid, long userid) {
        this.strengthid = strengthid;
        this.userid = userid;
    }

    public Strength(long userid, long strengthid, LocalDate date, int dayofweek, String strengthtype, String lifts, double distance, int time, String status, long weekid) {
        this.userid = userid;
        this.strengthid = strengthid;
        this.date = date;
        this.dayofweek = dayofweek;
        this.strengthtype = strengthtype;
        this.lifts = lifts;
        this.status = status;
        this.weekid = weekid;
    }

    public long getstrengthid() { return strengthid; }

    public Strength setstrengthid(long strengthid) { this.strengthid = strengthid;
        return this;}

    public long getuserid() { return this.userid; }

    public void setuserid(long userid) { this.userid = userid; }

    public LocalDate getdate() { return date; }

    public void setdate(LocalDate date) { this.date = date; }

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

    public void setlifts(String lifts) {
        this.lifts = lifts;
    }

    public String getstatus() {
        return this.status;
    }

    public void setstatus(String status) {
        this.status = status;
    }

    public long getweekid() { return weekid.longValue(); }

    public void setweekid(Long weekid) {
        if (weekid != null) {
            this.weekid = new Long(weekid);
        } else {
            this.weekid = new Long(-1);
        }
    }
}

