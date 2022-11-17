"use strict";
/**
 * Dashboard handler
 */
exports.__esModule = true;
exports.cardUpdate = exports.category = void 0;
var ej2_base_1 = require("@syncfusion/ej2-base");
(0, ej2_base_1.enableRipple)(true);
var ej2_charts_1 = require("@syncfusion/ej2-charts");
ej2_charts_1.AccumulationChart.Inject(ej2_charts_1.AccumulationLegend, ej2_charts_1.PieSeries, ej2_charts_1.AccumulationDataLabel);
var ej2_calendars_1 = require("@syncfusion/ej2-calendars");
var ej2_data_1 = require("@syncfusion/ej2-data");
var ej2_base_2 = require("@syncfusion/ej2-base");
var ej2_layouts_1 = require("@syncfusion/ej2-layouts");
var ej2_dropdowns_1 = require("@syncfusion/ej2-dropdowns");
var axios = require("axios");
var ej2_charts_2 = require("@syncfusion/ej2-charts");
ej2_charts_1.AccumulationChart.Inject(ej2_charts_1.AccumulationLegend, ej2_charts_1.PieSeries, ej2_charts_1.AccumulationDataLabel, ej2_charts_2.AccumulationTooltip, ej2_charts_2.AccumulationSelection, ej2_charts_2.ChartAnnotation);
ej2_charts_2.Chart.Inject(ej2_charts_2.ColumnSeries, ej2_charts_2.Category, ej2_charts_2.Legend, ej2_charts_2.Tooltip, ej2_charts_2.ChartAnnotation, ej2_charts_2.DateTime, ej2_charts_2.Crosshair);
ej2_charts_2.Chart.Inject(ej2_charts_2.LineSeries, ej2_charts_2.AreaSeries, ej2_charts_2.DateTime, ej2_charts_2.Logarithmic, ej2_charts_2.Legend, ej2_charts_2.Tooltip);
var ej2_grids_1 = require("@syncfusion/ej2-grids");
ej2_grids_1.Grid.Inject(ej2_grids_1.Page, ej2_grids_1.Toolbar);
var predicateStart = new ej2_data_1.Predicate("DateTime", "greaterthanorequal", window.startDate);
var predicateEnd = new ej2_data_1.Predicate("DateTime", "lessthanorequal", window.endDate);
var predicate = predicateStart.and(predicateEnd);
var chartDS;
var pieChartDS;
var gridDS;
var linechartObj;
var linechart;
var columnChartObj;
var gridObj;
var pie;
var grid;
var pieLegendData = [];
var pieRenderData = [];
var legendData = [];
var pieRenderingData = [];
exports.category = [];
var expTotal = 0;
var dateRangePickerObject;
var groupValue = 0;
var renderData;
var hiGridData;
function cardUpdate(toUpdate) {
    if (toUpdate) {
        updatePredicate();
    }
    var intl = new ej2_base_2.Internationalization();
    var nFormatter = intl.getNumberFormat({
        skeleton: "C0",
        currency: "USD"
    });
    var incomeRS = 0;
    var expenseRS = 0;
    /* tslint:disable-next-line */
    var incomeD;
    /* tslint:disable-next-line */
    var expenseD;
    new ej2_data_1.DataManager(window.expenseDS)
        .executeQuery(new ej2_data_1.Query().where(predicateStart
        .and(predicateEnd)
        .and("TransactionType", "equal", "Income")))
        /* tslint:disable-next-line */
        .then(function (e) {
        incomeD = objectAssign(e);
        for (var i = 0; i < incomeD.length - 1; i++) {
            incomeRS += parseInt(incomeD[i].Amount, 0);
        }
        if (document.getElementById("tolincome")) {
            document.getElementById("tolincome").textContent = window.getCurrencyVal(incomeRS ? incomeRS : 0);
        }
    });
    new ej2_data_1.DataManager(window.expenseDS)
        .executeQuery(new ej2_data_1.Query().where(predicateStart
        .and(predicateEnd)
        .and("TransactionType", "equal", "Expense")))
        /* tslint:disable-next-line */
        .then(function (e) {
        expenseD = objectAssign(e);
        for (var i = 0; i < expenseD.length - 1; i++) {
            expenseRS += parseInt(expenseD[i].Amount, 0);
        }
        if (document.getElementById("tolexpense")) {
            document.getElementById("tolexpense").textContent = window.getCurrencyVal(expenseRS ? expenseRS : 0);
        }
        if (document.getElementById("current-balance")) {
            document.getElementById("current-balance").textContent = window.getCurrencyVal(incomeRS - expenseRS);
        }
        if (document.getElementById("tolbalance")) {
            document.getElementById("tolbalance").textContent = window.getCurrencyVal(incomeRS - expenseRS);
        }
    });
}
exports.cardUpdate = cardUpdate;
if ((0, ej2_base_2.isNullOrUndefined)(window.startDate)) {
    window.startDate = new Date("2020-9-1");
    window.endDate = new Date("2020-10-25");
    window.country = "india";
}
// tslint:disable-next-line:max-func-body-length
function onDateRangeChange(args) {
    if (args.itemData && args.itemData.value) {
        window.country = args.itemData.value;
    }
    if (args.startDate || args.endDate) {
        window.startDate = args.startDate;
        window.endDate = args.endDate;
    }
    axios
        .get("https://api.covid19api.com/total/country/" +
        window.country +
        "" +
        "?from=" +
        window.startDate.toISOString() +
        "&to=" +
        window.endDate.toISOString())
        .then(function (response) {
        var res = response["data"];
        for (var i = 0; i < response.data.length; i++) {
            response.data[i].Date = new Date(response.data[i].Date);
            var Active = +response.data[i].Active;
            var Deaths = +response.data[i].Deaths;
            var Confirmed = +response.data[i].Confirmed;
            var Recovered = +response.data[i].Recovered;
        }
        if (document.getElementById("Active")) {
            document.getElementById("Active").textContent = Active.toString();
        }
        if (document.getElementById("Confirmed")) {
            document.getElementById("Confirmed").textContent = Confirmed.toString();
        }
        if (document.getElementById("Recovered")) {
            document.getElementById("Recovered").textContent = Recovered.toString();
        }
        if (document.getElementById("Deaths")) {
            document.getElementById("Deaths").textContent = Deaths.toString();
        }
    });
    lineDS = [];
    lineD = [];
    columnIncomeDS = [];
    columnExpenseDS = [];
    tempChartExpenseDS = [];
    tempChartIncomeDS = [];
    lineD = [];
    var piedata = [];
    axios
        .get("https://api.covid19api.com/total/country/" +
        window.country +
        "/status/confirmed" +
        "?from=" +
        window.startDate.toISOString() +
        "&to=" +
        window.endDate.toISOString())
        .then(function (response) {
        for (var i = 0; i < response.data.length; i++) {
            response.data[i].Date = new Date(response.data[i].Date);
            var Status = +response.data[i].Cases;
        }
        response.data[0].Cases = Status;
        piedata = piedata.concat(response.data[0]);
        axios
            .get("https://api.covid19api.com/total/country/" +
            window.country +
            "/status/recovered" +
            "?from=" +
            window.startDate.toISOString() +
            "&to=" +
            window.endDate.toISOString())
            .then(function (response) {
            for (var i = 0; i < response.data.length; i++) {
                response.data[i].Date = new Date(response.data[i].Date);
                var Status = +response.data[i].Cases;
            }
            response.data[0].Cases = Status;
            piedata = piedata.concat(response.data[0]);
        });
        axios
            .get("https://api.covid19api.com/total/country/" +
            window.country +
            "/status/deaths" +
            "?from=" +
            window.startDate.toISOString() +
            "&to=" +
            window.endDate.toISOString())
            .then(function (response) {
            for (var i = 0; i < response.data.length; i++) {
                response.data[i].Date = new Date(response.data[i].Date);
                var Status = +response.data[i].Cases;
            }
            response.data[0].Cases = Status;
            piedata = piedata.concat(response.data[0]);
            axios
                .get("https://api.covid19api.com/total/country/" +
                window.country +
                "/status/active" +
                "?from=" +
                window.startDate.toISOString() +
                "&to=" +
                window.endDate.toISOString())
                .then(function (response) {
                for (var i = 0; i < response.data.length; i++) {
                    response.data[i].Date = new Date(response.data[i].Date);
                    var Status = +response.data[i].Cases;
                }
                response.data[0].Cases = Status;
                piedata = piedata.concat(response.data[0]);
                piedata = [piedata[0], piedata[1], piedata[2], piedata[3]];
                pie.series = [
                    {
                        dataSource: piedata,
                        xName: "Status",
                        yName: "Cases",
                        radius: "83%",
                        startAngle: 0,
                        endAngle: 360,
                        innerRadius: "50%",
                        dataLabel: {
                            name: "Cases",
                            visible: true,
                            position: "Outside",
                            connectorStyle: { length: "10%" },
                            font: {
                                color: "Black",
                                size: "14px",
                                fontFamily: "Roboto"
                            }
                        },
                        palettes: [
                            "#61EFCD",
                            "#CDDE1F",
                            "#FEC200",
                            "#CA765A",
                            "#2485FA",
                            "#F57D7D",
                            "#C152D2",
                            "#8854D9",
                            "#3D4EB8",
                            "#00BCD7"
                        ]
                    }
                ];
                pie.dataBind();
                pie.refresh();
                // createLegendData('pieUpdate');
            });
        });
    });
    axios
        .get("https://api.covid19api.com/total/country/" +
        window.country +
        "" +
        "?from=" +
        window.startDate.toISOString() +
        "&to=" +
        window.endDate.toISOString())
        .then(function (response) {
        for (var i = 0; i < response.data.length; i++) {
            response.data[i].Date = new Date(response.data[i].Date);
        }
        debugger;
        // getCoulmnChartIncomeDS(e);
        columnChartObj.setProperties({
            //Initializing Chart Series
            primaryXAxis: {
                valueType: "DateTime",
                labelFormat: "MMM",
                // majorGridLines: { width: 0 },
                intervalType: "Months",
                edgeLabelPlacement: "Shift"
            },
            primaryYAxis: {},
            useGroupingSeparator: true,
            series: [
                {
                    type: "Column",
                    dataSource: response.data,
                    // legendShape: 'Circle',
                    xName: "Date",
                    width: 2,
                    yName: "Confirmed",
                    name: "Confirmed",
                    marker: {
                        visible: true,
                        height: 10,
                        width: 10
                    },
                    fill: "#4472C4",
                    animation: { enable: false }
                },
                {
                    type: "Column",
                    dataSource: response.data,
                    // legendShape: 'Circle',
                    xName: "Date",
                    width: 2,
                    yName: "Recovered",
                    name: "Recovered",
                    marker: {
                        visible: true,
                        height: 10,
                        width: 10
                    },
                    fill: "#A16EE5",
                    border: { width: 0.5, color: "#A16EE5" },
                    animation: { enable: false }
                }
            ]
        });
        columnChartObj.refresh();
        lineD = [];
        linechart.setProperties({
            primaryXAxis: {
                valueType: "DateTime",
                labelFormat: "MMM",
                majorGridLines: { width: 0 },
                intervalType: "Months"
            },
            primaryYAxis: {},
            useGroupingSeparator: true,
            chartArea: {
                border: {
                    width: 0
                }
            },
            series: [
                {
                    type: "Line",
                    dataSource: response.data,
                    xName: "Date",
                    width: 2,
                    yName: "Confirmed",
                    name: "Confirmed",
                    fill: "#b3d4f3"
                    // border: { width: 0.5, color: '#0470D8' },
                    // marker: {
                    //     visible: true,
                    //     width: 10,
                    //     height: 10,
                    //     fill: 'white',
                    //     // border: { width: 2, color: '#0470D8' },
                    // },
                }
            ]
        });
        linechartObj.setProperties({
            //Initializing Chart Series
            primaryXAxis: {
                valueType: "DateTime",
                labelFormat: "MMM",
                majorGridLines: { width: 0 },
                intervalType: "Months"
            },
            primaryYAxis: {},
            useGroupingSeparator: true,
            chartArea: {
                border: {
                    width: 0
                }
            },
            series: [
                {
                    type: "Area",
                    dataSource: response.data,
                    xName: "Date",
                    width: 2,
                    yName: "Active",
                    name: "Active",
                    fill: "#b3d4f3",
                    border: { width: 0.5, color: "#0470D8" },
                    marker: {
                        visible: true,
                        width: 10,
                        height: 10,
                        fill: "white",
                        border: { width: 2, color: "#0470D8" }
                    }
                },
                {
                    type: "Area",
                    dataSource: response.data,
                    xName: "Date",
                    width: 2,
                    yName: "Recovered",
                    name: "Recovered",
                    fill: "#4273f942",
                    border: { width: 0.5, color: "#0470D8" },
                    marker: {
                        visible: true,
                        width: 10,
                        height: 10,
                        fill: "white",
                        border: { width: 2, color: "#0470D8" }
                    }
                }
            ]
        });
        linechartObj.refresh();
        /* tslint:enable */
        gridObj.setProperties({
            dataSource: response.data
            //Initializing Chart Series
            // query: new Query().where(predicate).sortByDesc('Date').take(5)
        });
        gridObj.refresh();
        grid.dataSource = response.data;
        grid.dataBind();
        grid.refresh();
        formatRangeDate();
    });
}
function InitializeComponet() {
    // initialize DropDownList component
    var dropDownListObj = new ej2_dropdowns_1.DropDownList({
        // bind the DataManager instance to dataSource property
        // bind the Query instance to query property
        // map the appropriate columns to fields property
        // set the placeholder to DropDownList input element
        placeholder: "Select a country",
        // sort the resulted items
        sortOrder: "Ascending",
        // set the height of the popup element
        popupHeight: "200px",
        change: onDateRangeChange
    });
    dropDownListObj.appendTo("#country");
    if (document.getElementById("user-name")) {
        document.getElementById("user-name").textContent = window.userName;
    }
    cardUpdate();
    new ej2_data_1.DataManager(window.expenseDS)
        .executeQuery(new ej2_data_1.Query().where(predicate.and("TransactionType", "equal", "Expense")))
        .then(function (e) {
        getCoulmnChartExpenseDS(e);
    });
    var piedata = [];
    axios
        .get("https://api.covid19api.com/total/country/" +
        window.country +
        "/status/confirmed" +
        "?from=" +
        window.startDate.toISOString() +
        "&to=" +
        window.endDate.toISOString())
        .then(function (response) {
        for (var i = 0; i < response.data.length; i++) {
            response.data[i].Date = new Date(response.data[i].Date);
            var Status = +response.data[i].Cases;
        }
        response.data[0].Cases = Status;
        piedata = piedata.concat(response.data[0]);
        axios
            .get("https://api.covid19api.com/total/country/" +
            window.country +
            "/status/recovered" +
            "?from=" +
            window.startDate.toISOString() +
            "&to=" +
            window.endDate.toISOString())
            .then(function (response) {
            for (var i = 0; i < response.data.length; i++) {
                response.data[i].Date = new Date(response.data[i].Date);
                var Status = +response.data[i].Cases;
            }
            response.data[0].Cases = Status;
            piedata = piedata.concat(response.data[0]);
        });
        axios
            .get("https://api.covid19api.com/total/country/" +
            window.country +
            "/status/deaths" +
            "?from=" +
            window.startDate.toISOString() +
            "&to=" +
            window.endDate.toISOString())
            .then(function (response) {
            for (var i = 0; i < response.data.length; i++) {
                response.data[i].Date = new Date(response.data[i].Date);
                var Status = +response.data[i].Cases;
            }
            response.data[0].Cases = Status;
            piedata = piedata.concat(response.data[0]);
            axios
                .get("https://api.covid19api.com/total/country/" +
                window.country +
                "/status/active" +
                "?from=" +
                window.startDate.toISOString() +
                "&to=" +
                window.endDate.toISOString())
                .then(function (response) {
                for (var i = 0; i < response.data.length; i++) {
                    response.data[i].Date = new Date(response.data[i].Date);
                    var Status = +response.data[i].Cases;
                }
                response.data[0].Cases = Status;
                piedata = piedata.concat(response.data[0]);
                piedata = [piedata[0], piedata[1], piedata[2], piedata[3]];
                pie = new ej2_charts_1.AccumulationChart({
                    enableSmartLabels: true,
                    width: "100%",
                    height: "350px",
                    center: { x: "50%", y: "50%" },
                    legendSettings: { visible: true, position: "Bottom" },
                    series: [
                        {
                            dataSource: piedata,
                            xName: "Status",
                            yName: "Cases",
                            radius: "83%",
                            startAngle: 0,
                            endAngle: 360,
                            innerRadius: "50%",
                            dataLabel: {
                                name: "Cases",
                                visible: true,
                                position: "Inside",
                                font: {
                                    color: "Black",
                                    size: "14px",
                                    fontFamily: "Roboto"
                                }
                            },
                            palettes: [
                                "#61EFCD",
                                "#CDDE1F",
                                "#FEC200",
                                "#CA765A",
                                "#2485FA",
                                "#F57D7D",
                                "#C152D2",
                                "#8854D9",
                                "#3D4EB8",
                                "#00BCD7"
                            ]
                        }
                    ]
                });
                pie.appendTo("#total-expense");
            });
        });
    });
    axios
        .get("https://api.covid19api.com/total/country/" +
        window.country +
        "" +
        "?from=" +
        window.startDate.toISOString() +
        "&to=" +
        window.endDate.toISOString())
        .then(function (response) {
        var res = response["data"];
        for (var i = 0; i < response.data.length; i++) {
            response.data[i].Date = new Date(response.data[i].Date);
            var Active = +response.data[i].Active;
            var Deaths = +response.data[i].Deaths;
            var Confirmed = +response.data[i].Confirmed;
            var Recovered = +response.data[i].Recovered;
        }
        if (document.getElementById("Active")) {
            document.getElementById("Active").textContent = Active.toString();
        }
        if (document.getElementById("Confirmed")) {
            document.getElementById("Confirmed").textContent = Confirmed.toString();
        }
        if (document.getElementById("Recovered")) {
            document.getElementById("Recovered").textContent = Recovered.toString();
        }
        if (document.getElementById("Deaths")) {
            document.getElementById("Deaths").textContent = Deaths.toString();
        }
        columnChartObj = new ej2_charts_2.Chart({
            primaryXAxis: {
                labelFormat: "MMM",
                valueType: "DateTime",
                intervalType: "Months",
                edgeLabelPlacement: "Shift"
            },
            primaryYAxis: {},
            useGroupingSeparator: true,
            series: [
                {
                    type: "Column",
                    dataSource: response.data,
                    xName: "Date",
                    width: 2,
                    yName: "Confirmed",
                    name: "Confirmed",
                    fill: "#00bdae",
                    animation: { enable: false },
                    marker: {
                        visible: true,
                        height: 10,
                        width: 10
                    }
                },
                {
                    type: "Column",
                    dataSource: response.data,
                    xName: "Date",
                    width: 2,
                    yName: "Recovered",
                    name: "Recovered",
                    fill: "#357cd2",
                    animation: { enable: false },
                    marker: {
                        visible: true,
                        height: 10,
                        width: 10
                    }
                }
            ],
            annotations: [
                {
                    content: '<p style="font-family:Roboto;font-size: 16px;font-weight: 400;font-weight: 400;letter-spacing: 0.02em;line-height: 16px;color: #797979 !important;">Confirmed - Recovered</p>',
                    x: "200px",
                    y: "9%",
                    coordinateUnits: "Pixel",
                    region: "Chart"
                }
            ],
            margin: { top: 90 },
            legendSettings: { visible: true },
            titleStyle: {
                textAlignment: "Near",
                fontWeight: "500",
                size: "16",
                color: "#000"
            },
            tooltip: {
                fill: "#707070",
                enable: true,
                shared: true,
                format: "${series.name} : ${point.y}",
                header: "Month - ${point.x} "
            }
        });
        columnChartObj.appendTo("#account-balance");
        var content = '<p style="font-family:Roboto;font-size: 16px;font-weight: 400;font-weight: 400;letter-spacing: 0.02em;line-height: 16px;color: #797979 !important;">Active - Recovered</p>';
        linechartObj = new ej2_charts_2.Chart({
            primaryXAxis: {
                valueType: "DateTime",
                labelFormat: "MMM",
                majorGridLines: { width: 0 },
                intervalType: "Months"
            },
            primaryYAxis: {},
            useGroupingSeparator: true,
            chartArea: {
                border: {
                    width: 0
                }
            },
            annotations: [
                {
                    content: content,
                    x: "75px",
                    y: "9%",
                    coordinateUnits: "Pixel",
                    region: "Chart"
                }
            ],
            series: [
                {
                    type: "Area",
                    dataSource: response.data,
                    xName: "Date",
                    width: 2,
                    yName: "Active",
                    name: "Active",
                    fill: "#b3d4f3",
                    border: { width: 0.5, color: "green" },
                    marker: {
                        visible: true,
                        width: 10,
                        height: 10,
                        fill: "white",
                        border: { width: 2, color: "green" }
                    }
                },
                {
                    type: "Area",
                    dataSource: response.data,
                    xName: "Date",
                    width: 2,
                    yName: "Recovered",
                    name: "Recovered",
                    fill: "#4273f942",
                    border: { width: 0.5, color: "#0470D8" },
                    marker: {
                        visible: true,
                        width: 10,
                        height: 10,
                        fill: "white",
                        border: { width: 2, color: "#0470D8" }
                    }
                }
            ],
            margin: { top: 90 },
            tooltip: {
                fill: "#707070",
                enable: true,
                shared: true,
                format: "${series.name} : ${point.y}",
                header: "Month - ${point.x} "
            }
        });
        linechartObj.appendTo("#balance");
        var contentline = '<p style="font-family:Roboto;font-size: 16px;font-weight: 400;font-weight: 400;letter-spacing: 0.02em;line-height: 16px;color: #797979 !important;">Confirmed</p>';
        linechart = new ej2_charts_2.Chart({
            primaryXAxis: {
                valueType: "DateTime",
                labelFormat: "MMM",
                majorGridLines: { width: 0 },
                intervalType: "Months"
            },
            primaryYAxis: {},
            useGroupingSeparator: true,
            chartArea: {
                border: {
                    width: 0
                }
            },
            annotations: [
                {
                    content: contentline,
                    x: "75px",
                    y: "9%",
                    coordinateUnits: "Pixel",
                    region: "Chart"
                }
            ],
            series: [
                {
                    type: "Line",
                    dataSource: response.data,
                    xName: "Date",
                    width: 2,
                    yName: "Confirmed",
                    name: "Confirmed",
                    fill: "#b3d4f3"
                }
            ],
            margin: { top: 90 },
            tooltip: {
                fill: "#707070",
                enable: true,
                shared: true,
                format: "${series.name} : ${point.y}",
                header: "Month - ${point.x} "
            }
        });
        linechart.appendTo("#Confirmed-line");
        gridObj = new ej2_grids_1.Grid({
            dataSource: response.data,
            allowSorting: true,
            enableHover: false,
            allowKeyboard: true,
            allowPaging: true,
            width: "100%",
            height: 250,
            // toolbar: [{ text: 'Recent Transactions' }],
            pageSettings: {
                pageCount: 4,
                pageSize: 14
            },
            columns: [
                {
                    field: "Date",
                    headerText: "Date",
                    width: 245,
                    format: "yMd",
                    hideAtMedia: "(min-width: 600px)"
                },
                {
                    field: "Active",
                    headerText: "Active",
                    width: 245
                },
                {
                    field: "Recovered",
                    headerText: "Recovered",
                    width: 245,
                    hideAtMedia: "(min-width: 600px)"
                },
                {
                    field: "Deaths",
                    headerText: "Deaths",
                    width: 245,
                    hideAtMedia: "(min-width: 1050px)"
                },
                {
                    field: "Confirmed",
                    headerText: "Confirmed",
                    width: 245,
                    textAlign: "Right"
                }
            ]
        });
        gridObj.appendTo("#recentexpense-grid");
    });
}
/* tslint:disable-next-line */
var columnIncomeDS = [];
/* tslint:disable-next-line */
var columnExpenseDS = [];
/* tslint:disable-next-line */
var lineDS = [];
/* tslint:disable-next-line */
var tempChartIncomeDS = {};
/* tslint:disable-next-line */
var tempChartExpenseDS = {};
/* tslint:disable-next-line */
var tempChartLineDS = {};
/* tslint:disable-next-line */
var curDateTime;
/* tslint:disable-next-line */
var lineD = [];
function updatePredicate() {
    predicateStart = new ej2_data_1.Predicate("DateTime", "greaterthanorequal", window.startDate);
    predicateEnd = new ej2_data_1.Predicate("DateTime", "lessthanorequal", window.endDate);
    predicate = predicateStart.and(predicateEnd);
}
/* tslint:disable-next-line */
function objectAssign(e) {
    var result = [];
    /* tslint:disable-next-line */
    var obj;
    obj = (0, ej2_base_2.extend)(obj, e.result, {}, true);
    for (var data = 0; data <= Object.keys(e.result).length; data++) {
        result.push(obj[data]);
    }
    return result;
}
/* tslint:disable-next-line */
function getCoulmnChartExpenseDS(e) {
    columnExpenseDS = [];
    tempChartExpenseDS = [];
    var result = objectAssign(e);
    for (var i = 0; i < result.length - 1; i++) {
        /* tslint:disable-next-line */
        var cur = result[i];
        if (cur.DateTime.getMonth() in tempChartExpenseDS) {
            curDateTime = tempChartExpenseDS[cur.DateTime.getMonth()];
            tempChartExpenseDS[cur.DateTime.getMonth()].Amount =
                parseInt(curDateTime.Amount, 0) + parseInt(cur.Amount, 0);
        }
        else {
            tempChartExpenseDS[cur.DateTime.getMonth()] = cur;
            /* tslint:disable-next-line */
            tempChartExpenseDS[cur.DateTime.getMonth()].DateTime = new Date(new Date(tempChartExpenseDS[cur.DateTime.getMonth()].DateTime.setHours(0, 0, 0, 0)).setDate(1));
        }
    }
    /* tslint:disable-next-line */
    for (var data in tempChartExpenseDS) {
        columnExpenseDS.push(tempChartExpenseDS[data]);
    }
}
/* tslint:disable-next-line */
function getCoulmnChartIncomeDS(e) {
    columnIncomeDS = [];
    tempChartIncomeDS = [];
    var result = objectAssign(e);
    for (var i = 0; i < result.length - 1; i++) {
        /* tslint:disable-next-line */
        var cur = result[i];
        if (cur.DateTime.getMonth() in tempChartIncomeDS) {
            curDateTime = tempChartIncomeDS[cur.DateTime.getMonth()];
            tempChartIncomeDS[cur.DateTime.getMonth()].Amount =
                parseInt(curDateTime.Amount, 0) + parseInt(cur.Amount, 0);
        }
        else {
            tempChartIncomeDS[cur.DateTime.getMonth()] = cur;
            /* tslint:disable-next-line */
            tempChartIncomeDS[cur.DateTime.getMonth()].DateTime = new Date(new Date(tempChartIncomeDS[cur.DateTime.getMonth()].DateTime.setHours(0, 0, 0, 0)).setDate(1));
        }
    }
    /* tslint:disable-next-line */
    for (var data in tempChartIncomeDS) {
        columnIncomeDS.push(tempChartIncomeDS[data]);
    }
}
function DateRange() {
    dateRangePickerObject = new ej2_calendars_1.DateRangePicker({
        format: "MM/dd/yyyy",
        change: onDateRangeChange,
        startDate: window.startDate,
        endDate: window.endDate,
        showClearButton: false,
        allowEdit: false,
        presets: [
            {
                label: "Last Month",
                start: new Date("10/1/2017"),
                end: new Date("10/31/2017")
            },
            {
                label: "Last 3 Months",
                start: new Date("9/1/2017"),
                end: new Date("11/30/2017")
            },
            {
                label: "All Time",
                start: new Date("6/1/2017"),
                end: new Date("11/30/2017")
            }
        ]
    });
    dateRangePickerObject.appendTo("#daterange");
    window.startDate = dateRangePickerObject.startDate;
    window.endDate = dateRangePickerObject.endDate;
}
var centerTitle = document.createElement("div");
centerTitle.innerHTML = "Expenses <br> Year    2013";
centerTitle.style.position = "absolute";
centerTitle.style.visibility = "hidden";
function getFontSize(width) {
    if (width > 300) {
        return "13px";
    }
    else if (width > 250) {
        return "8px";
    }
    else {
        return "6px";
    }
}
window.dashboard = function () {
    var dashboard = new ej2_layouts_1.DashboardLayout({
        cellSpacing: [10, 10],
        allowResizing: false,
        columns: 4,
        cellAspectRatio: 2
    });
    dashboard.appendTo("#defaultLayout");
    predicateStart = new ej2_data_1.Predicate("DateTime", "greaterthanorequal", window.startDate);
    predicateEnd = new ej2_data_1.Predicate("DateTime", "lessthanorequal", window.endDate);
    predicate = predicateStart.and(predicateEnd);
    InitializeComponet();
    // DateRangePicker Initialization.
    DateRange();
    formatRangeDate();
    // updateChart();
    window.addEventListener("resize", function () {
        setTimeout(function () {
            updateChart();
        }, 1000);
    });
};
function updateChart() {
    // let pieContainerObj: HTMLElement = document.getElementById('totalExpense');
    // if (!isNOU(pieContainerObj) && pieContainerObj.offsetWidth < 480) {
    //     disableChartLabel();
    // } else {
    //     enableChartLabel();
    // }
}
function disableChartLabel() {
    pie.series[0].dataLabel.visible = false;
    pie.dataBind();
    pie.refresh();
}
function enableChartLabel() {
    pie.series[0].dataLabel.visible = true;
    pie.dataBind();
    pie.refresh();
}
function formatRangeDate() {
    var intl = new ej2_base_2.Internationalization();
    var dateStart = intl.formatDate(dateRangePickerObject.startDate, {
        skeleton: "MMMd"
    });
    var dateEnd = intl.formatDate(dateRangePickerObject.endDate, {
        skeleton: "MMMd"
    });
    document.getElementById("rangeDate").textContent =
        dateStart + " - " + dateEnd;
}
window.dashboard();
