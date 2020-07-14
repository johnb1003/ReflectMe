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
        
        let email = $('#landing-email').val();
        console.log(email);

        if(validEmail(email)) {
            console.log("Here1")
            if(emailExists(email)) {
                console.log("Here2")
                window.location.href = "login.html"
            }
            else {
                console.log("Here2")
                window.location.href = "signup.html"
            }
        }
        else {
            console.log("Here3")
            $('#landing-error-message').css('display', 'block');
        }
    })

    async function emailExists(email) {
        emailReq = $.ajax({
            type: "GET",
            url: baseAPIURL+"/accounts/email",
            contentType: "application/json",
            data: JSON.stringify({
                email: email
            }),
            success: function(data, status, xhr)    {
                console.log(data)
                return data;
            },
            failure: function(errMsg) {alert(errMsg);}
        });
        
        await emailReq.
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