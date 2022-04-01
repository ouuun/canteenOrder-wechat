const config = require('../config/config')

module.exports = {
    request: async function ({ url, method, data = {}, token }) {
        wx.showLoading({
            title: '加载中',
            mask: true
        });
        let header = { "Content-type": "application/json", };
        if (token) {
            if (wx.getStorageSync('token')) {
                header = Object.assign(header, { Authorization: 'Bearer ' + wx.getStorageSync('token') })
            } else {
                wx.hideLoading();
                wx.showModal({
                    title: '提示',
                    content: '请登录',
                    success(res) {
                        if (res.confirm) wx.navigateTo({ url: '/pages/index/index' });
                    }
                })
                return null;
            }
        }
        return new Promise((resolve, reject) => {
            wx.hideLoading();
            wx.request({
                url: `${config.host}` + url,
                method: method,
                data: data,
                header: header,
                success: (res) => {
                    if (res.statusCode === 200 || res.data.code === 200) {
                        resolve(res.data);
                    } else {
                        wx.showModal({
                            title: '提示',
                            content: res.data.message,
                        });
                        resolve({ code: 0 });
                    }
                },
                fail(error) {  //返回失败也同样传入reject()方法
                    wx.showToast({
                        title: error.errMsg,
                        icon: 'none',
                        duration: 2000
                    })
                    // reject(error.data)
                }
            })
        })
    },
    needLogin: async function () {
        if (wx.getStorageSync('token')) return;
        wx.showModal({
            title: '提示',
            content: '请登录',
            success(res) {
                if (res.confirm) wx.navigateTo({ url: '/pages/index/index' });
                wx.navigateBack()
            }
        })
    }
}