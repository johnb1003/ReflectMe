const inquirer = require('inquirer');

let JWTToken = null;
var email = null;
var pw = null;

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
});

function loginAJAX() {
    return loginReq = $.ajax({
        type: "POST",
        url: baseAPIURL+"/accounts/login",
        contentType: "application/json",
        data: JSON.stringify({
            email: email,
            password: pw
        }),
        success: function(data, status, xhr)    {
            JWTToken = xhr.getResponseHeader('Authorization');
        },
        failure: function(errMsg) {
            alert(errMsg);
        }
    });
}