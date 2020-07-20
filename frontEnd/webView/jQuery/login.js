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


    let setEmail = getCookie('email');
    if(setEmail != "") {
        $('#email').val(setEmail);
    }

    // Take in login form information
    $('#login-submit-button').click( () => {

        console.log("here!!!!!!!!!!!");
        event.preventDefault();

        let valid = authenticateLogin();

        if(valid) {
            console.log("Authenticated");
            loginAJAX()
                .then(data => {
                    window.location.href = "welcome.html";
                })
                .catch(error => {
                    console.log(error);
                });
        }
        else {
            $('.login-error-message').css('display', 'block');
        }
    })

    async function loginAJAX() {

        return loginReq = $.ajax({
            type: "POST",
            url: baseAPIURL+"/accounts/login",
            contentType: "application/json",
            data: JSON.stringify({
                email: $('#email').val(),
                password: $('#password').val()
            }),
            success: function(data, status, xhr)    {
                JWTToken = xhr.getResponseHeader('Authorization');
                setCookie("token", JWTToken);
            },
            failure: function(errMsg) {alert(errMsg);}
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
})