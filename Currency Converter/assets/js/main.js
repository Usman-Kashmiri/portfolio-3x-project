// Global variables
var selectCurrencyList = document.querySelectorAll(".currencyList"),
    calculationContainer = document.getElementById("calculationContainer"),
    resultContainer = document.getElementById("resultContainer"),
    // default_currency = document.querySelectorAll("#default_currency"),
    conversionAmount = document.getElementById('conversionAmount'),
    // output_currency = document.getElementById('output_currency'),
    conversionResult = document.getElementById('conversionResult'),
    exchangeRate = document.getElementById('exchangeRate'),
    calculationTimeStamp = document.getElementById('timeStamp'),
    updateTime = document.getElementById('updateTime'),
    conversionError = document.getElementById('conversionError'),

    // Initialing variables that will be assigned later-on.
    currencyData;


// Global Constant Scope

// API URL
const Api_Url = 'http://www.floatrates.com/daily/gbp.json';

// Setting Default display for containers
calculationContainer.style.display = "flex";
resultContainer.style.display = "none";

// fetching Currency API

// Javascript Fetch method to Fetch Api

fetch(Api_Url)
    .then((data) => data.json())
    .then((data) => {
        // mapping json data into array form
        currencyData = Object.entries(data);
        // console.log(currencyData)

        // Iterating currency name and currency code for currency select options using for loop
        for (var i = 0; i < currencyData.length; i++) {
            selectCurrencyList[0].innerHTML += `<option value="${i}">${currencyData[i][1].name} / ${currencyData[i][1].code}</option>`;
            // here id attribute will help us manipulation dom element by id
            selectCurrencyList[1].innerHTML += `<option value="${i}" id="option_${i}">${currencyData[i][1].name} / ${currencyData[i][1].code}</option>`;
        }

        // To append GBP option after option no. 2
        const beforeElement = document.getElementById('option_1')

        // HTML for GBP option element
        const gbp_option = `<option value="149">U. K. Pound Sterling / GBP</option>`;

        // inserting GBP option after option no. 2 using insertAdjacentHTML dom method
        beforeElement.insertAdjacentHTML('afterend', gbp_option);
    });

// Convert function without parameters & return 

function convert() {
    var calculation;

    // Storing Date object in local variable for conversion time
    var timeDateNow = new Date();

    // Getting year form date object
    yearNow = timeDateNow.getFullYear();
    // Getting month form date object
    monthNow = timeDateNow.getMonth();
    // Getting date form date object
    dateNow = timeDateNow.getDate();
    // Getting hour form date object
    hoursNow = timeDateNow.getHours();
    // Getting minute form date object
    minutesNow = timeDateNow.getMinutes();

    // formating the timestamp 
    var calculationTime = new Date(Date.UTC(yearNow, monthNow, dateNow, hoursNow, minutesNow));

    const options = {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "numeric",
        minute: "numeric"
    };

    var value1 = selectCurrencyList[0].value;
    var value2 = selectCurrencyList[1].value;
    conversionAmount_val = conversionAmount.value;
    var fromCurrency = currencyData[value1];
    var toCurrency = currencyData[value2];
    var fromCurrencyCode,
        toCurrencyCode,
        exchangeRateValue,
        RateUpdateTime;
        conversionError.innerText = "";
    if (conversionAmount.value <= 0) {
        conversionError.innerText = `Amount cannot be negative or zero!`
    } else if (conversionAmount.value > 100000000) {
        conversionError.innerText = `Conversion amount cannot be great than 100 Million!`
    } else if (value1 == value2) {
        conversionError.innerText = `Please select two different currencies`
    } else if (value1 == "149") {
        calculation = toCurrency[1].rate * conversionAmount_val;
        fromCurrencyCode = "GBP";
        toCurrencyCode = toCurrency[1].code;
        exchangeRateValue = toCurrency[1].rate;
        RateUpdateTime = toCurrency[1].date;
    } else if (selectCurrencyList[1].value == "149") {
        calculation = fromCurrency[1].inverseRate * conversionAmount_val;
        fromCurrencyCode = fromCurrency[1].code;
        toCurrencyCode = "GBP";
        exchangeRateValue = fromCurrency[1].inverseRate;
        RateUpdateTime = fromCurrency[1].date;
    } else {
        calculation = toCurrency[1].rate / fromCurrency[1].rate * conversionAmount_val;
        fromCurrencyCode = fromCurrency[1].code;
        toCurrencyCode = toCurrency[1].code;
        exchangeRateValue = toCurrency[1].rate / fromCurrency[1].rate;
        RateUpdateTime = toCurrency[1].date;
    }
    if (calculation) {
        calculationContainer.style.display = "none";
        resultContainer.style.display = "flex";
    }
    conversionResult.innerText = `${conversionAmount_val} ${fromCurrencyCode} = ${roundOff(calculation)} ${toCurrencyCode}`;
    exchangeRate.innerText = `1 ${fromCurrencyCode} = ${roundOff(exchangeRateValue)} ${toCurrencyCode}`;
    calculationTimeStamp.innerText = `${calculationTime.toLocaleString("en-GB", options)}`
    updateTime.innerText = `${RateUpdateTime}`;
    console.log()
    // window.location = 'result.html';
}

// Uncomment this function if you don't want to refresh page on back button press 

// function goBack() {
//     calculationContainer.style.display = "flex";
//     resultContainer.style.display = "none";
// }

// If enter key is pressed, this keypress eventlistener will execute convert function
conversionAmount.onkeypress = function(e){
    if(e.keyCode == 13){
       convert();
    }
}

// function to roundoff decimel points

function roundOff(value) {
    var multiplier;
    if (value > 1) {
        multiplier = Math.pow(10, 2);
    } else if (value > 0.09) {
        multiplier = Math.pow(10, 2);
    } else if (value > 0.009) {
        multiplier = Math.pow(10, 3);
    } else if (value > 0.0009) {
        multiplier = Math.pow(10, 4);
    } else if (value > 0.00009) {
        multiplier = Math.pow(10, 5);
    } else {
        multiplier = Math.pow(10, 6);
    }
    return Math.round(value * multiplier) / multiplier;
}