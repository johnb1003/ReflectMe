let baseIndexURL = 'https://reflectme.tech/';

$(document).ready(function() {
    $('.nav-button').click( (e) => {
        window.location.href = $(e.target).attr('id');
    });

    $('#home-button').click( (e) => {
        window.location.href = "welcome.html";
    });
})