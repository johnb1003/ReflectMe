package com.reflectme.server.model;

import org.postgresql.util.PGInterval;

import javax.persistence.*;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.util.Date;

@Entity
@Table(name = "strength")
public class Strength {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long userID;

    @Column(name = "date", nullable=true)
    private LocalDate date;

    @Column(name = "dayOfWeek", nullable=false)
    private String dayOfWeek;

    @Column(name = "StrengthType", nullable=false)
    private String strengthType;

    @Column(name = "status", nullable=false)
    private String status;

    public Strength() {

    }

    public Strength(LocalDate date, String dayOfWeek, String StrengthType, String status) {
        this.date = date;
        this.dayOfWeek = dayOfWeek;
        this.strengthType = StrengthType;
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

    public String getStrengthType() {
        return this.strengthType;
    }

    public void setStrengthType(String StrengthType) {
        this.strengthType = StrengthType;
    }

    public String getstatus() {
        return this.status;
    }

    public void setstatus(String status) {
        this.status = status;
    }
}
