const baseAPIURL = "https://reflectme.tech/api/v1";

var accountData;

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

    // Check for token cookie
    let JWToken = getCookie("token");
    if(JWToken == "") {
        alert("Must be logged in to access this page.")
        window.location.href = "login.html";
    }

    accountAJAX()
        .then(data => {
            accountData = data;
            console.log(data);
            $('#hello-name').text("Hello " + data.fName + "!");
        })
        .catch(error => {
            console.log(error);
    });


    function accountAJAX() {

        return accReq = $.ajax({
            type: "GET",
            url: baseAPIURL+"/accounts/info",
            contentType: "application/json",
            headers: {'Authorization': JWToken},
            success: function(data, status, xhr)    {
                return data;
            },
            failure: function(errMsg) {alert(errMsg);}
        });
    }
});