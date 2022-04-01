// pages/cuisine/dish.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        fileList: [],
        imgList: [
            {
                url: 'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fimg.jj20.com%2Fup%2Fallimg%2F4k%2Fs%2F02%2F2109242332225H9-0-lp.jpg&refer=http%3A%2F%2Fimg.jj20.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1651409948&t=d64673ba6d640ae919e1ba040b08d13d'
            },
            {
                url: 'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fimg.jj20.com%2Fup%2Fallimg%2F4k%2Fs%2F02%2F2109242332225H9-0-lp.jpg&refer=http%3A%2F%2Fimg.jj20.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1651409948&t=d64673ba6d640ae919e1ba040b08d13d'
            },
            {
                url: 'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fimg.jj20.com%2Fup%2Fallimg%2F4k%2Fs%2F02%2F2109242332225H9-0-lp.jpg&refer=http%3A%2F%2Fimg.jj20.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1651409948&t=d64673ba6d640ae919e1ba040b08d13d'
            },
            {
                url: 'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fimg.jj20.com%2Fup%2Fallimg%2F4k%2Fs%2F02%2F2109242332225H9-0-lp.jpg&refer=http%3A%2F%2Fimg.jj20.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1651409948&t=d64673ba6d640ae919e1ba040b08d13d'
            },
            {
                url: 'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fimg.jj20.com%2Fup%2Fallimg%2F4k%2Fs%2F02%2F2109242332225H9-0-lp.jpg&refer=http%3A%2F%2Fimg.jj20.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1651409948&t=d64673ba6d640ae919e1ba040b08d13d'
            }
        ]
    },

    onLoad: function (options) {

    },

    afterRead(event) {
        const { file } = event.detail;
        // 当设置 mutiple 为 true 时, file 为数组格式，否则为对象格式
        wx.uploadFile({
            url: 'http://localhost:3000/api/manager/dish/upload', // 仅为示例，非真实的接口地址
            filePath: file.url,
            name: 'files',
            success(res) {
                // 上传完成需要更新 fileList
                const { fileList = [] } = this.data;
                fileList.push({ ...file, url: res.data });
                this.setData({ fileList });
            },
        });
    },
    chooseImg: function () {
        const that = this;
        wx.chooseImage({
            count: 9,
            sizeType: ['original', 'compressed'],
            sourceType: ['album', 'camera'],
            success(res) {
                // tempFilePath可以作为img标签的src属性显示图片
                const tempFilePaths = res.tempFilePaths
                that.setData({
                    imgList: tempFilePaths.map(i => { return { url: i } })
                })
            }
        })
    },
    look:function(event){
        const imgs = this.data.imgList;
        const index = event.currentTarget.dataset.index;
        wx.previewImage({
            current: imgs[index], // 当前显示图片的http链接
            urls: imgs.map(i=>i.url) // 需要预览的图片http链接列表
          })
    },
    delete:function(event){
        const imgs = this.data.imgList;
        const index = event.currentTarget.dataset.index;
        imgs.splice(index,1);
        this.setData({
            imgList:imgs
        })
    }

})