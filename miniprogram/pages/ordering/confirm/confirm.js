// pages/ordering/confirm/confirm.js

const { request } = require('../../../util/http/request')

Page({

    /**
     * 页面的初始数据
     */
    data: {
        cart: [],
        totalAmount: 0,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.setData({
            tableId: options.table
        });
        this.loadCart();
    },
    loadCart: function () {
        const cart = wx.getStorageSync('cart');
        const amount = cart.reduce((prve, curr) => {
            return prve += curr.price;
        }, 0);
        this.setData({
            cart: cart,
            totalAmount: amount
        });
    },
    createOrder: async function () {
        const { cart, remark, tableId } = this.data;
        var data = {};
        const items = cart.map(item => {
            return {
                id: item.id,
                num: item.num,
                select: item.select,
                priceIndex: item.priceIndex,
                tasteIndex: item.tasteIndex,
                price: item.price
            }
        });

        data.type = 'dish';
        data.items = items;
        data.remark = { remark: remark };
        data.table = tableId;

        const res = await request({
            url: "/api/order/create",
            method: "POST",
            data: data,
            token: true
        });

        if (res.code == "200") {
            wx.setStorageSync('cart', []);
            wx.redirectTo({
                url: `../pay/pay?id=${res.data.info.id}`,
            })
        }

    },
})