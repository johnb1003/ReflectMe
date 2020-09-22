// Regular expression to check valid emails. Source: http://emailregex.com/
const emailRegEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

// Regular expression to check password is only alphanumeric values and length is between 5-20 inclusive. Source: https://stackoverflow.com/questions/4745112/javascript-regex-for-alphanumeric-string-with-length-of-3-5-chars
const passwordRegEx = /^([a-zA-Z0-9]){5,20}$/;

// Regex for name validation
const nameRegEx = /^[a-zA-Z -']{1,30}$/;

// Regex for phone number validation
const phoneRegEx = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;

const baseAPIURL = "https://reflectme.tech/api/v1";

let JWTToken = "empty";

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


    let setEmail = getCookie('reflectme-email');
    if(setEmail != "") {
        $('#signup-email').val(setEmail);
    }

    $('#signup-submit-button').click( () => {

        event.preventDefault();

        if(authenticateSignup()) {
            // Send AJAX POST request to create new user
            $.ajax({
                type: "POST",
                url: baseAPIURL+"/accounts/signup",
                data: JSON.stringify({
                    fName: $('#signup-fname').val(),
                    lName: $('#signup-lname').val(),
                    email: $('#signup-email').val(),
                    phoneNum: $('#signup-phone').val(),
                    password: $('#signup-password').val()
                }),
                contentType: "application/json",
                dataType: "json",
                statusCode:{
                    409: function() {
                        alert("An account with this email already exists!");
                    }
                },
                success: function(data){
                    setCookie('reflectme-email', data.email);
                    window.location.href = "login.html";
                },
                failure: function(errMsg) {
                    alert(errMsg);
                }
            });           
        }
    });


    function authenticateSignup() {
        let valid = true;

        // Check fname validity
        let fname = $('#signup-fname');
        if(!validName(fname.val())) {
            $('#invalid-fname').css('display', 'block');
            $('#signup-fname').css('border', '1px solid red');
            valid = false;
        }
        else {
            $('#invalid-fname').css('display', 'none');
            $('#signup-fname').css('border', 'none');
        }

        // Check lname validity
        let lname = $('#signup-lname');
        if(!validName(lname.val())) {
            $('#invalid-lname').css('display', 'block');
            $('#signup-lname').css('border', '1px solid red');
            valid = false;
        }
        else {
            $('#invalid-lname').css('display', 'none');
            $('#signup-lname').css('border', 'none');
        }

        // Check email validity
        let email = $('#signup-email');
        if(!validEmail(email.val())) {
            $('#invalid-email').css('display', 'block');
            $('#signup-email').css('border', '1px solid red');
            valid = false;
        }
        else {
            $('#invalid-email').css('display', 'none');
            $('#signup-email').css('border', 'none');
        }

        // Check password validity
        let password = $('#signup-password');
        if(!validPassword(password.val())) {
            $('#invalid-password').css('display', 'block');
            $('#signup-password').css('border', '1px solid red');
            valid = false;
        }
        else {
            $('#invalid-password').css('display', 'none');
            $('#signup-password').css('border', 'none');
        }
            
        // Check if confirmation password matches  
        let confirmationPassword = $('#signup-confirm-password');
        if(confirmationPassword.val() != password.val() || confirmationPassword.val() == "") {
            $('#confirm-password-error-message').css('display', 'block');
            $('#signup-confirm-password').css('border', '1px solid red');
            valid = false;
        }
        else {
            $('#confirm-password-error-message').css('display', 'none');
            $('#signup-confirm-password').css('border', 'none');
        }

        return valid;
    }


    function validName(name) {
        if(name == '' || !nameRegEx.test(name)) {
            return false;
        }
        return true;
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
});