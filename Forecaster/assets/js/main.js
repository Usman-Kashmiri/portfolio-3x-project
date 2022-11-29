// variables to get dom elements

var yearInputField = document.getElementById('yearInput'),
    historical_mode = document.getElementById('historical_mode'),
    forcast_mode = document.getElementById('forcast_mode'),
    historical_mode_btn = document.getElementById('historical_mode_btn'),
    forcast_mode_btn = document.getElementById('forcast_mode_btn');

// Default values

historical_mode.style.display = "block";
forcast_mode.style.display = "none";

// Functions for switching between modes


historical_mode_btn.onclick = () => {
    historical_mode.style.display = "block";
    forcast_mode.style.display = "none";
}

forcast_mode_btn.onclick = () => {
    historical_mode.style.display = "none";
    forcast_mode.style.display = "block";
}

async function fetchData() {
    var index = 1;
    const url = `assets/js/data.json`;
    const response = await fetch(url);
    const data = await response.json();
    // console.log(data.fuelCostData[index])
    return data;
}

function getValue() {

    fetchData().then(data => {
        var index = 0;
        if (yearInputField.value == 1996) {
            index = 0;
        }
        else if (yearInputField.value == 1997) {
            index = 1;
        }
        else if (yearInputField.value == 1998) {
            index = 2;
        }
        else if (yearInputField.value == 1999) {
            index = 3;
        }

        const years = data.fuelCostData.map(
            function (index) {
                return index.year;
            }
        );
        const months = data.fuelCostData[index].record.map(
            function (index) {
                return index.month;
            }
        );
        const D7DW = data.fuelCostData[index].record.map(
            function (index) {
                return index.D7DW;
            }
        );
        const D7DU = data.fuelCostData[index].record.map(
            function (index) {
                return index.D7DU;
            }
        );
        const D7DT = data.fuelCostData[index].record.map(
            function (index) {
                return index.D7DT;
            }
        );
        const D7DV = data.fuelCostData[index].record.map(
            function (index) {
                return index.D7DV;
            }
        );
        // console.log(years, months, D7DW, D7DU, D7DT, D7DV)
        drawMonthwiseChart(years, months, D7DW, D7DU, D7DT, D7DV)
    });

}

function drawMonthwiseChart(years, months, D7DW, D7DU, D7DT, D7DV) {
    var data = new google.visualization.DataTable();
    if (yearInputField.value < 1996 || yearInputField.value > 1999) {
        data.addColumn({ label: 'Month', type: 'string' });
        data.addColumn({ label: 'Cost', type: 'number' });
        data.addColumn({ role: 'annotation', type: 'string' });
        // data.addColumn('string', 'msg');
        data.addRows([
            ['', 0, 'No Data Available']
        ]);
    } else {
        data.addColumn('string', 'Month');
        data.addColumn('number', 'Solid Fuels');
        data.addColumn('number', 'Gas');
        data.addColumn('number', 'Electricity');
        data.addColumn('number', 'Liquid Fuels');
        var month;
        var d7dw;
        var d7du;
        var d7dt;
        var d7dv;

        months.forEach((i) => {
            month = i;
            D7DW.forEach((i) => {
                d7dw = parseFloat(i);
            });
            D7DU.forEach((i) => {
                d7du = parseFloat(i);
            });
            D7DT.forEach((i) => {
                d7dt = parseFloat(i);
            });
            D7DV.forEach((i) => {
                d7dv = parseFloat(i);
            });
            data.addRows([[month, d7dw, d7du, d7dt, d7dv]]);
            // console.log([[month, d7dw, d7du]]);
        });
    }

    var options = {
        title: 'Fuel Cost History',
        annotations: {
            stem: {
                color: 'transparent',
                length: 180
            },
            textStyle: {
                color: 'red',
                fontSize: 32
            }
        },
        vAxis: {
            title: 'Cost',
            minValue: 0,
            maxValue: 70,
            format: 'decimal'
        },
        hAxis: {
            title: 'Month'
        },
        height: 600,
        colors: ['#41DA96', '#E6AC2B', '#71EB92', '#FAAFF9']
    };


    var chart = new google.visualization.ColumnChart(document.getElementById('chart_div'));
    chart.draw(data, options);
}

google.charts.load('current', { packages: ['corechart', 'bar'] });
google.charts.setOnLoadCallback(getValue);