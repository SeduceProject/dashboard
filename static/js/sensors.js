$(document).ready(function () {
    let page = $(".sensors"); 
    $.getJSON('/json/power', function(data) {
        // Sort by the number included in the server name
        let powers = new Map();
        for(val of data.values) {
            powers.set(val.name, val);
        }
        let serverNames = data.values.map(function(power) {
            return power.name
        });
        serverNames = serverNames.sort(function(name0, name1) {
            if(name0.startsWith("ecotype") && name1.startsWith("ecotype")) {
                let int0 = name0.split("_")[0].split("-")[1]; 
                let int1 = name1.split("_")[0].split("-")[1]; 
                return int0 - int1;
            } else {
                return name0.localeCompare(name1);
            }
        });
        // Display the servers in an HTML table
        let serverTable = $("#server-cons");
        let serverHeader = $("<div class='row header'></div>");
        serverHeader.append("<div class='col'>Server Name</div>");
        serverHeader.append("<div class='col'>PDU Name</div>");
        serverHeader.append("<div class='col'>Power (W)</div>");
        serverHeader.append("<div class='col'><span class='in'>IN</span> / <span class='out'>OUT</span> Temp (°C)</div>");
        serverHeader.append("<div class='col'>Last Update (s)</div>");
        serverTable.append(serverHeader);
        // Display the switches in an HTML table
        let switchTable = $("#switch-cons");
        let switchHeader = $("<div class='row header'></div>");
        switchHeader.append("<div class='col'>Switch Name</div>");
        switchHeader.append("<div class='col'>PDU Name</div>");
        switchHeader.append("<div class='col'>Power (W)</div>");
        switchHeader.append("<div class='col'>Last Update (s)</div>");
        switchTable.append(switchHeader);
        // Display the cooling elements in an HTML table
        let coolingTable = $("#cooling-cons");
        let coolingHeader = $("<div class='row header'></div>");
        coolingHeader.append("<div class='col'>Cooling Element</div>");
        coolingHeader.append("<div class='col'>Power (W)</div>");
        coolingHeader.append("<div class='col'>Last Update (s)</div>");
        coolingTable.append(coolingHeader);
        // Display the solar panels in an HTML table
        let solarTable = $("#solar-prod");
        let solarHeader = $("<div class='row header'></div>");
        solarHeader.append("<div class='col'>Solar Panel</div>");
        solarHeader.append("<div class='col'>Power (W)</div>");
        solarHeader.append("<div class='col'>Last Update (s)</div>");
        solarTable.append(solarHeader);
        // Add the rows to the tables
        for(name of serverNames) {
            let server = powers.get(name);
            if(server.name.startsWith("ecotype")) {
                let row = $("<div class='row'></div>");
                serverTable.append(row);
                let name = server.name.split("_")[0];
                let pdu = server.name.split("_")[1];
                row.append("<div class='col'>" + name + "</div>");
                row.append("<div class='col'>" + pdu + "</div>");
                row.append("<div id='" + name + "-" + pdu.slice(-1) + "-power' class='col'>-</div>");
                row.append("<div id='" + name + "-" + pdu.slice(-1) + "-temp' class='col'>- / -</div>");
                row.append("<div id='" + name + "-" + pdu.slice(-1) + "-last' class='col'>-</div>");
            } else if(server.name.startsWith("switch")) {
                let row = $("<div class='row'></div>");
                switchTable.append(row);
                let splitIdx = server.name.lastIndexOf("_");
                let name = server.name.substring(0, splitIdx);
                let pdu = server.name.substring(splitIdx + 1);
                row.append("<div class='col'>" + name + "</div>");
                row.append("<div class='col'>" + pdu + "</div>");
                row.append("<div id='" + name + "-power' class='col'>-</div>");
                row.append("<div id='" + name + "-last' class='col'>-</div>");
            } else if(server.name.startsWith("watt")) {
                let row = $("<div class='row'></div>");
                coolingTable.append(row);
                row.append("<div class='col'>" + server.name + "</div>");
                row.append("<div id='" + server.name + "-power' class='col'>-</div>");
                row.append("<div id='" + server.name + "-last' class='col'>-</div>");
            } else {
                let row = $("<div class='row'></div>");
                solarTable.append(row);
                row.append("<div class='col'>" + server.name + "</div>");
                row.append("<div id='" + server.name + "-power' class='col'>-</div>");
                row.append("<div id='" + server.name + "-last' class='col'>-</div>");
            }
        }
        // Load the last temperature and power values 
        updateTable();
        // Update the temperature and the power values every 10s
        setInterval(updateTable, 10000);
    });
});

function updateTable() {
    $.getJSON('/json/power', function(data) {
        for(power of data.values) {
            let lastUpdate = Date.now() / 1000 - power.time; 
            if(power.name.startsWith("ecotype")) {
                let name = power.name.split("_")[0];
                let pdu = power.name.split("_")[1];
                $("#" + name + "-" + pdu.slice(-1) + "-power").html(power.last_value);
                $("#" + name + "-" + pdu.slice(-1) + "-last").html(lastUpdate.toFixed(1));
            } else if(power.name.startsWith("switch")) {
                let splitIdx = power.name.lastIndexOf("_");
                let name = power.name.substring(0, splitIdx);
                $("#" + name + "-power").html(power.last_value);
                $("#" + name + "-last").html(lastUpdate.toFixed(1));
            } else {
                $("#" + power.name + "-power").html(power.last_value);
                $("#" + power.name + "-last").html(lastUpdate.toFixed(1));
            }
        }
    });
    $.getJSON('/json/temperature', function(data) {
        let serverData = {};
        for(temp of data.values) {
            let splitPos = temp.name.lastIndexOf("-");
            let serverName = temp.name.substring(0, splitPos);
            let serverTemp = $("#" + serverName + "-0-temp");
            if(serverTemp.length > 0) {
                if(!(serverName in serverData)) {
                    serverData[serverName] = {};
                }
                serverData[serverName][temp.name.substring(splitPos + 1)] = temp.last_value;
            }
        }
        for(server in serverData) {
            let front = "-", back = "-";
            if("front" in serverData[server]) {
                front = serverData[server]["front"];
            }
            if("back" in serverData[server]) {
                back = serverData[server]["back"];
            }
            $("#" + server + "-0-temp").html("<span class='in'>" + front + "</span> / <span class='out'>" + back + "</span>");
            $("#" + server + "-1-temp").html("<span class='in'>" + front + "</span> / <span class='out'>" + back + "</span>");
        }
    });
}
