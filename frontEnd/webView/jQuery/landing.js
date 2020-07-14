// Regular expression to check valid emails. Source: http://emailregex.com/
const emailRegEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

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
})