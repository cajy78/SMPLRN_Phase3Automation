/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 99.9537626259015, "KoPercent": 0.04623737409849037};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9957099343619957, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.995690641446114, 500, 1500, "CityWeather_ByLatLon_HTTPRequest"], "isController": false}, {"data": [0.9955290753098188, 500, 1500, "CityWeather_ByZip_HTTPRequest"], "isController": false}, {"data": [0.9960812356979405, 500, 1500, "CityWeather_ByID_HTTPRequest"], "isController": false}, {"data": [0.995538863363392, 500, 1500, "CityWeather_ByName_HTTPRequest"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 209787, 97, 0.04623737409849037, 115.14675361199659, 0, 192770, 85.0, 114.0, 191.0, 393.0, 566.8693255512321, 441.39719104230846, 105.40872286059772], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["CityWeather_ByLatLon_HTTPRequest", 52444, 30, 0.05720387460910686, 117.04583937152078, 0, 141113, 88.0, 114.0, 186.95000000000073, 443.0, 164.97790081318718, 129.50138832636017, 31.237699462856064], "isController": false}, {"data": ["CityWeather_ByZip_HTTPRequest", 52450, 23, 0.0438512869399428, 118.86297426120085, 47, 192770, 88.0, 115.0, 191.95000000000073, 446.9900000000016, 142.0950967032312, 108.88066151684822, 26.35373962224919], "isController": false}, {"data": ["CityWeather_ByID_HTTPRequest", 52440, 23, 0.043859649122807015, 111.99473684210447, 38, 123358, 88.0, 114.0, 184.0, 434.9900000000016, 175.526092937786, 138.93771100305764, 32.55403367555454], "isController": false}, {"data": ["CityWeather_ByName_HTTPRequest", 52453, 21, 0.04003584161058472, 112.68322116942721, 63, 95019, 88.0, 114.0, 186.95000000000073, 441.9700000000048, 175.47973985654642, 135.44759371591806, 32.20408514880634], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: api.openweathermap.org:443 failed to respond", 89, 91.75257731958763, 0.042423982420264364], "isController": false}, {"data": ["Non HTTP response code: javax.net.ssl.SSLException/Non HTTP response message: Operation timed out", 8, 8.24742268041237, 0.0038133916782260103], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 209787, 97, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: api.openweathermap.org:443 failed to respond", 89, "Non HTTP response code: javax.net.ssl.SSLException/Non HTTP response message: Operation timed out", 8, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["CityWeather_ByLatLon_HTTPRequest", 52444, 30, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: api.openweathermap.org:443 failed to respond", 27, "Non HTTP response code: javax.net.ssl.SSLException/Non HTTP response message: Operation timed out", 3, null, null, null, null, null, null], "isController": false}, {"data": ["CityWeather_ByZip_HTTPRequest", 52450, 23, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: api.openweathermap.org:443 failed to respond", 20, "Non HTTP response code: javax.net.ssl.SSLException/Non HTTP response message: Operation timed out", 3, null, null, null, null, null, null], "isController": false}, {"data": ["CityWeather_ByID_HTTPRequest", 52440, 23, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: api.openweathermap.org:443 failed to respond", 22, "Non HTTP response code: javax.net.ssl.SSLException/Non HTTP response message: Operation timed out", 1, null, null, null, null, null, null], "isController": false}, {"data": ["CityWeather_ByName_HTTPRequest", 52453, 21, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: api.openweathermap.org:443 failed to respond", 20, "Non HTTP response code: javax.net.ssl.SSLException/Non HTTP response message: Operation timed out", 1, null, null, null, null, null, null], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
