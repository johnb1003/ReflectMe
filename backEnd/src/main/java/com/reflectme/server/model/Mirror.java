package com.reflectme.server.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;
@Entity
@Table(name = "mirrors")
public class Mirror {

    @Id
    private long mirrorid;

    @Column(name = "userid", nullable = false)
    private long userid;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "active", nullable = false)
    private boolean active;

    public Mirror() {

    }

    public Mirror(long mirrorid, long userid, String name, boolean active) {
        this.mirrorid = mirrorid;
        this.userid = userid;
        this.name = name;
        this.active = active;
    }

    public long getMirrorid() {
        return mirrorid;
    }

    public void setMirrorid(long mirrorid) {
        this.mirrorid = mirrorid;
    }

    public long getUserid() {
        return userid;
    }

    public void setUserid(long userid) {
        this.userid = userid;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public boolean getActive() {
        return active;
    }

    public void setActive(boolean active) {
        this.active = active;
    }
}
