// pages/ordering/index/index.js
const { request } = require('../../../util/http/request')

Page({

    /**
     * 页面的初始数据
     */
    data: {
        typeList: [], //类型列表
        dishes: [],//菜品列表
        showDishes: [],//当前选中类型菜品列表
        shoppingCart: [],//购物车
        activeKey: 0,//当前选中type 下标
        selectedDish: {},//当前选中菜品
        selectedPrice: 0,//选中的规格
        selectedTaste: 0,//选中的口味
        selectedNum: 1,//选择的数量
        selectPopup: false,//选规格弹窗
        cart: 0,//购物车中物品数量
        cartPopup: false, //购物车弹窗
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: async function (options) {
        await this.getTypeList();
        await this.getDishList();
        await this.updateCartNum();
        await this.addSumToDishes();
        await this.updateCartList();
        await this.setShowDishes();
    },
    // 获取所有类型
    getTypeList: async function () {
        const res = await request({
            url: '/api/manager/type/search',
            method: 'GET',
        });
        if (res.code == "200") {
            this.setData({
                typeList: res.data.list.sort((a, b) => { return a.sort - b.sort })
            });
        }
    },
    // 获取所有菜品
    getDishList: async function () {
        const res = await request({
            url: "/api/manager/dish/search",
            method: "GET",
            data: {
                active: true
            }
        });
        if (res.code == "200") {
            this.setData({
                dishes: res.data.list
            });
        }
    },
    // 更改侧边栏
    onChange: async function (event) {
        const activeKey = event.detail;
        this.setData({
            activeKey: activeKey
        });
        await this.setShowDishes();
    },
    // 获取当前侧边栏的菜品
    setShowDishes: async function () {
        const activeKey = this.data.activeKey;
        const typeId = this.data.typeList[activeKey].id;
        const show = this.data.dishes.filter((i) => { return i.type == typeId; });
        this.setData({
            showDishes: show
        });
    },
    // 展示弹窗
    showPopUp: function (event) {
        const id = event.currentTarget.dataset.id;
        const dish = this.data.dishes.find(i => i.id == id);
        var price = Number(dish.prices[0].price);
        if (dish.tastes.length > 0) {
            price += Number(dish.tastes[0].price);
        }
        dish.price = price;
        this.setData({
            selectPopup: true,
            selectedDish: dish
        });
    },
    //关闭弹窗
    onClose: function () {
        this.setData({
            selectPopup: false,
            cartPopup: false,
        });
        let that = this;
        setTimeout(function () {
            that.setData({
                selectedDish: {},
                selectedPrice: 0,
                selectedTaste: 0,
                selectedNum: 1
            });
        }, 500);
    },
    // 选中规格
    selectPrice: function (event) {
        const select = event.currentTarget.dataset.index;
        this.setData({
            selectedPrice: select
        });
        this.updatePice();
    },
    // 选中口味
    selectTaste: function (event) {
        const select = event.currentTarget.dataset.index;
        this.setData({
            selectedTaste: select
        });
        this.updatePice();
    },
    //更新价格
    updatePice: function () {
        const dish = this.data.selectedDish;
        const priceIndex = this.data.selectedPrice;
        const tasteInex = this.data.selectedTaste;
        const num = this.data.selectedNum;
        var price = Number(dish.prices[priceIndex].price);
        if (dish.tastes.length > 0) {
            price += Number(dish.tastes[tasteInex].price)
        }
        dish.price = price * num;
        this.setData({
            selectedDish: dish
        });
    },
    //改变弹窗中的数量
    change: function (event) {
        const num = event.detail;
        this.setData({
            selectedNum: num
        });
        this.updatePice();
    },
    //加入购物车 
    addToCart: function () {
        var cart = wx.getStorageSync('cart');
        const selected = this.data.selectedDish;
        const priceIndex = this.data.selectedPrice;
        const tasteIndex = this.data.selectedTaste;
        const num = this.data.selectedNum;

        if (!cart) {
            wx.setStorageSync('cart', []);
            this.addToCart();
            return null;
        }
        var oldIndex = -1;
        if (cart) {
            oldIndex = cart.findIndex(i => { return i.id == selected.id });
        }
        if (oldIndex !== -1) {
            var old = cart[oldIndex];
            if (priceIndex == old.priceIndex && tasteIndex == old.tasteIndex) {
                cart[oldIndex].num += num;
                wx.setStorageSync('cart', cart);
                this.updateDishes(selected.id, num);
                this.updateCartNum();
                this.clearSelected();
                this.updateCartList();
                this.onLoad();
                return;
            }
        }

        var dish = {};
        dish.id = selected.id;
        dish.price = selected.price;
        dish.image = selected.mainImages[0];
        dish.name = selected.name;
        dish.select = selected.prices[priceIndex].name + (selected.tastes.length > 0 ? " + " + selected.tastes[tasteIndex].name : "");
        dish.num = num;
        dish.priceIndex = priceIndex;
        dish.tasteIndex = tasteIndex;

        cart.push(dish);
        wx.setStorageSync('cart', cart);
        this.updateDishes(selected.id, num);
        this.updateCartNum();
        this.clearSelected();
        this.updateCartList();
        this.onLoad();
    },
    // 清空已选择菜品相关变量
    clearSelected: async function () {
        let that = this;
        that.setData({
            selectPopup: false,
        });
        setTimeout(function () {
            that.setData({
                selectedDish: {},
                selectedPrice: 0,
                selectedTaste: 0,
                selectedNum: 1
            });
        }, 500);
    },
    //更新购物车数量
    updateCartNum: async function () {
        this.setData({
            cart: wx.getStorageSync('cart').length || 0
        });
    },
    //更新dishes中被加入购物车的数量
    updateDishes: function (id, num) {
        const dishes = this.data.dishes;
        const index = dishes.findIndex(i => { return i.id == id });
        if (!dishes[index].num) dishes[index].num = num;
        else { dishes[index].num += num; }

        this.setData({
            dishes: dishes
        });
    },
    //在dishes中添加num属性，以判断是否加入购物车
    addSumToDishes: async function () {
        const dishes = this.data.dishes;
        const cart = wx.getStorageSync('cart');
        dishes.forEach((dish) => {
            var num = 0;
            if (cart) {
                num = cart.filter((i) => { return i.id == dish.id }).reduce((prev, curr) => {
                    return prev += curr.num;
                }, 0);
            }
            dish.num = num;
        });
        this.setData({
            dishes: dishes
        });
    },
    //显示购物车弹窗
    showCart: function () {
        this.setData({
            cartPopup: true,
        });
    },
    //更新购物车信息
    updateCartList: async function () {
        this.setData({
            shoppingCart: wx.getStorageSync('cart') || [],
        });
    },
    //购物车中改变数量
    changeCartNum: function (event) {
        const value = event.detail;
        const index = event.currentTarget.dataset.index;
        const shoppingCart = this.data.shoppingCart;
        shoppingCart[index].num = value;
        this.setData({
            shoppingCart: shoppingCart
        });
        wx.setStorageSync('cart', shoppingCart);
        this.onLoad();
    },
    //删除购物车中的选项
    clearAll: function () {
        this.setData({
            shoppingCart: [],
            cartPopup: false
        });
        wx.setStorageSync('cart', []);
        this.onLoad();
        this.updateCartNum();
    },
    //删除
    onDelete: function (event) {
        const { instance } = event.detail;
        const { index } = event.currentTarget.dataset;
        const { shoppingCart } = this.data;
        let that = this;
        wx.showModal({
            title: '提示',
            content: '确定要删除该菜品吗',
            success(res) {
                if (res.confirm) {
                    instance.close();
                    shoppingCart.splice(index, 1);
                    that.setData({
                        shoppingCart: shoppingCart
                    });
                    wx.setStorageSync('cart', shoppingCart);
                    that.updateCartNum();
                    this.onLoad();
                }
            }
        })
    },
    //页面点击
    changeNum: function (event) {
        const value = event.detail;
        const id = event.currentTarget.dataset.id;
        const { dishes } = this.data;
        const num = dishes.find(i => i.id == id).num;

        if (value < num) {
            this.showCart();
            wx.showToast({
                title: '请在购物车中调整数量',
                icon: 'none'
            })
        } else {
            const dish = this.data.dishes.find(i => i.id == id);
            var price = Number(dish.prices[0].price);
            if (dish.tastes.length > 0) {
                price += Number(dish.tastes[0].price);
            }

            dish.price = price;
            this.setData({
                selectPopup: true,
                selectedDish: dish
            });
        }


    }
})