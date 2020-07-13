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
        
        console.log($('#landing-email'));

        if(validEmail($('#landing-email'))) {
            if(emailExists($('#landing-email'))) {
                window.location.href = "login.html"
            }
            else {
                window.location.href = "signup.html"
            }
        }
        else {
            $('#landing-error-message').css('display', 'block');
        }
    })

    async function emailExists(email) {
        await emailReq = $.ajax({
            type: "GET",
            url: baseAPIURL+"/accounts/email",
            contentType: "application/json",
            data: JSON.stringify({
                email: email
            }),
            success: function(data, status, xhr)    {
                return data;
            },
            failure: function(errMsg) {alert(errMsg);}
        });
        
        emailReq.
            then(data => {
                console.log(data);
                if(data == "true") {
                    return true;
                }
                else {
                    return false;
                }
            })
            .catch(error => {
                console.log(error);
            });
    }

    function validEmail(email) {
        if(email == '' || !emailRegEx.test(email)) {
            return false;
        }
        return true;
    }
})