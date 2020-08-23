const baseAPIURL = "https://reflectme.tech/api/v1";

var accountData;

let tabSelected = "cardio";

let currentExtended = "";

const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October','November', 'December'];

const weekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const shortWeekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const daySuffix = ['th', 'st', 'nd', 'rd', 'th', 'th', 'th', 'th', 'th', 'th'];

let showCardio = true;
let showStrength = true;

let selectedDayType = 'cardio-day-type';
let clickedType = 'cardio-day-type';

let eventType = 'Cardio';

let allMonthData = null;

let collectPastInput = false;

// create, update, or delete
let requestType = 'create';

// scope = solo 'day' event or 'week' event
let createScope = '';
    
let createWeekID = null;

// id of event to be updated
let updateID = null;

// scope = solo 'day' event or 'week' event
let updateScope = '';

let updateWeekID = null;

let deleteScope = '';

// object to update or delete
let submitEventObject = {};

// key=cardioid, value=cardio object
let cardioEventsObject = {};

// key=strengthid, value=strength object
let strengthEventsObject = {};

// Text to set for the event submit button (depending on creating vs editing event)
let activeButtonText = 'Add Event to Calendar';


/*
////////////////////////////////////////////////////////////////////////
////////////////              CALENDAR CLASS            ////////////////
////////////////////////////////////////////////////////////////////////
*/

class Calendar {
    constructor(dayClickFunction) {
        this.dayClickFunction = dayClickFunction
        this.today = new Date();
        this.selectedDate = [this.today.getFullYear(), this.today.getMonth(), this.today.getDate()];
        this.shownDate = [this.selectedDate[0], this.selectedDate[1]];
        this.dateTense = 'present';
        this.fillMonthData();
    }
  
    init() {
        $('.prev-button').click(() => {
            this.prevMonth();
            this.fillMonthData();
            this.render();
        });
    
        $('.next-button').click(() => {
            this.nextMonth();
            this.fillMonthData();
            this.render();
        });
        
        this.render();
    }
    
    nextMonth() {
        //console.log("NEXT");
        if(this.shownDate[1] < 11) {
            this.shownDate[1]++;
        }
        else {
            this.shownDate[1] = 0;
            this.shownDate[0]++;
        }
    }
    
    prevMonth() {
        if(this.shownDate[1] > 0) {
            this.shownDate[1]--;
        }
        else {
            this.shownDate[1] = 11;
            this.shownDate[0]--;
        }
    }
        
    // get first dayand number of days in month
    fillMonthData() {
        let tempDate = new Date(this.shownDate[0], this.shownDate[1], 1);
        this.firstDay = tempDate.getDay();
        this.nextMonth();
        this.numDays = new Date(this.shownDate[0], this.shownDate[1], 0).getDate();
        this.prevMonth();
        if(allMonthData != null && !(this.getFirstDayDateString() in allMonthData.months)) {
            getCurrentMonthData();
        }
    }
    
    render() {
        this.renderMonth();
        this.renderDay();
    }
    
    renderMonth() {

        $('#month-year').text(months[this.shownDate[1]] + ' ' + this.shownDate[0]);

        let futureMonth = false;
        let currentMonth = false;
        if(this.shownDate[0] >= this.today.getFullYear()) {
            if(this.shownDate[1] > this.today.getMonth()) {
                futureMonth = true;
            }
            else if(this.shownDate[1] == this.today.getMonth()) {
                currentMonth = true;
            }
        }
        
        if(this.firstDay + this.numDays <= 35) {
            $('.grid-container').css('grid-template-rows', 'repeat(5, 5.5em)');
            $('.grid-container').css('padding-top', '3.2em');
            $('.grid-container').css('padding-bottom', '3.2em');
        }
        else {
            $('.grid-container').css('grid-template-rows', 'repeat(6, 5.5em)');
            $('.grid-container').css('padding-top', '.3em');
            $('.grid-container').css('padding-bottom', '.3em');
        }
        
        let calendarHTML = '';

        let dataArrived = false;
        let currMonthData = null;
        if((allMonthData != null && allMonthData != undefined) && (this.getFirstDayDateString() in allMonthData.months)) {
            dataArrived = true;
            currMonthData = allMonthData.months[this.getFirstDayDateString()];
        }
        
        for(let i=0; i<42; i++) {
            if(i < this.firstDay) {
                calendarHTML += '<div class="noclick">&nbsp;</div>';
            }

            else if(i >=  this.firstDay && i < this.numDays + this.firstDay) {  
                let dateNum = i-this.firstDay+1;
                calendarHTML += '<div class="day-block active-day number-'+dateNum+'" id="'+dateNum+'"><p class="date-number">'+dateNum+'</p>';
                calendarHTML += '<div class="day-event-container" id="event-'+dateNum+'">';
                if(dataArrived) {
                    if((""+dateNum) in currMonthData) {
                        let dateEvents = currMonthData[(""+dateNum)];
                        let cardioEvents = dateEvents['cardio'];
                        let strengthEvents = dateEvents['strength'];

                        // IF SHOW CARDIO IS CHECKED
                        cardioEvents.forEach(element => {
                            cardioEventsObject[element.cardioid] = element;
                            if(showCardio) {
                                calendarHTML += '<div class="day-event-row cardio-row" id="week-'+element.weekID+'">';
                                calendarHTML += '<p class="day-event-title">'+element.cardiotype.charAt(0).toUpperCase()+element.cardiotype.slice(1)+'</p>';
                                calendarHTML += '<p class="day-event-cardio-distance">'+element.distance+'</p>';
                                calendarHTML += '</div>';
                            }
                        });
                        
                        // IF SHOW STRENGTH IS CHECKED
                        strengthEvents.forEach(element => {
                            strengthEventsObject[element.strengthid] = element;
                            if(showStrength) {
                                calendarHTML += '<div class="day-event-row strength-row" id="week-'+element.weekID+'">';
                                calendarHTML += '<p class="day-event-title">'+element.strengthtype.charAt(0).toUpperCase()+element.strengthtype.slice(1)+'</p>';
                                calendarHTML += '</div>';
                            }
                        });                       
                    }
                    if(futureMonth || (currentMonth && (dateNum >= this.today.getDate()))) {
                        let weeksArr = allMonthData.weeks;
                    
                        weeksArr.forEach(currWeek => {
                            if(currWeek.active) {
                                let cardioWeekEvents = currWeek['cardio'];
                                let strengthWeekEvents = currWeek['strength'];
                                // IF SHOW CARDIO IS CHECKED
                                if(showCardio) {
                                    cardioWeekEvents.forEach(element => {
                                        if(i%7 == element.dayofweek) {
                                            calendarHTML += '<div class="day-event-row cardio-row" id="week-'+element.weekID+'">';
                                            calendarHTML += '<p class="day-event-title">'+element.cardiotype.charAt(0).toUpperCase()+element.cardiotype.slice(1)+'</p>';
                                            calendarHTML += '<p class="day-event-cardio-distance">'+element.distance+'</p>';
                                            calendarHTML += '</div>';
                                        }
                                    });
                                }
                                // IF SHOW STRENGTH IS CHECKED
                                if(showStrength) {
                                    strengthWeekEvents.forEach(element => {
                                        if(i%7 == element.dayofweek) {
                                            calendarHTML += '<div class="day-event-row strength-row" id="week-'+element.weekID+'">';
                                            calendarHTML += '<p class="day-event-title">'+element.strengthtype.charAt(0).toUpperCase()+element.strengthtype.slice(1)+'</p>';
                                            calendarHTML += '</div>';
                                        }
                                    });
                                }
                            }
                        });
                    }
                }
                calendarHTML += '</div></div>';
            }
            else {
                //calendarHTML += '<div class="noclick">&nbsp;</div>';
            }
        }
        $('.grid-container').html(calendarHTML);
        
        $('.active-day').click( (e) => {
            let element = $(e.target);
            let classes = null;
            let idNum = null;
            while(idNum == null) {
                classes = element.attr('class').split(' ');
                for(let i=0; i<classes.length; i++) {
                    console.log(classes[i]);
                    if(classes[i].includes('number-')) {
                        idNum = classes[i].substring(7);
                    }
                }
                element = element.parent();
            }
            console.log(idNum);

            this.newSelectedDate(this.shownDate[0], this.shownDate[1], idNum);
            let weekDay = new Date(this.shownDate[0], this.shownDate[1], idNum).getDay();
            let suffix = daySuffix[idNum % 10];
            this.dayClickFunction(weekDays[weekDay], this.shownDate[1], idNum, suffix, this.shownDate[0]);
        });
    }
    
    renderDay() {
        if(this.shownDate[0] == this.today.getFullYear() && this.shownDate[1] == this.today.getMonth()) {
            if(!$('#'+this.today.getDate()).hasClass('today')) {
                $('#'+this.today.getDate()).addClass('today');
            }
        }
        
        if(this.shownDate[0] == this.selectedDate[0] && this.shownDate[1] == this.selectedDate[1]) {
            if(!$('#'+this.selectedDate[2]).hasClass('selected-day')) {
                $('#'+this.selectedDate[2]).addClass('selected-day');
            }
        }

        this.dateTense = 'future';
        if(this.selectedDate[0] <= calendar.today.getFullYear()) {
            if(this.selectedDate[1] <= calendar.today.getMonth()) {
                if(this.selectedDate[2] < calendar.today.getDate()) {
                    this.dateTense = 'past';
                }
                else if(this.selectedDate[2] == calendar.today.getDate()) {
                    this.dateTense = 'present';
                }
            }
        }
    }
    
    newSelectedDate(year, month, idNum) {
        $('#'+this.selectedDate[2]).removeClass('selected-day');
        this.selectedDate[0] = year;
        this.selectedDate[1] = month;
        this.selectedDate[2] = parseInt(idNum);
        this.renderDay();
        processDayView();
    }

    nextDay() {
        let day = this.selectedDate[2];

        if(parseInt(day)+1 <= this.numDays) {
            this.selectedDate[2] = parseInt(this.selectedDate[2])+1;
            this.render();
            let weekDay = new Date(this.selectedDate[0], this.selectedDate[1], this.selectedDate[2]).getDay();
            return [weekDay, this.selectedDate[1], this.selectedDate[2]];
        }
        // Next day is in a new month
        else {
            this.nextMonth();
            this.fillMonthData();

            this.selectedDate[0] = this.shownDate[0];
            this.selectedDate[1] = this.shownDate[1];
            this.selectedDate[2] = 1;
            this.render();

            let weekDay = new Date(this.selectedDate[0], this.selectedDate[1], this.selectedDate[2]).getDay();

            processDayView();

            return [weekDay, this.selectedDate[1], this.selectedDate[2]]
        }
    }

    prevDay() {
        let day = this.selectedDate[2];

        if(parseInt(day) > 1) {
            this.selectedDate[2] = parseInt(this.selectedDate[2])-1;
            this.render();
            let weekDay = new Date(this.selectedDate[0], this.selectedDate[1], this.selectedDate[2]).getDay();
            return [weekDay, this.selectedDate[1], this.selectedDate[2]];
        }
        // Next day is in a new month
        else {
            this.prevMonth();
            this.fillMonthData();

            this.selectedDate[0] = this.shownDate[0];
            this.selectedDate[1] = this.shownDate[1];
            this.selectedDate[2] = this.numDays;
            this.render();

            let weekDay = new Date(this.selectedDate[0], this.selectedDate[1], this.selectedDate[2]).getDay();

            processDayView();

            return [weekDay, this.selectedDate[1], this.selectedDate[2]]
        }
    }

    getFirstDayDateString() {
        let year = ''+this.shownDate[0];
        let month = ''+(this.shownDate[1] + 1);
    
        if (month.length < 2) {
            month = '0' + month;
        }

        let stringDate = [year, month, '01'].join('-');

        return stringDate;
    }
}

let calendar = new Calendar(dayClickFunction);


/*
////////////////////////////////////////////////////////////////////////
////////////////    COOKIE METHODS TO SAVE USER DATA    ////////////////
////////////////////////////////////////////////////////////////////////
*/

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

let JWToken = getCookie("token");


// Method to call when a day in the calendar view is clicked
function dayClickFunction(weekDay, month, dateNum, suffix, year) {
    $('.pop-up').css('display', 'flex');
    $('#corner-week-day').text(weekDay+',');
    $('#corner-month-date').text(months[month]+' '+dateNum+suffix);


    $('.existing-events').css('display', 'block');
    $('.create-event-button').css('display', 'block');

    $('.pop-up-previous').css('display', 'flex');
    $('.pop-up-next').css('display', 'flex');

    $('.day-scheduler').css('display', 'none');
    $('.create-week-container').css('display', 'none');
    $('.existing-events-container').css('background-image', 'none');
    $('.existing-events-container').css('background-color', 'white');

    processDayView();
}


/*
////////////////////////////////////////////////////////////////////////
///////////////    HELPER METHODS FOR processDayView()   ///////////////
////////////////////////////////////////////////////////////////////////
*/


function getDistanceHTML(dist) {
    let distHTML = '<div class="day-view-distance-container">';
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

    if(Math.floor(duration / 3600) > 0) {
        durHTML += '<p class="day-view-duration-num">'+Math.floor(duration / 3600)+'</p>';
        durHTML += '<p class="day-view-distance-label">h&nbsp;</p>';
        duration = duration % 3600;
    }

    console.log(Math.floor(duration / 60));
    if(Math.floor(duration / 60) > 0) {
        durHTML += '<p class="day-view-duration-num">'+Math.floor(duration / 60)+'</p>';
        durHTML += '<p class="day-view-distance-label">m&nbsp;</p>';
        duration = duration % 60;
        console.log(duration);
    }

    if(duration > 0) {
        durHTML += '<p class="day-view-duration-num">'+duration+'</p>';
        durHTML += '<p class="day-view-distance-label">s</p>';
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


/*
////////////////////////////////////////////////////////////////////////
///////////////      DISPLAY DATA IN DAY VIEW POP UP      //////////////
////////////////////////////////////////////////////////////////////////
*/

function processDayView() {

    // Handle create-event-button activity
    $('#log-event-button').removeClass('active-create-event');
    $('#new-event-button').removeClass('active-create-event');
    $('#log-event-button').removeClass('inactive-create-event');
    $('#new-event-button').removeClass('inactive-create-event');
    if(calendar.dateTense == 'future') {
        $('#new-event-button').addClass('active-create-event');
        $('#log-event-button').addClass('inactive-create-event');
    }
    else if(calendar.dateTense == 'past') {
        $('#log-event-button').addClass('active-create-event');
        $('#new-event-button').addClass('inactive-create-event');
    }
    else if(calendar.dateTense == 'present') {
        $('#new-event-button').addClass('active-create-event');
        $('#log-event-button').addClass('active-create-event');
    }

    let weekDay = new Date(calendar.selectedDate[0], calendar.selectedDate[1], calendar.selectedDate[2]).getDay();
    $('#corner-week-day').text(weekDays[weekDay]+',');
    $('#corner-month-date').text(months[calendar.selectedDate[1]]+' '+date[2]+daySuffix[calendar.selectedDate[2]%10]);

    let futureMonth = false;
    let currentMonth = false;
    if(calendar.shownDate[0] >= calendar.today.getFullYear()) {
        if(calendar.shownDate[1] > calendar.today.getMonth()) {
            futureMonth = true;
        }
        else if(calendar.shownDate[1] == calendar.today.getMonth()) {
            currentMonth = true;
        }
    }

    dayViewHTML = '';

    let currMonthData = allMonthData.months[calendar.getFirstDayDateString()];

    let noEvents = true;

    let viewIDs = {};
    viewIDs.cardio = {};
    viewIDs.strength = {}; 

    let dateNum = calendar.selectedDate[2];
    //console.log(dateNum);
    dayViewHTML += '<div class="day-view" id="day-'+dateNum+'">';

    if((currMonthData != undefined) && ((""+dateNum) in currMonthData)) {
        let dateEvents = currMonthData[(""+dateNum)];
        let cardioEvents = dateEvents['cardio'];
        let strengthEvents = dateEvents['strength'];

        cardioEvents.forEach(element => {
            noEvents = false;
            let durationExists = true;
            if(element.time == null || element.time == 0) {
                durationExists = false;
            }
            dayViewHTML += '<div class="day-view-row full-cardio-row" id="full-week-cardio-'+element.cardioid+'">';
            dayViewHTML += '<p class="day-view-type">'+element.status.charAt(0).toUpperCase()+element.status.slice(1)+'</p>';
            dayViewHTML += '<p class="day-view-title">'+element.cardiotype.charAt(0).toUpperCase()+element.cardiotype.slice(1)+'</p>';
            dayViewHTML += getDistanceHTML(element.distance);
            if(durationExists) {
                dayViewHTML += getDurationHTML(element.time);
                viewIDs.cardio[element.cardioid] = '1.3fr 1fr 1fr 1fr 1.2fr';
                //$('#full-week-cardio-'+element.cardioid).css('grid-template-columns', '1fr 1fr 1fr 1fr 1fr');
            }
            else {
                viewIDs.cardio[element.cardioid] = '1.3fr 1fr 2fr 1.2fr';
                //$('#full-week-strength-'+element.cardioid).css('grid-template-columns', '1fr 1fr 2fr 1fr');
            }
            dayViewHTML += '<div class="day-view-buttons" id="day-view-buttons-'+element.cardioid+'">';
            dayViewHTML += '<button class="day-view-edit-button" id="cardio-view-edit-'+element.cardioid+'">Edit</button>';
            dayViewHTML += '<button class="day-view-delete-button" id="cardio-view-delete-'+element.cardioid+'">Delete</button>';
            dayViewHTML += '</div></div>';
        });
    
    
        strengthEvents.forEach(element => {
            noEvents = false;
            dayViewHTML += '<div class="day-view-row full-strength-row" id="full-week-strength-'+element.strengthid+'">';
            dayViewHTML += '<p class="day-view-type">'+element.status.charAt(0).toUpperCase()+element.status.slice(1)+'</p>';
            dayViewHTML += '<p class="day-view-title">'+element.strengthtype.charAt(0).toUpperCase()+element.strengthtype.slice(1)+'</p>';
            if(element.strengthtype.toLowerCase() == 'lift') {
                dayViewHTML += getLiftHTML(element.lifts);
            }
            else {
                dayViewHTML += '<p class="day-view-placeholder"> </p>';
            }
            dayViewHTML += '<div class="day-view-buttons" id="day-view-buttons-'+element.strengthid+'">';
            dayViewHTML += '<button class="day-view-edit-button" id="strength-view-edit-'+element.strengthid+'">Edit</button>';
            dayViewHTML += '<button class="day-view-delete-button" id="strength-view-delete-'+element.strengthid+'">Delete</button>';
            dayViewHTML += '</div></div>';
            viewIDs.strength[element.strengthid] = '1.3fr 1fr 2fr 1.2fr';
            //$('#full-week-strength-'+element.strengthid).css('grid-template-columns', '1fr 1fr 2fr 1fr');
        });
        
    }
    if(futureMonth || (currentMonth && (dateNum >= calendar.today.getDate()))) {
        let weeksArr = allMonthData.weeks;
                
        weeksArr.forEach(currWeek => {
            if(currWeek.active) {
                let cardioWeekEvents = currWeek['cardio'];
                let strengthWeekEvents = currWeek['strength'];
            
                cardioWeekEvents.forEach(element => {
                    if(((dateNum+(calendar.firstDay-1))%7) == element.dayofweek) {
                        noEvents = false;
                        dayViewHTML += '<div class="day-view-row full-cardio-row" id="full-week-cardio-'+element.cardioid+'">';
                        dayViewHTML += '<p class="day-view-type">'+element.status.charAt(0).toUpperCase()+element.status.slice(1)+'</p>';
                        dayViewHTML += '<p class="day-view-title">'+element.cardiotype.charAt(0).toUpperCase()+element.cardiotype.slice(1)+'</p>';
                        dayViewHTML += getDistanceHTML(element.distance);
                        dayViewHTML += '<div class="day-view-buttons" id="day-view-buttons-'+element.cardioid+'">';
                        dayViewHTML += '<button class="day-view-edit-cardio-week-button" id="cardio-view-edit-week-'+element.cardioid+'">Edit Week Event</button>';
                        dayViewHTML += '</div></div>';
                        viewIDs.cardio[element.cardioid] = '1.3fr 1fr 2fr 1.2fr';
                        //$('#full-week-cardio-'+element.cardioid).css('grid-template-columns', '1fr 1fr 2fr 1fr');
                    }
                });
            
                strengthWeekEvents.forEach(element => {
                    if(((dateNum+(calendar.firstDay-1))%7) == element.dayofweek) {
                        noEvents = false;
                        dayViewHTML += '<div class="day-view-row full-strength-row" id="full-week-strength-'+element.strengthid+'">';
                        dayViewHTML += '<p class="day-view-type">'+element.status.charAt(0).toUpperCase()+element.status.slice(1)+'</p>';
                        dayViewHTML += '<p class="day-view-title">'+element.strengthtype.charAt(0).toUpperCase()+element.strengthtype.slice(1)+'</p>';
                        if(element.strengthtype.toLowerCase() == 'lift') {
                            dayViewHTML += getLiftHTML(element.lifts);
                        }
                        else {
                            dayViewHTML += '<p class="day-view-placeholder"> </p>';
                        }
                        dayViewHTML += '<div class="day-view-buttons" id="day-view-buttons-'+element.strengthid+'">';
                        dayViewHTML += '<button class="day-view-edit-strength-week-button" id="strength-view-edit-week-'+element.strengthid+'">Edit Week Event</button>';
                        dayViewHTML += '</div></div>';
                        viewIDs.strength[element.strengthid] = '1.3fr 1fr 2fr 1.2fr';
                        //$('#full-week-strength-'+element.strengthid).css('grid-template-columns', '1fr 1fr 2fr 1fr');
                    }
                });
            }
        });
    }
    if(noEvents) {
        dayViewHTML += '<p class="no-events-message">No Events Scheduled</p>';
    }
    dayViewHTML += '</div>';
    $('.events-list').html(dayViewHTML);

    let cardioIDs = Object.keys(viewIDs.cardio);
    let strengthIDs = Object.keys(viewIDs.strength);

    while(cardioIDs.length > 0) {
        let cardioKey = cardioIDs.pop();
        $('#full-week-cardio-'+cardioKey).css('grid-template-columns', viewIDs.cardio[cardioKey]);
    }
    while(strengthIDs.length > 0) {
        let strengthKey = strengthIDs.pop();
        $('#full-week-strength-'+strengthKey).css('grid-template-columns', viewIDs.strength[strengthKey]);
    }

    $('.day-view-edit-button').click( (e) => {
        // id="cardio-view-edit-#" or id="strength-view-edit-#"
        let id = $(e.target).attr('id');
        let eventArr = null;
        let idNum = null;
        let event = null;
        if(id.includes('cardio')) {
            idNum = parseInt(id.substring(17));
            eventArr = allMonthData.months[calendar.getFirstDayDateString()][''+calendar.selectedDate[2]]['cardio'];
            eventArr.forEach( element => {
                if(element.cardioid == idNum) {
                    event = element;
                }
            });
            console.log("Edit Cardio: ");
            console.log(event);
            editCardioEvent(event);
        }
        else if(id.includes('strength')) {
            idNum = id.substring(19);
            eventArr = allMonthData.months[calendar.getFirstDayDateString()][''+calendar.selectedDate[2]]['strength'];
            eventArr.forEach( element => {
                if(element.strengthid == idNum) {
                    event = element;
                }
            });
            console.log("Edit Strength: ");
            console.log(event);
            editStrengthEvent(event);
        }
    });

    $('.day-view-delete-button').click( async (e) => {
        // id="cardio-view-delete-#" or id="strength-view-delete-#"
        let id = $(e.target).attr('id');
        let idNum = null;
        let event = null;
        deleteScope = 'day'
        if(id.includes('cardio')) {
            idNum = parseInt(id.substring(19));
            if(window.confirm("Are you sure you want to delete this event?")) {
                event = await deleteCardioObject(idNum);
            }
            console.log("Delete Cardio: "+idNum);
        }
        else if(id.includes('strength')) {
            idNum = parseInt(id.substring(21));
            if(window.confirm("Are you sure you want to delete this event?")) {
                event = await deleteStrengthObject(idNum);
            }
            console.log("Delete Strength: "+idNum);
        }

        if(event) {
            await getAllMonthData();
            console.log(allMonthData);
            processDayView();
            if(deleteScope == 'day') {
                backToDaySchedule();
            }
            else if(deleteScope == 'week'){
                backToCalendar();
            }
        }
        else {
            console.log("Could not delete event")
        }
    });

    $('.day-view-edit-cardio-week-button').click( async (e) => {
        let cardioID = $(e.target).attr('id').replace( /[^\d.]/g, '' );
        console.log(cardioID);
        console.log(cardioEventsObject);
        if(cardioID in cardioEventsObject) {
            editCardioEvent(cardioEventsObject[cardioID]);
        }
        else {
            console.log(cardioEventsObject);
        }
    });

    $('.day-view-edit-strength-week-button').click( async (e) => {
        let strengthID = $(e.target).attr('id').replace( /[^\d.]/g, '' );
        console.log(strengthID);
        console.log(strengthEventsObject);
        if(strengthID in strengthEventsObject) {
            editStrengthEvent(strengthEventsObject[strengthID]);
        }
        else {
            console.log(strengthEventsObject);
        }
    });
}


/*
////////////////////////////////////////////////////////////////////////
///////////////      DISPLAY DATA IN DAY VIEW POP UP      //////////////
////////////////////////////////////////////////////////////////////////
*/

function processSchedulerView() {
    // Check collectPastInput 

    // Check selected type (cardio, strength)

    // Show corresponding sections / inputs

    // 
}

function clearFormData() {
    // Clear cardio data
    $('#cardio-type').val('Run');
    $('#cardio-distance-big').val(0);
    $('#cardio-distance-small').val(0);
    $('#cardio-other-name').val('Other');
    $('#cardio-duration-h').val(0);
    $('#cardio-duration-m').val(0);
    $('#cardio-duration-s').val(0);
    $('#dow-selector-cardio').val('0');

    // Clear strength data
    $('#strength-type').val('Lift');
    let checkedLifts = $('.lift-type-pair input[type=checkbox]:checked');
    console.log(checkedLifts);
    for(let i=0; i<checkedLifts.length; i++) {
        $('#'+checkedLifts[i].value.toLowerCase()).prop('checked', false);
    }
    $('#strength-other-name').val('Other');
    $('#dow-selector-strength').val('0');

    $('.dow-selector-container').css('display', 'none');

    setClickedType('cardio');

    processDayView();

    disableSubmitButton();
}


/*
////////////////////////////////////////////////////////////////////////
////////////////  DISPLAY DATA IN DAY EVENT SCHEDULER   ////////////////
////////////////////////////////////////////////////////////////////////
*/

function setClickedType(typeString) {
    if(typeString == 'cardio') {
        clickedType = 'cardio-day-type';
    }
    else if(typeString == 'strength') {
        clickedType = 'strength-day-type';
    }
    else if(typeString == 'misc') {
        clickedType = 'misc-day-type';
    }
    else {
        return; 
    }
    if(selectedDayType != clickedType) {
        $('#'+selectedDayType).removeClass('button-clicked');
        $('#'+clickedType).addClass('button-clicked');
        
        $('#'+selectedDayType+'-input').css('display', 'none');
        $('#'+clickedType+'-input').css('display', 'block');
        

        //('#type-name').text(eventType+' Event');
        
        selectedDayType = clickedType;
    }
    processType();
}

function getLiftSchedule() {
    let checkedLifts = $('.lift-type-pair input[type=checkbox]:checked');
    return checkedLifts;
}

function displayCardio() {
    let cardioType = $('#cardio-type').val();
    let cardioDistance = $('#cardio-distance-big').val()+'.'+$('#cardio-distance-small').val();
    let durationH = $('#cardio-duration-h').val();
    let durationHString = "";
    if(durationH > 0) {
        durationHString = durationH + 'h ';
    }
    let durationM = $('#cardio-duration-m').val();
    let durationMString = "";
    if(durationM > 0) {
        durationMString = durationM + 'm ';
    }
    let durationS = $('#cardio-duration-s').val();
    let durationSString = "";
    if(durationS > 0) {
        durationSString = durationS + 's';
    }
    let durationString = durationHString + durationMString + durationSString;
    let eventSummaryHTML = '';
    //console.log('Value: '+cardioType);
    if(cardioType != 'Other') {
        $('.cardio-other-group').css('display', 'none');
        $('.event-title').text(cardioType);
        $('.cardio-distance-group').css('display', 'block');
    }
    else {
        $('.event-title').text($('#cardio-other-name').val());
        $('.cardio-other-group').css('display', 'block');
    }

    eventSummaryHTML += '<p class="event-distance">'+ cardioDistance +'</p> <p class="miles">mile(s)</p>';
    if(cardioDistance != '0.0' && !(cardioType == 'Other'  && $('#cardio-other-name').val() == "") 
            && ((collectPastInput && durationString != '') || !collectPastInput)) {
        enableSubmitButton();
    }
    else {
        disableSubmitButton();
    }

    if(collectPastInput) {
        //console.log('Here: '+calendar.dateTense);
        eventSummaryHTML += '<p class="event-duration">'+durationString+'</p>';
    }

    $('.event-summary').html(eventSummaryHTML);
}

function processStrengthView() {
    let strengthType = $('#strength-type').val();

    if(strengthType == 'Lift') {
        $('.lift-type').css('display', 'flex');
        displayStrengthLifts();
    }
    else if(strengthType == 'Yoga') {
        $('.lift-type').css('display', 'none');
        displayStrengthYoga()
    }
    else if(strengthType == 'Other'){
        $('.lift-type').css('display', 'none');
        displayStrengthOther();
    }
}

function displayStrengthLifts() {
    $('.strength-other-group').css('display', 'none');
    let strengthType = $('#strength-type').val();
    let eventSummaryHTML = '';

    $('.event-title').text('Lift');
    let liftSchedule = getLiftSchedule();
    console.log('liftSchedule length: '+liftSchedule.length);
    if(liftSchedule.length == 0) {
        disableSubmitButton();
        eventSummaryHTML += '<p>No lifts selected</p>';
    }
    else if(liftSchedule.length < 5) {
        enableSubmitButton();
        $('.lift-grid').css('grid-template-rows', 'repeat('+liftSchedule.length+', 1fr)');
        eventSummaryHTML += '<div class="lift-grid">';
        for(let i=0; i<liftSchedule.length; i++) {
            eventSummaryHTML += '<div>'+liftSchedule[i].value+'</div>';
        }
        eventSummaryHTML += '</div>';
    }
    else if(liftSchedule.length < 7) {
        enableSubmitButton();
        eventSummaryHTML += '<div class="lift-grid-2-3">';
        for(let i=0; i<liftSchedule.length; i++) {
            eventSummaryHTML += '<div>'+liftSchedule[i].value+'</div>';
        }
        eventSummaryHTML += '</div>';
    }
    else {
        enableSubmitButton();
        eventSummaryHTML += '<div class="lift-grid-2-4">';
        for(let i=0; i<liftSchedule.length; i++) {
            eventSummaryHTML += '<div>'+liftSchedule[i].value+'</div>';
        }
        eventSummaryHTML += '</div>';
    }

    $('.event-summary').html(eventSummaryHTML);
}

function displayStrengthYoga() {
    enableSubmitButton();
    $('.strength-other-group').css('display', 'none');
    let strengthType = $('#strength-type').val();
    let eventSummaryHTML = '';

    //eventSummaryHTML += '<p class="event-title">Yoga</p>';
    $('.event-title').text('Yoga');

    $('.event-summary').html(eventSummaryHTML);
}

function displayStrengthOther() {
    $('.strength-other-group').css('display', 'block');
    let eventSummaryHTML = '';

    $('.event-title').text($('#strength-other-name').val());

    if($('#strength-other-name').val() == "") {
        disableSubmitButton();
    }
    else {
        enableSubmitButton();
    }

    $('.event-summary').html(eventSummaryHTML);
}

function enableSubmitButton() {
    if($('.day-submit-button').hasClass('disabled-submit-button')) {
        $('.day-submit-button').removeClass('disabled-submit-button');
    }

    if(!$('.day-submit-button').hasClass('active-submit-button')) {
        $('.day-submit-button').addClass('active-submit-button');
    }

    $('.day-submit-button').text(activeButtonText);
}

function disableSubmitButton() {
    if($('.day-submit-button').hasClass('active-submit-button')) {
        $('.day-submit-button').removeClass('active-submit-button');
    }

    if(!$('.day-submit-button').hasClass('disabled-submit-button')) {
        $('.day-submit-button').addClass('disabled-submit-button');
    }

    $('.day-submit-button').text('Invalid Event');
}

function processType() {
    if(clickedType.includes('cardio')) {
        // eventType = 'Cardio';
        displayCardio();
    }
    else if(clickedType.includes('strength')) {
        // eventType = 'Strength';
        processStrengthView();
    }
    else {
        // eventType = 'Misc.';
    }
}


/*
////////////////////////////////////////////////////////////////////////
////////////////        AJAX LOAD EVENTS DATA           ////////////////
////////////////////////////////////////////////////////////////////////
*/


// Load user Month data
async function allMonthDataAJAX() {
    let dateString = calendar.getFirstDayDateString();
    return monthDataReq = $.ajax({
        type: "GET",
        url: baseAPIURL+'/events/all/'+dateString,
        contentType: "application/json",
        headers: {
            'Authorization': 'Bearer ' + JWToken
        },
        success: function(data, status, xhr)    {
            return data;
        },
        failure: function(errMsg) {alert(errMsg);}
    });
}

async function getAllMonthData() {
    cardioEventsObject = {};
    strengthEventsObject = {};
    await allMonthDataAJAX()
        .then(data => {
            allMonthData = data;
            console.log(allMonthData);
            displayWeeks(allMonthData.weeks);
            calendar.render();
        })
        .catch(error => {
            console.log(error);
        }
    );
}

getAllMonthData();

// Load user Month data
async function getCurrentMonthData() {
    let dateString = calendar.getFirstDayDateString();
    return monthDataReq = $.ajax({
        type: "GET",
        url: baseAPIURL+'/events/month/'+dateString,
        contentType: "application/json",
        headers: {
            'Authorization': 'Bearer ' + JWToken
        },
        success: function(data, status, xhr)    {
            addToAllMonthData(dateString, data);
            calendar.render()
            //console.log(allMonthData);
            return data;
        },
        failure: function(errMsg) {alert(errMsg);}
    });
}

function addToAllMonthData(dateString, data) {
    allMonthData['months'][dateString] = data;
}

function updateWeeks() {
    return $.ajax({
        type: "GET",
        url: baseAPIURL+'/events/weeks',
        contentType: "application/json",
        headers: {
            'Authorization': 'Bearer ' + JWToken
        },
        success: function(data, status, xhr)    {
            allMonthData.weeks = data.weeks;
            calendar.render(); 
        },
        failure: function(errMsg) {alert(errMsg);}
    });
}


/*
////////////////////////////////////////////////////////////////////////
///////////////        AJAX CREATE EVENTS DATA           ///////////////
////////////////////////////////////////////////////////////////////////
*/

async function createWeekObject(newWeekName) {
    let weekData = {
        'active': true,
        'name': newWeekName
    }
    return $.ajax({
        type: "POST",
        url: baseAPIURL+'/events/week',
        contentType: "application/json",
        headers: {
            'Authorization': 'Bearer ' + JWToken
        },
        data: JSON.stringify(weekData),
        success: function(data, status, xhr)    {
            return true;
        },
        failure: function(errMsg) {alert(errMsg);}
    });
}

async function createCardioObject(cardioObject) {
    return $.ajax({
        type: "POST",
        url: baseAPIURL+'/events/cardio',
        contentType: "application/json",
        headers: {
            'Authorization': 'Bearer ' + JWToken
        },
        data: JSON.stringify(cardioObject),
        success: function(data, status, xhr)    {
            return true;
        },
        failure: function(errMsg) {alert(errMsg); return false;}
    });
}

async function createStrengthObject(strengthObject) {
    return $.ajax({
        type: "POST",
        url: baseAPIURL+'/events/strength',
        contentType: "application/json",
        headers: {
            'Authorization': 'Bearer ' + JWToken
        },
        data: JSON.stringify(strengthObject),
        success: function(data, status, xhr)    {
            return true;
        },
        failure: function(errMsg) {alert(errMsg); return false;}
    });
}


/*
////////////////////////////////////////////////////////////////////////
///////////////        AJAX UPDATE EVENTS DATA           ///////////////
////////////////////////////////////////////////////////////////////////
*/

async function updateWeekObject(weekObject) {
    let weekData = {
        'weekid': weekObject.weekID,
        'active': !weekObject.active,
        'name': weekObject.weekName
    }
    return $.ajax({
        type: "PATCH",
        url: baseAPIURL+'/events/week',
        contentType: "application/json",
        headers: {
            'Authorization': 'Bearer ' + JWToken
        },
        data: JSON.stringify(weekData),
        success: function(data, status, xhr)    {
            if(data.updated == true) {
                //console.log("Update Successful");
                updateWeeks();
                return true;
            }
            else {
                return false;
            }
        },
        failure: function(errMsg) {alert(errMsg);}
    });
}

async function updateCardioObject(cardioObject) {
    return $.ajax({
        type: "PATCH",
        url: baseAPIURL+'/events/cardio',
        contentType: "application/json",
        headers: {
            'Authorization': 'Bearer ' + JWToken
        },
        data: JSON.stringify(cardioObject),
        success: function(data, status, xhr)    {
            if(data.updated == true) {
                //console.log("Update Successful");
                getAllMonthData();
                return true;
            }
            else {
                return false;
            }
        },
        failure: function(errMsg) {alert(errMsg);}
    });
}

async function updateStrengthObject(strengthObject) {
    return $.ajax({
        type: "PATCH",
        url: baseAPIURL+'/events/strength',
        contentType: "application/json",
        headers: {
            'Authorization': 'Bearer ' + JWToken
        },
        data: JSON.stringify(strengthObject),
        success: function(data, status, xhr)    {
            if(data.updated == true) {
                //console.log("Update Successful");
                getAllMonthData();
                return true;
            }
            else {
                return false;
            }
        },
        failure: function(errMsg) {alert(errMsg);}
    });
}


/*
////////////////////////////////////////////////////////////////////////
///////////////        AJAX DELETE EVENTS DATA           ///////////////
////////////////////////////////////////////////////////////////////////
*/

async function deleteWeekObject(weekid) {
    return $.ajax({
        type: "DELETE",
        url: baseAPIURL+'/events/week/'+weekid,
        contentType: "application/json",
        headers: {
            'Authorization': 'Bearer ' + JWToken
        },
        success: function(data, status, xhr)    {
            if(data.deleted == true) {
                //console.log("Delete Successful");
                updateWeeks();
                return true;
            }
            else {
                return false;
            }
        },
        failure: function(errMsg) {alert(errMsg);}
    });
}

async function deleteCardioObject(cardioid) {
    return $.ajax({
        type: "DELETE",
        url: baseAPIURL+'/events/cardio/'+cardioid,
        contentType: "application/json",
        headers: {
            'Authorization': 'Bearer ' + JWToken
        },
        success: function(data, status, xhr)    {
            if(data.deleted == true) {
                getAllMonthData();
                return true;
            }
            else {
                return false;
            }
        },
        failure: function(errMsg) {alert(errMsg); return false;}
    });
}

async function deleteStrengthObject(strengthid) {
    return $.ajax({
        type: "DELETE",
        url: baseAPIURL+'/events/strength/'+strengthid,
        contentType: "application/json",
        headers: {
            'Authorization': 'Bearer ' + JWToken
        },
        success: function(data, status, xhr)    {
            if(data.deleted == true) {
                getAllMonthData();
                return true;
            }
            else {
                return false;
            }
        },
        failure: function(errMsg) {alert(errMsg); return false;}
    });
}



/*
////////////////////////////////////////////////////////////////////////
////////////////          DISPLAY EVENTS DATA           ////////////////
/////////////       IN WEEKS SECTION AND ON CALENDAR           /////////
////////////////////////////////////////////////////////////////////////
*/


function displayWeeks(weeks) {
    let showWeeksHTML = '';
    let checked = '';
    weeks.forEach(element => {
        checked = '';
        if(element.active == true) {
            checked = 'checked';
        }
        showWeeksHTML += '<div class="week-row" id="week-'+element.weekID+'"> <div class="week-display-check"> ';
        showWeeksHTML += '<input type="checkbox" class="week-checkbox" id="week-check-'+element.weekID+'" '+checked+'>';
        showWeeksHTML += '<button class="dropdown-week-button up-arrow" id="dropdown-'+element.weekID+'">&#9650;</button></div>';
        showWeeksHTML += '<p class="week-name">'+element.weekName+'</p>';
        showWeeksHTML += '<div class="week-buttons">';
        showWeeksHTML += '<button class="add-week-event-button" id="add-week-event-'+element.weekID+'">&#43;</button>';
        showWeeksHTML += '<button class="delete-week-button" id="delete-week-'+element.weekID+'">Delete</button>';
        showWeeksHTML += '</div> </div>';

        // Prepare dropdown html
        showWeeksHTML += '<div class="week-dropdown" id="week-dropdown-'+element.weekID+'">';
        element.cardio.forEach( event => {
            cardioEventsObject[event.cardioid] = event;
            showWeeksHTML += '<div class="week-dropdown-cardio-event" id="week-dropdown-cardio-event-'+event.cardioid+'">';
            showWeeksHTML += '<p class="week-dropdown-event-dow">'+shortWeekDays[event.dayofweek]+'</p>';
            showWeeksHTML += '<p class="week-dropdown-event-type">'+event.cardiotype.charAt(0).toUpperCase()+event.cardiotype.slice(1)+'</p>';
            showWeeksHTML += '<p class="week-dropdown-cardio-event-distance">'+event.distance+'</p>';
            showWeeksHTML += '<div class="week-dropdown-event-buttons-container">';
            showWeeksHTML += '<button class="week-dropdown-cardio-event-edit">Edit</button>';
            showWeeksHTML += '<button class="week-dropdown-cardio-event-delete">Delete</button>';
            showWeeksHTML += '</div></div>';
        });

        element.strength.forEach( event => {
            strengthEventsObject[event.strengthid] = event;
            showWeeksHTML += '<div class="week-dropdown-strength-event" id="week-dropdown-strength-event-'+event.strengthid+'">';
            showWeeksHTML += '<p class="week-dropdown-event-dow">'+shortWeekDays[event.dayofweek]+'</p>';
            showWeeksHTML += '<p class="week-dropdown-event-type">'+event.strengthtype.charAt(0).toUpperCase()+event.strengthtype.slice(1)+'</p>';
            showWeeksHTML += '<div class="week-dropdown-event-buttons-container">';
            showWeeksHTML += '<button class="week-dropdown-strength-event-edit">Edit</button>';
            showWeeksHTML += '<button class="week-dropdown-strength-event-delete">Delete</button>';
            showWeeksHTML += '</div></div>';
        });
        showWeeksHTML += '</div>';

    });

    $('.show-weeks-container').html(showWeeksHTML);

    $('.week-dropdown-cardio-event-edit').click( (e) => {
        let cardioID = $(e.target).parent().parent().attr('id').replace( /[^\d.]/g, '' );
        console.log(cardioID);
        console.log(cardioEventsObject);
        if(cardioID in cardioEventsObject) {
            console.log("Key in cardioEventsObject");
            editCardioEvent(cardioEventsObject[cardioID]);
        }
        else {
            console.log(cardioEventsObject);
        }
    });

    $('.week-dropdown-cardio-event-delete').click( async (e) => {
        let event = null;
        let cardioID = $(e.target).parent().parent().attr('id').replace( /[^\d.]/g, '' );
        deleteScope = 'week';
        console.log(cardioID);
        console.log(cardioEventsObject);
        if(cardioID in cardioEventsObject) {
            console.log("Key in cardioEventsObject");
            if(window.confirm("Are you sure you want to delete this event?")) {
                event = await deleteCardioObject(parseInt(cardioID));
            }
            console.log("Delete Cardio: "+cardioID);
        }
        else {
            console.log(cardioEventsObject);
        }

        if(event) {
            await getAllMonthData();
            console.log(allMonthData);
            processDayView();
            if(deleteScope == 'day') {
                backToDaySchedule();
            }
            else if(deleteScope == 'week'){
                backToCalendar();
            }
        }
        else {
            alert("Could not delete event")
        }
    });

    $('.week-dropdown-strength-event-edit').click( (e) => {
        let strengthID = $(e.target).parent().parent().attr('id').replace( /[^\d.]/g, '' );
        console.log(strengthID);
        console.log(strengthEventsObject);
        if(strengthID in strengthEventsObject) {
            console.log("Key in strengthEventsObject");
            editStrengthEvent(strengthEventsObject[strengthID]);
        }
        else {
            console.log(strengthEventsObject);
        }
    });

    $('.week-dropdown-strength-event-delete').click( async (e) => {
        let strengthID = $(e.target).parent().parent().attr('id').replace( /[^\d.]/g, '' );
        let event = null;
        deleteScope = 'week';
        console.log(strengthID);
        console.log(strengthEventsObject);
        if(strengthID in strengthEventsObject) {
            console.log("Key in strengthEventsObject");
            if(window.confirm("Are you sure you want to delete this event?")) {
                event = await deleteStrengthObject(parseInt(strengthID));
            }
            console.log("Delete Strength: "+strengthID);
        }
        else {
            console.log(strengthEventsObject);
        }

        if(event) {
            await getAllMonthData();
            console.log(allMonthData);
            processDayView();
            if(deleteScope == 'day') {
                backToDaySchedule();
            }
            else if(deleteScope == 'week'){
                backToCalendar();
            }
        }
        else {
            alert("Could not delete event")
        }
    });

    $('.add-week-event-button').click( (e) => {
        let currWeekID = $(e.target).attr('id').replace( /[^\d.]/g, '' );
        console.log(currWeekID);
        createWeekEvent(currWeekID);
    });

    $('.delete-week-button').click( async (e) => {
        let currWeekID = $(e.target).attr('id').replace( /[^\d.]/g, '' );
        let event = null;
        if(window.confirm("Are you sure you want to delete this week and its corresponding events?")) {
            event = await deleteWeekObject(parseInt(currWeekID));
        }
        console.log("Delete Week: "+currWeekID);

        if(event) {
            await getAllMonthData();
            console.log(allMonthData);
            processDayView();
            if(createScope == 'day') {
                backToDaySchedule();
            }
            else if(createScope == 'week'){
                backToCalendar();
            }
        }
        else {
            alert("Could not delete week")
        }
    });

    $('.dropdown-week-button').click( (e) => {
        let currWeekID = $(e.target).attr('id').replace( /[^\d.]/g, '' );
        console.log(currWeekID);

        if($(e.target).hasClass('up-arrow')) {
            $(e.target).removeClass('up-arrow');
            $(e.target).addClass('down-arrow');
            $('#week-dropdown-'+currWeekID).css('display', 'none');
            $(e.target).html('&#9660;');
        }
        else if($(e.target).hasClass('down-arrow')) {
            $(e.target).removeClass('down-arrow');
            $(e.target).addClass('up-arrow');
            $('#week-dropdown-'+currWeekID).css('display', 'block');
            $(e.target).html('&#9650;');
        }
    });

    $('.week-checkbox').change( (e) => {
        //console.log("Here");
        //console.log("Here: "+$(e.target).attr('id'));
        let currWeekID = $(e.target).attr('id');
        let weeksArr = allMonthData.weeks;
        weeksArr.forEach(element => {
            if(element.weekID == parseInt(currWeekID.substring(11))) {
                if(updateWeekObject(element)) {
                    //console.log($('#'+currWeekID).is(':checked'));
                    element.active = $('#'+currWeekID).is(':checked');
                    //console.log('active: '+element.active);
                }
                else {
                    $('#'+currWeekID).prop( "checked", !$('#'+currWeekID).is(':checked'));
                }
            }
        });
    });

    $('#new-week-button').click( () => { 
        $('.pop-up-planner').css('display', 'none');
        $('.create-week-container').css('display', 'block');
        $('.pop-up-previous').css('display', 'none');
        $('.pop-up-next').css('display', 'none');
        $('.pop-up').css('display', 'flex');
    });
}

function displayCardioMonthData(cardioArr) {
    let cardioEventsHTML = '';
    cardioArr.forEach(element => {
        cardioEventsHTML = '';
        cardioEventsHTML += '<div class="day-event-row cardio-row" id="week-'+element.weekID+'">';
        cardioEventsHTML += '<p class="day-event-title">'+element.cardiotype.charAt(0).toUpperCase()+element.cardiotype.slice(1)+'</p>';
        cardioEventsHTML += '<p class="day-event-cardio-distance">'+element.distance+'</p>';
        cardioEventsHTML += '</div>'
        $('#event-'+getDate(element.date)).append(cardioEventsHTML);
    });
}

function displayStrengthMonthData(strengthArr) {
    let strengthEventsHTML = '';
    strengthArr.forEach(element => {
        strengthEventsHTML = '';
        strengthEventsHTML += '<div class="day-event-row strength-row" id="week-'+element.weekID+'">';
        strengthEventsHTML += '<p class="day-event-title">'+element.strengthtype.charAt(0).toUpperCase()+element.strengthtype.slice(1)+'</p>';
        strengthEventsHTML += '</div>'
        $('#event-'+getDate(element.date)).append(strengthEventsHTML);
    });
}

function getDate(dateString) {
    let dateNum = dateString.substring(dateString.length - 2);
    if(dateNum.charAt(0) == '0') {
        dateNum = dateString.substring(1);
    }
    return dateNum;
}

function getSelectedDateString() {
    let year = ''+calendar.selectedDate[0];
    let month = ''+(calendar.selectedDate[1] + 1);
    let day = ''+calendar.selectedDate[2];

    if (month.length < 2) {
        month = '0' + month;
    }

    if (day.length < 2) {
        day = '0' + day;
    }

    let stringDate = [year, month, day].join('-');

    return stringDate;
}

$(document).ready(function() {
    calendar.init();

    // Side bar show event type (on calendar) buttons
    $('#show-cardio').change( () => {
        showCardio = $('#show-cardio').is(':checked');
        calendar.render();
    });

    $('#show-strength').change( () => {
        showStrength = $('#show-strength').is(':checked');
        calendar.render();
    });


    $('#new-event-button').click( (e) => {
        if($(e.target).hasClass('active-create-event')) {
            $('#log-event-button').css('display', 'none');
            $('#new-event-button').css('display', 'none');
            $('.existing-events').css('display', 'none');

            $('#day-scheduler-header-title').css('padding-top', '.1em');
            $('#day-scheduler-header-title').text('Schedule New Day Event');
            $('.past-input').css('display', 'none');
            collectPastInput = false;

            activeButtonText = 'Add Event to Calendar';
            $('.event-type-selector').css('display', 'flex');
            $('.day-scheduler').css('display', 'block');
            $('.back-to-day-schedule').css('display', 'block');
            $('.existing-events-container').css('background-image', 'linear-gradient(to bottom right, #56B4E3, #4B45BE)');

            $('.pop-up-previous').css('display', 'none');
            $('.pop-up-next').css('display', 'none');

            requestType = 'create';
            createScope = 'day';
        }
    });

    $('#log-event-button').click( (e) => {
        if($(e.target).hasClass('active-create-event')) {
            $('#log-event-button').css('display', 'none');
            $('#new-event-button').css('display', 'none');
            $('.existing-events').css('display', 'none');

            $('#day-scheduler-header-title').css('padding-top', '.1em');
            $('#day-scheduler-header-title').text('Log Completed Day Event');
            $('.past-input').css('display', 'block');
            collectPastInput = true;

            activeButtonText = 'Add Event to Calendar';
            $('.event-type-selector').css('display', 'flex');
            $('.day-scheduler').css('display', 'block');
            $('.back-to-day-schedule').css('display', 'block');
            $('.existing-events-container').css('background-image', 'linear-gradient(to bottom right, #56B4E3, #4B45BE)');

            $('.dow-selector-container').css('display', 'block');

            $('.pop-up-previous').css('display', 'none');
            $('.pop-up-next').css('display', 'none');

            requestType = 'create';
            createScope = 'day';
        }
    });

    // Closeplanner when back-to-calendar button or background is clicked
    $('#pop-up-background').click( (e) => {
        if($(e.target).attr('class') == 'pop-up') {
            $('.pop-up').css('display', 'none');
            $('.pop-up-planner').css('display', 'flex');
            $('.back-to-day-schedule').css('display', 'none')
            clearFormData();
        }
    });
    
    $('.back-to-calendar').click( () => {
        $('.pop-up').css('display', 'none');
        $('.pop-up-planner').css('display', 'flex');
        $('.back-to-day-schedule').css('display', 'none')
        $('.create-week-container').css('display', 'none');
        clearFormData();
    });

    $('.back-to-day-schedule').click( () => {
        $('.existing-events').css('display', 'block');
        $('.create-event-button').css('display', 'block');

        $('.pop-up-previous').css('display', 'flex');
        $('.pop-up-next').css('display', 'flex');


        $('.day-scheduler').css('display', 'none');
        $('.back-to-day-schedule').css('display', 'none');
        $('.existing-events-container').css('background-image', 'none');
        $('.existing-events-container').css('background-color', 'white');

        clearFormData();
    });

    $('.pop-up-next').click( () => {
        let date = calendar.nextDay();
        $('#corner-week-day').text(weekDays[date[0]]+',');
        $('#corner-month-date').text(months[date[1]]+' '+date[2]+daySuffix[date[2]%10]);
        processDayView();
    });

    $('.pop-up-previous').click( () => {
        let date = calendar.prevDay();
        $('#corner-week-day').text(weekDays[date[0]]+',');
        $('#corner-month-date').text(months[date[1]]+' '+date[2]+daySuffix[date[2]%10]);
        processDayView();
    });


    $('.day-type-button').click( (e) => {
        clickedType = $(e.target).attr('id');
        if(selectedDayType != clickedType) {
            $('#'+selectedDayType).removeClass('button-clicked');
            $('#'+clickedType).addClass('button-clicked');
            
            $('#'+selectedDayType+'-input').css('display', 'none');
            $('#'+clickedType+'-input').css('display', 'block');

            
            processType();
            

            //('#type-name').text(eventType+' Event');
          
            selectedDayType = clickedType;
        }
    });

    $('#strength-type').change( () => {
        processStrengthView();
    });

    $('.lift-type-pair input[type=checkbox]').change( () => {
        displayStrengthLifts();
    });

    $('#cardio-type').change( () => {
        displayCardio();
    });

    $('.cardio-distance').change( () => {
        let eventSummaryHTML = '';
        displayCardio();
    });

    $('.cardio-duration').change( () => {
        let eventSummaryHTML = '';
        displayCardio();
    });

    $('#cardio-other-name').keyup( () => {
        $('.event-title').text($('#cardio-other-name').val());
        displayCardio();
    });

    $('#strength-other-name').keyup( () => {
        $('.event-title').text($('#strength-other-name').val());
        processStrengthView();
    });
    
    // Submit past("Completed") or future("Scheduled") day event
    $('.day-submit-button').click( (e) => {
        if($(e.target).hasClass('active-submit-button')) {
            //console.log("Active submit button");
            submitEvent();
        }
    });

    $('#create-week-submit-button').click( async () => { 
        // Check $('#create-week-name').val();
        let newWeekName = $('#create-week-name').val();
        let event = null;
        console.log(newWeekName);
        event = await createWeekObject(newWeekName);

        if(event) {
            await getAllMonthData();
            console.log(allMonthData);
            processDayView();
            backToCalendar();
        }
        else {
            alert("Could not create week")
        }
    });

    $('#create-week-name').keyup( () => {
        //console.log($('#create-week-name').val());
    });
});

async function submitEvent() {
    let dayEvent = {};

    dayEvent.date = getSelectedDateString();

    if(collectPastInput) {
        dayEvent.status = 'completed';
    }
    else {
        dayEvent.status = 'scheduled';
    }



    if(clickedType.includes('cardio')) {
        dayEvent.cardiotype = $('.event-title').text().toLowerCase();
        dayEvent.distance = parseFloat($('#cardio-distance-big').val()+'.'+$('#cardio-distance-small').val());
        if(collectPastInput) {
            dayEvent.time = 3600 * parseInt($('#cardio-duration-h').val()) + 60 * parseInt($('#cardio-duration-m').val()) + parseInt($('#cardio-duration-s').val());
        }

        let event = null;
        // BUFFER WHILE SENDING AJAX
        if(requestType == 'create') {
            if(createScope == 'week') {
                dayEvent.dayofweek = parseInt($('#dow-selector-cardio').val());
                dayEvent.weekid = createWeekID;
            }
            console.log('Event: '+dayEvent);
            event = await createCardioObject(dayEvent);
        }
        else if(requestType == 'update') {
            dayEvent.cardioid = updateID;

            if(updateScope == 'day') {
                console.log('scope = day');
                dayEvent.dayofweek = parseInt(new Date(calendar.selectedDate[0], calendar.selectedDate[1], calendar.selectedDate[2]).getDay());
            }
            else if(updateScope == 'week'){
                console.log('scope = week');
                dayEvent.dayofweek = parseInt($('#dow-selector-cardio').val());
                dayEvent.weekid = updateWeekID;
            }

            console.log(dayEvent);
            if(window.confirm("Are you sure you want to update this event?")) {
                console.log('Event: '+dayEvent);
                event = await updateCardioObject(dayEvent);
            }
        }

        if(event) {
            await getAllMonthData();
            console.log(allMonthData);
            processDayView();
            if(updateScope == 'day') {
                backToDaySchedule();
            }
            else if(updateScope == 'week'){
                backToCalendar();
            }
        }
        else {
            alert("Could not create event")
        }
    }
    else if(clickedType.includes('strength')) {
        urlEndPoint = "events/strength";
        dayEvent.strengthtype = $('.event-title').text().toLowerCase();
        
        if(dayEvent.strengthtype == 'lift') {
            let liftSchedule = getLiftSchedule();
            let liftString = '';
            for(let i=0; i<liftSchedule.length; i++) {
                liftString += liftSchedule[i].value.toLowerCase();
                if(i < liftSchedule.length-1) {
                    liftString += ', ';
                }
            }
            dayEvent.lifts = liftString;
        }

        let event = null;
        // BUFFER WHILE SENDING AJAX
        if(requestType == 'create') {
            if(createScope == 'week') {
                dayEvent.dayofweek = parseInt($('#dow-selector-strength').val());
                dayEvent.weekid = createWeekID;
            }
            console.log('Event: '+dayEvent);
            event = await createStrengthObject(dayEvent);
        }
        else if(requestType == 'update') {
            dayEvent.strengthid = updateID;

            if(updateScope == 'day') {
                console.log('scope = day');
                dayEvent.dayofweek = parseInt(new Date(calendar.selectedDate[0], calendar.selectedDate[1], calendar.selectedDate[2]).getDay());
            }
            else if(updateScope == 'week'){
                console.log('scope = week');
                dayEvent.dayofweek = parseInt($('#dow-selector-strength').val());
                dayEvent.weekid = updateWeekID;
            }

            console.log(dayEvent);
            if(window.confirm("Are you sure you want to update this event?")) {
                console.log('Event: '+dayEvent);
                event = await updateStrengthObject(dayEvent);
            }
        }

        if(event) {
            await getAllMonthData();
            processDayView();
            if(updateScope == 'day') {
                backToDaySchedule();
            }
            else if(updateScope == 'week'){
                backToCalendar();
            }
        }
        else {
            alert("Could not create event");
        }
    }
    else {
        urlEndPoint = "events/misc";
    }
}

function backToDaySchedule() {
    $('.existing-events').css('display', 'block');
    $('.create-event-button').css('display', 'block');

    $('.pop-up-previous').css('display', 'flex');
    $('.pop-up-next').css('display', 'flex');


    $('.day-scheduler').css('display', 'none');
    $('.back-to-day-schedule').css('display', 'none');
    $('.existing-events-container').css('background-image', 'none');
    $('.existing-events-container').css('background-color', 'white');

    clearFormData();
}

function backToCalendar() {
    $('.pop-up').css('display', 'none');
    $('.pop-up-planner').css('display', 'flex');
    $('.back-to-day-schedule').css('display', 'none');
    $('.create-week-container').css('display', 'none');
    clearFormData();
}

function createWeekEvent(weekID) {
    
    // individual day event, or week event?
    createScope = 'week';
    createWeekID = weekID;

    let weeksArr = allMonthData.weeks;
    let weekName = 'Week Event';
                
    weeksArr.forEach(currWeek => { 
        if(currWeek.weekID == weekID) {
            weekName = currWeek.weekName.charAt(0).toUpperCase()+currWeek.weekName.slice(1);
        }
    });

    $('#log-event-button').css('display', 'none');
    $('#new-event-button').css('display', 'none');
    $('.existing-events').css('display', 'none');

    $('#corner-week-day').text('Event belongs to week:');
    $('#corner-month-date').text(weekName);
    $('.pop-up').css('display', 'flex');

    $('#day-scheduler-header-title').css('padding-top', '.1em');
    $('#day-scheduler-header-title').text('Schedule New Event');
    $('.dow-selector-container').css('display', 'block');
    $('.past-input').css('display', 'none');
    collectPastInput = false;

    activeButtonText = 'Add Event to Week';
    $('.event-type-selector').css('display', 'flex');
    $('.back-to-day-schedule').css('display', 'none');
    $('.existing-events-container').css('background-image', 'linear-gradient(to bottom right, #56B4E3, #4B45BE)');


    displayCardio();
    $('.day-scheduler').css('display', 'block');

    $('.pop-up-previous').css('display', 'none');
    $('.pop-up-next').css('display', 'none');

    requestType = 'create';
}


function editCardioEvent(event) {

    console.log('editCardioEvent: '+JSON.stringify(event));

    // individual day event, or week event?
    updateScope = 'day';

    let toCalendar = false;
    // If pop-up is not already visible
    if($('.pop-up').css('display') == 'none') {
        toCalendar = true;
    }
    if(event.weekid != null && event.weekid != undefined) {
        updateScope = 'week';
        updateWeekID = event.weekid;

        let weeksArr = allMonthData.weeks;
        let weekName = 'Week Event';
                    
        weeksArr.forEach(currWeek => { 
            if(currWeek.weekID == event.weekid) {
                weekName = currWeek.weekName.charAt(0).toUpperCase()+currWeek.weekName.slice(1);
            }
        });

        // dayClickFunction(weekDay, month, dateNum, suffix, year)
        $('.pop-up').css('display', 'flex');
        $('#corner-week-day').text('Event belongs to week:');
        $('#corner-month-date').text(weekName);


        activeButtonText = 'Confirm Event Changes';
        $('.existing-events').css('display', 'block');
        $('.create-event-button').css('display', 'block');

        $('.pop-up-previous').css('display', 'flex');
        $('.pop-up-next').css('display', 'flex');

        $('.day-scheduler').css('display', 'none');
        $('.existing-events-container').css('background-image', 'none');
        $('.existing-events-container').css('background-color', 'white');
    }

    $('#log-event-button').css('display', 'none');
    $('#new-event-button').css('display', 'none');
    $('.existing-events').css('display', 'none');
    $('.event-type-selector').css('display', 'none');

    $('#day-scheduler-header-title').css('padding-top', '1em');
    $('#day-scheduler-header-title').text('Edit Existing Event');

    if(updateScope == 'week') {
        $('#dow-selector-cardio').val(''+event.dayofweek);
        $('.dow-selector-container').css('display', 'block');
    }
    else if(updateScope == 'day') {
        $('.dow-selector-container').css('display', 'none');
    }

    if(event.cardiotype.toLowerCase() == 'run' || event.cardiotype.toLowerCase() == 'walk' || 
        event.cardiotype.toLowerCase() == 'hike' || event.cardiotype.toLowerCase() == 'bike') {
        $('#cardio-type').val(event.cardiotype.charAt(0).toUpperCase()+event.cardiotype.slice(1));
    }
    else {
        $('#cardio-type').val('Other');
        $('#cardio-other-name').val(event.cardiotype.charAt(0).toUpperCase()+event.cardiotype.slice(1));
    }

    let dist = parseFloat(event.distance);
    let bigDist = Math.floor(dist);
    let smallDist = Math.floor(10 * (dist - bigDist) + .01);

    $('#cardio-distance-big').val(bigDist);
    $('#cardio-distance-small').val(smallDist);

    if(event.status.toLowerCase() == 'completed' && event.time != null) {
        let dur = event.time;
        let hour = Math.floor(dur / 3600);
        dur = dur % 3600;
        let min = Math.floor(dur / 60);
        dur = dur % 60;
        let sec = dur;
        $('#cardio-duration-h').val(hour);
        $('#cardio-duration-m').val(min);
        $('#cardio-duration-s').val(sec);
        $('.past-input').css('display', 'block');
        collectPastInput = true;
    }
    else {
        $('.past-input').css('display', 'none');
        collectPastInput = false;
    }

    displayCardio();
    $('.day-scheduler').css('display', 'block');
    //if(updateScope == 'day') {
    if(!toCalendar) {
        $('.back-to-day-schedule').css('display', 'block');
    }
    else {
        $('.back-to-day-schedule').css('display', 'none');
    }
    $('.existing-events-container').css('background-image', 'linear-gradient(to bottom right, #56B4E3, #4B45BE)');

    $('.pop-up-previous').css('display', 'none');
    $('.pop-up-next').css('display', 'none');

    updateID = event.cardioid;
    requestType = 'update';
}

function editStrengthEvent(event) {

    // individual day event, or week event?
    updateScope = 'day';

    // If pop-up is not already visible
    if($('.pop-up').css('display') == 'none') {
        updateScope = 'week';
        updateWeekID = event.weekid;

        let weeksArr = allMonthData.weeks;
        let weekName = 'Week Event';
                    
        console.log('Week id: '+ event.weekid);
        weeksArr.forEach(currWeek => { 
            if(currWeek.weekID == event.weekid) {
                weekName = currWeek.weekName.charAt(0).toUpperCase()+currWeek.weekName.slice(1);
                console.log('Week Name: '+ weekName);
            }
        });

        // dayClickFunction(weekDay, month, dateNum, suffix, year)
        $('.pop-up').css('display', 'flex');
        $('#corner-week-day').text('Event belongs to week:');
        $('#corner-month-date').text(weekName);


        activeButtonText = 'Confirm Event Changes';
        $('.existing-events').css('display', 'block');
        $('.create-event-button').css('display', 'block');

        $('.pop-up-previous').css('display', 'flex');
        $('.pop-up-next').css('display', 'flex');

        $('.day-scheduler').css('display', 'none');
        $('.existing-events-container').css('background-image', 'none');
        $('.existing-events-container').css('background-color', 'white');
    }

    $('#log-event-button').css('display', 'none');
    $('#new-event-button').css('display', 'none');
    $('.existing-events').css('display', 'none');
    $('.event-type-selector').css('display', 'none');

    $('#day-scheduler-header-title').css('padding-top', '1em');
    $('#day-scheduler-header-title').text('Edit Existing Event');

    if(updateScope == 'week') {
        $('#dow-selector-strength').val(''+event.dayofweek);
        $('.dow-selector-container').css('display', 'block');
    }
    else if(updateScope == 'day') {
        $('.dow-selector-container').css('display', 'none');
    }

    $('#strength-type').val(event.strengthtype.charAt(0).toUpperCase()+event.strengthtype.slice(1));

    if(event.strengthtype.toLowerCase() == 'lift' || event.strengthtype.toLowerCase() == 'yoga') {
        $('#strength-type').val(event.strengthtype.charAt(0).toUpperCase()+event.strengthtype.slice(1));
    }
    else {
        $('#strength-type').val('Other');
        $('#strength-other-name').val(event.strengthtype.charAt(0).toUpperCase()+event.strengthtype.slice(1));
    }

    if(event.strengthtype.toLowerCase() == 'lift') {
        let liftsString = event.lifts.toLowerCase();
        let liftsArr = liftsString.split(', ');
        liftsArr.forEach( element => {
            $('#'+element).prop('checked', true);
        });
    }

    setClickedType('strength');
    processStrengthView();
    $('.day-scheduler').css('display', 'block');
    if(updateScope == 'day') {
        $('.back-to-day-schedule').css('display', 'block');
    }
    $('.existing-events-container').css('background-image', 'linear-gradient(to bottom right, #56B4E3, #4B45BE)');

    $('.pop-up-previous').css('display', 'none');
    $('.pop-up-next').css('display', 'none');

    updateID = event.strengthid;
    requestType = 'update';
}