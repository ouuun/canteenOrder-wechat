// pages/manager/report/report.js
const { request } = require('../../../util/http/request')
import * as echarts from '../../../ec-canvas/echarts';

let chart = null;

function initChart(canvas, width, height, dpr) {
    chart = echarts.init(canvas, null, {
        width: width,
        height: height,
        devicePixelRatio: dpr // new
    });
    canvas.setChart(chart);

    const { data, time } = this.data;
    console.log(time);

    var option = {
        title: {
            text: '近7日收入报表',
            left: 'center'
        },
        legend: {
            data: ['订单', '收入', '菜品'],
            top: 50,
            left: 'center',
            //   backgroundColor: 'red',
            z: 100
        },
        grid: {
            containLabel: true
        },
        tooltip: {
            show: true,
            trigger: 'axis'
        },
        xAxis: {
            type: 'category',
            boundaryGap: false,
            data: time,
            // show: false
        },
        yAxis: {
            x: 'center',
            type: 'value',
            splitLine: {
                lineStyle: {
                    type: 'dashed'
                }
            }
            // show: false
        },
        series: [{
            name: '订单',
            type: 'line',
            smooth: true,
            data: [18, 36, 65, 30, 78, 40, 33]
        }, {
            name: '收入',
            type: 'line',
            smooth: true,
            data: [12, 50, 51, 35, 70, 30, 20]
        }, {
            name: '菜品',
            type: 'line',
            smooth: true,
            data: [10, 30, 31, 50, 40, 20, 10]
        }]
    };

    chart.setOption(option);
    return chart;
}

Page({

    data: {
        ec: {
            lazyLoad: true
        },
        data: [],
        time: []
    },
    onLoad: async function (options) {
        await this.getHistory();
        await this.init();
    },
    //初始化报表
    init: async function () {
        this.ecComponent = this.selectComponent('#mychart-dom-bar');
        this.ecComponent.init((canvas, width, height, dpr) => {
            const chart = echarts.init(canvas, null, {
                width: width,
                height: height,
                devicePixelRatio: dpr // new
            });
            this.setOption(chart);
            this.chart = chart;
            return chart;
        });
    },
    //设置参数
    setOption: function (chart) {
        const { data, time } = this.data;
        var option = {
            title: {
                text: '近7日收入报表',
                left: 'center'
            },
            legend: {
                data: ['订单', '收入', '菜品'],
                top: 50,
                left: 'center',
                z: 100
            },
            grid: {
                containLabel: true
            },
            tooltip: {
                show: true,
                trigger: 'axis'
            },
            xAxis: {
                type: 'category',
                boundaryGap: false,
                data: time
                // data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
                // show: false
            },
            yAxis: [
                {
                    x: 'center',
                    type: 'value',
                    name: '个数',
                    max: 20,
                    splitLine: {
                        lineStyle: {
                            type: 'dashed'
                        }
                    }
                },
                {
                    x: 'center',
                    type: 'value',
                    name: '元',
                    max: 500,
                    splitLine: {
                        lineStyle: {
                            type: 'dashed'
                        }
                    }
                }
            ],
            series: [{
                name: '订单',
                type: 'line',
                smooth: true,
                // data: [18, 36, 65, 30, 78, 40, 33]
                data: data.map(i => {
                    return i.orderNum;
                })
            }, 
            {
                name: '收入',
                type: 'line',
                smooth: true,
                yAxisIndex: 1,
                data: data.map(i => {
                    return i.amount;
                })
            }, 
            {
                name: '菜品',
                type: 'line',
                smooth: true,
                data: data.map(i => {
                    return i.dishNum;
                })
            }]
        };

        chart.setOption(option);
    },
    //获取数据
    getHistory: async function () {
        const res = await request({
            url: "/api/manager/report/history",
            method: "GET"
        })
        if (res.code == "200") {
            const data = res.data.info;
            this.setData({
                data: data.data,
                time: data.time
            });
        }
    }
})