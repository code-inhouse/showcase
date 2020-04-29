/*------------------------------------------------------------------[Charts Custom JS] - [Table of contents]1. CHARTJS - BAR CHART VERTICAL2. CHARTJS - LINE CHART3. CHARTJS - LINE POINT SIZES4. CHARTJS - LINE STYLE CHART5. Sparkline charts - mini charts6. Highcharts -> Exchange Page------------------------------------------------------------------- */
/*---------------------------------------------*/
/*--- 1. CHARTJS - BAR CHART VERTICAL ---*/
/*---------------------------------------------*/
"use strict";
function cryptic_bar_chart_vertical() {
    var color = Chart.helpers.color;
    var barChartData = {
        labels: ["January", "February", "March", "April", "May", "June", "July"],
        datasets: [{
            label: 'Dataset 1',
            backgroundColor: color(window.chartColors.red).alpha(0.5).rgbString(),
            borderColor: window.chartColors.red,
            borderWidth: 1,
            data: [randomScalingFactor(), randomScalingFactor(), randomScalingFactor(), randomScalingFactor(), randomScalingFactor(), randomScalingFactor(), randomScalingFactor()]
        }, {
            label: 'Dataset 2',
            backgroundColor: color(window.chartColors.blue).alpha(0.5).rgbString(),
            borderColor: window.chartColors.blue,
            borderWidth: 1,
            data: [randomScalingFactor(), randomScalingFactor(), randomScalingFactor(), randomScalingFactor(), randomScalingFactor(), randomScalingFactor(), randomScalingFactor()]
        }]
    };
    window.onload = function() {
        var ctx = document.getElementById("bar_chart_vertical").getContext("2d");
        window.myBar = new Chart(ctx, {
            type: 'bar',
            data: barChartData,
            options: {
                responsive: true,
                legend: {
                    position: 'top',
                },
                title: {
                    display: true,
                    text: 'Chart.js Bar Chart'
                }
            }
        });
    };
}
if ($('#bar_chart_vertical').length) {
    cryptic_bar_chart_vertical();
} 
/*---------------------------------------------*/ 
/*--- 2. CHARTJS - LINE CHART ---*/ 
/*---------------------------------------------*/
function cryptic_line_chart() {
    var config = {
        type: 'line',
        data: {
            labels: ["January", "February", "March", "April", "May", "June", "July"],
            datasets: [{
                label: "Bitcoin ",
                fill: false,
                borderColor: window.chartColors.red,
                backgroundColor: window.chartColors.red,
                data: [randomScalingFactor(), randomScalingFactor(), randomScalingFactor(), randomScalingFactor(), randomScalingFactor(), randomScalingFactor(), randomScalingFactor()]
            }, {
                label: "Litecoin ",
                fill: false,
                borderColor: window.chartColors.blue,
                backgroundColor: window.chartColors.blue,
                data: [randomScalingFactor(), randomScalingFactor(), randomScalingFactor(), randomScalingFactor(), randomScalingFactor(), randomScalingFactor(), randomScalingFactor()]
            }]
        },
        options: {
            title: {
                display: true,
                text: "Currecies Line Chart"
            }
        }
    };
    window.onload = function() {
        var ctx = document.getElementById("line_chart").getContext("2d");
        window.myLine = new Chart(ctx, config);
    };
}
if ($('#line_chart').length) {
    cryptic_line_chart();
} 
/*---------------------------------------------*/ 
/*--- 2.a CHARTJS - LINE CHART - BITCOIN POTENTIAL ---*/ 
/*---------------------------------------------*/
function cryptic_line_chart_btc_pot() {
    var config2a = {
        type: 'line',
        data: {
            labels: ["2016", "2016", "2016", "2017", "2017", "2018"],
            datasets: [{
                label: "Bitcoin ",
                fill: false,
                borderColor: window.chartColors.green,
                backgroundColor: window.chartColors.green,
                data: [0, 1.5, 2.5, 2, 3, 5]
            }]
        }
    };
    var ctx2a = document.getElementById("bitcoin_potential").getContext("2d");
    window.chart2a = new Chart(ctx2a, config2a);
}
if ($('#bitcoin_potential').length) {
    cryptic_line_chart_btc_pot();
} 
/*---------------------------------------------*/ 
/*--- 2.b CHARTJS - LINE CHART - BITCOIN VS ETHEREUM POTENTIAL ---*/ 
/*---------------------------------------------*/
function cryptic_line_chart_btc_eth() {
    var config2b = {
        type: 'line',
        data: {
            labels: ["2016", "2016", "2016", "2017", "2017", "2018"],
            datasets: [{
                label: "Bitcoin ",
                fill: false,
                borderColor: window.chartColors.green,
                backgroundColor: window.chartColors.green,
                data: [0, 1.5, 2.5, 2, 3, 5]
            }, {
                label: "Ethereum",
                fill: false,
                borderColor: window.chartColors.red,
                backgroundColor: window.chartColors.red,
                data: [0, 0.75, 1, 1.75, 2.5, 3]
            }]
        }
    };
    var ctx2b = document.getElementById("bitcoin_ethereum").getContext("2d");
    window.chart2b = new Chart(ctx2b, config2b);
}
if ($('#bitcoin_ethereum').length) {
    cryptic_line_chart_btc_eth();
}
/*---------------------------------------------*/ 
/*--- 2.c CHARTJS - LINE CHART - BTN VS ETN VS NEO ---*/
/*---------------------------------------------*/
function cryptic_line_chart_btc_eth_neo() {
    var config2c = {
        type: 'line',
        data: {
            labels: ["2016", "2016", "2016", "2017", "2017", "2018"],
            datasets: [{
                label: "Bitcoin ",
                fill: false,
                borderColor: window.chartColors.green,
                backgroundColor: window.chartColors.green,
                data: [0, 1.5, 2.5, 2, 3, 5]
            }, {
                label: "Ethereum",
                fill: false,
                borderColor: window.chartColors.red,
                backgroundColor: window.chartColors.red,
                data: [0, 0.75, 1, 1.75, 2.5, 3]
            }, {
                label: "NEO ",
                fill: false,
                borderColor: window.chartColors.blue,
                backgroundColor: window.chartColors.blue,
                data: [0, 2, 0.75, 1.5, 2, 4]
            }]
        }
    };
    var ctx2c = document.getElementById("btn_etn_neo").getContext("2d");
    window.chart2c = new Chart(ctx2c, config2c);
}
if ($('#btn_etn_neo').length) {
    cryptic_line_chart_btc_eth_neo();
} 
/*---------------------------------------------*/ 
/*--- 2.d CHARTJS - LINE CHART - BITCOIN IN CIRCULATION  ---*/ 
/*---------------------------------------------*/
function cryptic_line_chart_btc_cir() {
    var config2d = {
        type: 'line',
        data: {
            labels: ["2016", "2016", "2016", "2017", "2017", "2018"],
            datasets: [{
                label: "Bitcoin ",
                fill: false,
                borderColor: window.chartColors.green,
                backgroundColor: window.chartColors.green,
                data: [0, 1.5, 2.5, 2, 3, 5]
            }]
        }
    };
    var ctx2d = document.getElementById("bitcoin_cir").getContext("2d");
    window.chart2d = new Chart(ctx2d, config2d);
}
if ($('#bitcoin_cir').length) {
    cryptic_line_chart_btc_cir();
} 
/*---------------------------------------------*/ 
/*--- 2.e CHARTJS - LINE CHART - BTN VS ETH MARKET PRICE (USD) ---*/ 
/*---------------------------------------------*/
function cryptic_line_chart_btc_eth_mp() {
    var config2e = {
        type: 'line',
        data: {
            labels: ["2016", "2016", "2016", "2017", "2017", "2018"],
            datasets: [{
                label: "Bitcoin ",
                fill: false,
                borderColor: window.chartColors.green,
                backgroundColor: window.chartColors.green,
                data: [0, 1.5, 2.5, 2, 3, 5]
            }, {
                label: "Ethereum",
                fill: false,
                borderColor: window.chartColors.red,
                backgroundColor: window.chartColors.red,
                data: [0, 0.75, 1, 1.75, 2.5, 3]
            }]
        }
    };
    var ctx2e = document.getElementById("bitcoin_ethereum_mp").getContext("2d");
    window.chart2e = new Chart(ctx2e, config2e);
}
if ($('#bitcoin_ethereum_mp').length) {
    cryptic_line_chart_btc_eth_mp();
} 
/*---------------------------------------------*/ 
/*--- 2.f CHARTJS - LINE CHART - EXCHANGE TRADE VOLUME ---*/ 
/*---------------------------------------------*/
function cryptic_line_chart_exc() {
    var config2f = {
        type: 'line',
        data: {
            labels: ["2016", "2016", "2016", "2017", "2017", "2018"],
            datasets: [{
                label: "Bitcoin ",
                fill: false,
                borderColor: window.chartColors.green,
                backgroundColor: window.chartColors.green,
                data: [0, 1.5, 2.5, 2, 3, 5]
            }, {
                label: "Ethereum",
                fill: false,
                borderColor: window.chartColors.red,
                backgroundColor: window.chartColors.red,
                data: [0, 0.75, 1, 1.75, 2.5, 3]
            }, {
                label: "NEO",
                fill: false,
                borderColor: window.chartColors.blue,
                backgroundColor: window.chartColors.blue,
                data: [0, 2, 0.75, 1.5, 2, 4]
            }]
        }
    };
    var ctx2f = document.getElementById("exchange_trade").getContext("2d");
    window.chart2f = new Chart(ctx2f, config2f);
}
if ($('#exchange_trade').length) {
    cryptic_line_chart_exc();
} 
/*---------------------------------------------*/ 
/*--- 3. CHARTJS - LINE POINT SIZES ---*/ 
/*---------------------------------------------*/
function cryptic_line_point_sizes() {
    var config = {
        type: 'line',
        data: {
            labels: ["January", "February", "March", "April", "May", "June", "July"],
            datasets: [{
                label: "dataset - big points",
                data: [randomScalingFactor(), randomScalingFactor(), randomScalingFactor(), randomScalingFactor(), randomScalingFactor(), randomScalingFactor(), randomScalingFactor()],
                backgroundColor: window.chartColors.red,
                borderColor: window.chartColors.red,
                fill: false,
                borderDash: [5, 5],
                pointRadius: 15,
                pointHoverRadius: 10,
            }, {
                label: "dataset - individual point sizes",
                data: [randomScalingFactor(), randomScalingFactor(), randomScalingFactor(), randomScalingFactor(), randomScalingFactor(), randomScalingFactor(), randomScalingFactor()],
                backgroundColor: window.chartColors.blue,
                borderColor: window.chartColors.blue,
                fill: false,
                borderDash: [5, 5],
                pointRadius: [2, 4, 6, 18, 0, 12, 20],
            }, {
                label: "dataset - large pointHoverRadius",
                data: [randomScalingFactor(), randomScalingFactor(), randomScalingFactor(), randomScalingFactor(), randomScalingFactor(), randomScalingFactor(), randomScalingFactor()],
                backgroundColor: window.chartColors.green,
                borderColor: window.chartColors.green,
                fill: false,
                pointHoverRadius: 30,
            }, {
                label: "dataset - large pointHitRadius",
                data: [randomScalingFactor(), randomScalingFactor(), randomScalingFactor(), randomScalingFactor(), randomScalingFactor(), randomScalingFactor(), randomScalingFactor()],
                backgroundColor: window.chartColors.yellow,
                borderColor: window.chartColors.yellow,
                fill: false,
                pointHitRadius: 20,
            }]
        },
        options: {
            responsive: true,
            legend: {
                position: 'bottom',
            },
            hover: {
                mode: 'index'
            },
            scales: {
                xAxes: [{
                    display: true,
                    scaleLabel: {
                        display: true,
                        labelString: 'Month'
                    }
                }],
                yAxes: [{
                    display: true,
                    scaleLabel: {
                        display: true,
                        labelString: 'Value'
                    }
                }]
            },
            title: {
                display: true,
                text: 'Chart.js Line Chart - Different point sizes'
            }
        }
    };
    window.onload = function() {
        var ctx = document.getElementById("line_point_sizes").getContext("2d");
        window.myLine = new Chart(ctx, config);
    };
}
if ($('#line_point_sizes').length) {
    cryptic_line_point_sizes();
} 
/*---------------------------------------------*/ 
/*--- 4. CHARTJS - LINE STYLE CHART ---*/ 
/*---------------------------------------------*/
function cryptic_line_style_chart() {
    var config = {
        type: 'line',
        data: {
            labels: ["January", "February", "March", "April", "May", "June", "July"],
            datasets: [{
                label: "Unfilled",
                fill: false,
                backgroundColor: window.chartColors.blue,
                borderColor: window.chartColors.blue,
                data: [randomScalingFactor(), randomScalingFactor(), randomScalingFactor(), randomScalingFactor(), randomScalingFactor(), randomScalingFactor(), randomScalingFactor()],
            }, {
                label: "Dashed",
                fill: false,
                backgroundColor: window.chartColors.green,
                borderColor: window.chartColors.green,
                borderDash: [5, 5],
                data: [randomScalingFactor(), randomScalingFactor(), randomScalingFactor(), randomScalingFactor(), randomScalingFactor(), randomScalingFactor(), randomScalingFactor()],
            }, {
                label: "Filled",
                backgroundColor: window.chartColors.red,
                borderColor: window.chartColors.red,
                data: [randomScalingFactor(), randomScalingFactor(), randomScalingFactor(), randomScalingFactor(), randomScalingFactor(), randomScalingFactor(), randomScalingFactor()],
                fill: true,
            }]
        },
        options: {
            responsive: true,
            title: {
                display: true,
                text: 'Chart.js Line Chart'
            },
            tooltips: {
                mode: 'index',
                intersect: false,
            },
            hover: {
                mode: 'nearest',
                intersect: true
            },
            scales: {
                xAxes: [{
                    display: true,
                    scaleLabel: {
                        display: true,
                        labelString: 'Month'
                    }
                }],
                yAxes: [{
                    display: true,
                    scaleLabel: {
                        display: true,
                        labelString: 'Value'
                    }
                }]
            }
        }
    };
    window.onload = function() {
        var ctx = document.getElementById("line_styles_chart").getContext("2d");
        window.myLine = new Chart(ctx, config);
    };
}
if ($('#line_styles_chart').length) {
    cryptic_line_style_chart();
} 
/*---------------------------------------------*/ 
/*--- 5. Sparkline charts - mini charts ---*/ 
/*---------------------------------------------*/
function cryptic_sparkline_charts() {
    $('.sparklines').sparkline('html');
}
if ($('.sparklines').length) {
    cryptic_sparkline_charts();
} 
/*---------------------------------------------*/ 
/*--- 6. Highcharts -> Exchange Page ---*/ 
/*---------------------------------------------*/
function cryptic_highcharts_btc() {
    if ($('#chart_btc').length) {
        jQuery('#chart_btc').highcharts({
            title: {
                text: '',
                x: 0
            },
            subtitle: {
                text: '',
                x: 0
            },
            navigation: {
                buttonOptions: {
                    enabled: false
                }
            },
            xAxis: {
                visible: false,
                enabled: false,
                categories: ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep']
            },
            yAxis: {
                visible: false,
                enabled: false,
                title: {
                    text: ''
                },
                plotLines: [{
                    value: 0,
                    width: 1,
                    color: '#808080'
                }]
            },
            tooltip: {
                borderColor: '#FFDD90',
                borderRadius: '3',
                borderWidth: '1',
                backgroundColor: '#FFFAD3',
                formatter: function() {
                    return '<strong>' + this.y + '</strong>';
                }
            },
            legend: {
                enabled: false
            },
            credits: {
                enabled: false
            },
            plotOptions: {
                area: {
                    fillColor: '#FEFAF6',
                    lineWidth: 3,
                    marker: {
                        enabled: true,
                        fillColor: '#FFF',
                        lineColor: '#F3CCA3',
                        lineWidth: 2
                    },
                    color: "#F3CCA3",
                    shadow: false,
                    states: {
                        hover: {
                            lineWidth: 3
                        }
                    },
                    threshold: null
                }
            },
            series: [{
                name: '',
                type: 'area',
                color: '#F3CCA3',
                data: [760, 760, 770, 780, 760, 780, 780, 790, 790, 790, 790, 820]
            }]
        });
    }
}
cryptic_highcharts_btc(); 
/* dashboard v3 */
function cryptic_bitcoin_circulation() {
    if ($('#bitcoin-circulation').length) {
        jQuery('#bitcoin-circulation').highcharts({
            title: {
                text: '',
                x: 0
            },
            tooltip: {
                enabled: false
            },
            subtitle: {
                text: '',
                x: 0
            },
            navigation: {
                buttonOptions: {
                    enabled: false
                }
            },
            xAxis: {
                visible: false,
                enabled: false,
                categories: ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep']
            },
            yAxis: {
                visible: false,
                enabled: false,
                title: {
                    text: ''
                },
                plotLines: [{
                    value: 0,
                    width: 1,
                    color: '#808080'
                }]
            },
            legend: {
                enabled: false
            },
            credits: {
                enabled: false
            },
            plotOptions: {
                area: {
                    fillColor: '#FEFAF6',
                    lineWidth: 3,
                    marker: {
                        enabled: false,
                        fillColor: '#FFF',
                        lineColor: '#F3CCA3',
                        lineWidth: 2
                    },
                    color: "#F3CCA3",
                    shadow: true,
                    states: {
                        hover: {
                            lineWidth: 3
                        }
                    },
                    threshold: null
                }
            },
            series: [{
                name: 'BTC',
                type: 'area',
                color: '#ffd600',
                data: [16200000, 16300000, 16400000, 16500000, 16600000, 16700000, 16800000, 16900000, 17000000, 17100000, 17200000, 17300000]
            }]
        });
    }
}
cryptic_bitcoin_circulation();
function cryptic_market_price_usd() {
    if ($('#market_price_usd').length) {
        jQuery('#market_price_usd').highcharts({
            title: {
                text: '',
                x: 0
            },
            subtitle: {
                text: '',
                x: 0
            },
            navigation: {
                buttonOptions: {
                    enabled: false
                }
            },
            xAxis: {
                visible: false,
                enabled: false,
                categories: ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep']
            },
            yAxis: {
                visible: false,
                enabled: false,
                title: {
                    text: ''
                },
                plotLines: [{
                    value: 0,
                    width: 1,
                    color: '#808080'
                }]
            },
            tooltip: {
                enabled: false
            },
            legend: {
                enabled: false
            },
            credits: {
                enabled: false
            },
            plotOptions: {
                area: {
                    fillColor: '#FEFAF6',
                    lineWidth: 3,
                    marker: {
                        enabled: false,
                        fillColor: '#FFF',
                        lineColor: '#F3CCA3',
                        lineWidth: 2
                    },
                    color: "#F3CCA3",
                    shadow: true,
                    states: {
                        hover: {
                            lineWidth: 3
                        }
                    },
                    threshold: null
                }
            },
            series: [{
                name: '',
                type: 'area',
                color: '#ffd600',
                data: [1012, 952, 1206, 1821, 2400, 2276, 2665, 2793, 2059, 2265, 3424, 4850, 3978, 5506, 5647, 7198, 5716, 7817, 9718, 16502, 14870.16808, 16679, 19290, 16048, 14119, 15999, 14640, 14717, 11345, 12951, 11504, 6839, 9335]
            }]
        });
    }
}
cryptic_market_price_usd();
function cryptic_market_capitalization() {
    if ($('#market_capitalization').length) {
        jQuery('#market_capitalization').highcharts({
            title: {
                text: '',
                x: 0
            },
            subtitle: {
                text: '',
                x: 0
            },
            navigation: {
                buttonOptions: {
                    enabled: false
                }
            },
            xAxis: {
                visible: false,
                enabled: false,
                categories: ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep']
            },
            yAxis: {
                visible: false,
                enabled: false,
                title: {
                    text: ''
                },
                plotLines: [{
                    value: 0,
                    width: 1,
                    color: '#808080'
                }]
            },
            tooltip: {
                enabled: false
            },
            legend: {
                enabled: false
            },
            credits: {
                enabled: false
            },
            plotOptions: {
                area: {
                    fillColor: '#FEFAF6',
                    lineWidth: 3,
                    marker: {
                        enabled: false,
                        fillColor: '#FFF',
                        lineColor: '#F3CCA3',
                        lineWidth: 2
                    },
                    color: "#F3CCA3",
                    shadow: true,
                    states: {
                        hover: {
                            lineWidth: 3
                        }
                    },
                    threshold: null
                }
            },
            series: [{
                name: '',
                type: 'area',
                color: '#ffd600',
                data: [1012, 952, 1206, 1821, 2400, 2276, 2665, 2793, 2059, 2265, 3424, 4850, 3978, 5506, 5647, 7198, 5716, 7817, 9718, 16502, 14870.17808, 17679, 19290, 16048, 14119, 18999, 14640, 14717, 11345, 12951, 11504, 6839, 9335]
            }]
        });
    }
}
cryptic_market_capitalization();
function cryptic_usd_exchange_trade_volume() {
    if ($('#market_usd_exchange_trade_volume').length) {
        jQuery('#market_usd_exchange_trade_volume').highcharts({
            title: {
                text: '',
                x: 0
            },
            subtitle: {
                text: '',
                x: 0
            },
            navigation: {
                buttonOptions: {
                    enabled: false
                }
            },
            xAxis: {
                visible: false,
                enabled: false,
                categories: ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep']
            },
            yAxis: {
                visible: false,
                enabled: false,
                title: {
                    text: ''
                },
                plotLines: [{
                    value: 0,
                    width: 1,
                    color: '#808080'
                }]
            },
            tooltip: {
                enabled: false
            },
            legend: {
                enabled: false
            },
            credits: {
                enabled: false
            },
            plotOptions: {
                area: {
                    fillColor: '#FEFAF6',
                    lineWidth: 3,
                    marker: {
                        enabled: false,
                        fillColor: '#FFF',
                        lineColor: '#F3CCA3',
                        lineWidth: 2
                    },
                    color: "#F3CCA3",
                    shadow: true,
                    states: {
                        hover: {
                            lineWidth: 3
                        }
                    },
                    threshold: null
                }
            },
            series: [{
                name: '',
                type: 'area',
                color: '#ffd600',
                data: [1010, 950, 1020, 970, 2000, 970, 1800.900, 10000, 980, 15000, 1800, 5000, 900, 4000, 10000, 980, 11000, 800]
            }]
        });
    }
}
cryptic_usd_exchange_trade_volume();
function cryptic_blockchain_size() {
    if ($('#blockchain_size').length) {
        jQuery('#blockchain_size').highcharts({
            title: {
                text: '',
                x: 0
            },
            tooltip: {
                enabled: false
            },
            subtitle: {
                text: '',
                x: 0
            },
            navigation: {
                buttonOptions: {
                    enabled: false
                }
            },
            xAxis: {
                visible: false,
                enabled: false,
                categories: ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep']
            },
            yAxis: {
                visible: false,
                enabled: false,
                title: {
                    text: ''
                },
                plotLines: [{
                    value: 0,
                    width: 1,
                    color: '#808080'
                }]
            },
            legend: {
                enabled: false
            },
            credits: {
                enabled: false
            },
            plotOptions: {
                area: {
                    fillColor: '#FEFAF6',
                    lineWidth: 3,
                    marker: {
                        enabled: false,
                        fillColor: '#FFF',
                        lineColor: '#F3CCA3',
                        lineWidth: 2
                    },
                    color: "#F3CCA3",
                    shadow: true,
                    states: {
                        hover: {
                            lineWidth: 3
                        }
                    },
                    threshold: null
                }
            },
            series: [{
                name: 'BTC',
                type: 'area',
                color: '#ffd600',
                data: [16200000, 16300000, 16400000, 16500000, 16600000, 16700000, 16800000, 16900000, 17000000, 17100000, 17200000, 17300000]
            }]
        });
    }
}
cryptic_blockchain_size();
function cryptic_average_block_size() {
    if ($('#average_block_size').length) {
        jQuery('#average_block_size').highcharts({
            title: {
                text: '',
                x: 0
            },
            subtitle: {
                text: '',
                x: 0
            },
            navigation: {
                buttonOptions: {
                    enabled: false
                }
            },
            xAxis: {
                visible: false,
                enabled: false,
                categories: ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep']
            },
            yAxis: {
                visible: false,
                enabled: false,
                title: {
                    text: ''
                },
                plotLines: [{
                    value: 0,
                    width: 1,
                    color: '#808080'
                }]
            },
            tooltip: {
                enabled: false
            },
            legend: {
                enabled: false
            },
            credits: {
                enabled: false
            },
            plotOptions: {
                area: {
                    fillColor: '#FEFAF6',
                    lineWidth: 3,
                    marker: {
                        enabled: false,
                        fillColor: '#FFF',
                        lineColor: '#F3CCA3',
                        lineWidth: 2
                    },
                    color: "#F3CCA3",
                    shadow: true,
                    states: {
                        hover: {
                            lineWidth: 3
                        }
                    },
                    threshold: null
                }
            },
            series: [{
                name: '',
                type: 'area',
                color: '#ffd600',
                data: [2000, 1950, 2000, 700, 2000, 1900, 1950, 2000, 1900, 1950, 200, 1800, 2100, 500, 2200, 1900, 2100, 1700, 1600, 2300, 2100, 2200, 1600, 2300, 2100, 2200, 1900, 2300]
            }]
        });
    }
}
cryptic_average_block_size();
function cryptic_orphaned_blocks() {
    if ($('#orphaned_blocks').length) {
        jQuery('#orphaned_blocks').highcharts({
            title: {
                text: '',
                x: 0
            },
            subtitle: {
                text: '',
                x: 0
            },
            navigation: {
                buttonOptions: {
                    enabled: false
                }
            },
            xAxis: {
                visible: false,
                enabled: false,
                categories: ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep']
            },
            yAxis: {
                visible: false,
                enabled: false,
                title: {
                    text: ''
                },
                plotLines: [{
                    value: 0,
                    width: 1,
                    color: '#808080'
                }]
            },
            tooltip: {
                enabled: false
            },
            legend: {
                enabled: false
            },
            credits: {
                enabled: false
            },
            plotOptions: {
                area: {
                    fillColor: '#FEFAF6',
                    lineWidth: 3,
                    marker: {
                        enabled: false,
                        fillColor: '#FFF',
                        lineColor: '#F3CCA3',
                        lineWidth: 2
                    },
                    color: "#F3CCA3",
                    shadow: true,
                    states: {
                        hover: {
                            lineWidth: 3
                        }
                    },
                    threshold: null
                }
            },
            series: [{
                name: '',
                type: 'area',
                color: '#ffd600',
                data: [500, 1500, 500, 1500, 500, 500, 1500, 500, 8000, 500, 500, 500, 5000, 500, 500, 500, 500, 1500, 500, 1500, 500, 500, 1500, 500, 10000, 500, 500, 500, 7000, 500, 500, 500, 500, 1500, 500, 1500, 500, 500, 1500, 1500, 500, 500, 500, 500, 500, 500, 1500, 500, 1500, 500, 500, 1500, 1500, 500, 500, 1500, 500, 7000, 500, 500, 500, 3000, 500, 500, 500]
            }]
        });
    }
}
cryptic_orphaned_blocks();
function cryptic_transactions_per_block() {
    if ($('#transactions_per_block').length) {
        jQuery('#transactions_per_block').highcharts({
            title: {
                text: '',
                x: 0
            },
            subtitle: {
                text: '',
                x: 0
            },
            navigation: {
                buttonOptions: {
                    enabled: false
                }
            },
            xAxis: {
                visible: false,
                enabled: false,
                categories: ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep']
            },
            yAxis: {
                visible: false,
                enabled: false,
                title: {
                    text: ''
                },
                plotLines: [{
                    value: 0,
                    width: 1,
                    color: '#808080'
                }]
            },
            tooltip: {
                enabled: false
            },
            legend: {
                enabled: false
            },
            credits: {
                enabled: false
            },
            plotOptions: {
                area: {
                    fillColor: '#FEFAF6',
                    lineWidth: 3,
                    marker: {
                        enabled: false,
                        fillColor: '#FFF',
                        lineColor: '#F3CCA3',
                        lineWidth: 2
                    },
                    color: "#F3CCA3",
                    shadow: true,
                    states: {
                        hover: {
                            lineWidth: 3
                        }
                    },
                    threshold: null
                }
            },
            series: [{
                name: '',
                type: 'area',
                color: '#ffd600',
                data: [2000, 1950, 2000, 700, 2000, 1900, 1950, 2000, 1900, 1950, 200, 2300, 2800, 500, 2200, 1900, 2100, 1700, 1600, 2300, 2100, 2200, 1600, 2300, 2100, 2200, 1900, 2300]
            }]
        });
    }
}
cryptic_transactions_per_block(); 
// LTC - #838383
function cryptic_highcharts_ltc() {
    if ($('#chart_ltc').length) {
        jQuery('#chart_ltc').highcharts({
            title: {
                text: '',
                x: 0
            },
            subtitle: {
                text: '',
                x: 0
            },
            navigation: {
                buttonOptions: {
                    enabled: false
                }
            },
            xAxis: {
                visible: false,
                enabled: false,
                categories: ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep']
            },
            yAxis: {
                visible: false,
                enabled: false,
                title: {
                    text: ''
                },
                plotLines: [{
                    value: 0,
                    width: 1,
                    color: '#808080'
                }]
            },
            tooltip: {
                borderColor: '#838383',
                borderRadius: '3',
                borderWidth: '1',
                backgroundColor: '#dddddd',
                formatter: function() {
                    return '<strong>' + this.y + '</strong>';
                }
            },
            legend: {
                enabled: false
            },
            credits: {
                enabled: false
            },
            plotOptions: {
                area: {
                    fillColor: '#dddddd',
                    lineWidth: 3,
                    marker: {
                        enabled: true,
                        fillColor: '#FFF',
                        lineColor: '#838383',
                        lineWidth: 2
                    },
                    color: "#838383",
                    shadow: false,
                    states: {
                        hover: {
                            lineWidth: 3
                        }
                    },
                    threshold: null
                }
            },
            series: [{
                name: '',
                type: 'area',
                color: '#838383',
                data: [760, 760, 770, 780, 760, 780, 800, 790, 790, 790, 790, 760]
            }]
        });
    }
}
cryptic_highcharts_ltc();
// ETH - #282828
function cryptic_highcharts_eth() {
    if ($('#chart_eth').length) {
        jQuery('#chart_eth').highcharts({
            title: {
                text: '',
                x: 0
            },
            subtitle: {
                text: '',
                x: 0
            },
            navigation: {
                buttonOptions: {
                    enabled: false
                }
            },
            xAxis: {
                visible: false,
                enabled: false,
                categories: ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep']
            },
            yAxis: {
                visible: false,
                enabled: false,
                title: {
                    text: ''
                },
                plotLines: [{
                    value: 0,
                    width: 1,
                    color: '#808080'
                }]
            },
            tooltip: {
                borderColor: '#282828',
                borderRadius: '3',
                borderWidth: '1',
                backgroundColor: '#dbdbdb',
                formatter: function() {
                    return '<strong>' + this.y + '</strong>';
                }
            },
            legend: {
                enabled: false
            },
            credits: {
                enabled: false
            },
            plotOptions: {
                area: {
                    fillColor: '#dbdbdb',
                    lineWidth: 3,
                    marker: {
                        enabled: true,
                        fillColor: '#FFF',
                        lineColor: '#282828',
                        lineWidth: 2
                    },
                    color: "#282828",
                    shadow: false,
                    states: {
                        hover: {
                            lineWidth: 3
                        }
                    },
                    threshold: null
                }
            },
            series: [{
                name: '',
                type: 'area',
                color: '#282828',
                data: [760, 760, 770, 780, 760, 780, 800, 790, 790, 790, 790, 900]
            }]
        });
    }
}
cryptic_highcharts_eth();
// NEO - #282828
function cryptic_highcharts_neo() {
    if ($('#chart_neo').length) {
        jQuery('#chart_neo').highcharts({
            title: {
                text: '',
                x: 0
            },
            subtitle: {
                text: '',
                x: 0
            },
            navigation: {
                buttonOptions: {
                    enabled: false
                }
            },
            xAxis: {
                visible: false,
                enabled: false,
                categories: ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep']
            },
            yAxis: {
                visible: false,
                enabled: false,
                title: {
                    text: ''
                },
                plotLines: [{
                    value: 0,
                    width: 1,
                    color: '#808080'
                }]
            },
            tooltip: {
                borderColor: '#58BF00',
                borderRadius: '3',
                borderWidth: '1',
                backgroundColor: '#f6ffef',
                formatter: function() {
                    return '<strong>' + this.y + '</strong>';
                }
            },
            legend: {
                enabled: false
            },
            credits: {
                enabled: false
            },
            plotOptions: {
                area: {
                    fillColor: '#f6ffef',
                    lineWidth: 3,
                    marker: {
                        enabled: true,
                        fillColor: '#FFF',
                        lineColor: '#58BF00',
                        lineWidth: 2
                    },
                    color: "#58BF00",
                    shadow: false,
                    states: {
                        hover: {
                            lineWidth: 3
                        }
                    },
                    threshold: null
                }
            },
            series: [{
                name: '',
                type: 'area',
                color: '#58BF00',
                data: [760, 760, 770, 780, 760, 780, 800, 790, 790, 790, 790, 760]
            }]
        });
    }
}
cryptic_highcharts_neo();
// NEO - #282828
function cryptic_highcharts_dash() {
    if ($('#chart_dash').length) {
        jQuery('#chart_dash').highcharts({
            title: {
                text: '',
                x: 0
            },
            subtitle: {
                text: '',
                x: 0
            },
            navigation: {
                buttonOptions: {
                    enabled: false
                }
            },
            xAxis: {
                visible: false,
                enabled: false,
                categories: ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep']
            },
            yAxis: {
                visible: false,
                enabled: false,
                title: {
                    text: ''
                },
                plotLines: [{
                    value: 0,
                    width: 1,
                    color: '#808080'
                }]
            },
            tooltip: {
                borderColor: '#1c75bc',
                borderRadius: '3',
                borderWidth: '1',
                backgroundColor: '#f6fafd',
                formatter: function() {
                    return '<strong>' + this.y + '</strong>';
                }
            },
            legend: {
                enabled: false
            },
            credits: {
                enabled: false
            },
            plotOptions: {
                area: {
                    fillColor: '#f6fafd',
                    lineWidth: 3,
                    marker: {
                        enabled: true,
                        fillColor: '#FFF',
                        lineColor: '#1c75bc',
                        lineWidth: 2
                    },
                    color: "#1c75bc",
                    shadow: false,
                    states: {
                        hover: {
                            lineWidth: 3
                        }
                    },
                    threshold: null
                }
            },
            series: [{
                name: '',
                type: 'area',
                color: '#1c75bc',
                data: [760, 760, 770, 800, 760, 780, 800, 790, 790, 790, 850, 856, 870, 888]
            }]
        });
    }
}
cryptic_highcharts_dash();
// Ripple - #282828
function cryptic_highcharts_ripple_xrp() {
    if ($('#chart_ripple_xrp').length) {
        jQuery('#chart_ripple_xrp').highcharts({
            title: {
                text: '',
                x: 0
            },
            subtitle: {
                text: '',
                x: 0
            },
            navigation: {
                buttonOptions: {
                    enabled: false
                }
            },
            xAxis: {
                visible: false,
                enabled: false,
                categories: ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep']
            },
            yAxis: {
                visible: false,
                enabled: false,
                title: {
                    text: ''
                },
                plotLines: [{
                    value: 0,
                    width: 1,
                    color: '#808080'
                }]
            },
            tooltip: {
                borderColor: '#346AA9',
                borderRadius: '3',
                borderWidth: '1',
                backgroundColor: '#f3f7fb',
                formatter: function() {
                    return '<strong>' + this.y + '</strong>';
                }
            },
            legend: {
                enabled: false
            },
            credits: {
                enabled: false
            },
            plotOptions: {
                area: {
                    fillColor: '#f3f7fb',
                    lineWidth: 3,
                    marker: {
                        enabled: true,
                        fillColor: '#FFF',
                        lineColor: '#346AA9',
                        lineWidth: 2
                    },
                    color: "#346AA9",
                    shadow: false,
                    states: {
                        hover: {
                            lineWidth: 3
                        }
                    },
                    threshold: null
                }
            },
            series: [{
                name: '',
                type: 'area',
                color: '#346AA9',
                data: [760, 760, 770, 800, 760, 780, 800, 790, 790, 790, 700, 690, 680]
            }]
        });
    }
}
cryptic_highcharts_ripple_xrp();

$(function () {

  'use strict';
    //----BTC V2
    //Get the context of the Chart canvas element we want to select
    var dasChartjs = document.getElementById("chart_btc_v2").getContext("2d");
    // Chart Options
    var DASStats = {
        responsive: true,
        maintainAspectRatio: false,
        datasetStrokeWidth : 3,
        pointDotStrokeWidth : 4,
        tooltipFillColor: "rgba(247, 147, 26,0.8)",
        legend: {
            display: false,
        },
        hover: {
            mode: 'label'
        },
        scales: {
            xAxes: [{
                display: false,
            }],
            yAxes: [{
                display: false,
                ticks: {
                    min: 0,
                    max: 85
                },
            }]
        },
        title: {
            display: false,
            fontColor: "#FFF",
            fullWidth: false,
            fontSize: 30,
            text: '52%'
        }
    };
    // Chart Data
    var DASMonthData = {
        labels: ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
        datasets: [{
            label: "BTC",
            data: [20, 18, 35, 60, 38, 40, 60, 50, 38, 40,],
            backgroundColor:"#FFF",
            borderColor: "#FFDD90",
            borderWidth: 1.5,
            strokeColor : "#FFFAD3",
            pointRadius: 0,
        }]
    };
    var DASCardconfig = {
        type: 'line',

        // Chart Options
        options : DASStats,

        // Chart Data
        data : DASMonthData
    };
    // Create the chart
    var DASAreaChart = new Chart(dasChartjs, DASCardconfig);


    //----LTC v2
    //Get the context of the Chart canvas element we want to select
    var dasChartjs = document.getElementById("chart_ltc_v2").getContext("2d");
    // Chart Options
    var DASStats = {
        responsive: true,
        maintainAspectRatio: false,
        datasetStrokeWidth : 3,
        pointDotStrokeWidth : 4,
        tooltipFillColor: "rgba(247, 147, 26,0.8)",
        legend: {
            display: false,
        },
        hover: {
            mode: 'label'
        },
        scales: {
            xAxes: [{
                display: false,
            }],
            yAxes: [{
                display: false,
                ticks: {
                    min: 0,
                    max: 85
                },
            }]
        },
        title: {
            display: false,
            fontColor: "#FFF",
            fullWidth: false,
            fontSize: 30,
            text: '52%'
        }
    };
    // Chart Data
    var DASMonthData = {
        labels: ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
        datasets: [{
            label: "BTC",
            data: [20, 20, 30, 40, 20, 40, 40, 50, 50, 50, 50, 20],
            backgroundColor:"#dddddd",
            borderColor: "#838383",
            borderWidth: 1.5,
            strokeColor : "#838383",
            pointRadius: 0,
        }]
    };
    var DASCardconfig = {
        type: 'line',

        // Chart Options
        options : DASStats,

        // Chart Data
        data : DASMonthData
    };
    // Create the chart
    var DASAreaChart = new Chart(dasChartjs, DASCardconfig);


    //----ETH V2
    //Get the context of the Chart canvas element we want to select
    var dasChartjs = document.getElementById("chart_eth_v2").getContext("2d");
    // Chart Options
    var DASStats = {
        responsive: true,
        maintainAspectRatio: false,
        datasetStrokeWidth : 3,
        pointDotStrokeWidth : 4,
        tooltipFillColor: "rgba(247, 147, 26,0.8)",
        legend: {
            display: false,
        },
        hover: {
            mode: 'label'
        },
        scales: {
            xAxes: [{
                display: false,
            }],
            yAxes: [{
                display: false,
                ticks: {
                    min: 0,
                    max: 85
                },
            }]
        },
        title: {
            display: false,
            fontColor: "#FFF",
            fullWidth: false,
            fontSize: 30,
            text: '52%'
        }
    };
    // Chart Data
    var DASMonthData = {
        labels: ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
        datasets: [{
            label: "BTC",
            data: [10, 10, 30, 40, 20, 50, 55, 50, 50, 50, 55, 70],
            backgroundColor:"#dbdbdb",
            borderColor: "#282828",
            borderWidth: 1.5,
            strokeColor : "#282828",
            pointRadius: 0,
        }]
    };
    var DASCardconfig = {
        type: 'line',

        // Chart Options
        options : DASStats,

        // Chart Data
        data : DASMonthData
    };
    // Create the chart
    var DASAreaChart = new Chart(dasChartjs, DASCardconfig);


    //----NEO V2
    //Get the context of the Chart canvas element we want to select
    var dasChartjs = document.getElementById("chart_neo_v2").getContext("2d");
    // Chart Options
    var DASStats = {
        responsive: true,
        maintainAspectRatio: false,
        datasetStrokeWidth : 3,
        pointDotStrokeWidth : 4,
        tooltipFillColor: "rgba(247, 147, 26,0.8)",
        legend: {
            display: false,
        },
        hover: {
            mode: 'label'
        },
        scales: {
            xAxes: [{
                display: false,
            }],
            yAxes: [{
                display: false,
                ticks: {
                    min: 0,
                    max: 85
                },
            }]
        },
        title: {
            display: false,
            fontColor: "#FFF",
            fullWidth: false,
            fontSize: 30,
            text: '52%'
        }
    };
    // Chart Data
    var DASMonthData = {
        labels: ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
        datasets: [{
            label: "BTC",
            data: [20, 20, 30, 40, 20, 40, 60, 50, 50, 50, 50, 20],
            backgroundColor:"#f6ffef",
            borderColor: "#58BF00",
            borderWidth: 1.5,
            strokeColor : "#58BF00",
            pointRadius: 0,
        }]
    };
    var DASCardconfig = {
        type: 'line',

        // Chart Options
        options : DASStats,

        // Chart Data
        data : DASMonthData
    };
    // Create the chart
    var DASAreaChart = new Chart(dasChartjs, DASCardconfig);


    //----DASH V2
    //Get the context of the Chart canvas element we want to select
    var dasChartjs = document.getElementById("chart_dash_v2").getContext("2d");
    // Chart Options
    var DASStats = {
        responsive: true,
        maintainAspectRatio: false,
        datasetStrokeWidth : 3,
        pointDotStrokeWidth : 4,
        tooltipFillColor: "rgba(247, 147, 26,0.8)",
        legend: {
            display: false,
        },
        hover: {
            mode: 'label'
        },
        scales: {
            xAxes: [{
                display: false,
            }],
            yAxes: [{
                display: false,
                ticks: {
                    min: 0,
                    max: 85
                },
            }]
        },
        title: {
            display: false,
            fontColor: "#FFF",
            fullWidth: false,
            fontSize: 30,
            text: '52%'
        }
    };
    // Chart Data
    var DASMonthData = {
        labels: ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
        datasets: [{
            label: "BTC",
            data: [10, 10, 15, 30, 10, 20, 30, 25, 25, 25, 40, 50, 55, 60],
            backgroundColor:"#f6fafd",
            borderColor: "#1c75bc",
            borderWidth: 1.5,
            strokeColor : "#1c75bc",
            pointRadius: 0,
        }]
    };
    var DASCardconfig = {
        type: 'line',

        // Chart Options
        options : DASStats,

        // Chart Data
        data : DASMonthData
    };
    // Create the chart
    var DASAreaChart = new Chart(dasChartjs, DASCardconfig);
    // Create the chart
    var DASAreaChart = new Chart(dasChartjs, DASCardconfig);


    //----XRP V2
    //Get the context of the Chart canvas element we want to select
    var dasChartjs = document.getElementById("chart_ripple_xrp_v2").getContext("2d");
    // Chart Options
    var DASStats = {
        responsive: true,
        maintainAspectRatio: false,
        datasetStrokeWidth : 3,
        pointDotStrokeWidth : 4,
        tooltipFillColor: "rgba(247, 147, 26,0.8)",
        legend: {
            display: false,
        },
        hover: {
            mode: 'label'
        },
        scales: {
            xAxes: [{
                display: false,
            }],
            yAxes: [{
                display: false,
                ticks: {
                    min: 0,
                    max: 85
                },
            }]
        },
        title: {
            display: false,
            fontColor: "#FFF",
            fullWidth: false,
            fontSize: 30,
            text: '52%'
        }
    };
    // Chart Data
    var DASMonthData = {
        labels: ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
        datasets: [{
            label: "BTC",
            data: [30, 30, 40, 70, 30, 50, 70, 60, 60, 60, 20, 15, 10],
            backgroundColor:"#f3f7fb",
            borderColor: "#346AA9",
            borderWidth: 1.5,
            strokeColor : "#346AA9",
            pointRadius: 0,
        }]
    };

    var DASCardconfig = {
        type: 'line',

        // Chart Options
        options : DASStats,

        // Chart Data
        data : DASMonthData
    };

    // Create the chart
    var DASAreaChart = new Chart(dasChartjs, DASCardconfig);
});