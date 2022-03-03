const config = require('../../config')
const http = require('../../http/http')
Page({
  data: {
    isLogin: false,
    hasInfo: false,
    headImage: '../../images/index/user.png',
    name: 'username',
    openid: ''
  },
  onLoad: function () {
    if (wx.getStorageSync('token')) {
      this.getUserInfoByToken();
      this.setData({
        isLogin: true,
        name: wx.getStorageSync('name'),
        headImage: wx.getStorageSync('headImage'),
      });
    }
  },
  login: function (event) {
    var that = this;
    wx.showLoading({
      title: '登录中',
    })
    wx.login({
      success(res) {
        if (res.code) {
          http.request({
            url: '/api/user/login',
            method: 'GET',
            data: {
              code: res.code
            }
          }).then((res) => {
            wx.hideLoading();
            if (res.data.info.openid) {
              that.setData({
                hasInfo: false,
                openid: res.data.info.openid,
              })
              wx.showModal({
                title: '提示',
                content: '是否允许获取信息？',
                success(res) {
                  if (res.confirm) {
                    that.getUserInfo();
                  }
                }
              });
            } else if (res.data.info.access_token) {
              wx.setStorageSync('token', res.data.info.access_token);
              that.getUserInfoByToken();
            }
          });
        }
      }
    });
  },
  getUserInfo: function () {
    wx.getUserProfile({
      desc: '用于完善会员资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        wx.showToast({
          title: '登录成功',
          icon: 'success',
          duration: 2000
        });
        http.request({
          url: '/api/user/register',
          method: 'post',
          data: {
            name: res.userInfo.nickName,
            image: res.userInfo.avatarUrl,
            openid: this.data.openid
          }
        }).then(res => {
          this.setData({
            headImage: res.data.info.image,
            name: res.data.info.name,
            isLogin: true,
          });
          wx.setStorageSync('name', this.data.name);
          wx.setStorageSync('headImage', this.data.headImage);
        });
      },
      fail: (res) => {
        wx.showToast({
          title: '授权失败',
          icon: 'error',
          duration: 2000
        });
      }
    })
  },
  getUserInfoByToken: function () {
    if (wx.getStorageSync('token')) {
      http.request({
        url: '/api/user/info',
        method: 'get',
        token: true,
      }).then((res) => {
        this.setData({
          headImage: res.data.info.image,
          name: res.data.info.name,
          isLogin: true,
        });
        wx.setStorageSync('name', this.data.name);
        wx.setStorageSync('headImage', this.data.headImage);
      });
    };
  }
});
