// pages/ordering/pay/pay.js
const { request } = require('../../../util/http/request')
Page({

    /**
     * 页面的初始数据
     */
    data: {
        time: 15 * 60 * 1000,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        console.log(options);
        this.getOrderInfo(options.id);
    },
    //改变时间
    onChange(e) {
        this.setData({
            timeData: e.detail,
        });
    },
    //获取订单信息
    getOrderInfo: async function (id) {
        const res = await request({
            url: "/api/order/get",
            method: "GET",
            data: {
                id: Number(id)
            }
        });
        if (res.code == "200") {
            const order = res.data.info;
            // if(order.state == "未支付"){
            if (order.state !== "未支付") {
                var start = Date.parse(new Date(order.createdAt));//获得开始时间的毫秒数
                var end = Date.parse(new Date());//获得结束时间的毫秒数
                var time = end - start; //两个时间戳相差的毫秒数

                this.setData({
                    time:time,
                    price:order.price
                })
            }
            else {
                wx.showModal({
                    title: '提示',
                    content: `当前订单 ${order.state}`,
                    success(res) {
                        wx.redirectTo({
                            url: '../index/index',
                        })
                    }
                })
            }
        }
    }
})