let baseIndexURL = 'https://reflectme.tech/';

$(document).ready(function() {
    $('.nav-button').click( (e) => {
        window.location.href = $(e.target).attr('id');
    });

    $('.nav-button-dropdown').click( (e) => {
        window.location.href = $(e.target).attr('id');
    });

    $('.logo-pic').click( () => {
        window.location.href = 'landing.html';
    });

    $('.home-button').click( (e) => {
        window.location.href = $(e.target).attr('id');
    });

    $('#landing-button').click( (e) => {
        window.location.href = "landing.html";
    });

    $('#nav-dropdown-button').click( () => {
        if($('.nav-dropdown-container').css('display') == 'none') {
            $('.nav-dropdown-container').css('display', 'flex');
        }
        else {
            $('.nav-dropdown-container').css('display', 'none');
        }
    });

    $('#logout-button').click( () => {
        setCookie('token', '');
        setCookie('email', '');
        window.location.href = "landing.html";
    });
})