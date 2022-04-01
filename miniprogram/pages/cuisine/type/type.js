const { request, needLogin } = require('../../../util/http/request')
let app = getApp()
Page({
  data: {
    typeList: [],
    isMove: false,
    sort: false,
    addShow: false,
    editShow: false,
    newType: '',
    editType: '',
    editId: 0,
  },
  onLoad: async function (options) {
    await needLogin();
    await this.getTypeList();
    if (this.data.typeList?.length > 0) {
      this.initDrag();
    }
  },
  getTypeList: async function () {
    const res = await request({
      url: '/api/manager/type/search',
      method: 'GET',
    });
    if (res.code == 200) {
      this.setData({
        typeList: res.data.list.sort((a, b) => { return a.sort - b.sort })
      });
    }
  },
  // 初始化拖动排序所需信息
  initDrag: function (params) {
    this.getwxmlcode("#movebox", (resp) => {
      this.setData({ movebox: resp })
      setTimeout(() => {
        this.getwxmlcode("#movelist0", (res) => {
          this.setData({ movelist0: res })
          var jiange = res.top - resp.top;
          var yiban = res.bottom - res.top + jiange;
          this.setData({
            itemheight: res.bottom - res.top,
            jiange: yiban, //两条中间到另一条的距离
            jianqu: resp.top - (res.bottom - res.top) / 2, //位置要减去距离
          })
        })
      }, 300)
    })
  },
  getwxmlcode: function (str, cal) {
    const query1 = wx.createSelectorQuery()
    query1.select(str).boundingClientRect()
    query1.selectViewport().scrollOffset()
    query1.exec((res) => {
      if (cal) cal(res[0])
    })
  },
  //当触发移动
  move: function (e) {
    if (e.type == "touchmove") {
      var movetop = e.touches[0].pageY - this.data.itemheight;
      var moveoutindex = parseInt((movetop - this.data.jianqu) / this.data.jiange);
      if (e.currentTarget.dataset.index <= moveoutindex) moveoutindex++;
      // this.moveoutindex = moveoutindex;
      this.setData({ nowmoveindex: e.currentTarget.dataset.index, movetop, moveoutindex });
      this.animate(`#movelist${e.currentTarget.dataset.index}`, [{ top: movetop + 'px' }], 0);
      this.setData({ isMove: true });
    } else {
      if (this.data.isMove) {
        let index = e.currentTarget.dataset.index;
        let score = this.data.typeList;
        let data = { ...score[index] };
        score.splice(index, 1);
        if (index <= this.data.moveoutindex - 1) this.data.moveoutindex--;
        score.splice(this.data.moveoutindex, 0, data);
        this.setData({ typeList: score, moveoutindex: -1, nowmoveindex: -1 });
        this.setData({ isMove: false });
        this.data.typeList.forEach((item, index) => {
          item.sort = index + 1
        });
      };
    }
  },
  //排序完成
  sort: async function () {
    if (this.data.sort) {
      console.log('保存');
      const sorted = this.data.typeList.map(item => { return { id: item.id, sort: item.sort } });
      const res = await request({
        url: '/api/manager/type/sort',
        method: 'POST',
        data: {
          sorted: sorted,
        },
        token: true
      });
      if (res.code == 200) {
        await this.getTypeList();
        this.onClose();
      }
    }
    this.setData({
      sort: !this.data.sort,
    })
  },
  //添加
  add() {
    this.setData({ addShow: true });
  },
  //点击编辑按钮
  edit(event) {
    const data = event.currentTarget.dataset;
    this.setData({ editShow: true, editType: data.name, editId: data.id });
  },
  //关闭
  onClose() {
    this.setData({ addShow: false, editShow: false });
  },
  //新增type
  addType: async function () {
    const res = await request({
      url: '/api/manager/type/add',
      method: 'POST',
      data: {
        name: this.data.newType,
        sort: this.data.typeList.length + 1
      },
      token: true
    });
    if (res.code == 200) {
      this.setData({
        newType: ''
      });
      await this.getTypeList();
      this.onClose();
    }
  },
  // 删除
  deleteType: async function () {
    const res = await request({
      url: '/api/manager/type/delete',
      method: 'POST',
      data: {
        id: this.data.editId,
      },
      token: true
    });
    if (res.code == 200) {
      await this.getTypeList();
      this.onClose();
    }
  },
  // 修改
  updateType: async function () {
    var list = this.data.typeList;
    const res = await request({
      url: '/api/manager/type/update',
      method: 'POST',
      data: {
        id: this.data.editId,
        name: this.data.editType
      },
      token: true
    });
    if (res.code == 200) {
      await this.getTypeList();
      this.onClose();
    }
  },
  // 下拉刷新
  onPullDownRefresh: async function () {
    await this.getTypeList();
    wx.stopPullDownRefresh();
  }
})