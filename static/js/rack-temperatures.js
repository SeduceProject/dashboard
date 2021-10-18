$(document).ready(function () {
    let front = $("#front");
    let frontRow = $("<div class='row'></div>");
    front.append(frontRow);
    frontRow.append($("<div class='col'>Rack z1.1 front</div>"));
    frontRow.append($("<div class='col'>Rack z1.2 front</div>"));
    frontRow.append($("<div class='col'>Rack z1.4 front</div>"));
    frontRow.append($("<div class='col'>Rack z1.5 front</div>"));
    let back = $("#back");
    let backRow = $("<div class='row'></div>");
    back.append(backRow);
    backRow.append($("<div class='col'>Rack z1.1 back</div>"));
    backRow.append($("<div class='col'>Rack z1.2 back</div>"));
    backRow.append($("<div class='col'>Rack z1.4 back</div>"));
    backRow.append($("<div class='col'>Rack z1.5 </div>"));
    for(let i =  1; i < 43; i++) {
        // Add 42U to the 4 racks 
        let row = $("<div class='row'></div>");
        front.append(row);
        let col1 = $("<div id='r1u" + i + "-front' class='col border'>-</div>");
        let col2 = $("<div id='r2u" + i + "-front' class='col border'>-</div>");
        let col3 = $("<div id='r3u" + i + "-front' class='col border'>-</div>");
        let col4 = $("<div id='r4u" + i + "-front' class='col border'>-</div>");
        row.append(col1);
        row.append(col2);
        row.append(col3);
        row.append(col4);
    }
    for(let i =  1; i < 43; i++) {
        // Add 42U to the 4 racks 
        let row = $("<div class='row'></div>");
        back.append(row);
        let col1 = $("<div id='r1u" + i + "-back' class='col border'>-</div>");
        let col2 = $("<div id='r2u" + i + "-back' class='col border'>-</div>");
        let col3 = $("<div id='r3u" + i + "-back' class='col border'>-</div>");
        let col4 = $("<div id='r4u" + i + "-back' class='col border'>-</div>");
        row.append(col1);
        row.append(col2);
        row.append(col3);
        row.append(col4);
    }
    update();
    setInterval(update, 10000);
});

function hsl_color(temperature) {
    let TEMP_MIN = 17;
    let TEMP_MAX = 40;
    let HSL_COLOR_MIN = 180;
    let HSL_COLOR_MAX = 0;
    if (temperature < TEMP_MIN) {
        return HSL_COLOR_MIN;
    }
    if (temperature > TEMP_MAX) {
        return HSL_COLOR_MAX;
    }
    return HSL_COLOR_MIN - ((HSL_COLOR_MIN - HSL_COLOR_MAX) / (TEMP_MAX - TEMP_MIN))
        * (temperature - TEMP_MIN);
}

function rackSquare(rackId, tempId, temperatureMap) {
    let temp = temperatureMap.get(tempId).last_value;
    let splitIdx = tempId.lastIndexOf("-");
    $("#" + rackId).html(temp + "°C (" + tempId.substring(0, splitIdx) + ")");
    $("#" + rackId).css("background-color", "hsl(" + hsl_color(temp) + ", 75%, 55%)");
}

function update() {
    $.getJSON('/json/temperature', function(data) {         
        // Insert the data to a Map()
        let temperatures = new Map();
        for(val of data.values) {
            temperatures.set(val.name, val);
        }
        // Rack z1.1 temperatures
        rackSquare("r1u4-front", "temp-13-front", temperatures);
        rackSquare("r1u8-front", "temp-14-front", temperatures);

        rackSquare("r1u14-front", "ecotype-37-front", temperatures);
        rackSquare("r1u15-front", "ecotype-38-front", temperatures);
        rackSquare("r1u16-front", "ecotype-39-front", temperatures);
        rackSquare("r1u17-front", "ecotype-40-front", temperatures);
        rackSquare("r1u18-front", "ecotype-41-front", temperatures);
        rackSquare("r1u19-front", "ecotype-42-front", temperatures);
        rackSquare("r1u20-front", "ecotype-43-front", temperatures);
        rackSquare("r1u21-front", "ecotype-44-front", temperatures);
        rackSquare("r1u22-front", "ecotype-45-front", temperatures);
        rackSquare("r1u23-front", "ecotype-46-front", temperatures);
        rackSquare("r1u24-front", "ecotype-47-front", temperatures);
        rackSquare("r1u25-front", "ecotype-48-front", temperatures);

        rackSquare("r1u37-front", "temp-15-front", temperatures);
        rackSquare("r1u42-front", "temp-16-front", temperatures);
        // Rack z1.2 temperatures
        rackSquare("r2u3-front", "temp-9-front", temperatures);
        rackSquare("r2u6-front", "temp-10-front", temperatures);

        rackSquare("r2u14-front", "ecotype-25-front", temperatures);
        rackSquare("r2u15-front", "ecotype-26-front", temperatures);
        rackSquare("r2u16-front", "ecotype-27-front", temperatures);
        rackSquare("r2u17-front", "ecotype-28-front", temperatures);
        rackSquare("r2u18-front", "ecotype-29-front", temperatures);
        rackSquare("r2u19-front", "ecotype-30-front", temperatures);
        rackSquare("r2u20-front", "ecotype-31-front", temperatures);
        rackSquare("r2u21-front", "ecotype-32-front", temperatures);
        rackSquare("r2u22-front", "ecotype-33-front", temperatures);
        rackSquare("r2u23-front", "ecotype-34-front", temperatures);
        rackSquare("r2u24-front", "ecotype-35-front", temperatures);
        rackSquare("r2u25-front", "ecotype-36-front", temperatures);

        rackSquare("r2u37-front", "temp-11-front", temperatures);
        rackSquare("r2u42-front", "temp-12-front", temperatures);
        // Rack z1.3 temperatures
        rackSquare("r3u3-front", "temp-5-front", temperatures);
        rackSquare("r3u6-front", "temp-6-front", temperatures);

        rackSquare("r3u11-front", "ecotype-13-front", temperatures);
        rackSquare("r3u13-front", "ecotype-14-front", temperatures);
        rackSquare("r3u15-front", "ecotype-15-front", temperatures);
        rackSquare("r3u17-front", "ecotype-16-front", temperatures);
        rackSquare("r3u19-front", "ecotype-17-front", temperatures);
        rackSquare("r3u21-front", "ecotype-18-front", temperatures);
        rackSquare("r3u23-front", "ecotype-19-front", temperatures);
        rackSquare("r3u25-front", "ecotype-20-front", temperatures);
        rackSquare("r3u27-front", "ecotype-21-front", temperatures);
        rackSquare("r3u29-front", "ecotype-22-front", temperatures);
        rackSquare("r3u31-front", "ecotype-23-front", temperatures);
        rackSquare("r3u33-front", "ecotype-24-front", temperatures);

        rackSquare("r3u37-front", "temp-7-front", temperatures);
        rackSquare("r3u41-front", "temp-8-front", temperatures);
        // Rack z1.4 temperatures
        rackSquare("r4u3-front", "temp-1-front", temperatures);
        rackSquare("r4u7-front", "temp-2-front", temperatures);

        rackSquare("r4u11-front", "ecotype-1-front", temperatures);
        rackSquare("r4u13-front", "ecotype-2-front", temperatures);
        rackSquare("r4u15-front", "ecotype-3-front", temperatures);
        rackSquare("r4u17-front", "ecotype-4-front", temperatures);
        rackSquare("r4u19-front", "ecotype-5-front", temperatures);
        // No temperature for the ecotype-6
        //rackSquare("r4u21-front", "ecotype-6-front", temperatures);
        rackSquare("r4u23-front", "ecotype-7-front", temperatures);
        rackSquare("r4u25-front", "ecotype-8-front", temperatures);
        rackSquare("r4u27-front", "ecotype-9-front", temperatures);
        rackSquare("r4u29-front", "ecotype-10-front", temperatures);
        rackSquare("r4u31-front", "ecotype-11-front", temperatures);
        rackSquare("r4u33-front", "ecotype-12-front", temperatures);

        rackSquare("r4u37-front", "temp-3-front", temperatures);
        rackSquare("r4u42-front", "temp-4-front", temperatures);
        // Rack z1.1 temperatures
        rackSquare("r1u4-back", "temp-13-back", temperatures);
        rackSquare("r1u8-back", "temp-14-back", temperatures);

        rackSquare("r1u14-back", "ecotype-37-back", temperatures);
        rackSquare("r1u15-back", "ecotype-38-back", temperatures);
        rackSquare("r1u16-back", "ecotype-39-back", temperatures);
        rackSquare("r1u17-back", "ecotype-40-back", temperatures);
        rackSquare("r1u18-back", "ecotype-41-back", temperatures);
        rackSquare("r1u19-back", "ecotype-42-back", temperatures);
        rackSquare("r1u20-back", "ecotype-43-back", temperatures);
        rackSquare("r1u21-back", "ecotype-44-back", temperatures);
        rackSquare("r1u22-back", "ecotype-45-back", temperatures);
        rackSquare("r1u23-back", "ecotype-46-back", temperatures);
        rackSquare("r1u24-back", "ecotype-47-back", temperatures);
        rackSquare("r1u25-back", "ecotype-48-back", temperatures);

        rackSquare("r1u37-back", "temp-15-back", temperatures);
        rackSquare("r1u42-back", "temp-16-back", temperatures);
        // Rack z1.2 temperatures
        rackSquare("r2u3-back", "temp-9-back", temperatures);
        rackSquare("r2u6-back", "temp-10-back", temperatures);

        rackSquare("r2u14-back", "ecotype-25-back", temperatures);
        rackSquare("r2u15-back", "ecotype-26-back", temperatures);
        rackSquare("r2u16-back", "ecotype-27-back", temperatures);
        rackSquare("r2u17-back", "ecotype-28-back", temperatures);
        rackSquare("r2u18-back", "ecotype-29-back", temperatures);
        rackSquare("r2u19-back", "ecotype-30-back", temperatures);
        rackSquare("r2u20-back", "ecotype-31-back", temperatures);
        rackSquare("r2u21-back", "ecotype-32-back", temperatures);
        rackSquare("r2u22-back", "ecotype-33-back", temperatures);
        rackSquare("r2u23-back", "ecotype-34-back", temperatures);
        rackSquare("r2u24-back", "ecotype-35-back", temperatures);
        rackSquare("r2u25-back", "ecotype-36-back", temperatures);

        rackSquare("r2u37-back", "temp-11-back", temperatures);
        rackSquare("r2u42-back", "temp-12-back", temperatures);
        // Rack z1.3 temperatures
        rackSquare("r3u3-back", "temp-5-back", temperatures);
        rackSquare("r3u6-back", "temp-6-back", temperatures);

        rackSquare("r3u11-back", "ecotype-13-back", temperatures);
        rackSquare("r3u13-back", "ecotype-14-back", temperatures);
        rackSquare("r3u15-back", "ecotype-15-back", temperatures);
        rackSquare("r3u17-back", "ecotype-16-back", temperatures);
        rackSquare("r3u19-back", "ecotype-17-back", temperatures);
        rackSquare("r3u21-back", "ecotype-18-back", temperatures);
        rackSquare("r3u23-back", "ecotype-19-back", temperatures);
        rackSquare("r3u25-back", "ecotype-20-back", temperatures);
        rackSquare("r3u27-back", "ecotype-21-back", temperatures);
        rackSquare("r3u29-back", "ecotype-22-back", temperatures);
        rackSquare("r3u31-back", "ecotype-23-back", temperatures);
        rackSquare("r3u33-back", "ecotype-24-back", temperatures);

        rackSquare("r3u37-back", "temp-7-back", temperatures);
        rackSquare("r3u41-back", "temp-8-back", temperatures);
        // Rack z1.4 temperatures
        rackSquare("r4u3-back", "temp-1-back", temperatures);
        rackSquare("r4u7-back", "temp-2-back", temperatures);

        rackSquare("r4u11-back", "ecotype-1-back", temperatures);
        rackSquare("r4u13-back", "ecotype-2-back", temperatures);
        rackSquare("r4u15-back", "ecotype-3-back", temperatures);
        rackSquare("r4u17-back", "ecotype-4-back", temperatures);
        rackSquare("r4u19-back", "ecotype-5-back", temperatures);
        rackSquare("r4u21-back", "ecotype-6-back", temperatures);
        rackSquare("r4u23-back", "ecotype-7-back", temperatures);
        rackSquare("r4u25-back", "ecotype-8-back", temperatures);
        rackSquare("r4u27-back", "ecotype-9-back", temperatures);
        rackSquare("r4u29-back", "ecotype-10-back", temperatures);
        rackSquare("r4u31-back", "ecotype-11-back", temperatures);
        rackSquare("r4u33-back", "ecotype-12-back", temperatures);

        rackSquare("r4u37-back", "temp-3-back", temperatures);
        rackSquare("r4u42-back", "temp-4-back", temperatures);
    });
}
