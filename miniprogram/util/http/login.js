const { request } = require('../http/request')
const { toAsync } = require('../toAsync/toAsync')
const awx = toAsync("login", "getUserProfile");

module.exports = {
    //登录
    needLogin: async function () {
        var that = this;
        if (wx.getStorageSync('token')) return;
        wx.showModal({
            title: '提示',
            content: '请登录',
            success(res) {
                wx.showLoading({
                    title: '登录中',
                })
                wx.login({
                    success: (res) => {
                        if (res.code) {
                            request({
                                url: '/api/user/login',
                                method: 'GET',
                                data: {
                                    code: res.code
                                }
                            }).then((res) => {
                                wx.hideLoading();
                                const data = res.data.info
                                if (data.openid) {
                                    wx.showModal({
                                        title: '提示',
                                        content: '是否允许获取信息？',
                                        success(res) {
                                            if (res.confirm) {
                                                getUserInfo(data.openid);
                                            }
                                        }
                                    });
                                } else if (data.access_token) {
                                    wx.setStorageSync('token', data.access_token);
                                }
                            });
                        }
                    }
                });
            }
        })
    }
}

async function getUserInfo(openid) {
    try {
        const { userInfo } = await awx.getUserProfile({ desc: '用于完善会员资料' });
        wx.showToast({
            title: '登录成功',
            icon: 'success',
            duration: 2000
        });

        const res = await request({
            url: '/api/user/register',
            method: 'post',
            data: {
                name: userInfo.nickName,
                image: userInfo.avatarUrl,
                openid: openid
            }
        });

    } catch (error) {
        wx.showToast({
            title: '取消授权',
            icon: 'error'
        });
    }
}