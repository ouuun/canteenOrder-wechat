let app = getApp()
app.unitgameinfo = { "members": [{ "member": { "nickname": "小程序照片合成", "job": "ckext" }, }, { "member": { "nickname": "高球丸子" }, }, { "member": { "nickname": "DRobertdsf", "job": "黄金" }, }, { "member": { "nickname": "erer", "job": "ckext" }, }, { "member": { "nickname": "just do it", "job": "黄金" }, }, { "member": { "nickname": "888" }, }], };
Page({
  data: {
    isMove: false,
  },
  onLoad: function (options) {
    var info = app.unitgameinfo, list;
    list = info.members;
    this.setData({ options, info, list });
    this.getwxmlcode("#movebox", (resp) => {
      this.setData({ movebox: resp })
      setTimeout(() => {
        this.getwxmlcode("#movelist0", (res) => {
          this.setData({ movelist0: res })
          var jiange = res.top - resp.top;
          console.log('jiange----->', jiange);
          var yiban = res.bottom - res.top + jiange;
          console.log('yiban----->', yiban);
          this.setData({
            itemheight: res.bottom - res.top,
            jiange: yiban, //两条中间到另一条的距离
            jianqu: resp.top - (res.bottom - res.top) / 2, //位置要减去距离
          })
        })
      }, 300)
    })

  },
  getwxmlcode(str, cal) {
    const query1 = wx.createSelectorQuery()
    query1.select(str).boundingClientRect()
    query1.selectViewport().scrollOffset()
    query1.exec((res) => {
      console.log(`${str}-------->`, res);
      if (cal) cal(res[0])
    })
  },
  listitemmove(e) {
    if (e.type == "touchmove") {
      var movetop = e.touches[0].pageY - this.data.itemheight;
      var moveoutindex = parseInt((movetop - this.data.jianqu) / this.data.jiange);
      if (e.currentTarget.dataset.index <= moveoutindex) moveoutindex++;
      this.moveoutindex = moveoutindex;
      this.setData({ nowmoveindex: e.currentTarget.dataset.index, movetop, moveoutindex });
      this.setData({ isMove: true });
    } else {
      if (this.data.isMove) {
        let index = e.currentTarget.dataset.index, score = this.data.list;
        let data = { ...score[index] };
        score.splice(index, 1);
        if (index <= this.moveoutindex - 1) this.moveoutindex--;
        score.splice(this.moveoutindex, 0, data);
        this.setData({ list: score, moveoutindex: -1, nowmoveindex: -1 });
        this.setData({ isMove: false });
      };
    }
  },
  onShow: function () {
  },
  lastsubmit() {
    console.log(this.data.list)
  },
  test: function () {
    console.log(123);
  }

})