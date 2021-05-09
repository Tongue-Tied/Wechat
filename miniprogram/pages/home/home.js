// pages/home/home.js
const app = getApp()
const db = wx.cloud.database()
const _ = db.command
Page({
  data: {
    motto: {}
  },
  bindTextAreaBlur: function (e) {
    this.setData({
      ceshi: e.detail.value
    })
  },
  formSubmit: function (e) {

    this.setData({
      ceshis: this.data.ceshi,
      ceshidd: e.detail.value.input
    })

  },
  add: function (event) {
    // this.data.myRecords = this.data.myRecords + 1
    this.setData({
      myRecords: this.data.myRecords + 1
    })

  },
  minus: function (event) {

    // this.data.myRecords = this.data.myRecords + 1
    this.setData({
      myRecords: this.data.myRecords - 1
    })
    console.log(this.data.myRecords)
  },
  god: function (params) {
    wx.cloud.init()
    // console.log(wx.cloud)
    wx.cloud.callFunction({
        name: 'check-str'
      })
      .then(res => {
        // res.result.data.reverse()
        console.log(res)
        // this.setData({
        //   motto: res.result.data
        // })
      })
  },
  sure: function () {
    if (this.data.myRecords < 0) {
      this.setData.type = 0
    } else if (this.data.myRecords > 0) {
      this.setData.type = 1
    }
    var util = require("../../utils/util");
    var arr = Date.now(); //测试
    arr = util.formatTime(arr)
    this.setData({
      time: arr
    })
    if (this.data.ceshi != '') {
      if (this.data.myRecords > 0) {
        const db = wx.cloud.database()
        db.collection('counters').add({
          data: {
            count: this.data.myRecords,
            type: this.data.type,
            total: this.data.AllRecords + this.data.myRecords,
            reason: this.data.ceshi,
            time: this.data.time
          },
          success: res => {
            wx.showToast({
              title: '新增记录成功',
            })
            console.log('[数据库] [新增记录] 成功，记录 _id: ', res._id)
          },
          fail: err => {
            wx.showToast({
              icon: 'none',
              title: '新增记录失败'
            })
            console.error('[数据库] [新增记录] 失败：', err)
          }
        })
      } else if (this.data.myRecords < 0) {

        const db = wx.cloud.database()
        db.collection('counters').add({
          data: {
            count: this.data.myRecords,
            type: this.data.type,
            total: this.data.AllRecords + this.data.myRecords,
            reason: this.data.ceshi,
            time: this.data.time
          },
          success: res => {
            // 在返回结果中会包含新创建的记录的 _id
            // this.setData({
            //   counterId: 154154545,
            //   count: 1,
            //   type: 1,
            //   total: 78,
            //   reason: '我是你爸爸',
            //   time: this.data.time
            // })
            this.watch()
            wx.showToast({
              title: '新增记录成功',
            })
            console.log('[数据库] [新增记录] 成功，记录 _id: ', res._id)
          },
          fail: err => {
            wx.showToast({
              icon: 'none',
              title: '新增记录失败'
            })
            console.error('[数据库] [新增记录] 失败：', err)
          }
        })

      } else {
        wx.showToast({
          title: '还没打分呢',
          icon: 'success',
          duration: 4000
        })
      }

      this.setData({
        myRecords: 0,
        ceshi: '',
        AllRecords: this.data.AllRecords + this.data.myRecords
      })
    } else {
      wx.showToast({
        title: '给个reason啊',
        icon: 'success',
        duration: 4000
      })
    }

  },
  check: function () {
    wx.navigateTo({

      url: "../logs/logs",

    })
  },
  /**
   * 页面的初始数据
   */
  data: {
    myRecords: 0,
    AllRecords: 78,
    ceshi: '',
    type: 0,
    time: null
  },
  //实时数据监听 
  watch() {
    const db = wx.cloud.database()
    // const watcher = db.collection('message').watch({
    //   onChange: function (snapshot) {
    //     console.log('snapshot', snapshot)
    //   },
    //   onError: function (err) {
    //     console.error('the watch closed because of error', err)
    //   }
    // })
    // // ...
    // // 等到需要关闭监听的时候调用 close() 方法
    // // watcher.close()F
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.watch()
    // const db = wx.cloud.database()
    // wx.cloud.callFunction({
    //   // 需调用的云函数名
    //   name: 'watch',
    //   // 传给云函数的参数
    //   // 成功回调
    // }).then(res =>{
    //   console.log(res);
    // })
    // const db = wx.cloud.database()
    // 2. 构造查询语句
    // collection 方法获取一个集合的引用
    // where 方法传入一个对象，数据库返回集合中字段等于指定值的 JSON 文档。API 也支持高级的查询条件（比如大于、小于、in 等），具体见文档查看支持列表
    // get 方法会触发网络请求，往数据库取数据
    var that = this
    db.collection('counters').where({

    }).get({
      success: function (res) {
        // 输出 [{ "title": "The Catcher in the Rye", ... }]
        that.setData({
          AllRecords: res.data[res.data.length - 1].total
        })
        console.log(res.data)
        console.log(that)
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
})
