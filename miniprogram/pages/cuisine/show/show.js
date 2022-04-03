// pages/cuisine/show/show.js
const { request, needLogin } = require('../../../util/http/request')
Page({

    /**
     * 页面的初始数据
     */
    data: {
        dishes: [],
        typeId: 0,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: async function (options) {
        await this.getDishByType(options.id);
    },
    getDishByType: async function (typeId) {
        const res = await request({
            url: "/api/manager/dish/getByType",
            data: {
                typeId: typeId
            }
        });
        if (res.code == "200") {
            const dishes = res.data.list;
            dishes.forEach(dish => {
                const priceSale = dish.prices.reduce((p, c) => {
                    return p + c.sale;
                }, 0);
                dish.sale = priceSale;
            });
            this.setData({
                dishes: res.data.list,
                typeId: typeId
            });
        }
    },
    watchImgs: function (event) {
        const id = event.currentTarget.dataset.id;
        const dish = this.data.dishes.find(i => i.id == id);
        var imgs = dish.mainImages.concat(dish.detailImages);
        wx.previewImage({
            current: imgs[0],
            urls: imgs
        })
    },
    editDish: function (event) {
        const id = event.currentTarget.dataset.id;
        wx.navigateTo({ url: `../dish/dish?id=${id}` });
    },
    addDish: function () {
        wx.navigateTo({ url: `../dish/dish?typeId=${this.data.typeId}` });
    },
    editDishActive: async function (event) {
        const id = event.currentTarget.dataset.id;
        const dish = this.data.dishes.find(i => i.id == id);

        dish.active = !dish.active;
        const res = await request({
            url: "/api/manager/dish/update",
            method: "POST",
            data: dish,
            token: true,
        });
        if (res.code == "200") {
            wx.reLaunch({ url: `show?id=${this.data.typeId}` });
        }
    }
})