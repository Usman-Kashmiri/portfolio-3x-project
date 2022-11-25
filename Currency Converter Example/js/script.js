// variables

var select = document.querySelectorAll(".currency"),
    calculationContainer = document.getElementById("calculationContainer"),
    resultContainer = document.getElementById("resultContainer"),
    default_currency = document.querySelectorAll("#default_currency"),
    input_currency = document.getElementById('input_currency'),
    output_currency = document.getElementById('output_currency'),
    conversionAmount = document.getElementById('conversionAmount'),
    exchangeRate = document.getElementById('exchangeRate'),
    calculationTimeSpan = document.getElementById('timeStamp'),
    updateTime = document.getElementById('updateTime'),
    conversionError = document.getElementById('conversionError');


calculationContainer.style.display = "block";
resultContainer.style.display = "none";

// fetching Gbp api

var entries;

fetch('http://www.floatrates.com/daily/gbp.json')
    .then((data) => data.json())
    .then((data) => {
        entries = Object.entries(data);
        console.log(entries)
        for (var i = 0; i < entries.length; i++) {
            select[0].innerHTML += `<option value="${i}">${entries[i][1].name} / ${entries[i][1].code}</option>`;
            select[1].innerHTML += `<option value="${i}" id="option_${i}">${entries[i][1].name} / ${entries[i][1].code}</option>`;
        }
        const beforeElement = document.getElementById('option_1')
        const gbp_option = `<option value="149">U. K. Pound Sterling / GBP</option>`;
        beforeElement.insertAdjacentHTML('afterend', gbp_option);
    });

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


function convert() {
    var calculation;
    var timeDateNow = new Date();
    yearNow = timeDateNow.getFullYear();
    monthNow = timeDateNow.getMonth();
    dateNow = timeDateNow.getDate();
    hoursNow = timeDateNow.getHours();
    minutesNow = timeDateNow.getMinutes();
    var calculationTime = new Date(Date.UTC(yearNow, monthNow, dateNow, hoursNow, minutesNow));
    const options = {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "numeric",
        minute: "numeric"
    };
    // var calculationTime = new timeStamp;
    var value1 = select[0].value;
    var value2 = select[1].value;
    input_currency_val = input_currency.value;
    var fromCurrency = entries[value1];
    var toCurrency = entries[value2];
    var fromCurrencyCode,
        toCurrencyCode,
        exchangeRateValue,
        RateUpdateTime;
        conversionError.innerText = "";
    if (input_currency.value <= 0) {
        conversionError.innerText = `Amount cannot be negative or zero!`
    } else if (input_currency.value > 100000000) {
        conversionError.innerText = `Conversion amount cannot be great than 100 Million!`
    } else if (value1 == value2) {
        conversionError.innerText = `Please select two different currencies`
    } else if (value1 == "149") {
        calculation = toCurrency[1].rate * input_currency_val;
        fromCurrencyCode = "GBP";
        toCurrencyCode = toCurrency[1].code;
        exchangeRateValue = toCurrency[1].rate;
        RateUpdateTime = toCurrency[1].date;
        // conversionError.innerText = "";
    } else if (select[1].value == "149") {
        calculation = fromCurrency[1].inverseRate * input_currency_val;
        fromCurrencyCode = fromCurrency[1].code;
        toCurrencyCode = "GBP";
        exchangeRateValue = fromCurrency[1].inverseRate;
        RateUpdateTime = fromCurrency[1].date;
        // conversionError.innerText = "";
    } else {
        calculation = toCurrency[1].rate / fromCurrency[1].rate * input_currency_val;
        fromCurrencyCode = fromCurrency[1].code;
        toCurrencyCode = toCurrency[1].code;
        exchangeRateValue = toCurrency[1].rate;
        RateUpdateTime = toCurrency[1].date;
        // conversionError.innerText = "";
    }
    if (calculation) {
        calculationContainer.style.display = "none";
        resultContainer.style.display = "block";
    }
    conversionAmount.innerText = `${input_currency_val} ${fromCurrencyCode} = ${roundOff(calculation)} ${toCurrencyCode}`;
    exchangeRate.innerText = `1 ${fromCurrencyCode} = ${roundOff(exchangeRateValue)} ${toCurrencyCode}`;
    calculationTimeSpan.innerText = `${calculationTime.toLocaleString("en-GB", options)}`
    updateTime.innerText = `${RateUpdateTime}`;
    console.log()
    // window.location = 'result.html';
}

function goBack() {
    calculationContainer.style.display = "block";
    resultContainer.style.display = "none";
}