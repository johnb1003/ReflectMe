let CORSLink = "https://cors-anywhere.herokuapp.com/"
let key = "2a71ca322b7918de6de5db5e9e7bede4";
let base = "https://api.darksky.net/forecast/";
//let excludes = "exlude=minutely,hourly,daily,alerts,flags";
let excludes = "exlude=minutely,alerts,flags";
let url;
let attLat = 41.9445;
let attLong = -71.2856;
let amhLat = 42.3732;
let amhLong = -72.5199;
let weatherCond;
let weatherTemp;
let weatherIcon;
let lat = amhLat;
let long = amhLong;

let iconMap = {clear_day:'icons/clear-day.svg', clear_night:'icons/clear-night.svg', 
                rain:'icons/rain.svg', snow:'icons/snow.svg', sleet:'icons/sleet.svg', wind:'icons/wind.svg', 
                fog:'icons/fog.svg', cloudy:'icons/cloudy.svg', partly_cloudy_day:'icons/partly-cloudy-day.svg', 
                partly_cloudy_night:'icons/partly-cloudy-night.svg', thunderstorm:'icons/thunderstorm.svg'};

$(document).ready(function() {
  url = CORSLink + base + key + "/" + lat + "," + long + "?" + excludes;
  weatherCond = "SAD ):";

  var xhr = createCORSRequest('GET', url);
  if (!xhr) {
    throw new Error('CORS not supported');
  }

  xhr.onload = function() {
    var text = xhr.responseText;
    var currently = text.substring(0, text.indexOf(",\"minutely\""));
    weatherCond = parseCond(currently);
    $("#weatherConditions").html("Current: " + weatherCond);

    weatherTemp = parseTemp(currently);
    $("#weatherTemperature").html(weatherTemp + "&#8457");

    weatherIcon = parseIcon(currently);
    document.getElementById("icon").src = weatherIcon;
    //$("#iconName").html(weatherIcon);

    $("#text").html(text);
  }

  xhr.onerror = function() {
    alert('Whoops, there was an error making the request.');
  };

  xhr.send();
});

function parseCond(text) {
  let startIndex = text.indexOf("summary");
  startIndex = startIndex + 10;
  let endIndex = text.indexOf("icon");
  endIndex = endIndex - 3;
  let conditions = text.substring(startIndex, endIndex);
  
  return conditions;
}

function parseTemp(text) {
  let startIndex = text.indexOf("apparentTemperature");
  startIndex = startIndex + 21;
  let endIndex = text.indexOf("dewPoint");
  endIndex = endIndex - 5;
  let temperature = text.substring(startIndex, endIndex);
  
  return temperature;
}

function parseIcon(text) {
  let startIndex = text.indexOf("icon");
  startIndex = startIndex + 7;
  let endIndex = text.indexOf("nearestStormDistance");
  endIndex = endIndex - 3;
  let iconName = text.substring(startIndex, endIndex);

  let objectIndex = iconName.replace("-", "_");
  let icon;

  $("#response").html(objectIndex);

  if (objectIndex in iconMap) {
    icon = iconMap[objectIndex];
  }
  else {
    icon = 'icons/LUL.png';
  }
  return icon;
}

function createCORSRequest(method, url) {
  var xhr = new XMLHttpRequest();
  if ("withCredentials" in xhr) {

    // Check if the XMLHttpRequest object has a "withCredentials" property.
    // "withCredentials" only exists on XMLHTTPRequest2 objects.
    xhr.open(method, url, true);

  } else if (typeof XDomainRequest != "undefined") {

    // Otherwise, check if XDomainRequest.
    // XDomainRequest only exists in IE, and is IE's way of making CORS requests.
    xhr = new XDomainRequest();
    xhr.open(method, url);

  } else {

    // Otherwise, CORS is not supported by the browser.
    xhr = null;

  }
  return xhr;
}

