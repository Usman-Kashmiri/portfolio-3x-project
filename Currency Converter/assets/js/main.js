/* `` these symbols are called backticks... you will find them above tab key on keyboard or below Esc key 
    backticks are very helpful when you have to use variables within quotations. with the help of ${} you
    can use variables and functions within quotations... this way you do't have to concat variables with
    quotes. */

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
            // passing iterator variable in value attribute... it will work as array index for each option element
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

    // This variable will hold the actual conversion value
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

    // Variables to store values of from currency, to currency & conversion amount value
    var fromCurrencyValue = selectCurrencyList[0].value,
        toCurrencyValue = selectCurrencyList[1].value,
        conversionAmount_value = conversionAmount.value,

        /* from currency & to currency values are equal to their respective array index
        hence passing currency value variable as index here */
        fromCurrency = currencyData[fromCurrencyValue],
        toCurrency = currencyData[toCurrencyValue],

        // other local variables
        fromCurrencyCode,
        toCurrencyCode,
        exchangeRateValue,
        RateUpdateTime;

    /* Declared conversion error variable globally on top 
    reasigning here conversion error conditionaly */

    // This will unset conversion error if there is no error: 
    conversionError.innerText = "";

    // if a user inputs a negative value in conversion amount input field:
    if (conversionAmount.value <= 0) {
        conversionError.innerText = `Amount cannot be negative or zero!`
    }

    // if a user inputs value greater than 100000000 in conversion amount input field: 
    else if (conversionAmount.value > 100000000) {
        conversionError.innerText = `Conversion amount cannot be great than 100 Million!`
    } 
    
    // if a user selected same currency from both select fields:
    else if (fromCurrencyValue == toCurrencyValue) {
        conversionError.innerText = `Please select two different currencies`
    } 
    
    // There is no data of UK pound in the GBP api so we have to do calculation this way
    // if a user selects u.k pound sterling / GBP from, from currency select fields:
    else if (fromCurrencyValue == "149") {

        /* on index 0 of currency array there is only currency code stored..
        to access rest of the currency details you have to pass index 1 */

        // to currency rate will be multiplied to conversion amount passed by user
        calculation = toCurrency[1].rate * conversionAmount_value;

        // GBP is the currency code for UK pound Sterling
        fromCurrencyCode = "GBP";

        // to currency code
        toCurrencyCode = toCurrency[1].code;
        
        // exchange rate of to currency
        exchangeRateValue = toCurrency[1].rate;
        
        // last exchange rate update time of to currency 
        RateUpdateTime = toCurrency[1].date;

    }

    // if a user selects u.k pound sterling / GBP from, to currency select fields:
    else if (toCurrencyValue == "149") {

        // from currency inverse rate will be multiplied to conversion amount passed by user
        calculation = fromCurrency[1].inverseRate * conversionAmount_value;

        fromCurrencyCode = fromCurrency[1].code;
        toCurrencyCode = "GBP";
        exchangeRateValue = fromCurrency[1].inverseRate;
        RateUpdateTime = fromCurrency[1].date;
    } 
    
    // if a user selects any currency other than u.k pound sterling / GBP ():
    else {

        /* to currency rate will be divided with from currency rate annd then
         multiplied to conversion amount passed by user */
        calculation = toCurrency[1].rate / fromCurrency[1].rate * conversionAmount_value;

        fromCurrencyCode = fromCurrency[1].code;
        toCurrencyCode = toCurrency[1].code;
        exchangeRateValue = toCurrency[1].rate / fromCurrency[1].rate;
        RateUpdateTime = toCurrency[1].date;
    }

    /* This condition here checks if the calculation is successful and there were no errors 
    then the result container will be displayed */
    if (calculation) {
        calculationContainer.style.display = "none";
        resultContainer.style.display = "flex";
    }

    // Conversion details: 

    // we have made a custom parameterized return function name roundOff

    // passing calculation value in roundOff() function to round off conversion amount up-to 2 decimal figures
    conversionResult.innerText = `${conversionAmount_value} ${fromCurrencyCode} = ${roundOff(calculation)} ${toCurrencyCode}`;
    
    // passing exchange rate value in roundOff function to round off conversion amount up-to 2 decimal figures
    exchangeRate.innerText = `1 ${fromCurrencyCode} = ${roundOff(exchangeRateValue)} ${toCurrencyCode}`;

    // using toLocalString() JS built-in function to format calculation time 
    // here en-GB means United Kingdom English which will format our date according to UK format.
    calculationTimeStamp.innerText = `${calculationTime.toLocaleString("en-GB", options)}`;
    
    // last exchange rate update time:
    updateTime.innerText = `${RateUpdateTime}`;

}

// Uncomment this function if you don't want to refresh page on back button press 

// function goBack() {
//     calculationContainer.style.display = "flex";
//     resultContainer.style.display = "none";
// }

// If enter key is pressed, this keypress eventlistener will execute convert function
conversionAmount.onkeypress = function (e) {
    // 13 is the key code for enter key 
    if (e.keyCode == 13) {
        convert();
    }
}

// function to roundoff decimel points
function roundOff(value) {

    // initializing multiplier variable, which will be assigned conditionally
    var multiplier;
    
    if (value > 1) {
        // using Math object and power function
        // here the multiplier will be equal to 100
        multiplier = Math.pow(10, 2);
    } else if (value > 0.09) {
        // here the multiplier will be equal to 100
        multiplier = Math.pow(10, 2);
    } else if (value > 0.009) {
        // here the multiplier will be equal to 1000
        multiplier = Math.pow(10, 3);
    } else if (value > 0.0009) {
        // here the multiplier will be equal to 10000
        multiplier = Math.pow(10, 4);
    } else if (value > 0.00009) {
        // here the multiplier will be equal to 100000
        multiplier = Math.pow(10, 5);
    } else {
        // here the multiplier will be equal to 1000000
        multiplier = Math.pow(10, 6);
    }

    // Math Object round function to round off value 
    return Math.round(value * multiplier) / multiplier;
}
