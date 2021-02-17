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

    var data = {"OkPercent": 88.88269713011981, "KoPercent": 11.11730286988019};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7538721256125743, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.7945544554455446, 500, 1500, "UserList_Page2_HTTPRequest"], "isController": false}, {"data": [0.9097315939421202, 500, 1500, "Register_HTTPRequest"], "isController": false}, {"data": [0.8537764350453172, 500, 1500, "PUT_Updateuser_HTTPRequest"], "isController": false}, {"data": [0.7828870779976718, 500, 1500, "UserList_Page1_HTTPRequest"], "isController": false}, {"data": [0.0, 500, 1500, "Single_User_NotFound_Get_HTTPRequest"], "isController": false}, {"data": [0.9752029520295203, 500, 1500, "Single_User_GET_HTTPRequest"], "isController": false}, {"data": [0.7935352358765289, 500, 1500, "UserList_Page4_HTTPRequest"], "isController": false}, {"data": [0.7847363821730265, 500, 1500, "UserList_Page3_HTTPRequest"], "isController": false}, {"data": [0.8913172762414511, 500, 1500, "Create_User_HTTPRequest"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 61013, 6783, 11.11730286988019, 454.18425581433536, 17, 36130, 309.0, 553.0, 1079.0, 1627.9900000000016, 455.07637687212844, 565.1861223004244, 71.10631758262352], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["UserList_Page2_HTTPRequest", 6868, 0, 0.0, 558.0647932440288, 19, 3547, 418.0, 1414.0, 1612.5499999999993, 2203.0, 66.42102107329715, 130.14256239059583, 8.237763355770253], "isController": false}, {"data": ["Register_HTTPRequest", 6669, 0, 0.0, 391.2102264207517, 147, 1654, 409.0, 564.0, 641.0, 728.3000000000002, 65.49858081497558, 60.83862854980406, 15.99086445678115], "isController": false}, {"data": ["PUT_Updateuser_HTTPRequest", 6620, 12, 0.18126888217522658, 411.797885196376, 144, 2038, 420.0, 609.0, 653.9499999999998, 721.79, 65.28921544454855, 60.94204595887371, 14.345774877952563], "isController": false}, {"data": ["UserList_Page1_HTTPRequest", 6872, 0, 0.0, 571.143626309662, 18, 3164, 421.0, 1444.6999999999998, 1619.3499999999995, 2207.8099999999986, 67.17234907725992, 129.33333381698174, 8.33094563751173], "isController": false}, {"data": ["Single_User_NotFound_Get_HTTPRequest", 6749, 6749, 100.0, 298.74070232626974, 18, 2591, 313.0, 433.0, 483.0, 595.0, 66.19781858129316, 61.86681293647991, 7.951495786620175], "isController": false}, {"data": ["Single_User_GET_HTTPRequest", 6775, 0, 0.0, 314.60014760147567, 17, 2425, 330.0, 448.0, 497.39999999999964, 600.2399999999998, 66.39292854062953, 81.39724614810768, 7.910095001910941], "isController": false}, {"data": ["UserList_Page4_HTTPRequest", 6868, 0, 0.0, 556.9194816540493, 18, 3653, 420.0, 1388.1000000000004, 1587.5499999999993, 2204.479999999996, 66.20205700625584, 75.74699693593784, 8.210606679486808], "isController": false}, {"data": ["UserList_Page3_HTTPRequest", 6866, 0, 0.0, 574.2369647538607, 19, 36130, 422.0, 1441.6000000000004, 1621.6499999999996, 2191.99, 51.72205984270949, 59.17715097402598, 6.4147476562735415], "isController": false}, {"data": ["Create_User_HTTPRequest", 6726, 22, 0.3270889087124591, 401.89146595301827, 143, 1859, 419.0, 565.0, 641.0, 723.7299999999996, 65.99164066639194, 62.65853498876592, 13.984556664655326], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["503/Service Unavailable", 34, 0.5012531328320802, 0.05572582892170521], "isController": false}, {"data": ["404/Not Found", 6749, 99.49874686716792, 11.061577040958484], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 61013, 6783, "404/Not Found", 6749, "503/Service Unavailable", 34, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["PUT_Updateuser_HTTPRequest", 6620, 12, "503/Service Unavailable", 12, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["Single_User_NotFound_Get_HTTPRequest", 6749, 6749, "404/Not Found", 6749, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Create_User_HTTPRequest", 6726, 22, "503/Service Unavailable", 22, null, null, null, null, null, null, null, null], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
