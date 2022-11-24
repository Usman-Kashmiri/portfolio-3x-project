// variables

var select = document.querySelectorAll(".currency"),
    default_currency = document.querySelectorAll("#default_currency"),
    input_currency = document.getElementById('input_currency'),
    output_currency = document.getElementById('output_currency'),
    conversionAmount = document.getElementById('conversionAmount'),
    exchangeRate = document.getElementById('exchangeRate'),
    timeStamp = document.getElementById('timeStamp'),
    updateTime = document.getElementById('updateTime');

// fetching Gbp api

fetch('http://www.floatrates.com/daily/gbp.json')
    .then((data) => data.json())
    .then((data) => {
        const entries = Object.entries(data);
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
    var value1 = select[0].value;
    var value2 = select[1].value;
    fetch('http://www.floatrates.com/daily/gbp.json')
        .then((data) => data.json())
        .then((data) => {
            const entries = Object.entries(data);
            input_currency_val = input_currency.value;
            fromCurrency = entries[value1];
            toCurrency = entries[value2];
            if (input_currency.value <= 0) {
                alert("Amount cannot be negative or zero!")
            } else if (input_currency.value > 1000000000) {
                alert("Conversion amount cannot be great than 1Billon!")
            } else if (value1 == value2) {
                alert("Please select two different currencies")
            } else if (value1 == "149") {
                calculation = toCurrency[1].rate * input_currency_val;
            }
            else if (select[1].value == "149") {
                calculation = fromCurrency[1].inverseRate * input_currency_val;
            } else {
                calculation = toCurrency[1].rate / fromCurrency[1].rate * input_currency_val;
            }
            // output_currency.value = roundOff(calculation);
            conversionAmount.innerHTML = roundOff(calculation);
            exchangeRate.innerHTML = `1 ${fromCurrency[1].code} = ${toCurrency[1].rate} ${toCurrency[1].code}`;
            window.location = 'result.html';
        });
}
