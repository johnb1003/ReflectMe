package com.reflectme.server.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;
import org.postgresql.util.PGInterval;

import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.util.Date;

@Entity
@Table(name = "Account")
public class Account {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long userID;

    @Column(name = "fName", nullable=false)
    private String fName;

    @Column(name = "lName", nullable=false)
    private String lName;

    @Column(name = "email", nullable=false)
    private String email;

    @Column(name = "phoneNum", nullable=false)
    private String phoneNum;

    public Account() {

    }

    public Account(String fName, String lName, String email, String phoneNum) {
        this.fName = fName;
        this.lName = lName;
        this.email = email;
        this.phoneNum = phoneNum;
    }

    public long getUserID() {
        return this.getUserID();
    }

    public void setUserID(long userID) {
        this.userID = userID;
    }

    public String getfName() {
        return this.fName;
    }

    public void setfName(String fName) {
        this.fName = fName;
    }

    public String getlName() {
        return this.lName;
    }

    public void setlName(String lName) {
        this.lName = lName;
    }

    public String getemail() {
        return this.email;
    }

    public void setemail(String email) {
        this.email = email;
    }

    public String getphoneNum() {
        return this.phoneNum;
    }

    public void setphoneNum(String phoneNum) {
        this.phoneNum = phoneNum;
    }
}
