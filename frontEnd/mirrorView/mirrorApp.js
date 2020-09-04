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

///////////////////////////////////////
///////////////////////////////////////
///////// Login View Functions ////////
///////////////////////////////////////
///////////////////////////////////////

async function loginAJAX() {

    return loginReq = $.ajax({
        type: "POST",
        url: loginURL,
        contentType: "application/json",
        data: JSON.stringify({
            email: $('#email').val(),
            password: $('#password').val()
        }),
        success: function(data, status, xhr)    {
            JWToken = xhr.getResponseHeader('Authorization');
            displayLoop();
            updateDateTime();
            $('.login-view').css('display', 'none');
            $('.mirror-view').css('display', 'block');
        },
        failure: function(errMsg) {
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

function displayLoop() {
    // Update display every 10 minutes
    //let updateDataInterval = setInterval(updateAllData, 10 * 60 * 1000);

    // Update display every 10 seconds
    let updateDataInterval = setInterval(updateAllData, 10 * 1000);
}

async function updateAllData() {
    updateDayData();
    // updateWeatherData();
    // updateDateTime();
}

// Load user day data
async function updateDayData() {
    let dateString = new Date().toISOString().slice(0,10);
    console.log(dateString);

    let httpRequest = new XMLHttpRequest();

    if (!httpRequest) {
        console.log('Giving up. Cannot create an XMLHTTP instance');
    }

    httpRequest.onreadystatechange = function() {
        console.log(`${this.readyState} = ${XMLHttpRequest.DONE}`);
        console.log(this.readyState === 4);
        if (this.readyState === 4) {
            if (this.status === 200) {
                console.log(this.responseText);
                // Display data in mirrorApp.html
            } 
            else {
                // ERROR
            }
        }
        else {
            // ERROR
        }
    };
    
    httpRequest.open('GET', dayDataURL+dateString, true);
    httpRequest.setRequestHeader("Content-Type", "application/json");
    httpRequest.setRequestHeader("Authorization", "Bearer " + JWToken);
    httpRequest.send();
}

async function updateWeatherData() {

}

async function updateDateTime() {
    let currDateTime = new Date();
    let h = currDateTime.getHours();
    let m = currDateTime.getMinutes();

    let ampm = h <= 12 ? 'AM' : 'PM';
    h = formatHour(h);
    m = formatMinutes(m);
    let timeString = `${h}:${m} ${ampm}`;
    $('time-string').text(timeString);

    if(currDate != currDateTime.getDate()) {
        let dateString = `${weekDays[currDateTime.getDay()]}, ${months[currDateTime.getMonth()]} ${currDateTime.getDate(), currDateTime.getFullYear()}`;
    }
}

function formatHour(hour) {
    hour = hour <= 12 ? hour : hour-12;
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

        console.log("here!!!!!!!!!!!");
        event.preventDefault();

        let valid = authenticateLogin();

        if(valid) {
            $('.login-error-message').css('display', 'none');
            loginAJAX()
                .then(data => {
                    window.location.href = "welcome.html";
                })
                .catch(error => {
                    $('.login-error-message').css('display', 'block');
                });
        }
        else {
            $('.login-error-message').css('display', 'block');
        }
    })




    //////////////////////////////////
    ///////// Mirror Functions ///////
    //////////////////////////////////

    // On successful login
    let timeUpdateInterval = setTimeout(updateDateTime, 5 * 1000);
});






