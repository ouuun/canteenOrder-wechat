// pages/cuisine/dish.js
const imgCountMap = {
    "img": { count: 1, file: "img" },
    "imgList": { count: 9, file: "imgList" }
}
Page({

    /**
     * 页面的初始数据
     */
    data: {
        id: 0,
        img: [],//主图
        imgList: [],//详情图
        edit: false,//是否未编辑
        editId: 0,//当前编辑的数组下标
        pricesShow: false,//价格编辑弹窗
        // prices: [{ id: 1, name: "小份", price: 1.5 }, { id: 1, name: "小份", price: 1.5 }],//价格数组
        prices: [],//价格数组
        priceName: '',
        priceValue: '',
        tasteShow: false,//口味编辑弹窗
        tastes: [],
        tasteName: '',
        tasteValue: '',
        material: '',//原料
        cooking: '',//烹饪方式
        weight: 1,//份量
        type: '类型',
        types: ['1', '新款商品2', '新款商品3'],//类型
    },

    onLoad: function (options) {

    },
    // 选择图片
    chooseImg: function (event) {
        const that = this;
        const type = event.currentTarget.dataset.type;
        wx.chooseImage({
            count: imgCountMap[type].count,
            sizeType: ['original', 'compressed'],
            sourceType: ['album', 'camera'],
            success(res) {
                // tempFilePath可以作为img标签的src属性显示图片
                const tempFilePaths = res.tempFilePaths;
                const imgNewList = tempFilePaths.map(i => { return { url: i } });
                var old = [];
                if (type === "img") {
                    old = that.data.img;
                    that.setData({ img: old.concat(imgNewList) });
                } else {
                    old = that.data.imgList;
                    that.setData({ imgList: old.concat(imgNewList) });
                }
            }
        })
    },
    //点击查看图片
    look: function (event) {
        const index = event.currentTarget.dataset.index;
        const type = event.currentTarget.dataset.type;
        var imgs = []
        if (type == "img") imgs = this.data.img;
        else imgs = this.data.imgList;
        wx.previewImage({
            current: imgs[index], // 当前显示图片的http链接
            urls: imgs.map(i => i.url) // 需要预览的图片http链接列表
        })
    },
    //点击删除图片
    delete: function (event) {
        const index = event.currentTarget.dataset.index;
        const type = event.currentTarget.dataset.type;
        var imgs = []
        if (type == "img") {
            imgs = this.data.img;
            imgs.splice(index, 1);
            this.setData({
                img: imgs
            });
        }
        else {
            imgs = this.data.imgList;
            imgs.splice(index, 1);
            this.setData({
                imgList: imgs
            });
        }
    },
    //弹窗控制关闭
    onClose: function () {
        const that = this;
        that.setData({
            pricesShow: false,
            tasteShow: false,
            typeShow: false,
        });
        setTimeout(function () {
            that.setData({
                priceName: '',
                priceValue: '',
                tasteName: '',
                tasteValue: '',
                edit: false
            });
        }, 500);

    },
    //弹窗控制显示
    show: function (event) {
        const type = event.currentTarget.dataset.type;
        const index = event.currentTarget.dataset?.index || 0;
        if (type == "priceAdd") {
            this.setData({ pricesShow: true });
        } else if (type == "priceEdit") {
            const price = this.data.prices[index];
            this.setData({
                pricesShow: true,
                edit: true,
                priceName: price.name,
                priceValue: price.price,
                editId: index,
            });
        } else if (type == "tasteAdd") {
            this.setData({ tasteShow: true });
        } else if (type == "tasteEdit") {
            const taste = this.data.tastes[index];
            this.setData({
                tasteShow: true,
                edit: true,
                tasteName: taste.name,
                tasteValue: taste.price,
                editId: index,
            });
        }

        if (type == "typePicker") {
            this.setData({ typeShow: true });
        }
    },
    //添加价格
    addPrice: async function () {
        const name = this.data.priceName;
        const price = this.data.priceValue;
        const prices = this.data.prices;
        this.setData({
            prices: [...prices, { name: name, price: price }],
        });
        this.onClose();
    },
    //修改价格
    updatePrice: async function () {
        const name = this.data.priceName;
        const price = this.data.priceValue;
        const prices = this.data.prices;
        const index = this.data.editId;
        const newPrice = { name: name, price: price };
        prices[index] = newPrice;
        this.setData({
            prices: prices,
        });
        this.onClose();
    },
    //删除价格
    deletePrice: async function () {
        const prices = this.data.prices;
        const index = this.data.editId;
        prices.splice(index, 1);
        this.setData({
            prices: prices
        });
        this.onClose();
    },
    //添加口味
    addTaste: async function () {
        const name = this.data.tasteName;
        const price = this.data.tasteValue;
        const tastes = this.data.tastes;
        this.setData({
            tastes: [...tastes, { name: name, price: price }],
        });
        this.onClose();
    },
    //修改口味
    updateTaste: async function () {
        const name = this.data.tasteName;
        const price = this.data.tasteValue;
        const tastes = this.data.tastes;
        const index = this.data.editId;
        const newTaste = { name: name, price: price };
        tastes[index] = newTaste;
        this.setData({
            tastes: tastes,
        });
        this.onClose();
    },
    //删除口味
    deleteTaste: async function () {
        const tastes = this.data.tastes;
        const index = this.data.editId;
        tastes.splice(index, 1);
        this.setData({
            tastes: tastes
        });
        this.onClose();
    },
    // 保存
    save: async function () {
        const { img, imgList, name, type, prices, tastes, material, cooking, weight } = this.data;

        var dish = {
            mainImages: img,
            detailImages: imgList,
            name: name,
            type: type,
            prices: prices,
            tastes: tastes,
            material: material,
            cooking: cooking,
            weight: weight
        };
        this.setData({
            mainImages: [],
            detailImages: [],
            name: '',
            type: '类型',
            prices: [],
            tastes: [],
            material: '',
            cooking: '',
            weight: 1
        });
    },
    //类型
    onConfirm(event) {
        const { value, index } = event.detail;
        this.setData({ type: value });
        this.onClose();
    },
    onCancel() {
        this.onClose();
    },
    weight(event) {
        this.setData({ weight: event.detail });
    },
})