const inquirer = require('inquirer');
const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

const loginURL = 'https://reflectme.tech/api/v1/accounts/login';

let JWTToken = null;
var email = null;
var pw = null;
let loginObject = {};

var questions = [{
        type: 'input',
        name: 'email',
        message: "ReflectMe Email: "
    },
    {
        type: 'input',
        name: 'pw',
        message: "ReflectMe Password: "
    }
];

// Read in user email and password
inquirer.prompt(questions).then(answers => {
    email = answers['email'];
    pw = answers['pw'];
    console.log(`Email: ${email} \t Password: ${pw}`);
    loginObject = {
        'email': email,
        'password': pw
    }
    loginAJAX();
});

function loginAJAX() {
    let httpRequest = new XMLHttpRequest();

    if (!httpRequest) {
        console.log('Giving up. Cannot create an XMLHTTP instance');
    }

    httpRequest.onreadystatechange = function() {
        console.log(`${this.readyState} = ${XMLHttpRequest.DONE}`);
        console.log(this.readyState === 4);
        if (this.readyState === 4) {
            console.log('Here 1');
            if (this.status === 200) {
                JWTToken = this.getResponseHeader('Authorization').split(' ')[1];
                displayLoop();
            } 
            else {
                //console.log(this.status);
            }
        }
        else {
            //console.log(`${this.status}, ${this.readyState}`);
        }
    };
    
    httpRequest.open('POST', loginURL, true);
    httpRequest.setRequestHeader("Content-Type", "application/json");
    httpRequest.send(JSON.stringify(loginObject));
}

function displayLoop() {
    while(true) {
        // Fetch user data and update display
        setTimeout( () => {
            
        }, 10000);
    }
}