const baseAPIURL = "https://reflectme.tech/api/v1";

var accountData;

let tabSelected = "cardio";

let currentExtended = "";

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

$(document).ready(function() {

    // Change tabs on planner
    $('.p-tab').click( (e) => {
        let id = $(e.target).attr('id');
        if(tabSelected != id) {
            $('#'+id).css('outline', 'none');
            $('#'+id).css('background-color', '#36495F');

            $('#'+tabSelected).css('background-color', 'rgb(22, 28, 34)');

            $('#'+tabSelected+'-og').css('display', 'none');
            $('#'+id+'-og').css('display', 'block');

            tabSelected = id;
        }
    })

    // Expand planner when a scheduling button is clicked
    $('.schedule-button').click( (e) => {
        let id = $(e.target).attr('id');
        if(currentExtended == "") {
            $('.calendar-container').css('display', 'none');
            $('#'+id+'-extended').css('display', 'block');
        }
        else {
            $('#'+currentExtended).css('display', 'none');
            $('#'+id+'-extended').css('display', 'block');
        }

        currentExtended = id+'-extended';
    })

    // Close extended planner when back-to-calendar button is clicked
    $('.back-to-calendar').click( (e) => {
        $('#'+currentExtended).css('display', 'none');
        $('.calendar-container').css('display', 'block');
        currentExtended = "";
    })

    $("#cardio-datepicker").datepicker({
        onSelect: function(dateText, inst) { 
           var cardioDateAsString = dateText; //the first parameter of this function
           var dateAsObject = $(this).datepicker( 'getDate' ); //the getDate method

           $('#cardio-date-selected').text('Date selected: '+cardioDateAsString);
        }
     });

    $("#strength-datepicker").datepicker({
        onSelect: function(dateText, inst) { 
           var strengthDateAsString = dateText; //the first parameter of this function
           var dateAsObject = $(this).datepicker( 'getDate' ); //the getDate method

           $('#strength-date-selected').text('Date selected: '+strengthDateAsString);
        }
     });

    $("#strength-datepicker").datepicker('show');

    $("#misc-datepicker").datepicker({
        onSelect: function(dateText, inst) { 
           var miscDateAsString = dateText; //the first parameter of this function
           var dateAsObject = $(this).datepicker( 'getDate' ); //the getDate method

           $('#misc-date-selected').text('Date selected: '+miscDateAsString);
        }
     });

    $("#misc-datepicker").datepicker('show');
});