const MONTH_STR = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul",
    "Aug", "Sep", "Oct", "Now", "Dec" ];

function int2digit(number) {
        return ("0" + number).slice(-2);
}

function timestamp2string(ts) {
        let myDate = new Date(ts * 1000);
        return int2digit(myDate.getDate()) + "-" + MONTH_STR[myDate.getMonth()] + " " +
                int2digit(myDate.getHours()) + ":" + int2digit(myDate.getMinutes()) + ":" +
                int2digit(myDate.getSeconds());
}

$(document).ready(function () {
    $.getJSON('/json/production', function(data) {
        data = data.values;
        // Get the time of yesterday at midnight (start of the day)
        let yesterdayMidnight = Math.floor(Date.now() / 1000);
        yesterdayMidnight = yesterdayMidnight - yesterdayMidnight % (24 * 3600) - (24 * 3600);
        // Get the time of yesterday at noon (start of the afternoon)
        let yesterdayNoon = yesterdayMidnight + 12 * 3600;
        // Get the time of today at midnight
        let todayMidnight = yesterdayMidnight + 24 * 3600;

        // Compute the production hours of yesterday
        // The last PV to produce is the ouest panel
        let nameAM = "monocristallin_ouest_5_ond3";
        let otherAM = [ "polycristallin_est_5_ond1",
            "polycristallin_est_5_ond2", "monocristallin_ouest_5_ond4",
            "monocristallin_sud_30_ond5", "monocristallin_sud_30_ond6",
            "polycristallin_sud_30_ond7", "polycristallin_sud_30_ond8",
            "polycristallin_plat_0_ond9", "polycristallin_plat_0_ond10",
            "polycristallin_plat_0_ond11", "polycristallin_plat_0_ond12",
            "tracker_solaire_ond13", "tracker_solaire_ond14"
        ];
        // The last PV to stop producing is the est panel
        let namePM = "polycristallin_est_5_ond1";
        let otherPM = [ "polycristallin_est_5_ond2",
            "monocristallin_ouest_5_ond3", "monocristallin_ouest_5_ond4",
            "monocristallin_sud_30_ond5", "monocristallin_sud_30_ond6",
            "polycristallin_sud_30_ond7", "polycristallin_sud_30_ond8",
            "polycristallin_plat_0_ond9", "polycristallin_plat_0_ond10",
            "polycristallin_plat_0_ond11", "polycristallin_plat_0_ond12",
            "tracker_solaire_ond13", "tracker_solaire_ond14"
        ];
        let idx = 0;
        // Looking for the first consumption of yesterday greater than 0
        let found = false;
        for(; idx < data[nameAM].length; idx++) {
            let value = data[nameAM][idx];
            if(value.time > yesterdayMidnight) {
                if(value.mean > 0) {
                    found = true;
                    // Check that all PV produce
                    for(other of otherAM) {
                        if(data[other][idx].mean == 0) {
                            found = false;
                        }
                    }
                    if(found) {
                        break;
                    }
                }
            }
        }
        if(found) {
            let sDate = new Date(data[nameAM][idx].time * 1000);
            $("#yesterday-start").html(int2digit(sDate.getHours()) + ":" +
                int2digit(sDate.getMinutes()));
        }
        // Looking for the first consumption of yesterday afternoon equal to 0
        found = false;
        for(; idx < data[namePM].length; idx++) {
            let value = data[namePM][idx];
            if(value.time > yesterdayNoon) {
                if(value.mean == 0) {
                    found = true;
                    // Check that all PV produce
                    for(other of otherAM) {
                        if(data[other][idx].mean > 0) {
                            found = false;
                        }
                    }
                    if(found) {
                        break;
                    }
                }
            }
        }
        if(found) {
            let eDate = new Date(data[namePM][idx].time * 1000);
            $("#yesterday-end").html(int2digit(eDate.getHours()) + ":" +
                int2digit(eDate.getMinutes()));
        }
        // Compute the production hours of today
        // Looking for the first consumption of today greater than 0
        found = false;
        for(; idx < data[nameAM].length; idx++) {
            let value = data[nameAM][idx];
            if(value.time > todayMidnight) {
                if(value.mean > 0) {
                    found = true;
                    // Check that all PV produce
                    for(other of otherAM) {
                        if(data[other][idx].mean == 0) {
                            found = false;
                        }
                    }
                    if(found) {
                        break;
                    }
                }
            }
        }
        if(found) {
            let sDate = new Date(data[nameAM][idx].time * 1000);
            $("#today-start").html(int2digit(sDate.getHours()) + ":" +
                int2digit(sDate.getMinutes()));
        }

        // Compute the 'Total Production', the 'Maximum Production' and 'Production Details (kW)'
        let prodTimestamp = new Map();
        let yesterdayProd = new Map();
        let todayProd = new Map();
        for(let name in data) {
            yesterdayProd[name] = 0;
            todayProd[name] = 0;
            for(let cons of data[name]) {
                if(cons.time > yesterdayMidnight) {
                    if(cons.time < todayMidnight) {
                        yesterdayProd[name] += cons.mean;
                    } else {
                        todayProd[name] += cons.mean;
                    }
                    if(!(cons.time in prodTimestamp)) {
                        prodTimestamp[cons.time] = cons.mean;
                    } else {
                        prodTimestamp[cons.time] += cons.mean;
                    }
                }
            }
        }
        // Convert the todayProd values in kW
        for(let name in todayProd) {
            todayProd[name] = (todayProd[name] / 1000).toFixed(0);
        }
        // Convert the yesterdayProd values in kW
        for(let name in yesterdayProd) {
            yesterdayProd[name] = (yesterdayProd[name] / 1000).toFixed(0);
        }
        let todayDate = new Date(), todayMax = 0, todayTotal = 0;
        let yestedayDate = new Date(), yesterdayMax = 0, yesterdayTotal = 0;
        for (let ts in prodTimestamp) {
            let prod = prodTimestamp[ts];
            if(ts < todayMidnight) {
                if(prod > yesterdayMax) {
                    yestedayDate = new Date(ts * 1000);
                    yesterdayMax = prod;
                }
                yesterdayTotal += prod;
            } else {
                if(prod > todayMax) {
                    todayDate = new Date(ts * 1000);
                    todayMax = prod;
                }
                todayTotal += prod;
            }
        }
        // Display the total and max values of today
        if(todayTotal < 10000) {
            $("#today-total").html(todayTotal.toFixed(0) + " W");
        } else {
            $("#today-total").html((todayTotal / 1000).toFixed(0) + " kW");
        }
        if(todayMax < 10000) {
            $("#today-max").html(todayMax.toFixed(0) + " W at " + 
                int2digit(todayDate.getHours()) + ":" +
                int2digit(todayDate.getMinutes()));
        } else {
            $("#today-max").html((todayMax / 1000).toFixed(0) + " kW at " +
                int2digit(todayDate.getHours()) + ":" +
                int2digit(todayDate.getMinutes()));
        }
        // Display the total and max values of yesterday
        if(yesterdayTotal < 10000) {
            $("#yesterday-total").html(yesterdayTotal.toFixed(0) + " W");
        } else {
            $("#yesterday-total").html((yesterdayTotal / 1000).toFixed(0) + " kW");
        }
        if(yesterdayMax < 10000) {
            $("#yesterday-max").html(yesterdayMax.toFixed(0) + " W at " + 
                int2digit(yestedayDate.getHours()) + ":" + int2digit(yestedayDate.getMinutes()));
        } else {
            $("#yesterday-max").html((yesterdayMax / 1000).toFixed(0) + " kW at " +
                int2digit(yestedayDate.getHours()) + ":" + int2digit(yestedayDate.getMinutes()));
        }
        // Display the today doughnut
        const todayData = {
          labels: [
              "polycristallin_est_5_ond1",
              "polycristallin_est_5_ond2",
              "monocristallin_ouest_5_ond3",
              "monocristallin_ouest_5_ond4",
              "monocristallin_sud_30_ond5",
              "monocristallin_sud_30_ond6",
              "polycristallin_sud_30_ond7",
              "polycristallin_sud_30_ond8",
              "polycristallin_plat_0_ond9",
              "polycristallin_plat_0_ond10",
              "polycristallin_plat_0_ond11",
              "polycristallin_plat_0_ond12",
              "tracker_solaire_ond13",
              "tracker_solaire_ond14"
          ],
          datasets: [{
            data: [
              todayProd["polycristallin_est_5_ond1"],
              todayProd["polycristallin_est_5_ond2"],
              todayProd["monocristallin_ouest_5_ond3"],
              todayProd["monocristallin_ouest_5_ond4"],
              todayProd["monocristallin_sud_30_ond5"],
              todayProd["monocristallin_sud_30_ond6"],
              todayProd["polycristallin_sud_30_ond7"],
              todayProd["polycristallin_sud_30_ond8"],
              todayProd["polycristallin_plat_0_ond9"],
              todayProd["polycristallin_plat_0_ond10"],
              todayProd["polycristallin_plat_0_ond11"],
              todayProd["polycristallin_plat_0_ond12"],
              todayProd["tracker_solaire_ond13"],
              todayProd["tracker_solaire_ond14"]
            ],
            backgroundColor: [
                "#a3a948",
                "#edb92e",
                "#f8876b",
                "#ce1836",
                "#009989",
                "#86b894",
                "#668284",
                "#2a2c31",
                "#f2d694",
                "#b7eeca",
                "#bcbcbc",
                "#e8d5b7",
                "#b576ad",
                "#7ccce5"
            ],
            hoverOffset: 4
          }]
        };
        let noZero = false;
        for(value of todayData.datasets[0].data) {
            if(value > 0) {
                noZero = true;
            }
        }
        let nodataDiv = document.getElementById('today-nodata');
        let todayDetails = document.getElementById('today-details');
        if(noZero) {
            $(nodataDiv).hide();
            let ctx = todayDetails.getContext('2d');
            let todayChart = new Chart(ctx, {
                type: 'doughnut',
                data: todayData
            });
        } else {
            $(todayDetails).hide();
            nodataDiv.innerHTML = "No production data";
        }
        // Display the yesterday doughnut
        const yesterdayData = {
          labels: [
              "polycristallin_est_5_ond1",
              "polycristallin_est_5_ond2",
              "monocristallin_ouest_5_ond3",
              "monocristallin_ouest_5_ond4",
              "monocristallin_sud_30_ond5",
              "monocristallin_sud_30_ond6",
              "polycristallin_sud_30_ond7",
              "polycristallin_sud_30_ond8",
              "polycristallin_plat_0_ond9",
              "polycristallin_plat_0_ond10",
              "polycristallin_plat_0_ond11",
              "polycristallin_plat_0_ond12",
              "tracker_solaire_ond13",
              "tracker_solaire_ond14"
          ],
          datasets: [{
            data: [
              yesterdayProd["polycristallin_est_5_ond1"],
              yesterdayProd["polycristallin_est_5_ond2"],
              yesterdayProd["monocristallin_ouest_5_ond3"],
              yesterdayProd["monocristallin_ouest_5_ond4"],
              yesterdayProd["monocristallin_sud_30_ond5"],
              yesterdayProd["monocristallin_sud_30_ond6"],
              yesterdayProd["polycristallin_sud_30_ond7"],
              yesterdayProd["polycristallin_sud_30_ond8"],
              yesterdayProd["polycristallin_plat_0_ond9"],
              yesterdayProd["polycristallin_plat_0_ond10"],
              yesterdayProd["polycristallin_plat_0_ond11"],
              yesterdayProd["polycristallin_plat_0_ond12"],
              yesterdayProd["tracker_solaire_ond13"],
              yesterdayProd["tracker_solaire_ond14"]
            ],
            backgroundColor: [
                "#a3a948",
                "#edb92e",
                "#f8876b",
                "#ce1836",
                "#009989",
                "#86b894",
                "#668284",
                "#2a2c31",
                "#f2d694",
                "#b7eeca",
                "#bcbcbc",
                "#e8d5b7",
                "#b576ad",
                "#7ccce5"
            ],
            hoverOffset: 4
          }]
        };
        noZero = false;
        for(value of yesterdayData.datasets[0].data) {
            if(value > 0) {
                noZero = true;
            }
        }
        nodataDiv = document.getElementById('yesterday-nodata');
        let yesterdayDetails = document.getElementById('yesterday-details');
        if(noZero) {
            $(nodataDiv).hide();
            ctx = document.getElementById('yesterday-details').getContext('2d');
            let prodChart = new Chart(ctx, {
                type: 'doughnut',
                data: yesterdayData
            });
        } else {
            $(yesterdayDetails).hide();
            nodataDiv.innerHTML = "No production data";
        }

        // Draw the graph of 'Yesterday Production (last 48h)' section
        let prodValues = {};
        let xValues = [];
        const lineData = {
              labels: xValues,
              datasets: []
        };
        for(idx in yesterdayData.labels) {
            let name = yesterdayData.labels[idx];
            let color = yesterdayData.datasets[0].backgroundColor[idx];
            prodValues[name] = [];
            lineData.datasets.push({
                label: name,
                data: prodValues[name],
                fill: false,
                borderColor: color
            });
        }
        for (oneValue of Object.values(data)[0]) {
            xValues.push(timestamp2string(oneValue.time));
        }
        for(name in data) {
            for (value of data[name]) {
                prodValues[name].push(value.mean)
            }
        }
        ctx = document.getElementById('production-line').getContext('2d');
        let lineChart = new Chart(ctx, {
            type: 'line',
            data: lineData 
        });
    });
});
