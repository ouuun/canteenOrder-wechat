Page({
  data:{
    index:0,
  },
  login: function(event) {
    // wx.login({
    //   success (res) {
    //     if (res.code) {
    //       console.log(res.code);
    //     } else {
    //       console.log('登录失败！' + res.errMsg)
    //     }
    //   }
    // });
    wx.getUserProfile({
      desc: '用于完善会员资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        console.log(res);
        // this.setData({
        //   userInfo: res.userInfo,
        //   hasUserInfo: true
        // })
      }
    })
  }
});
