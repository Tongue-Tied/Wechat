// miniprogram/pages/chat/chat.js
var util = require("../../utils/util");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    input_value: '',
    hasUserInfo: false,
    userInfo: {},
    message: [],
    openID: "",
    scrollTop: 0
  },
  input(e){
    this.setData({
      input_value:e.detail.value
    })
  },
  toViewBottomFun: function () {
    // 设置屏幕自动滚动到最后一条消息处
    let that = this;
    wx.createSelectorQuery().select('.scroll_view').boundingClientRect(function (rect) {
      console.log(rect);
      wx.pageScrollTo({
        scrollTop: rect.height,
        duration: 0 // 滑动速度
      })
      that.setData({
        scrollTop: rect.height - that.data.scrollTop
      });
    }).exec();
  },
  confirm(e) {
    // this.data.input_value
    console.log(e.detail.value);
    if (e.detail.value === "") {
      return false
    }
    var arr = Date.now(); //测试
    arr = util.formatTime(arr)
    console.log(arr);
    console.log(this.data.userInfo);
    const db = wx.cloud.database()
    db.collection('message').add({
      data: {
        msg: e.detail.value,
        time: arr,
        userInfo: this.data.userInfo
      },
      success: res => {
        this.toViewBottomFun();
        this.setData({
          input_value:""
        })
        // e.detail.value = ""
        // wx.showToast({
        //   title: '新增记录成功',
        // })
        // wx.cloud.callFunction({
        //     name: 'message'
        //   })
        //   .then(res => {
        //     res.result.data.reverse()
        //     console.log(res);
        //     // that.setData({
        //     //   motto: res.result.data
        //     // })
        //   })
        // console.log(12)
        console.log('[数据库] [新增记录] 成功，记录 _id: ', res)
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '发送失败'
        })
        console.error('[数据库] [新增记录] 失败：', err)
      }
    })
  },
  getUserProfile() {
    wx.getUserProfile({
      desc: '用于完善会员资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
        setTimeout(() => {
          this.toViewBottomFun();
        }, 100);
      }
    })
  },
  //实时数据监听 
  watch() {
    const db = wx.cloud.database()
    let that = this
    const watcher = db.collection('message').watch({
      onChange: function (snapshot) {
        // console.log('snapshot', snapshot.docs)
        that.setData({
          message: snapshot.docs
        })
      },
      onError: function (err) {
        console.error('the watch closed because of error', err)
      }
    })
    // ...
    // 等到需要关闭监听的时候调用 close() 方法
    // // watcher.close()F
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.watch();
    wx.cloud.callFunction({
        name: 'watch'
      })
      .then(res => {
        // res.result.data.reverse()
        console.log(res);
        this.setData({
          openID: res.result.openid
        })
      })
    // let date = Date.now()
    // date = util.formatTime(date)
    // this.setData({
    //   time: date
    // })
    // console.log(this.data.time)
    // const db = wx.cloud.database()
    // db.collection('enter-time').add({
    //   data: {
    //     time: this.data.time,
    //     page: '聊天'
    //   },
    //   success: res => {

    //   }
    // })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {},

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

  }
})
