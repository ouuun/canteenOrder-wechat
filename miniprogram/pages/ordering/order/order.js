// pages/ordering/order/order.js

const { request } = require('../../../util/http/request')

Page({

    data: {
        orders: [],
        showOrders: [],
        type: '已支付'
    },

    onLoad: async function (options) {
        await this.getOrders();
        await this.selectOrders();
    },
    getOrders: async function () {
        const res = await request({
            url: "/api/order/getAll",
            method: "GET",
            token: true
        });
        if (res.code == "200") {
            const orders = res.data.list.map(i => {
                i.select = i.Items[0].price.name
                if (i.Items[0].taste !== null)
                    i.select += "+" + i.Items[0].taste?.name;
                return i;
            });

            this.setData({
                orders: orders,
            });
        }
    },
    //tab点击切换
    changeType: async function (event) {
        const type = event.currentTarget.dataset.type;
        this.setData({
            type: type
        });
        await this.selectOrders();
    },
    //根据type过滤orders
    selectOrders: async function () {
        const { type, orders } = this.data;
        if (type == "全部") {
            this.setData({
                showOrders: orders
            });
        } else {
            this.setData({
                showOrders: orders.filter(i => {
                    return i.state == type
                })
            });
        }
    },
    //查看订单详情
    orderDetail: function (event) {
        const id = event.currentTarget.dataset.id;
        wx.navigateTo({
            url: `../detail/detail?id=${id}`,
        })
    },
    //支付未支付的订单
    orderPay: function (event) {
        const id = event.currentTarget.dataset.id;
        wx.navigateTo({
            url: `../pay/pay?id=${id}`,
        })
    }
})