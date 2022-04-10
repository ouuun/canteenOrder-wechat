// pages/manager/table/table.js
const { request } = require('../../../util/http/request')
const { needLogin } = require('../../../util/http/login')

Page({

    /**
     * 页面的初始数据
     */
    data: {
        table: "",
        qrCode: ""
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: async function (options) {
        await needLogin();
    },
    //获取二维码
    getQrCode: async function () {
        const table = this.data.table;
        if (table == "") {
            wx.showToast({
                title: '未输入参数',
                icon: 'error'
            });
            return;
        }
        const res = await request({
            url: "/api/manager/table/get",
            method: "GET",
            data: {
                name: this.data.table
            },
            token: true
        });
        this.setData({
            qrCode: res.data.info.qrCode
        })
    },
    //查看图片
    look: function () {
        wx.previewImage({
            current: [this.data.qrCode],
            urls: [this.data.qrCode]
        })
    }
})