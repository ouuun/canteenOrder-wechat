const config = require('../config')

module.exports = {
    request: function ({ url, method, data = {}, token }) {
        // console.log(url, method, data, token);
        wx.showLoading({
            title: '加载中',
            mask:true
        });
        let header = { "Content-type": "application/json", };
        if (token) {
            if (wx.getStorageSync('token')) {
                header = Object.assign(header, { Authorization: 'Bearer ' + wx.getStorageSync('token') })
            }
        }
        return new Promise((resolve, reject) => {
            wx.hideLoading();
            wx.request({
                url: `${config.host}`+url,
                method: method,
                data: data,
                header: header,
                success: (res) => {
                    if (res.statusCode === 200 || res.data.code === 200) {
                        resolve(res.data);
                    } else {
                        wx.showToast({
                            title: res.data.message,
                            icon: 'error'
                        })
                    }
                },
                fail(error) {  //返回失败也同样传入reject()方法
                    wx.showToast({
                        title: error.errMsg,
                        icon: 'none',
                        duration:2000
                    })
                    // reject(error.data)
                }
            })
        })
    }
}