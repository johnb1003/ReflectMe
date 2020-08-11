package com.reflectme.server.model;

import com.fasterxml.jackson.annotation.JsonFormat;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;
import java.time.LocalDate;

@Entity
@Table(name = "cardio_week")
public class Week {

    @Id
    private long weekid;

    @Column(name = "userid", nullable = false)
    private long userid;

    @Column(name = "active", nullable = false)
    private boolean active;

    @Column(name = "name", nullable = false)
    private String name;

    public Week() {

    }

    public Week(long weekid, long userid, boolean active, String name) {
        this.weekid = weekid;
        this.userid = userid;
        this.active = active;
        this.name = name;
    }

    public long getUserid() {
        return userid;
    }

    public void setUserid(long userid) {
        this.userid = userid;
    }

    public long getWeekid() {
        return weekid;
    }

    public Week setWeekid(long weekid) {
        this.weekid = weekid;
        return this;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public boolean getActive() {
        return this.active;
    }

    public void setActive(boolean active) {
        this.active = active;
    }
}