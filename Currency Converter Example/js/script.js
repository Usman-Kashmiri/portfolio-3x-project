var select = document.querySelectorAll(".currency"),
    default_currency = document.querySelectorAll("#default_currency"),
    input_currency = document.getElementById('input_currency'),
    output_currency = document.getElementById('output_currency');
// https://api.frankfurter.app/currencies
fetch('http://www.floatrates.com/daily/gbp.json')
    .then((data) => data.json())
    .then((data) => {
        const entries = Object.entries(data);
        // select[1].innerHTML = `<option value="${data.usd.code}">${data.usd.name} / ${data.usd.code}</option>`;
        // const beforeElement = '<option value="147">Guyanese dollar / GYD</option>';
        // const gbp_option = document.createElement('option');
        // gbp_option.innerHTML = `<option value="149">U. K. Pound Sterling / GBP</option>`;
        console.log(data)
        for (var i = 0; i < entries.length; i++) {
            select[0].innerHTML += `<option value="${i}">${entries[i][1].name} / ${entries[i][1].code}</option>`;
            select[1].innerHTML += `<option value="${i}" id="option_${i}">${entries[i][1].name} / ${entries[i][1].code}</option>`;
        }
        const beforeElement = document.getElementById('option_1')
        const gbp_option = `<option value="149">U. K. Pound Sterling / GBP</option>`;
        beforeElement.insertAdjacentHTML('afterend', gbp_option);
    });

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
    if (input_currency.value <= 0) {
        alert("Amount cannot be negative or zero!")
    } else if (input_currency.value > 1000000000) {
        alert("Conversion amount cannot be great than 1Billon!")
    } else if (value1 == value2) {
        alert("Please select two different currencies")
    }  else if (value1 == "149") {
        fetch('http://www.floatrates.com/daily/gbp.json')
        .then((data) => data.json())
        .then((data) => {
            const entries = Object.entries(data);
            input_currency_val = input_currency.value;
            fromCurrency = entries[value1];
            toCurrency = entries[value2];
            calculation = toCurrency[1].rate * input_currency_val;
            output_currency.value = roundOff(calculation);
        });
    } 
    else if (select[1].value == "149") {
        fetch('http://www.floatrates.com/daily/usd.json')
            .then((data) => data.json())
            .then((data) => {
                const { usd } = data;
                const entries = Object.entries(data);
                input_currency_val = input_currency.value;
                var fromCurrency = entries[value1];
                var gbpCurrency = entries[1];
                var eurCurrency = entries[0];
                if (value1 == "0") {
                    calculation = gbpCurrency[1].rate * input_currency_val;
                    output_currency.value = roundOff(calculation);
                } else if (value1 == "1") {
                    calculation = gbpCurrency[1].rate / eurCurrency[1].rate * input_currency_val;
                    output_currency.value = roundOff(calculation);
                }
            });
    } else {
        fetch('http://www.floatrates.com/daily/gbp.json')
            .then((data) => data.json())
            .then((data) => {
                const { usd } = data;
                const entries = Object.entries(data);
                input_currency_val = input_currency.value;
                var fromCurrency = entries[value1];
                var toCurrency = entries[value2];
                calculation = toCurrency[1].rate / fromCurrency[1].rate * input_currency_val;
                console.log(toCurrency[1].rate, fromCurrency[1].rate);
                output_currency.value = roundOff(calculation);
            });
    }
}
