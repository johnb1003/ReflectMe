// Regular expression to check valid emails. Source: http://emailregex.com/
const emailRegEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

// Regular expression to check password is only alphanumeric values and length is between 5-20 inclusive. Source: https://stackoverflow.com/questions/4745112/javascript-regex-for-alphanumeric-string-with-length-of-3-5-chars
const passwordRegEx = /^([a-zA-Z0-9]){5,20}$/;

// Regular expression to check valid zip code
const zipCodeRegEx = /(^\d{5}$)/

//const loginURL = 'https://reflectme.tech/api/v1/accounts/login';
//const dayDataURL = 'https://reflectme.tech/api/v1/events/day/';
const weatherDataURL = 'https://reflectme.tech/api/v1/events/weather/';

const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October','November', 'December'];
const weekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

let currDate = 0;

let scheduleData = {
    "cardio": [
        {
            "cardioid": 0,
            "userid": 0,
            "date": "2020-01-01",
            "dayofweek": 0,
            "cardiotype": "run",
            "distance": 2.0,
            "time": null,
            "status": "scheduled",
            "weekid": null
        }
    ],
    "strength": [
        {
            "strengthid": 1,
            "userid": 0,
            "date": "2020-01-01",
            "dayofweek": 0,
            "strengthtype": "lift",
            "lifts": "chest, triceps",
            "status": "scheduled",
            "weekid": null
        },
        {
            "strengthid": 0,
            "userid": 0,
            "date": "2020-01-01",
            "dayofweek": 0,
            "strengthtype": "yoga",
            "lifts": null,
            "status": "scheduled",
            "weekid": null
        }
    ]
};

let weatherData = JSON.parse('{"coord":{"lon":-71.3,"lat":41.93},"weather":[{"id":800,"main":"Clear","description":"clear sky","icon":"01d"}],"base":"stations","main":{"temp":286.31,"feels_like":281.91,"temp_min":283.71,"temp_max":288.15,"pressure":1035,"humidity":59},"visibility":10000,"wind":{"speed":4.78,"deg":32},"clouds":{"all":0},"dt":1600697661,"sys":{"type":3,"id":2006275,"country":"US","sunrise":1600684323,"sunset":1600728253},"timezone":-14400,"id":0,"name":"Attleboro","cod":200}');

let cardioHTMLArray = [];
let strengthHTMLArray = [];

let updatescheduleContainerInterval = undefined;

let cardioHTMLArrayIndex = 0;
let strengthHTMLArrayIndex = 0;

function devSetup() {
    zipCode = '02703';
    displayLoops();
    $('.login-view').css('display', 'none');
    $('.mirror-view').css('display', 'flex');
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
    //updateSchedule();
    displaySchedule();
    updateDateTime();
    //updateWeather();
    displayWeather();
    let updateUserDataInterval = setInterval(updateSchedule, 10 * 60 * 1000);
    let timeUpdateInterval = setInterval(updateDateTime, 10 * 1000);
    let updateWeatherDataInterval = setInterval(updateWeather, 10 * 60 * 1000);
}

function getCurrDateString() {
    let now = new Date();
    let year = ''+now.getFullYear();
    let month = ''+(now.getMonth() + 1);
    let day = ''+now.getDate();

    if(month.length < 2) {
        month = '0' + month;
    }

    if(day.length < 2) {
        day = '0' + day;
    }

    let stringDate = [year, month, day].join('-');

    return stringDate;
}

async function updateSchedule() {
    //let dateString = new Date().toISOString().slice(0,10);
    let dateString = getCurrDateString();
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

    cardioHTMLArray = [];
    strengthHTMLArray = [];

    cardioEvents.forEach( event => {
        let cardioHTML = '';
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
        cardioHTML += `<img class="event-icon" src="resources/event-icons/${iconName}"></img>`;
        cardioHTML += `<div class='event-description'>`;
        cardioHTML += `<p class='event-distance'>${event.distance} ${mileString}</p>`;
        cardioHTML += `</div>`;
        cardioHTML += `</div>`;
        cardioHTMLArray.push(cardioHTML);
    });

    strengthEvents.forEach( event => {
        let strengthHTML = '';
        let iconName = '';

        if(event.strengthtype == 'yoga') {
            iconName = 'yoga.svg';
        }
        else {
            iconName = 'lift.svg';
        }
        strengthHTML += `<div class='event-container'>`;
        strengthHTML += `<p class='event-name'>${event.strengthtype.charAt(0).toUpperCase()+event.strengthtype.slice(1)}</p>`;
        strengthHTML += `<img class="event-icon" src="resources/event-icons/${iconName}"></img>`;
        strengthHTML += `<div class='event-description'>`;
        if(event.strengthtype == 'lift') {
            strengthHTML += `<p class='event-lifts'>${event.lifts.charAt(0).toUpperCase()+event.lifts.slice(1)}</p>`;
        }
        strengthHTML += `</div>`;
        strengthHTML += `</div>`;
        strengthHTMLArray.push(strengthHTML);
    });

    if(updatescheduleContainerInterval != undefined) {
        clearInterval(updatescheduleContainerInterval);
        cardioHTMLArrayIndex = 0;
        strengthHTMLArrayIndex = 0;
    }

    if(cardioHTMLArray.length > 0) {
        $('#cardio-container').html(cardioHTMLArray[0]);
    }

    if(strengthHTMLArray.length > 0) {
        $('#strength-container').html(strengthHTMLArray[0]);
    }

    updatescheduleContainerInterval = setInterval(updateScheduleContainer, 8 * 1000);
}

function updateScheduleContainer() {
    if(cardioHTMLArray.length > 1) {
        if(cardioHTMLArrayIndex+1 < cardioHTMLArray.length) {
            cardioHTMLArrayIndex = cardioHTMLArrayIndex+1;
        }
        else {
            cardioHTMLArrayIndex = 0;
        }
        $('#cardio-container').html(cardioHTMLArray[cardioHTMLArrayIndex]);
    }

    if(strengthHTMLArray.length > 1) {
        if(strengthHTMLArrayIndex+1 < strengthHTMLArray.length) {
            strengthHTMLArrayIndex = strengthHTMLArrayIndex+1;
        }
        else {
            strengthHTMLArrayIndex = 0;
        }
        $('#strength-container').html(strengthHTMLArray[strengthHTMLArrayIndex]);
    }
}


async function updateWeather() {
    $.ajax({
        type: "GET",
        url: weatherDataURL+zipCode,
        contentType: "application/json",
        headers: {
            'Authorization': 'Bearer ' + JWToken
        },
        success: function(data, status, xhr)    {
            // Display schedule data
            weatherData = JSON.parse(data);
            displayWeather();
        },
        failure: function(errMsg) {
            console.log(errMsg);
        }
    });
}

function displayWeather() {
    console.log(weatherData);

    let temperatureK = weatherData['main']['temp'];
    let code = weatherData['weather']['0']['id'];

    let dayOrNight = '';
    let sunriseTime = weatherData['sys']['sunrise'];
    let sunsetTime = weatherData['sys']['sunset'];
    let currTime = weatherData['dt'];

    if(currTime > sunriseTime && currTime < sunsetTime) {
        dayOrNight = 'day';
    }
    else {
        dayOrNight = 'night';
    }

    let icon = getWeatherIcon(code, dayOrNight)

    let temperatureF = Math.floor(((parseFloat(temperatureK) - 273.15) * (9/5)) + 32);
    $('#temperature-num').text(temperatureF);
    $('#weather-icon').attr('src', icon);
}

function getWeatherIcon(weatherCode, dayOrNight) {
    let icon = 'resources/weather-icons/';
    if(weatherCode < 300) {
        // Thunder
        icon += 'thunder';
    }
    else if(weatherCode < 400) {
        // Light rain
        icon += 'light-rain';
    }
    else if(weatherCode < 600) {
        // Rain
        icon += 'rain';
    }
    else if(weatherCode < 700) {
        // Snow
        icon += 'snow';
    }
    else if(weatherCode < 800) {
        // "Atmosphere" (wind symbol)
        icon += 'atmosphere';
    }
    else if(weatherCode == 800) {
        // Clear (sunny)
        icon += 'clear';
    }
    else if(weatherCode < 803) {
        // Partly cloudy
        icon += 'partly-cloudy';
    }
    else if(weatherCode >= 803) {
        // Cloudy
        icon += 'cloudy';
    }
    icon += '-' + dayOrNight + '.svg';
    return icon;
}

async function updateDateTime() {
    let currDateTime = new Date();
    let h = currDateTime.getHours();
    let m = currDateTime.getMinutes();

    let ampm = h < 12 ? 'AM' : 'PM';
    h = formatHour(h);
    m = formatMinutes(m);
    let timeString = `${h}:${m} ${ampm}`;
    console.log(timeString);
    $('#time-string').text(timeString);

    if(currDate != currDateTime.getDate()) {
        let dateString = `${weekDays[currDateTime.getDay()]}, ${months[currDateTime.getMonth()]} ${currDateTime.getDate()}, ${currDateTime.getFullYear()}`;
        console.log(dateString);
        $('#date-string').text(dateString);
        currDate = currDateTime.getDate();
    }
}

function formatHour(hour) {
    hour = hour <= 12 ? hour : hour-12;
    hour = hour == 0 ? 12 : hour;
    return hour;
}

function formatMinutes(minute) {
    if (minute < 10) {
        minute = "0" + minute;
    };
    return minute;
}





$(document).ready(function() {
    
    // Only use for development purposes
    devSetup();

    //////////////////////////////////
    ///////// Mirror Functions ///////
    //////////////////////////////////

    var video = document.querySelector("#mirror-video-layer");
    //video.style.width = $('.mirror-view').width() + 'px';
    //video.style.height = $('.mirror-view').height() + 'px';
    video.setAttribute('autoplay', '');
    video.setAttribute('muted', '');
    video.setAttribute('playsinline', '');

    var constraints = {
        audio: false,
        video: {
         facingMode: 'user'
        }
    }

    if(navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia(constraints)
        .then( (stream) => {
            //console.log("Stream retrieved");
            video.srcObject = stream;
        })
        .catch( (error) => {
            //console.log("Video error");
        });
    }


    $(window).resize( () => {
        let height = $('.date-time-container').outerHeight() * .85;

        $('#weather-icon').css('height', `${height}px`);

        $('.temperature').css({
            'font-size': ((height) * 1.1) + 'px'
        });

    });
    $(window).resize();
});






