// pages/ordering/pay/pay.js
const { request } = require('../../../util/http/request')
Page({

    /**
     * 页面的初始数据
     */
    data: {
        time: 15 * 60 * 1000,
        price: 0,
        order: {}
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
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
            if(order.state == "未支付"){
                const end = Date.parse(new Date(order.createdAt)) + 15 * 60 * 1000;//获得开始时间的毫秒数
                const now = Date.parse(new Date());

                this.setData({
                    time: end - now,
                    price: order.price,
                    order: order
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
    },
    //模拟支付
    pay: async function () {
        const res = await request({
            url: "/api/order/pay",
            method: "POST",
            data: {
                id: this.data.order.id
            },
            token: true
        });

        if (res.code == "200") {
            wx.showToast({
                title: '支付成功',
                duration: 2000
            });
            setTimeout(() => {
                wx.redirectTo({
                    url: '../index/index',
                })
            }, 2000);
        }
    }
})