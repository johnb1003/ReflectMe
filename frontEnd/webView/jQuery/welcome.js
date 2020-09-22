const baseAPIURL = "https://reflectme.tech/api/v1";

var accountData;

let scheduledMonthData = {};

function setCookie(key, value) {
    document.cookie = key + "=" + value + ";";
}

function getCookie(key) {
    let name = key + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let  cookie = decodedCookie.split(';');
    for(let i = 0; i <cookie.length; i++) {
      let c = cookie[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
}

// Check for token cookie
let JWToken = getCookie("reflectme-token");

if(JWToken == "") {
    alert("Must be logged in to access this page.")
    window.location.href = "landing.html";
}

getAccountData();

function getAccountData() {
    return $.ajax({
        type: "GET",
        url: baseAPIURL+"/accounts/info",
        contentType: "application/json",
        headers: {
            'Authorization': 'Bearer ' + JWToken
        },
        success: function(data, status, xhr)    {
            accountData = data;
            $('#hello-message').text("Hello " + accountData.fName + ",");
            $('#welcome-image').css('height', `${$('.welcome-container').height() - $('#welcome-message').outerHeight(true)}px`);
        },
        failure: function(errMsg) {alert(errMsg);}
    });
}



function getDateString() {
    let today = new Date();
    let year = ''+today.getFullYear();
    let month = ''+(today.getMonth()+1);
    let day = ''+today.getDate();

    if (month.length < 2) {
        month = '0' + month;
    }

    if (day.length < 2) {
        day = '0' + day;
    }

    let stringDate = [year, month, day].join('-');

    return stringDate;
}

// Load user Month data
async function getScheduledData() {
    let dateString = getDateString();
    $.ajax({
        type: "GET",
        url: baseAPIURL+'/events/day/'+dateString,
        contentType: "application/json",
        headers: {
            'Authorization': 'Bearer ' + JWToken
        },
        success: function(data, status, xhr)    {
            scheduledData = data;
            displayScheduledEvents(data);
        },
        failure: function(errMsg) {alert(errMsg);}
    });
}


function displayScheduledEvents(data) {
    let cardioData = data.cardio;
    let strengthData = data.strength;

    let scheduledEventsHTML = '';

    cardioData.forEach(element => {
        noEvents = false;
        let durationExists = true;
        if(element.time == null || element.time == 0) {
            durationExists = false;
        }
        scheduledEventsHTML += '<div class="day-view-row full-cardio-row" id="full-week-cardio-'+element.cardioid+'">';
        scheduledEventsHTML += '<div class="day-view-row-top">';
        scheduledEventsHTML += '<p class="day-view-type">'+element.status.charAt(0).toUpperCase()+element.status.slice(1)+'</p>';
        scheduledEventsHTML += '<p class="day-view-title">'+element.cardiotype.charAt(0).toUpperCase()+element.cardiotype.slice(1)+'</p>';
        scheduledEventsHTML += '<button class="day-view-dropdown-button" id="cardio-view-dropdown-button-'+element.cardioid+'">&#9660;</button>';
        scheduledEventsHTML += '</div>';
        scheduledEventsHTML += '<div class="day-view-row-dropdown" id="cardio-view-dropdown-'+element.cardioid+'">';
        scheduledEventsHTML += '<div class="day-view-details">';
        scheduledEventsHTML += getDistanceHTML(element.distance);
        if(durationExists) {
            scheduledEventsHTML += getDurationHTML(element.time);
        }
        scheduledEventsHTML += '</div></div></div>';
    });


    strengthData.forEach(element => {
        noEvents = false;
        scheduledEventsHTML += '<div class="day-view-row full-strength-row" id="full-week-strength-'+element.strengthid+'">';
        scheduledEventsHTML += '<div class="day-view-row-top">';
        scheduledEventsHTML += '<p class="day-view-type">'+element.status.charAt(0).toUpperCase()+element.status.slice(1)+'</p>';
        scheduledEventsHTML += '<p class="day-view-title">'+element.strengthtype.charAt(0).toUpperCase()+element.strengthtype.slice(1)+'</p>';
        scheduledEventsHTML += '<button class="day-view-dropdown-button" id="strength-view-dropdown-button-'+element.strengthid+'">&#9660;</button>';
        scheduledEventsHTML += '</div>';
        scheduledEventsHTML += '<div class="day-view-row-dropdown" id="strength-view-dropdown-'+element.strengthid+'">';
        scheduledEventsHTML += '<div class="day-view-details">';
        if(element.strengthtype.toLowerCase() == 'lift') {
            scheduledEventsHTML += getLiftHTML(element.lifts);
        }
        else {
            scheduledEventsHTML += '<p class="day-view-placeholder"> </p>';
        }
        scheduledEventsHTML += '</div></div></div>';
    });

    if(cardioData.length === 0 && strengthData.length === 0) {
        scheduledEventsHTML += '<div id="no-events-container">';
        scheduledEventsHTML += '<p class="no-events-message-pc">No events set for today.</p>';
        scheduledEventsHTML += `<p class="no-events-message-pc">Let's get some scheduled!</p>`;
        scheduledEventsHTML += '<p class="no-events-message-mobile">No events scheduled</p>';
        scheduledEventsHTML += '</div>';
        $('#scheduled-events-list').html(scheduledEventsHTML);

        $('#no-events-container').css('height', `${$('#scheduled-events-list').height()}px`);
        $('#no-events-container').css('display', 'flex');
    }
    else {
        $('#no-events-container').css('display', 'none');
        $('#scheduled-events-list').html(scheduledEventsHTML);
    }

    $('.day-view-dropdown-button').click( (e) => {
        // id="cardio-view-dropdown-#" or id="strength-view-dropdown-#"
        let id = $(e.target).attr('id');
        let idNum = $(e.target).attr('id').replace( /[^\d.]/g, '' );
        if(id.includes('cardio')) {
            if($('#cardio-view-dropdown-'+idNum).css('display') == 'none') {
                $('#cardio-view-dropdown-'+idNum).css('display', 'flex');
                $('#cardio-view-dropdown-button-'+idNum).html('&#9650;');
            }
            else {
                $('#cardio-view-dropdown-'+idNum).css('display', 'none');
                $('#cardio-view-dropdown-button-'+idNum).html('&#9660;');
            }
        }
        else if(id.includes('strength')) {
            if($('#strength-view-dropdown-'+idNum).css('display') == 'none') {
                $('#strength-view-dropdown-'+idNum).css('display', 'flex');
                $('#strength-view-dropdown-button-'+idNum).html('&#9650;');
            }
            else {
                $('#strength-view-dropdown-'+idNum).css('display', 'none');
                $('#strength-view-dropdown-button-'+idNum).html('&#9660;');
            }
        }
    });
}

function getDistanceHTML(dist) {
    let distHTML = '<div class="day-view-distance-container">';
    distHTML += '<p class="day-view-distance-label">Distance:&nbsp;</p>';
    distHTML += '<p class="day-view-distance">'+dist+'</p>';
    if(dist > 1) {
        distHTML += '<p class="day-view-distance-miles">&nbsp;miles</p>';
    }
    else {
        distHTML += '<p class="day-view-distance-miles">&nbsp;mile</p>';
    }
    distHTML += '</div>';

    return distHTML;
}

function getDurationHTML(dur) {
    let duration = parseInt(dur);
    let durHTML = '<div class="day-view-duration">';
    durHTML += '<p class="day-view-duration-label">Time:&nbsp;</p>';
    if(Math.floor(duration / 3600) > 0) {
        durHTML += '<p class="day-view-duration-num">'+Math.floor(duration / 3600)+'</p>';
        durHTML += '<p class="day-view-duration-unit">h&nbsp;</p>';
        duration = duration % 3600;
    }

    if(Math.floor(duration / 60) > 0) {
        durHTML += '<p class="day-view-duration-num">'+Math.floor(duration / 60)+'</p>';
        durHTML += '<p class="day-view-duration-unit">m&nbsp;</p>';
        duration = duration % 60;
    }

    if(duration > 0) {
        durHTML += '<p class="day-view-duration-num">'+duration+'</p>';
        durHTML += '<p class="day-view-duration-unit">s</p>';
    }

    durHTML += '</div>';
    return durHTML;
}

function getLiftHTML(liftList) {
    liftArr = liftList.split(', ');
    let liftHTML = '';
    let liftString = '';
    for(let i=0; i<liftArr.length; i++) {
        liftString += liftArr[i].charAt(0).toUpperCase()+liftArr[i].slice(1);
        if(i == liftArr.length-2) {
            liftString += ' & ';
        }
        else if(i < liftArr.length-1) {
            liftString += ', ';
        }
    }
    liftHTML += '<p class="day-view-lifts">'+liftString+'</p>';
    return liftHTML;
}

getScheduledData();
$(document).ready(function() {
    $(window).resize( () => {
        $('#no-events-container').css('height', `${$('#scheduled-events-list').height()}px`);
        $('#welcome-image').css('height', `${$('.welcome-container').height() - $('#welcome-message').outerHeight(true)}px`);
    });
});