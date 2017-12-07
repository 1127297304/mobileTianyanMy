;(function(){
// $.get('data/china.json', function (chinaJson) {
//     console.log(chinaJson)
//     echarts.registerMap('china', chinaJson);
//     var chart = echarts.init(document.getElementById('main'));
//     chart.setOption({
//         series: [{
//             type: 'map',
//             map: 'china'
//         }]
//     });
// });

/*循换调用*/
var globalData ={};
var geoCoordMap = {
    "海门":[121.15,31.89],
    "鄂尔多斯":[109.781327,39.608266],
    "招远":[120.38,37.35],
    "舟山":[122.207216,29.985295]
}
// globalData.geoCoordMap = geoCoordMap;
// var timer = setInterval(DrawChart,100000);
DrawChart();
function DrawChart(){
    var myChart = echarts.init(document.getElementById('main'));
    var convertData = function (data) {
        console.log(data)
        var res = [];
        for (var i = 0; i < data.length; i++) {
            var geoCoord = geoCoordMap[data[i].name];
            if (geoCoord) {
                res.push({
                    name: data[i].name,
                    value: geoCoord.concat(data[i].value)
                });
            }
        }
        return res;
    };

    option = {
        backgroundColor: '#404a59',
        title: {
            text: '舆情分析',
            x:'center',
            textStyle: {
                color: '#fff'
            }
        },
        tooltip: {
            trigger: 'item',
            formatter: function (params) {
                return params.name + ' : ' + params.value[2]+'111';
            }
        },
        legend: {
            orient: 'vertical',
            y: 'bottom',
            x:'right',
            data:['pm2.5'],
            textStyle: {
                color: '#fff'
            }
        },
        visualMap: {
            min: 0,
            max: 200,
            calculable: true,
            inRange: {
                color: ['#50a3ba', '#eac736', '#d94e5d']
            },
            textStyle: {
                color: '#fff'
            }
        },
        geo: {
            map: 'china',
            label: {
                emphasis: {
                    show: false
                }
            },
            itemStyle: {
                normal: {
                    areaColor: '#323c48',
                    borderColor: '#111'
                },
                emphasis: {
                    areaColor: '#2a333d'
                }
            }
        },

        series: [
            {
            type: 'map',
            map: 'china',
            name: 'pm2.5',
            type: 'scatter',
            coordinateSystem: 'geo',
            data: convertData([
                {name: "海门", value: 9},
                {name: "鄂尔多斯", value: 12},
                {name: "招远", value: 12},
                {name: "舟山", value: 12},
            ]),
            symbolSize: 12,
            label: {
                normal: {
                    show: false
                },
                emphasis: {
                    show: false
                }
            },
            itemStyle: {
                emphasis: {
                    borderColor: '#fff',
                    borderWidth: 1
                }
            }
        }
        ]
    }

    myChart.setOption(option);
}

// clearInterval(timer);

})()
