const musics = [
    {
      name: '孤勇者',
      singer: ['陈奕迅'],
      difficulty: 3.5,
    },
    {
      name: '不为谁而作的歌',
      singer: ['林俊杰'],
      difficulty: 4.5,
    },
    {
      name: '幼稚完',
      singer: ['林峰'],
      difficulty: 2.5,
    },
    {
      name: '那些你很冒险的梦',
      singer: ['林俊杰'],
      difficulty: 3.5,
    },
  ]
  
  
  // 列表项高度
  const ITEM_HEIGHT = 100
  // 列表项上外边距
  const ITEM_MARGIN_TOP = 20
  // 列表高度
  const AREA_HEIGHT = (ITEM_HEIGHT + ITEM_MARGIN_TOP) * musics.length
  
  
  Component({
    data: {
      musics,
      // 移动的是哪个元素块
      moveId: null,
      // 最终停止的位置
      endY: 0,
      ITEM_HEIGHT,
      AREA_HEIGHT,
    },
  
  
    methods: {
      onReady() {
        const { musics } = this.data
        this.init(musics)
      },
  
  
      // 重置列表顺序
      init(musics) {
        const list = musics.map((item, index) => {
          item.id = index
          // 单项顶部距离(组件默认是绝对定位且 left:0 & top:0 )
          item.y = (ITEM_HEIGHT + ITEM_MARGIN_TOP) * index + ITEM_MARGIN_TOP
          return item
        })
        console.log(list)
        this.setData({ musics: list })
      },
  
  
      moved(e) {
        const { musics, moveId, endY } = this.data
        let list = musics
        list[moveId].y = endY
        list = list.sort((a, b) => a.y - b.y)
        this.init(list)
      },
  
  
      moving(event) {
        const {
          detail,
          currentTarget: { dataset },
        } = event
        this.setData({
          moveId: dataset.moveid,
          endY: detail.y,
        })
      }
    },
  })