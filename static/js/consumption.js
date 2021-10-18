$(document).ready(function () {
    // Switch doughnut 
    switchInfo = {
        "names": [
            "switch_mgmt_pdu-Z1.40",
            "switch_prod_1_pdu-Z1.51",
            "switch_prod_2_pdu-Z1.21"
        ],
        "labels": [
            "switch_mgmt",
            "switch_prod_1",
            "switch_prod_2"
        ],
        "colors": [
            "#dedede",
            "#a2a2a2",
            "#525252"
        ],
        "cons": [
            0,
            0,
            0
        ]
    }
	const switchData = {
	  labels: switchInfo.labels,
	  datasets: [{
		data: switchInfo.cons,
		backgroundColor: switchInfo.colors,
		hoverOffset: 4
	  }]
	};
	var ctx = document.getElementById('switch-doughnut').getContext('2d');
    let switchChart = new Chart(ctx, {
        type: 'doughnut',
        data: switchData 
    });
    switchInfo.chart = switchChart;
    // Cooling doughnut 
    coolingInfo = {
        "names": [
            "wattmeter_condensator",
            "wattmeter_cooling",
            "watt_cooler_b232_2",
            "watt_cooler_ext_1",
            "watt_cooler_ext_2"
        ],
        "labels": [
            "wattmeter_condensator",
            "wattmeter_cooling",
            "watt_cooler_b232_2",
            "watt_cooler_ext_1",
            "watt_cooler_ext_2"
        ],
        "colors": [
            "#89bbff",
            "#89ddff",
            "#8b89ff",
            "#5497ff",
            "#426396"
        ],
        "cons": [
            0,
            0,
            0,
            0,
            0
        ]
    }
	const coolingData = {
	  labels: coolingInfo.labels,
	  datasets: [{
		data: coolingInfo.cons,
		backgroundColor: coolingInfo.colors,
		hoverOffset: 4
	  }]
	};
	var ctx = document.getElementById('cooling-doughnut').getContext('2d');
    let coolingChart = new Chart(ctx, {
        type: 'doughnut',
        data: coolingData
    });
    coolingInfo.chart = coolingChart;
    // Rack z1.1 consumption
    rack1Info = {
        "names": [
            "ecotype-37_pdu-Z1.10",
            "ecotype-38_pdu-Z1.10",
            "ecotype-39_pdu-Z1.10",
            "ecotype-40_pdu-Z1.10",
            "ecotype-41_pdu-Z1.10",
            "ecotype-42_pdu-Z1.10",
            "ecotype-43_pdu-Z1.10",
            "ecotype-44_pdu-Z1.10",
            "ecotype-45_pdu-Z1.10",
            "ecotype-46_pdu-Z1.10",
            "ecotype-47_pdu-Z1.10",
            "ecotype-48_pdu-Z1.10",
            "ecotype-37_pdu-Z1.11",
            "ecotype-38_pdu-Z1.11",
            "ecotype-39_pdu-Z1.11",
            "ecotype-40_pdu-Z1.11",
            "ecotype-41_pdu-Z1.11",
            "ecotype-42_pdu-Z1.11",
            "ecotype-43_pdu-Z1.11",
            "ecotype-44_pdu-Z1.11",
            "ecotype-45_pdu-Z1.11",
            "ecotype-46_pdu-Z1.11",
            "ecotype-47_pdu-Z1.11",
            "ecotype-48_pdu-Z1.11"
        ],
        "labels": [
            "ecotype-37",
            "ecotype-38",
            "ecotype-39",
            "ecotype-40",
            "ecotype-41",
            "ecotype-42",
            "ecotype-43",
            "ecotype-44",
            "ecotype-45",
            "ecotype-46",
            "ecotype-47",
            "ecotype-48"
        ],
        "colors": [
            "#555e7b",
            "#b7d968",
            "#b576ad",
            "#e04644",
            "#7ffd9f",
            "#7ccce5",
            "#a8e6ce",
            "#f0e2a4",
            "#f9ba7e",
            "#c44d58",
            "#67917a",
            "#594f4f"
        ],
        "cons": [
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0
        ]
    }
	const rack1Data = {
	  labels: rack1Info.labels,
	  datasets: [{
		data: rack1Info.cons,
		backgroundColor: rack1Info.colors,
		hoverOffset: 4
	  }]
	};
	var ctx = document.getElementById('rack1-doughnut').getContext('2d');
    let rack1Chart = new Chart(ctx, {
        type: 'doughnut',
        data: rack1Data
    });
    rack1Info.chart = rack1Chart;
    // Rack z1.2 consumption
    rack2Info = {
        "names": [
            "ecotype-25_pdu-Z1.20",
            "ecotype-26_pdu-Z1.20",
            "ecotype-27_pdu-Z1.20",
            "ecotype-28_pdu-Z1.20",
            "ecotype-29_pdu-Z1.20",
            "ecotype-30_pdu-Z1.20",
            "ecotype-31_pdu-Z1.20",
            "ecotype-32_pdu-Z1.20",
            "ecotype-33_pdu-Z1.20",
            "ecotype-34_pdu-Z1.20",
            "ecotype-35_pdu-Z1.20",
            "ecotype-36_pdu-Z1.20",
            "ecotype-25_pdu-Z1.21",
            "ecotype-26_pdu-Z1.21",
            "ecotype-27_pdu-Z1.21",
            "ecotype-28_pdu-Z1.21",
            "ecotype-29_pdu-Z1.21",
            "ecotype-30_pdu-Z1.21",
            "ecotype-31_pdu-Z1.21",
            "ecotype-32_pdu-Z1.21",
            "ecotype-33_pdu-Z1.21",
            "ecotype-34_pdu-Z1.21",
            "ecotype-35_pdu-Z1.21",
            "ecotype-36_pdu-Z1.21"
        ],
        "labels": [
            "ecotype-25",
            "ecotype-26",
            "ecotype-27",
            "ecotype-28",
            "ecotype-29",
            "ecotype-30",
            "ecotype-31",
            "ecotype-32",
            "ecotype-33",
            "ecotype-34",
            "ecotype-35",
            "ecotype-36"
        ],
        "colors": [
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
            "#e8d5b7"
        ],
        "cons": [
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0
        ]
    }
	const rack2Data = {
	  labels: rack2Info.labels,
	  datasets: [{
		data: rack2Info.cons,
		backgroundColor: rack2Info.colors,
		hoverOffset: 4
	  }]
	};
	var ctx = document.getElementById('rack2-doughnut').getContext('2d');
    let rack2Chart = new Chart(ctx, {
        type: 'doughnut',
        data: rack2Data
    });
    rack2Info.chart = rack2Chart;
    // Rack z1.4 consumption
    rack4Info = {
        "names": [
            "ecotype-13_pdu-Z1.40",
            "ecotype-14_pdu-Z1.40",
            "ecotype-15_pdu-Z1.40",
            "ecotype-16_pdu-Z1.40",
            "ecotype-17_pdu-Z1.40",
            "ecotype-18_pdu-Z1.40",
            "ecotype-19_pdu-Z1.40",
            "ecotype-20_pdu-Z1.40",
            "ecotype-21_pdu-Z1.40",
            "ecotype-22_pdu-Z1.40",
            "ecotype-23_pdu-Z1.40",
            "ecotype-24_pdu-Z1.40",
            "ecotype-13_pdu-Z1.41",
            "ecotype-14_pdu-Z1.41",
            "ecotype-15_pdu-Z1.41",
            "ecotype-16_pdu-Z1.41",
            "ecotype-17_pdu-Z1.41",
            "ecotype-18_pdu-Z1.41",
            "ecotype-19_pdu-Z1.41",
            "ecotype-20_pdu-Z1.41",
            "ecotype-21_pdu-Z1.41",
            "ecotype-22_pdu-Z1.41",
            "ecotype-23_pdu-Z1.41",
            "ecotype-24_pdu-Z1.41"
        ],
        "labels": [
            "ecotype-13",
            "ecotype-14",
            "ecotype-15",
            "ecotype-16",
            "ecotype-17",
            "ecotype-18",
            "ecotype-19",
            "ecotype-20",
            "ecotype-21",
            "ecotype-22",
            "ecotype-23",
            "ecotype-24"
        ],
        "colors": [
            "#9ca3af",
            "#e5e59b",
            "#dfba69",
            "#a25959",
            "#2a2c31",
            "#ccbf82",
            "#556270",
            "#af8168",
            "#f4ebc3",
            "#7ab317",
            "#cfbe27",
            "#98157e"
        ],
        "cons": [
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0
        ]
    }
	const rack4Data = {
	  labels: rack4Info.labels,
	  datasets: [{
		data: rack4Info.cons,
		backgroundColor: rack4Info.colors,
		hoverOffset: 4
	  }]
	};
	var ctx = document.getElementById('rack4-doughnut').getContext('2d');
    let rack4Chart = new Chart(ctx, {
        type: 'doughnut',
        data: rack4Data
    });
    rack4Info.chart = rack4Chart;
    // Rack z1.5 consumption
    rack5Info = {
        "names": [
            "ecotype-1_pdu-Z1.50",
            "ecotype-2_pdu-Z1.50",
            "ecotype-3_pdu-Z1.50",
            "ecotype-4_pdu-Z1.50",
            "ecotype-5_pdu-Z1.50",
            "ecotype-6_pdu-Z1.50",
            "ecotype-7_pdu-Z1.50",
            "ecotype-8_pdu-Z1.50",
            "ecotype-9_pdu-Z1.50",
            "ecotype-10_pdu-Z1.50",
            "ecotype-11_pdu-Z1.50",
            "ecotype-12_pdu-Z1.50",
            "ecotype-1_pdu-Z1.51",
            "ecotype-2_pdu-Z1.51",
            "ecotype-3_pdu-Z1.51",
            "ecotype-4_pdu-Z1.51",
            "ecotype-5_pdu-Z1.51",
            "ecotype-6_pdu-Z1.51",
            "ecotype-7_pdu-Z1.51",
            "ecotype-8_pdu-Z1.51",
            "ecotype-9_pdu-Z1.51",
            "ecotype-10_pdu-Z1.51",
            "ecotype-11_pdu-Z1.51",
            "ecotype-12_pdu-Z1.51"
        ],
        "labels": [
            "ecotype-1",
            "ecotype-2",
            "ecotype-3",
            "ecotype-4",
            "ecotype-5",
            "ecotype-6",
            "ecotype-7",
            "ecotype-8",
            "ecotype-9",
            "ecotype-10",
            "ecotype-11",
            "ecotype-12"
        ],
        "colors": [
            "#554236",
            "#f58439",
            "#d3ce3d",
            "#c8c7af",
            "#60b99a",
            "#e5fcc2",
            "#607848",
            "#e6b527",
            "#a7dbd8",
            "#f584b1",
            "#ece5ce",
            "#cbe86b"
        ],
        "cons": [
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0
        ]
    }
	const rack5Data = {
	  labels: rack5Info.labels,
	  datasets: [{
		data: rack5Info.cons,
		backgroundColor: rack5Info.colors,
		hoverOffset: 4
	  }]
	};
	var ctx = document.getElementById('rack5-doughnut').getContext('2d');
    let rack5Chart = new Chart(ctx, {
        type: 'doughnut',
        data: rack5Data
    });
    rack5Info.chart = rack5Chart;
    // Update the charts
    update(switchInfo, coolingInfo, rack1Info, rack2Info, rack4Info, rack5Info);
});

function update(switches, cooling, rack1, rack2, rack4, rack5) {
    let powerMap = new Map();
    $.getJSON('/json/power', function(data) {
        for(val of data.values) {
            powerMap.set(val.name, val);
        }
        // Switch consumption
        let switchCons = [];
        let switchTotal = 0;
        for (name of switches.names) {
            switchCons.push(powerMap.get(name).last_value); 
            switchTotal += powerMap.get(name).last_value;
        }
        $("#switch-total").html(switchTotal.toFixed(0) + " W");
        if(switchTotal == 0) {
            $("#switch-doughnut").hide();
            $("#switch-msg").show();
        } else {
            $("#switch-doughnut").show();
            switches.chart.data.datasets[0].data = switchCons;
            switches.chart.update();
            $("#switch-msg").hide();
        }
        // Cooling consumption
        let coolingData = [];
        let coolingTotal = 0;
        for (name of cooling.names) {
            coolingData.push(powerMap.get(name).last_value); 
            coolingTotal += powerMap.get(name).last_value;
        }
        $("#cooling-total").html(coolingTotal.toFixed(0) + " W");
        if(coolingTotal == 0) {
            $("#cooling-doughnut").hide();
            $("#cooling-msg").show();
        } else {
            $("#cooling-doughnut").show();
            cooling.chart.data.datasets[0].data = coolingData;
            cooling.chart.update();
            $("#cooling-msg").hide();
        }
        // Rack1 consumption
        let rack1Data = {};
        let rack1Total = 0;
        for (name of rack1.names) {
            let label = name.split("_")[0];
            if(label in rack1Data) {
                rack1Data[label] += powerMap.get(name).last_value;
            } else {
                rack1Data[label] = powerMap.get(name).last_value;
            }
            rack1Total += powerMap.get(name).last_value;
        }
        $("#rack1-total").html(rack1Total.toFixed(0) + " W");
        if(rack1Total == 0) {
            $("#rack1-doughnut").hide();
            $("#rack1-msg").show();
        } else {
            $("#rack1-doughnut").show();
            rack1.chart.data.datasets[0].data = Object.values(rack1Data);
            rack1.chart.update();
            $("#rack1-msg").hide();
        }
        // Rack2 consumption
        let rack2Data = {};
        let rack2Total = 0;
        for (name of rack2.names) {
            let label = name.split("_")[0];
            if(label in rack2Data) {
                rack2Data[label] += powerMap.get(name).last_value;
            } else {
                rack2Data[label] = powerMap.get(name).last_value;
            }
            rack2Total += powerMap.get(name).last_value;
        }
        $("#rack2-total").html(rack2Total.toFixed(0) + " W");
        if(rack2Total == 0) {
            $("#rack2-doughnut").hide();
            $("#rack2-msg").show();
        } else {
            $("#rack2-doughnut").show();
            rack2.chart.data.datasets[0].data = Object.values(rack2Data);
            rack2.chart.update();
            $("#rack2-msg").hide();
        }
        // Rack4 consumption
        let rack4Data = {};
        let rack4Total = 0;
        for (name of rack4.names) {
            let label = name.split("_")[0];
            if(label in rack4Data) {
                rack4Data[label] += powerMap.get(name).last_value;
            } else {
                rack4Data[label] = powerMap.get(name).last_value;
            }
            rack4Total += powerMap.get(name).last_value;
        }
        $("#rack4-total").html(rack4Total.toFixed(0) + " W");
        if(rack4Total == 0) {
            $("#rack4-doughnut").hide();
            $("#rack4-msg").show();
        } else {
            $("#rack4-doughnut").show();
            rack4.chart.data.datasets[0].data = Object.values(rack4Data);
            rack4.chart.update();
            $("#rack4-msg").hide();
        }
        // Rack5 consumption
        let rack5Data = {};
        let rack5Total = 0;
        for (name of rack5.names) {
            let label = name.split("_")[0];
            if(label in rack5Data) {
                rack5Data[label] += powerMap.get(name).last_value;
            } else {
                rack5Data[label] = powerMap.get(name).last_value;
            }
            rack5Total += powerMap.get(name).last_value;
        }
        $("#rack5-total").html(rack5Total.toFixed(0) + " W");
        if(rack5Total == 0) {
            $("#rack5-doughnut").hide();
            $("#rack5-msg").show();
        } else {
            $("#rack5-doughnut").show();
            rack5.chart.data.datasets[0].data = Object.values(rack5Data);
            rack5.chart.update();
            $("#rack5-msg").hide();
        }
    });
}
