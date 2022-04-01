const { request } = require('../../util/http/request')
const { toAsync } = require('../../util/toAsync/toAsync')
const awx = toAsync("login", "getUserProfile");
Page({
  data: {
    isLogin: false,
    hasInfo: false,
    headImage: '../../images/index/user.png',
    name: 'username',
    openid: ''
  },
  onLoad: async function () {
    if (wx.getStorageSync('token')) {
      await this.getUserInfoByToken();
      this.setData({
        isLogin: true,
        name: wx.getStorageSync('name'),
        headImage: wx.getStorageSync('headImage'),
      });
    }
  },
  login: async function (event) {
    var that = this;
    wx.showLoading({
      title: '登录中',
    })
    const { code } = await awx.login();
    if (code) {
      const res = await request({
        url: '/api/user/login',
        method: 'GET',
        data: {
          code: code
        }
      });
      wx.hideLoading();
      const data = res.data.info
      if (data.openid) {
        that.setData({
          hasInfo: false,
          openid: data.openid,
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
      } else if (data.access_token) {
        wx.setStorageSync('token', data.access_token);
        await that.getUserInfoByToken();
      }
    }
  },
  getUserInfo: async function () {
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
          openid: this.data.openid
        }
      });
      this.setData({
        headImage: res.data.info.image,
        name: res.data.info.name,
        isLogin: true,
      });
      wx.setStorageSync('name', this.data.name);
      wx.setStorageSync('headImage', this.data.headImage);
    } catch (error) {
      wx.showToast({
        title: '取消授权',
        icon: 'error'
      });
    }
  },
  getUserInfoByToken: async function () {
    if (wx.getStorageSync('token')) {
      const { data } = await request({
        url: '/api/user/info',
        method: 'get',
        token: true,
      });
      this.setData({
        headImage: data.info.image,
        name: data.info.name,
        isLogin: true,
      });
      wx.setStorageSync('name', this.data.name);
      wx.setStorageSync('headImage', this.data.headImage);
    };
  },
  subscribe:function(){
    wx.requestSubscribeMessage({
      tmplIds: ['Jh3c8z8H_SBimPbWdhuZYX3biCMvojLBLjXpCsz0jbw']
    });
  },
  openCuisine:function() {
    wx.navigateTo({url:"../cuisine/cuisine"});
  }
});
