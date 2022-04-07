// pages/ordering/detail/detail.js
const { request } = require('../../../util/http/request')
Page({

    /**
     * 页面的初始数据
     */
    data: {
        order: {},
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: async function (options) {
        await this.getOrderInfo(options.id);
        await this.transDate();
    },
    //获取订单信息
    getOrderInfo: async function (id) {
        const res = await request({
            url: "/api/order/get",
            method: "GET",
            data: { id: id },
        });
        if (res.code == "200") {
            this.setData({
                order: res.data.info
            });
        }
    },
    //转换时间戳
    transDate: async function () {
        var { order } = this.data;
        const date = new Date(order.createdAt);
        order.date = date.getFullYear() + "-" + (date.getMonth() + 1).toString() + "-" + date.getDate() + " " + date.getHours() + ":" + date.getMinutes();

        this.setData({
            order: order
        });
    }
})