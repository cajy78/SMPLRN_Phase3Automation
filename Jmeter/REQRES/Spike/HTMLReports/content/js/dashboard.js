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

    var data = {"OkPercent": 88.8344000438696, "KoPercent": 11.165599956130388};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8785125067567038, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.9776161360601588, 500, 1500, "UserList_Page2_HTTPRequest"], "isController": false}, {"data": [0.9996814835787089, 500, 1500, "Register_HTTPRequest"], "isController": false}, {"data": [0.9965942954448701, 500, 1500, "PUT_Updateuser_HTTPRequest"], "isController": false}, {"data": [0.9782822603317403, 500, 1500, "UserList_Page1_HTTPRequest"], "isController": false}, {"data": [0.0, 500, 1500, "Single_User_NotFound_Get_HTTPRequest"], "isController": false}, {"data": [0.9997884642504583, 500, 1500, "Single_User_GET_HTTPRequest"], "isController": false}, {"data": [0.9781753004849933, 500, 1500, "UserList_Page4_HTTPRequest"], "isController": false}, {"data": [0.9794669854440616, 500, 1500, "UserList_Page3_HTTPRequest"], "isController": false}, {"data": [0.9965767927724449, 500, 1500, "Create_User_HTTPRequest"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 127651, 14253, 11.165599956130388, 135.79043642431415, 16, 42180, 35.0, 168.0, 175.0, 282.0, 357.00481875819787, 442.55387706136156, 55.92945100189199], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["UserList_Page2_HTTPRequest", 14229, 0, 0.0, 118.36179633143566, 16, 1716, 64.0, 260.0, 454.0, 791.0, 39.81197800814203, 78.03309128911879, 4.937618366244177], "isController": false}, {"data": ["Register_HTTPRequest", 14128, 0, 0.0, 198.75693657984135, 144, 681, 170.0, 283.0, 321.0, 390.7099999999991, 39.697994026193705, 36.871654705355915, 9.691893072801198], "isController": false}, {"data": ["PUT_Updateuser_HTTPRequest", 14094, 39, 0.2767134951042997, 203.1183482332904, 143, 1539, 171.0, 295.0, 334.0, 408.0, 39.62350083497799, 37.00318524246693, 8.706335632685594], "isController": false}, {"data": ["UserList_Page1_HTTPRequest", 14228, 0, 0.0, 118.0176412707341, 17, 3195, 64.5, 258.10000000000036, 436.0, 774.7099999999991, 39.89692080343448, 76.83879933836951, 4.948153263707205], "isController": false}, {"data": ["Single_User_NotFound_Get_HTTPRequest", 14174, 14174, 100.0, 68.20565824749548, 16, 1492, 31.0, 165.0, 188.0, 251.0, 39.800743561231485, 37.214955105174035, 4.780753376983859], "isController": false}, {"data": ["Single_User_GET_HTTPRequest", 14182, 0, 0.0, 71.83063037653392, 17, 938, 31.0, 178.0, 199.0, 259.0, 39.81336956643797, 48.838476981404334, 4.743389733501398], "isController": false}, {"data": ["UserList_Page4_HTTPRequest", 14227, 0, 0.0, 121.36613481408594, 16, 42029, 64.0, 259.0, 439.0, 786.0, 39.91807073413673, 45.6915456082266, 4.950776350815786], "isController": false}, {"data": ["UserList_Page3_HTTPRequest", 14221, 0, 0.0, 118.91182054707863, 17, 42180, 63.0, 250.0, 418.89999999999964, 780.7800000000007, 39.888812844304326, 45.660862696204376, 4.947147686744774], "isController": false}, {"data": ["Create_User_HTTPRequest", 14168, 40, 0.282326369282891, 204.43972332015807, 142, 879, 171.0, 298.0, 328.0, 401.3099999999995, 39.78948196161472, 37.77529060848307, 8.431950767256245], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["503/Service Unavailable", 79, 0.5542692766435137, 0.06188749010975237], "isController": false}, {"data": ["404/Not Found", 14174, 99.44573072335649, 11.103712466020635], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 127651, 14253, "404/Not Found", 14174, "503/Service Unavailable", 79, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["PUT_Updateuser_HTTPRequest", 14094, 39, "503/Service Unavailable", 39, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["Single_User_NotFound_Get_HTTPRequest", 14174, 14174, "404/Not Found", 14174, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Create_User_HTTPRequest", 14168, 40, "503/Service Unavailable", 40, null, null, null, null, null, null, null, null], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
