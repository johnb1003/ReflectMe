// Regular expression to check valid emails. Source: http://emailregex.com/
const emailRegEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

// Regular expression to check password is only alphanumeric values and length is between 5-20 inclusive. Source: https://stackoverflow.com/questions/4745112/javascript-regex-for-alphanumeric-string-with-length-of-3-5-chars
const passwordRegEx = /^([a-zA-Z0-9]){5,20}$/;

const baseAPIURL = "https://reflectme.tech/api/v1";

function setCookie(key, value) {
    document.cookie = key + "=" + value + ";";
}

$(document).ready(function() {

    // Take in login form information
    $('#landing-submit-button').click( () => {

        event.preventDefault();
        
        let landingEmail = $('#landing-email').val();
        //console.log(email);

        if(validEmail(landingEmail)) {

            let exists = false;

            setCookie("email", landingEmail)

            emailReq = $.get({
                url: baseAPIURL+"/accounts/email",
                contentType: "application/json",
                data: {
                    email: $('#landing-email').val()
                },
                success: function(data, status, xhr)    {
                    if(data == "true") {
                        window.location.href = "login.html";
                    }
                    else {
                        window.location.href = "signup.html";
                    }
                },
                failure: function(errMsg) {alert(errMsg);}
            });
        }
        else {
            console.log("Here3")
            $('#landing-error-message').css('display', 'block');
        }
    })

    function validEmail(email) {
        if(email == '' || !emailRegEx.test(email)) {
            return false;
        }
        return true;
    }
});