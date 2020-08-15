const baseAPIURL = "https://reflectme.tech/api/v1";

var accountData;

let tabSelected = "cardio";

let currentExtended = "";

const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October','November', 'December'];

const weekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const daySuffix = ['th', 'st', 'nd', 'rd', 'th', 'th', 'th', 'th', 'th', 'th'];

let selectedDayType = 'cardio-day-type';
let clickedType = 'cardio-day-type';

let eventType = 'Cardio';

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
        console.log("NEXT");
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
    }
    
    render() {
        this.renderMonth();
        this.renderDay();
    }
    
    renderMonth() {
        $('#month-year').text(months[this.shownDate[1]] + ' ' + this.shownDate[0]);

        
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
        
        for(let i=0; i<42; i++) {
            if(i < this.firstDay) {
                calendarHTML += '<div class="noclick">&nbsp;</div>';
            }

            else if(i >=  this.firstDay && i < this.numDays + this.firstDay) {  
                let dateNum = i-this.firstDay+1;
                calendarHTML += '<div class="day-block active-day" id="'+dateNum+'">'+dateNum+'</div>';
            }
            else {
                //calendarHTML += '<div class="noclick">&nbsp;</div>';
            }
        }
        $('.grid-container').html(calendarHTML);
        
        $('.active-day').click((e) => {
            let idNum = $(e.target).attr("id");
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
        $('#day-scheduler-header-title').text('Schedule Future Day Event');
        $('.past-input').css('display', 'none');
        if(this.selectedDate[0] <= calendar.today.getFullYear()) {
            if(this.selectedDate[1] <= calendar.today.getMonth()) {
                if(this.selectedDate[2] < calendar.today.getDate()) {
                    this.dateTense = 'past';
                    $('#day-scheduler-header-title').text('Log Completed Day Event');
                    $('.past-input').css('display', 'block');
                }
                else if(this.selectedDate[2] == calendar.today.getDate()) {
                    this.dateTense = 'present';
                    $('#day-scheduler-header-title').text('Log Completed Day Event');
                    $('.past-input').css('display', 'block');
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

            return [weekDay, this.selectedDate[1], this.selectedDate[2]]
        }
    }
}

let calendar = new Calendar(dayClickFunction);

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

function dayClickFunction(weekDay, month, dateNum, suffix, year) {
    $('.pop-up').css('display', 'flex');
    $('#corner-week-day').text(weekDay+',');
    $('#corner-month-date').text(months[month]+' '+dateNum+suffix);

    if(calendar.dateTense == 'future') {
        $('#day-scheduler-header-title').text('Schedule Future Day Event');
    }
    else {
        $('#day-scheduler-header-title').text('Log Completed Day Event');
    }


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
    console.log('Value: '+cardioType);
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
        console.log('Here: '+calendar.dateTense);
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

// Load user Month data
async function getCurrentMonthData(myDate) {
    if(myDate == null) {
        myDate = new Date();
    }
    let myYear = myDate.getFullYear();
    let myMonth = myDate.getMonth()+1;
    if((''+myMonth).length == 1) {
        myMonth = '0'+myMonth;
    }
    let dateString = myYear+'-'+myMonth+'-01';
    return monthDataReq = $.ajax({
        type: "GET",
        url: baseAPIURL+'/events/month/'+dateString,
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
let monthData;
getCurrentMonthData(null)
    .then(data => {
        monthData = data;
        console.log(JSON.stringify(monthData));
    })
    .catch(error => {
        console.log(error);
});


// Load user Week data
async function getWeekData(date) {
    return weekDataReq = $.ajax({
        type: "GET",
        url: baseAPIURL+'/events/weeks',
        contentType: "application/json",
        headers: {
            'Authorization': 'Bearer ' + JWToken
        },
        success: function(data, status, xhr)    {
            displayWeeks(data.weeks);
            return data;
        },
        failure: function(errMsg) {alert(errMsg);}
    });
}
let weekData;
getWeekData(null)
    .then(data => {
        weekData = data.weeks;
        console.log(JSON.stringify(weekData));
    })
    .catch(error => {
        console.log(error);
});

/*
////////////////////////
////EXAMPLE WEEK ROW////
////////////////////////
<div class="week-row">
    <div class="week-display-check">
        <input type="checkbox" id="week-1" name="week-1" value="week-1" checked>
    </div>
    <p class="week-name">Week Name</p>
    <div class="week-buttons">
        <button class="edit-week-button">Ed.</button>
        <button class="delete-week-button">Del</button>
    </div>
</div>
*/
function displayWeeks(weeks) {
    let showWeeksHTML = '';
    let checked = '';
    weeks.forEach(element => {
        checked = '';
        if(element.active) {
            checked = 'checked';
        }
        showWeeksHTML += '<div class="week-row"> <div class="week-display-check"> <input type="checkbox" id="'+element.weekID+'"'+checked+'></div>';
        showWeeksHTML += '<p class="week-name">'+element.weekName+'</p> <div class="week-buttons">'; 
        showWeeksHTML += '<button class="edit-week-button" id="'+element.weekID+'">Ed.</button>';
        showWeeksHTML += '<button class="delete-week-button" id="'+element.weekID+'">Del</button> </div> </div>'
    });

    $('.show-weeks-container').html(showWeeksHTML);
}

$(document).ready(function() {
    //displayWeeks();

    $('#new-event-button').click( () => {
        $('.existing-events').css('display', 'none');
        $('.day-scheduler').css('display', 'block');
        $('.existing-events-container').css('background-image', 'linear-gradient(to bottom right, #56B4E3, #4B45BE)');
    });

    // Close extended planner when back-to-calendar button is clicked
	$('.back-to-cal').click( (e) => {
		$('#'+currentExtended).css('display', 'none');
		$('.calendar-container').css('display', 'block');
		currentExtended = "";
    })

     calendar.init();
    
    $('#pop-up-background').click( (e) => {
        if($(e.target).attr('class') == 'pop-up') {
            $('.pop-up').css('display', 'none');
        }
    });
    
    $('.back-to-calendar').click( () => {
        $('.pop-up').css('display', 'none');
    });

    $('.pop-up-next').click( () => {
        let date = calendar.nextDay();
        $('#corner-week-day').text(weekDays[date[0]]+',');
        $('#corner-month-date').text(months[date[1]]+' '+date[2]+daySuffix[date[2]%10]);
        processType();
    });

    $('.pop-up-previous').click( () => {
        let date = calendar.prevDay();
        $('#corner-week-day').text(weekDays[date[0]]+',');
        $('#corner-month-date').text(months[date[1]]+' '+date[2]+daySuffix[date[2]%10]);
        processType();
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