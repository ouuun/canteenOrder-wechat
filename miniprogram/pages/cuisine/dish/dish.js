// pages/cuisine/dish.js
const { request } = require('../../../util/http/request')
const { toAsync } = require('../../../util/toAsync/toAsync')
const config = require('../../../util/config/config')

const awx = toAsync("uploadFile")


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
        typeList: [],
        types: ['1', '新款商品2', '新款商品3'],//类型
    },

    onLoad: async function (options) {
        await this.getTypes();
        if (options.typeId != null) {
            const typelist = this.data.typeList;
            const type = typelist.find((i) => i.id == Number(options.typeId));
            this.setData({
                type: type.name
            })
        }
        if (options.id != null) {
            const res = await request({
                url: "/api/manager/dish/get",
                data: {
                    id: options.id
                }
            })
            if (res.code == "200") {
                const dish = res.data.info;
                const type = this.data.typeList.find((i) => i.id == Number(dish.type));
                this.setData({
                    id: dish.id,
                    img: dish.mainImages,
                    imgList: dish.detailImages,
                    name: dish.name,
                    type: type.name,
                    prices: dish.prices,
                    tastes: dish.tastes,
                    material: dish.material,
                    cooking: dish.cooking,
                    weight: dish.weight
                });
            }
        }
    },
    // 获取类型
    getTypes: async function () {
        const res = await request({
            url: "/api/manager/type/search",
            method: "GET",
        });
        this.setData({
            types: res.data.list.sort((a, b) => { return a.sort - b.sort }).map(i => i.name),
            typeList: res.data.list
        })
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
                // const imgNewList = tempFilePaths.map(i => { return { url: i } });
                // const imgNewList = tempFilePaths.map(i => { return { url: i } });
                var old = [];
                if (type === "img") {
                    old = that.data.img;
                    that.setData({ img: old.concat(tempFilePaths) });
                } else {
                    old = that.data.imgList;
                    that.setData({ imgList: old.concat(tempFilePaths) });
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
            urls: imgs // 需要预览的图片http链接列表
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
            prices: [...prices, { name: name, price: price, sale: 0 }],
        });
        this.onClose();
    },
    //修改价格
    updatePrice: async function () {
        const name = this.data.priceName;
        const price = this.data.priceValue;
        const prices = this.data.prices;
        const index = this.data.editId;
        const newPrice = { name: name, price: price, sale: prices[index].sale };
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
            tastes: [...tastes, { name: name, price: price, sale: 0 }],
        });
        this.onClose();
    },
    //修改口味
    updateTaste: async function () {
        const name = this.data.tasteName;
        const price = this.data.tasteValue;
        const tastes = this.data.tastes;
        const index = this.data.editId;
        const newTaste = { name: name, price: price, sale: tastes[index].sale };
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
        const { img, imgList, name, type, prices, tastes, material, cooking, weight, typeList } = this.data;
        var error = "";
        if (img.length == 0) error = "主图至少需要一张图片";
        if (imgList.length == 0) error = "详情图至少需要一张图片";
        if (name == "") error = "请输入菜品名";
        if (type == 0) error = "请选择类型";
        if (prices.length == 0) error = "至少需要一种规格";
        if (material == "") error = "请输入原材料";
        if (cooking == "") error = "请输入烹饪方式";

        if (error !== "") {
            wx.showModal({
                title: '提示',
                content: error
            })
            return null;
        }

        const imgRes = await this.uploadImgs(img);
        const imgListRes = await this.uploadImgs(imgList);

        var dish = {
            mainImages: imgRes,
            detailImages: imgListRes,
            name: name,
            type: typeList.find(i => i.name == type).id,
            prices: prices,
            tastes: tastes,
            material: material,
            cooking: cooking,
            weight: weight
        };

        var isAdd = true;
        if (this.data.id !== 0) {
            dish.id = this.data.id;
            isAdd = false;
        }

        const res = await request({
            url: `/api/manager/dish/${isAdd ? "add" : "update"}`,
            method: "POST",
            data: dish,
            token: true
        });

        if (res.code == "200") {
            if (isAdd)
                this.setData({
                    img: [],
                    imgList: [],
                    name: '',
                    type: '类型',
                    prices: [],
                    tastes: [],
                    material: '',
                    cooking: '',
                    weight: 1
                });
            else {
                wx.reLaunch({ url: `dish?id=${this.data.id}` });
            }
        }
    },
    // 上传图片
    uploadImgs: async function (imgs) {
        if (imgs.length == 0) return [];
        const imgRes = [];
        for (const img of imgs) {
            if (img.toString().indexOf("fanjiaming") == -1) {
                const res = await awx.uploadFile({
                    url: config.host + "/api/manager/dish/upload", 
                    filePath: img,
                    name: 'file',
                })
                var result = JSON.parse(res.data)
                imgRes.push(result.data.info);
            }
            else {
                imgRes.push(img);
            }

        }
        return imgRes;
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