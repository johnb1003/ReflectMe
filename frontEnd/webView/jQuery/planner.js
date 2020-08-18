const baseAPIURL = "https://reflectme.tech/api/v1";

var accountData;

let tabSelected = "cardio";

let currentExtended = "";

const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October','November', 'December'];

const weekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const daySuffix = ['th', 'st', 'nd', 'rd', 'th', 'th', 'th', 'th', 'th', 'th'];

let showCardio = true;
let showStrength = true;

let selectedDayType = 'cardio-day-type';
let clickedType = 'cardio-day-type';

let eventType = 'Cardio';

let allMonthData = null;

let collectPastInput = false;


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
                calendarHTML += '<div class="day-block active-day" id="'+dateNum+'"><p class="date-number">'+dateNum+'</p>';
                calendarHTML += '<div class="day-event-container" id="event-'+dateNum+'">';
                if(dataArrived) {
                    if((""+dateNum) in currMonthData) {
                        let dateEvents = currMonthData[(""+dateNum)];
                        let cardioEvents = dateEvents['cardio'];
                        let strengthEvents = dateEvents['strength'];

                        // IF SHOW CARDIO IS CHECKED
                        if(showCardio) {
                            cardioEvents.forEach(element => {
                                calendarHTML += '<div class="day-event-row cardio-row" id="week-'+element.weekID+'">';
                                calendarHTML += '<p class="day-event-title">'+element.cardiotype.charAt(0).toUpperCase()+element.cardiotype.slice(1)+'</p>';
                                calendarHTML += '<p class="day-event-cardio-distance">'+element.distance+'</p>';
                                calendarHTML += '</div>';
                            });
                        }
                        // IF SHOW STRENGTH IS CHECKED
                        if(showStrength) {
                            strengthEvents.forEach(element => {
                                calendarHTML += '<div class="day-event-row strength-row" id="week-'+element.weekID+'">';
                                calendarHTML += '<p class="day-event-title">'+element.strengthtype.charAt(0).toUpperCase()+element.strengthtype.slice(1)+'</p>';
                                calendarHTML += '</div>';
                            });
                        }
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
        
        $('.active-day').click((e) => {
            let idNum = null;
            if($(e.target).attr("id") == undefined) {
                idNum = $(e.target).parent().attr("id");
                if(idNum.length > 2) {
                    idNum = $(e.target).parent().parent().attr("id").substring(6);
                }
                //console.log(idNum);
            }
            else if($(e.target).attr("id").length > 2) {
                //console.log($(e.target).attr("id"));
                idNum = $(e.target).attr("id").substring(6);
                //console.log(idNum);
            }
            else {
                idNum = $(e.target).attr("id");
                //console.log(idNum);
            }
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
    $('.existing-events-container').css('background-image', 'none');
    $('.existing-events-container').css('background-color', 'white');

    processDayView();
}

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
    console.log(dateNum);
    dayViewHTML += '<div class="day-view" id="day-'+dateNum+'">';

    if((currMonthData != undefined) && ((""+dateNum) in currMonthData)) {
        let dateEvents = currMonthData[(""+dateNum)];
        let cardioEvents = dateEvents['cardio'];
        let strengthEvents = dateEvents['strength'];

        cardioEvents.forEach(element => {
            noEvents = false;
            let durationExists = true;
            if(element.time == null || element.time == 0) {
                daurationExists = false;
            }
            dayViewHTML += '<div class="day-view-row full-cardio-row" id="full-week-cardio-'+element.cardio+'">';
            dayViewHTML += '<p class="day-view-type">'+element.status.charAt(0).toUpperCase()+element.status.slice(1)+'</p>';
            dayViewHTML += '<p class="day-view-title">'+element.cardiotype.charAt(0).toUpperCase()+element.cardiotype.slice(1)+'</p>';
            dayViewHTML += '<p class="day-view-distance">'+element.distance+'</p>';
            if(durationExists) {
                dayViewHTML += '<p class="day-view-duration">'+element.time+'</p>';
                viewIDs.cardio[element.cardioid] = '1.5fr 1.5fr 1fr 1fr 1fr';
                //$('#full-week-cardio-'+element.cardioid).css('grid-template-columns', '1fr 1fr 1fr 1fr 1fr');
            }
            else {
                viewIDs.cardio[element.cardioid] = '1.5fr 1.5fr 2fr 1fr';
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
            dayViewHTML += '<p class="day-view-lifts">'+element.lifts+'</p>';
            dayViewHTML += '<div class="day-view-buttons" id="day-view-buttons-'+element.strengthid+'">';
            dayViewHTML += '<button class="day-view-edit-button" id="strength-view-edit-'+element.strengthid+'">Edit</button>';
            dayViewHTML += '<button class="day-view-delete-button" id="strength-view-delete-'+element.strengthid+'">Delete</button>';
            dayViewHTML += '</div></div>';
            viewIDs.strength[element.strengthid] = '1.5fr 1.5fr 2fr 1fr';
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
                        dayViewHTML += '<div class="day-view-row full-cardio-row" id="full-week-cardio'+element.cardioid+'">';
                        dayViewHTML += '<p class="day-view-type">'+element.status.charAt(0).toUpperCase()+element.status.slice(1)+'</p>';
                        dayViewHTML += '<p class="day-view-title">'+element.cardiotype.charAt(0).toUpperCase()+element.cardiotype.slice(1)+'</p>';
                        dayViewHTML += '<p class="day-view-distance">'+element.distance+'</p>';
                        dayViewHTML += '<div class="day-view-buttons" id="day-view-buttons-'+element.cardioid+'">';
                        dayViewHTML += '<button class="day-view-edit-button" id="cardio-view-edit-'+element.cardioid+'">Edit</button>';
                        dayViewHTML += '<button class="day-view-delete-button" id="cardio-view-delete-'+element.cardioid+'">Delete</button>';
                        dayViewHTML += '</div></div>';
                        viewIDs.cardio[element.cardioid] = '1.5fr 1.5fr 2fr 1fr';
                        //$('#full-week-cardio-'+element.cardioid).css('grid-template-columns', '1fr 1fr 2fr 1fr');
                    }
                });
            
                strengthWeekEvents.forEach(element => {
                    if(((dateNum+(calendar.firstDay-1))%7) == element.dayofweek) {
                        noEvents = false;
                        dayViewHTML += '<div class="day-view-row full-strength-row" id="full-week-strength-'+element.strengthid+'">';
                        dayViewHTML += '<p class="day-view-type">'+element.status.charAt(0).toUpperCase()+element.status.slice(1)+'</p>';
                        dayViewHTML += '<p class="day-view-title">'+element.strengthtype.charAt(0).toUpperCase()+element.strengthtype.slice(1)+'</p>';
                        dayViewHTML += '<p class="day-view-lifts">'+element.lifts+'</p>';
                        dayViewHTML += '<div class="day-view-buttons" id="day-view-buttons-'+element.strengthid+'">';
                        dayViewHTML += '<button class="day-view-edit-button" id="strength-view-edit-'+element.strengthid+'">Edit</button>';
                        dayViewHTML += '<button class="day-view-delete-button" id="strength-view-delete-'+element.strengthid+'">Delete</button>';
                        dayViewHTML += '</div></div>';
                        viewIDs.strength[element.strengthid] = '1.5fr 1.5fr 2fr 1fr';
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
}


/*
////////////////////////////////////////////////////////////////////////
////////////////  DISPLAY DATA IN DAY EVENT SCHEDULER   ////////////////
////////////////////////////////////////////////////////////////////////
*/


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
            && ((calendar.dateTense != 'future' && durationString != '') || calendar.dateTense == 'future')) {
        if(!$('.day-submit-button').hasClass('active-submit-button')) {
            enableSubmitButton();
        }
    }
    else if(!$('.day-submit-button').hasClass('disabled-submit-button')) {
        disableSubmitButton();
    }

    if(calendar.dateTense != 'future') {
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
    $('.day-submit-button').removeClass('disabled-submit-button');
    $('.day-submit-button').addClass('active-submit-button');
    $('.day-submit-button').text('Add Event to Calendar');
}

function disableSubmitButton() {
    $('.day-submit-button').addClass('disabled-submit-button');
    $('.day-submit-button').removeClass('active-submit-button');
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

function getAllMonthData() {
    allMonthDataAJAX()
        .then(data => {
            allMonthData = data;
            displayWeeks(allMonthData.weeks);
            calendar.render();
            //console.log(JSON.stringify(allMonthData));
        })
        .catch(error => {
            //console.log(error);
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
    let newWeeksReq = $.ajax({
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

async function createWeekObject(weekObject) {
    let weekData = {
        'weekid': weekObject.weekID,
        'active': !weekObject.active,
        'name': weekObject.weekName
    }
    let weekUpdateReq = $.ajax({
        type: "POST",
        url: baseAPIURL+'/events/week',
        contentType: "application/json",
        headers: {
            'Authorization': 'Bearer ' + JWToken
        },
        data: JSON.stringify(weekData),
        success: function(data, status, xhr)    {
            if(data.updated == true) {
                //console.log("Week successfully created");
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

async function createCardioObject(cardioObject) {
    let cardioUpdateReq = $.ajax({
        type: "POST",
        url: baseAPIURL+'/events/cardio',
        contentType: "application/json",
        headers: {
            'Authorization': 'Bearer ' + JWToken
        },
        data: JSON.stringify(cardioObject),
        success: function(data, status, xhr)    {
            getAllMonthData();
            //console.log("Event Created");
            return true;
        },
        failure: function(errMsg) {alert(errMsg); return false;}
    });
}

async function createStrengthObject(strengthObject) {
    let strengthUpdateReq = $.ajax({
        type: "POST",
        url: baseAPIURL+'/events/strength',
        contentType: "application/json",
        headers: {
            'Authorization': 'Bearer ' + JWToken
        },
        data: JSON.stringify(strengthObject),
        success: function(data, status, xhr)    {
            getAllMonthData();
            //console.log("Event Created");
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
    let weekUpdateReq = $.ajax({
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
    let cardioUpdateReq = $.ajax({
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
    let strengthUpdateReq = $.ajax({
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
    let weekUpdateReq = $.ajax({
        type: "DELETE",
        url: baseAPIURL+'/events/week'+weekid,
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
    let cardioUpdateReq = $.ajax({
        type: "DELETE",
        url: baseAPIURL+'/events/cardio'+cardioid,
        contentType: "application/json",
        headers: {
            'Authorization': 'Bearer ' + JWToken
        },
        success: function(data, status, xhr)    {
            getAllMonthData();
            //console.log("Event Deleted");
            return true;
        },
        failure: function(errMsg) {alert(errMsg); return false;}
    });
}

async function deleteStrengthObject(strengthid) {
    let strengthUpdateReq = $.ajax({
        type: "DELETE",
        url: baseAPIURL+'/events/strength'+strengthid,
        contentType: "application/json",
        headers: {
            'Authorization': 'Bearer ' + JWToken
        },
        success: function(data, status, xhr)    {
            getAllMonthData();
            //console.log("Event Deleted");
            return true;
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
        showWeeksHTML += '<div class="week-row" id="week-'+element.weekID+'"> <div class="week-display-check"> '
        showWeeksHTML += '<input type="checkbox" class="week-checkbox" id="week-check-'+element.weekID+'" '+checked+'></div>';
        showWeeksHTML += '<p class="week-name">'+element.weekName+'</p> <div class="week-buttons">'; 
        showWeeksHTML += '<button class="edit-week-button" id="'+element.weekID+'">Ed.</button>';
        showWeeksHTML += '<button class="delete-week-button" id="'+element.weekID+'">Del</button> </div> </div>'
    });

    $('.show-weeks-container').append(showWeeksHTML);

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

            $('#day-scheduler-header-title').text('Schedule New Day Event');
            $('.past-input').css('display', 'none');
            collectPastInput = false;

            $('.day-scheduler').css('display', 'block');
            $('.back-to-day-schedule').css('display', 'block');
            $('.existing-events-container').css('background-image', 'linear-gradient(to bottom right, #56B4E3, #4B45BE)');

            $('.pop-up-previous').css('display', 'none');
            $('.pop-up-next').css('display', 'none');
        }
    });

    $('#log-event-button').click( (e) => {
        if($(e.target).hasClass('active-create-event')) {
            $('#log-event-button').css('display', 'none');
            $('#new-event-button').css('display', 'none');
            $('.existing-events').css('display', 'none');

            $('#day-scheduler-header-title').text('Log Completed Day Event');
            $('.past-input').css('display', 'block');
            collectPastInput = true;

            $('.day-scheduler').css('display', 'block');
            $('.back-to-day-schedule').css('display', 'block');
            $('.existing-events-container').css('background-image', 'linear-gradient(to bottom right, #56B4E3, #4B45BE)');

            $('.pop-up-previous').css('display', 'none');
            $('.pop-up-next').css('display', 'none');
        }
    });

    // Closeplanner when back-to-calendar button or background is clicked
    $('#pop-up-background').click( (e) => {
        if($(e.target).attr('class') == 'pop-up') {
            $('.pop-up').css('display', 'none');
            $('.back-to-day-schedule').css('display', 'none')
        }
    });
    
    $('.back-to-calendar').click( () => {
        $('.pop-up').css('display', 'none');
        $('.back-to-day-schedule').css('display', 'none')
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
    $('.active-submit-button').click( () => {
        let urlEndPoint = "";
        let dayEvent = {};

        if(clickedType.includes('cardio')) {
            urlEndPoint = "/cardio";
            dayEvent.cardioType = $('.event-title').text();
            dayEvent.distance = parseFloat($('#cardio-distance-big').val()+'.'+$('#cardio-distance-small').val());
            if(calendar.dateTense != 'future') {
                // Duration
                //day.time = 
                alert('future');
            }
        }
        else if(clickedType.includes('strength')) {
            urlEndPoint = "/strength";
        }
        else {
            urlEndPoint = "/misc";
        }

        // Check calendar.dateTense

        // Get appropriate data
        // Send post ajax
        // Bring back to updated day schedule view
    });
});

function createDayEventAJAX(endPoint, eventData) {
    return dayEventReq = $.ajax({
        type: "POST",
        url: baseAPIURL+endPoint,
        contentType: "application/json",
        data: JSON.stringify(eventData),
        success: function(data, status, xhr)    {
            JWTToken = xhr.getResponseHeader('Authorization');
            setCookie("token", JWTToken);
        },
        failure: function(errMsg) {alert(errMsg);}
    });
}