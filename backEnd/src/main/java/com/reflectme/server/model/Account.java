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
@Table(name = "account")
public class Account {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long userID;

    @Column(name = "fname", nullable=false)
    private String fname;

    @Column(name = "lname", nullable=false)
    private String lname;

    @Column(name = "email", nullable=false)
    private String email;

    @Column(name = "password", nullable = false)
    private String password;

    @Column(name = "phonenum", nullable=false)
    private String phonenum;

    public Account() {

    }

    public Account(String fName, String lName, String email, String phoneNum, String password) {
        this.fname = fName;
        this.lname = lName;
        this.email = email;
        this.password = password;
        this.phonenum = phoneNum;
    }

    public Account(String email, String password) {
        this.fname = null;
        this.lname = null;
        this.email = email;
        this.password = password;
        this.phonenum = null;
    }

    public Account(String fName, String lName, String email, String phoneNum) {
        this.fname = fName;
        this.lname = lName;
        this.email = email;
        this.password = null;
        this.phonenum = phoneNum;
    }

    public long getUserID() {
        return this.userID;
    }

    public void setUserID(long userID) {
        this.userID = userID;
    }

    public String getfName() {
        return this.fname;
    }

    public void setfName(String fName) {
        this.fname = fName;
    }

    public String getlName() {
        return this.lname;
    }

    public void setlName(String lName) {
        this.lname = lName;
    }

    public String getEmail() {
        return this.email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getPhoneNum() {
        return this.phonenum;
    }

    public void setPhoneNum(String phoneNum) {
        this.phonenum = phoneNum;
    }

    @Override
    public String toString() {
        return "Account{" +
                "fName='" + fname + '\'' +
                ", lName='" + lname + '\'' +
                ", email='" + email + '\'' +
                ", phoneNum='" + "number" + '\'' +
                '}';
    }

    public Account dropPassword() {
        this.password = "";
        return this;
    }
}
