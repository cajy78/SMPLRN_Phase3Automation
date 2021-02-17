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

    var data = {"OkPercent": 88.80818933030025, "KoPercent": 11.191810669699752};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8879174489194633, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.9999384008870272, 500, 1500, "UserList_Page2_HTTPRequest"], "isController": false}, {"data": [0.9996296753487224, 500, 1500, "Register_HTTPRequest"], "isController": false}, {"data": [0.9957925999257518, 500, 1500, "PUT_Updateuser_HTTPRequest"], "isController": false}, {"data": [0.999815157116451, 500, 1500, "UserList_Page1_HTTPRequest"], "isController": false}, {"data": [0.0, 500, 1500, "Single_User_NotFound_Get_HTTPRequest"], "isController": false}, {"data": [0.9998767258382643, 500, 1500, "Single_User_GET_HTTPRequest"], "isController": false}, {"data": [0.9998767714109673, 500, 1500, "UserList_Page4_HTTPRequest"], "isController": false}, {"data": [0.9998767865943815, 500, 1500, "UserList_Page3_HTTPRequest"], "isController": false}, {"data": [0.9965461946466017, 500, 1500, "Create_User_HTTPRequest"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 72973, 8167, 11.191810669699752, 79.22297288037977, 16, 11697, 38.0, 176.0, 188.0, 293.0, 486.3245584805065, 602.619654125708, 76.22827547067644], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["UserList_Page2_HTTPRequest", 8117, 0, 0.0, 31.42983861032394, 17, 656, 27.0, 41.0, 51.0, 110.0, 54.371780530119835, 106.57304203689873, 6.743375124341034], "isController": false}, {"data": ["Register_HTTPRequest", 8101, 0, 0.0, 174.44130354277263, 144, 900, 165.0, 189.0, 245.0, 316.0, 54.56394643963682, 50.681527069385325, 13.32127598623946], "isController": false}, {"data": ["PUT_Updateuser_HTTPRequest", 8081, 30, 0.37124118302190323, 178.40353916594472, 144, 11697, 166.0, 197.0, 286.89999999999964, 324.0, 54.51883635578584, 50.935557469185156, 11.97923650395685], "isController": false}, {"data": ["UserList_Page1_HTTPRequest", 8115, 0, 0.0, 31.663585951940878, 17, 1116, 27.0, 41.0, 50.19999999999982, 122.84000000000015, 54.36748804116252, 104.70830287095845, 6.7428427551051175], "isController": false}, {"data": ["Single_User_NotFound_Get_HTTPRequest", 8109, 8109, 100.0, 30.518312985571587, 17, 670, 27.0, 40.0, 47.0, 101.69999999999891, 54.34221724824254, 50.81283329340374, 6.527434298372883], "isController": false}, {"data": ["Single_User_GET_HTTPRequest", 8112, 0, 0.0, 30.796967455621328, 17, 517, 27.0, 40.0, 48.0, 123.73999999999978, 54.343020217854416, 66.66395562857564, 6.474461393142811], "isController": false}, {"data": ["UserList_Page4_HTTPRequest", 8115, 0, 0.0, 31.42957486136787, 17, 546, 27.0, 41.0, 50.0, 131.52000000000044, 54.143675898558165, 61.973207866845925, 6.715084803825086], "isController": false}, {"data": ["UserList_Page3_HTTPRequest", 8116, 0, 0.0, 31.267496303597795, 16, 653, 27.0, 41.0, 50.0, 126.82999999999993, 54.36544619053361, 62.225647205699126, 6.742589517771258], "isController": false}, {"data": ["Create_User_HTTPRequest", 8107, 28, 0.34538053533982976, 173.69285802393037, 145, 809, 165.0, 187.0, 258.59999999999945, 308.9200000000001, 54.480330094216626, 51.73342567251992, 11.545148076606454], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["503/Service Unavailable", 58, 0.7101750948940859, 0.07948145204390665], "isController": false}, {"data": ["404/Not Found", 8109, 99.28982490510592, 11.112329217655846], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 72973, 8167, "404/Not Found", 8109, "503/Service Unavailable", 58, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["PUT_Updateuser_HTTPRequest", 8081, 30, "503/Service Unavailable", 30, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["Single_User_NotFound_Get_HTTPRequest", 8109, 8109, "404/Not Found", 8109, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Create_User_HTTPRequest", 8107, 28, "503/Service Unavailable", 28, null, null, null, null, null, null, null, null], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
