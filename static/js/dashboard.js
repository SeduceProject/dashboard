// Global variables
const MONTH_STR = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul",
    "Aug", "Sep", "Oct", "Now", "Dec" ];
let temperatureTS = 0
let powerTS = 0
let powerDayTS = 0

$(document).ready(function () {
    // Doughnut
	const doughnutData = {
	  labels: [
		'Servers',
		'Cooling',
		'Solar'
	  ],
	  datasets: [{
		label: 'Energy Balance',
		data: [0, 0, 0],
		backgroundColor: [
		  'rgb(255, 99, 132)',
		  'rgb(198, 248, 255)',
		  'rgb(255, 205, 86)'
		],
		hoverOffset: 4
	  }]
	};
	var ctx = document.getElementById('energy-doughnut').getContext('2d');
    let doughnutChart = new Chart(ctx, {
        type: 'doughnut',
        data: doughnutData
    });
    $.getJSON('/json/power_day', function(data) {
        // Graph
        let xValues = [], prodData = [], consData = [];
        for (value in data["values"]) {
            xValues.push(timestamp2string(value));
            prodData.push(data["values"][value]["prod"]);
            consData.push(data["values"][value]["cons"]);
        }
        const lineData = {
              labels: xValues,
              datasets: [
                  {
                      label: 'Energy Production',
                      data: prodData,
                      fill: false,
                      borderColor: 'rgb(255, 205, 86)'
                  },
                  {
                      label: 'Energy Consumption',
                      data: consData,
                      fill: false,
                      borderColor: 'rgb(54, 162, 235)'
                  }
              ]
        };
        var ctx = document.getElementById('energy-line').getContext('2d');
        let lineChart = new Chart(ctx, {
            type: 'line',
            data: lineData 
        });
    });
    updateData(doughnutChart);
    // Update the 'Genaral Statistics' and the 'Energy Balance' every 10s.
    // NOTE: The 'Energy Balance (last 24h) is not updated.
    setInterval(function() {
        updateData(doughnutChart);
    }, 10000);
});

function int2digit(number) {
        return ("0" + number).slice(-2);
}

function timestamp2string(ts) {
        let myDate = new Date(ts * 1000);
        return int2digit(myDate.getDate()) + "-" + MONTH_STR[myDate.getMonth()] + " " +
                int2digit(myDate.getHours()) + ":" + int2digit(myDate.getMinutes()) + ":" +
                int2digit(myDate.getSeconds());
}

function updateData(dChart) {
    $.getJSON('/json/temperature', function(data) {         
        if(data.time != temperatureTS) {
            temperatureTS = data.time;
            let roomTemp = 0, outsideTemp = 0, incomingTemp = 0, outgoingTemp = 0;
            // Counters to compute the average
            let incomingNb = 0, outgoingNb = 0;
            for (d of data.values) {
                if(d.name.startsWith("ecotype")) {
                    if(d.name.endsWith("back")) {
                        outgoingNb++;
                        outgoingTemp += d.last_value;
                    } else {
                        incomingNb++;
                        incomingTemp += d.last_value;
                    }
                } else if (d.name == "room-top") {
                    roomTemp = d.last_value;
                } else if (d.name == "outside") {
                    outsideTemp = d.last_value;
                }
            }
            $("#room-temp").html(roomTemp.toFixed(1) + "°C");
            if(outsideTemp != 0) {
                $("#outside-temp").html(outsideTemp.toFixed(1) + "°C");
            } else {
                console.log("outside temperature is missing");
            }
            $("#incoming-temp").html((incomingTemp / incomingNb).toFixed(1) + "°C");
            $("#outgoing-temp").html((outgoingTemp / outgoingNb).toFixed(1) + "°C");
        }
    });
    $.getJSON('/json/power', function(data) {         
        if(data.time != powerTS) {
            powerTS = data.time;
            let serverPower = 0, coolingPower = 0, solarPower = 0;
            for (d of data.values) {
                if(d.name.startsWith("ecotype") || d.name.startsWith("switch")) {
                    serverPower += d.last_value;
                } else if (d.name.startsWith("watt")) {
                    coolingPower += d.last_value;
                } else if (d.name.startsWith("poly") || 
                    d.name.startsWith("mono") || 
                    d.name.startsWith("tracker")) {
                    solarPower += d.last_value;
                }
            }
            $("#server-power").html("-" + serverPower + " W");
            $("#cooling-power").html("-" + coolingPower + " W");
            $("#solar-power").html("+" + solarPower + " W");
            $("#pue").html(((serverPower + coolingPower) / serverPower).toFixed(2));
            if(solarPower > serverPower + coolingPower) {
                dChart.data.datasets[0].data = [ serverPower, coolingPower,
                    solarPower - serverPower - coolingPower, 0 ];
            }
            dChart.update();
        }
    });
}
