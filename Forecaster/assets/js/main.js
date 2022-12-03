// variables to get dom elements

var yearInputField = document.getElementById('yearInput'),
    historical_mode = document.getElementById('historical_mode'),
    forcast_mode = document.getElementById('forcast_mode'),
    historical_mode_btn = document.getElementById('historical_mode_btn'),
    forcast_mode_btn = document.getElementById('forcast_mode_btn'),
    d7dwFilter = document.getElementById('d7dwFilter'),
    d7duFilter = document.getElementById('d7duFilter'),
    d7dtFilter = document.getElementById('d7dtFilter'),
    d7dvFilter = document.getElementById('d7dvFilter'),
    fuelFilters = document.getElementsByClassName('fuelFilters');

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
    const url = `assets/js/fuelCostData.json`;
    const response = await fetch(url);
    const data = await response.json();
    // console.log(data.fuelCostData[index])
    return data;
}

function getValue() {

    fetchData().then(data => {
        var index;

        switch (yearInputField.value) {
            case '1996':
                index = 0;
                break;
            case '1997':
                index = 1;
                break;
            case '1998':
                index = 2;
                break;
            case '1999':
                index = 3;
                break;
            case '2000':
                index = 4;
                break;
            case '2001':
                index = 5;
                break;
            case '2002':
                index = 6;
                break;
            case '2003':
                index = 7;
                break;
            case '2004':
                index = 8;
                break;
            case '2005':
                index = 9;
                break;
            case '2006':
                index = 10;
                break;
            case '2007':
                index = 11;
                break;
            case '2008':
                index = 12;
                break;
            case '2009':
                index = 13;
                break;
            case '2010':
                index = 14;
                break;
            case '2011':
                index = 15;
                break;
            case '2012':
                index = 16;
                break;
            case '2013':
                index = 17;
                break;
            case '2014':
                index = 18;
                break;
            case '2015':
                index = 19;
                break;
            case '2016':
                index = 20;
                break;
            case '2017':
                index = 21;
                break;
            case '2018':
                index = 22;
                break;
            case '2019':
                index = 23;
                break;
            case '2020':
                index = 24;
                break;
            case '2021':
                index = 25;
                break;
            case '2022':
                index = 26;
                break;

            default:
                index = 26;
                break;
        }

        const dataOf22 = data.fuelCostData[26].record
        const dataOf21 = data.fuelCostData[25].record
        const twelveMonthsData = (dataOf21.concat(dataOf22)).slice(-12)
        // console.log(twelveMonthsData)

        const years = data.fuelCostData.map(
            function (index) {
                return index.year;
            }
        );

        var months, D7DW, D7DU, D7DT, D7DV;

        if (index == 26) {
            months = twelveMonthsData.map(
                function (index) {
                    return index.month;
                }
            );

            D7DW = twelveMonthsData.map(
                function (index) {
                    return index.D7DW;
                }
            );

            D7DU = twelveMonthsData.map(
                function (index) {
                    return index.D7DU;
                }
            );

            D7DT = twelveMonthsData.map(
                function (index) {
                    return index.D7DT;
                }
            );

            D7DV = twelveMonthsData.map(
                function (index) {
                    return index.D7DV;
                }
            );

        } else {
            months = data.fuelCostData[index].record.map(
                function (index) {
                    return index.month;
                }
            );
            D7DW = data.fuelCostData[index].record.map(
                function (index) {
                    return index.D7DW;
                }
            );
            D7DU = data.fuelCostData[index].record.map(
                function (index) {
                    return index.D7DU;
                }
            );
            D7DT = data.fuelCostData[index].record.map(
                function (index) {
                    return index.D7DT;
                }
            );
            D7DV = data.fuelCostData[index].record.map(
                function (index) {
                    return index.D7DV;
                }
            );
        }

        drawMonthwiseChart(years, months, D7DW, D7DU, D7DT, D7DV);

    });

}

function drawMonthwiseChart(years, months, D7DW, D7DU, D7DT, D7DV) {
    var data = new google.visualization.DataTable();
    if (yearInputField.value < 1996 || yearInputField.value > 2022) {
        data.addColumn({ label: 'months', type: 'string' });
        data.addColumn({ label: 'cost', type: 'number' });
        data.addColumn({ role: 'annotation', type: 'string' });
        data.addRows([
            ['', 0, 'No Data Available']
        ]);
    } else {
        data.addColumn('string', 'Months');
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
            title: 'Months',
            slantedText: true
        },
        height: 600,
        colors: colors
    };

    var colors = ['#41DA96', '#E6AC2B', '#71EB92', '#FAAFF9'];
        colors.forEach(function (color, index) {
            data.setColumnProperty(index + 1, 'color', color);
        });

    var chart = new google.visualization.ColumnChart(document.getElementById('chart_div'));

    function drawChart() {
        var chartColors = [];
        var chartColumns = [0];
        var view = new google.visualization.DataView(data);

        Array.from(fuelFilters).forEach((fuelFilters) => {
            var seriesColumn = parseInt(fuelFilters.value);
            if (fuelFilters.checked) {
                chartColumns.push(seriesColumn);
                chartColors.push(data.getColumnProperty(seriesColumn, 'color'));
                console.log(seriesColumn);
            }
        });

        view.setColumns(chartColumns);
        options.colors = chartColors;
        chart.draw(view, options);
    }

    for (let index = 0; index < fuelFilters.length; index++) {
        fuelFilters[index].onchange = () => {
            drawChart();
        }
    }

    drawChart();

}

google.charts.load('current', { packages: ['corechart', 'bar'] });
google.charts.setOnLoadCallback(getValue);