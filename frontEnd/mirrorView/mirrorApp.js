//const inquirer = require('inquirer');
//const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

// Regular expression to check valid emails. Source: http://emailregex.com/
const emailRegEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

// Regular expression to check password is only alphanumeric values and length is between 5-20 inclusive. Source: https://stackoverflow.com/questions/4745112/javascript-regex-for-alphanumeric-string-with-length-of-3-5-chars
const passwordRegEx = /^([a-zA-Z0-9]){5,20}$/;

const loginURL = 'https://reflectme.tech/api/v1/accounts/login';
const dayDataURL = 'https://reflectme.tech/api/v1/events/day/'

const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October','November', 'December'];
const weekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

let JWToken = null;
var email = null;
var pw = null;
let loginObject = {};

let currDate = 0;

let scheduleData = { 
    'cardio': [],
    'strength': []
};

function devSetup() {
    JWToken = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJzdWIiOiI2NCJ9.7Iak7NNb5S4fkpJDvXLnIfJy1a7_hMfSUZ46iOMGL5-J8s-O-_rsCIVPmxArjaaCw3IvJO4AX__bkYuTVqygBQ'
    displayLoops();
    $('.login-view').css('display', 'none');
    $('.mirror-view').css('display', 'flex');
}

///////////////////////////////////////
///////////////////////////////////////
///////// Login View Functions ////////
///////////////////////////////////////
///////////////////////////////////////

async function loginAJAX() {
    return loginReq = $.ajax({
        type: "POST",
        url: loginURL,
        crossDomain: true,
        contentType: "application/json",
        data: JSON.stringify({
            email: $('#email').val(),
            password: $('#password').val()
        }),
        success: function(data, status, xhr)    {
            // ERROR HERE, CANT GET TOKEN
            console.log(data);
            console.log(status);
            console.log(xhr.getAllResponseHeaders());
            JWToken = xhr.getResponseHeader('Authorization');
            displayLoops();
            $('.login-view').css('display', 'none');
            $('.mirror-view').css('display', 'flex');
        },
        failure: function(errMsg) {
            $('.login-error-message').css('display', 'block');
            console.log(errMsg);
        }
    });
}

function authenticateLogin() {
    let valid = true;

    const email = $('#email');
    if(!validEmail(email.val())) {
        $('.login-error-message').css('display', 'block');
        valid = false;
    }
    else {
        console.log("email");
        $('.login-error-message').css('display', 'none');
    }

    const password = $('#password');
    if(!validPassword(password.val())) {
        $('.login-error-message').css('display', 'block');
        valid = false;
    }
    else {
        console.log("password");
        $('.login-error-message').css('display', 'none');
    }

    return valid;
}

function validEmail(email) {
    if(email == '' || !emailRegEx.test(email)) {
        return false;
    }
    return true;
}

function validPassword(password) {
    if(password == '' || !passwordRegEx.test(password)) {
        return false;
    }
    return true;
}


////////////////////////////////////////
////////////////////////////////////////
///////// Mirror View Functions ////////
////////////////////////////////////////
////////////////////////////////////////

function displayLoops() {
    // Update display every 10 minutes
    //let updateDataInterval = setInterval(updateAllData, 10 * 60 * 1000);

    // Update display every 10 seconds
    updateSchedule();
    updateDateTime();
    updateWeather();
    let updateUserDataInterval = setInterval(updateSchedule, 10 * 60 * 1000);
    let timeUpdateInterval = setInterval(updateDateTime, 10 * 1000);
    let updateWeatherDataInterval = setInterval(updateWeather, 10 * 60 * 1000);
}

async function updateSchedule() {
    let dateString = new Date().toISOString().slice(0,10);
    $.ajax({
        type: "GET",
        url: dayDataURL+dateString,
        contentType: "application/json",
        headers: {
            'Authorization': 'Bearer ' + JWToken
        },
        success: function(data, status, xhr)    {
            // Display schedule data
            scheduleData = data;
            displaySchedule();
        },
        failure: function(errMsg) {
            console.log(errMsg);
        }
    });
}

function displaySchedule() {
    let cardioEvents = scheduleData.cardio;
    let strengthEvents = scheduleData.strength;

    let cardioHTML = '';
    let strengthHTML = '';

    cardioEvents.forEach( event => {
        let iconName = '';
        if(event.cardiotype == 'run') {
            iconName = 'run.svg';
        }
        else if(event.cardiotype == 'bike') {
            iconName = 'bike.svg';
        }
        else {
            iconName = 'walk.svg';
        }

        let mileString = event.distance > 1 ? 'miles' : 'mile';
        cardioHTML += `<div class='event-container'>`;
        cardioHTML += `<p class='event-name'>${event.cardiotype.charAt(0).toUpperCase()+event.cardiotype.slice(1)}</p>`;
        cardioHTML += `<img class="event-icon" src="event-icons/${iconName}"></img>`;
        cardioHTML += `<div class='event-description'>`;
        cardioHTML += `<p class='event-distance'>${event.distance} ${mileString}</p>`;
        cardioHTML += `</div>`;
        cardioHTML += `</div>`;
    });

    strengthEvents.forEach( event => {
        let iconName = '';
        if(event.strengthtype == 'yoga') {
            iconName = 'yoga.svg';
        }
        else {
            iconName = 'lift.svg';
        }
        strengthHTML += `<div class='event-container'>`;
        strengthHTML += `<p class='event-name'>${event.strengthtype.charAt(0).toUpperCase()+event.strengthtype.slice(1)}</p>`;
        strengthHTML += `<img class="event-icon" src="event-icons/${iconName}"></img>`;
        strengthHTML += `<div class='event-description'>`;
        if(event.strengthtype == 'lift') {
            strengthHTML += `<p class='event-lifts'>${event.lifts.charAt(0).toUpperCase()+event.lifts.slice(1)}</p>`;
        }
        strengthHTML += `</div>`;
        strengthHTML += `</div>`;
    });
    $('#cardio-container').html(cardioHTML);
    $('#strength-container').html(strengthHTML);
}


async function updateWeather() {

}

async function updateDateTime() {
    let currDateTime = new Date();
    let h = currDateTime.getHours();
    let m = currDateTime.getMinutes();

    let ampm = h <= 12 ? 'AM' : 'PM';
    h = formatHour(h);
    m = formatMinutes(m);
    let timeString = `${h}:${m} ${ampm}`;
    console.log(timeString);
    $('#time-string').text(timeString);

    if(currDate != currDateTime.getDate()) {
        let dateString = `${weekDays[currDateTime.getDay()]}, ${months[currDateTime.getMonth()]} ${currDateTime.getDate(), currDateTime.getFullYear()}`;
        console.log(dateString);
        $('#date-string').text(dateString);
        currDate = currDateTime.getDate();
    }
}

function formatHour(hour) {
    hour = hour <= 12 ? hour : hour-12;
    return hour;
}

function formatMinutes(minute) {
    if (minute < 10) {
        minute = "0" + minute;
    };
    return minute;
}





$(document).ready(function() {
    //////////////////////////////////
    ///////// Login Functions ////////
    //////////////////////////////////

    // Take in login form information
    $('#login-submit-button').click( () => {
        event.preventDefault();

        let valid = authenticateLogin();

        if(valid) {
            $('.login-error-message').css('display', 'none');
            loginAJAX();
        }
        else {
            $('.login-error-message').css('display', 'block');
        }
    })



    // Only use for development purposes
    //devSetup();


    //////////////////////////////////
    ///////// Mirror Functions ///////
    //////////////////////////////////

});






