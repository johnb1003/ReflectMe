// Regular expression to check valid emails. Source: http://emailregex.com/
const emailRegEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

// Regular expression to check password is only alphanumeric values and length is between 5-20 inclusive. Source: https://stackoverflow.com/questions/4745112/javascript-regex-for-alphanumeric-string-with-length-of-3-5-chars
const passwordRegEx = /^([a-zA-Z0-9]){5,20}$/

$(document).ready(function() {

    $(submitButton).click( () => {

        //Check email validity
        const email = document.getElementById('email').value;
        if(!validEmail(email)) {
            alert("Email not valid");
            return ;
        }

        //Check password validity
        const password = document.getElementById('password').value;
        if(!validPassword(password)) {
            alert("Password not valid");
            return ;
        }

        authenticateUser();
    })

    

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

    function authenticateUser() {
        const email = document.getElementById('email');
        const password = document.getElementById('password');
        alert(email.value + " " + password.value);

        // AJAX REQUEST TO VALIDATE (EMAIL, PASSWORD)

        // SUCCESS: GO TO HOME PAGE WITH CUSTOM DETAILS

        // FAILURE: ALERT INVALID USERNAME / PASSWORD
    }
})