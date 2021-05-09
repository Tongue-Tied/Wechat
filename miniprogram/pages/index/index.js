//index.js
//获取应用实例
const app = getApp()
const db = wx.cloud.database()
const _ = db.command

Page({
  data: {
    msg: "特大喜讯!!!特大喜讯!!! ViJiaO公众号开通啦 微信搜索ViJiaO即可领取爱的礼包一份",
    msg1: [],
    myIndex: 5,
    scrollHeight: wx.getSystemInfoSync().windowHeight,
    visual: false,
    height: '',
    inputValue: "",
    textAreaShow: false,
    textAreaShow1: false,
    time: "",
    motto: [],
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    touchTime: 0,
    touchTimer: null,
    isBack: false,
    filePath: ""
  },
  goTop: function (e) { // 一键回到顶部
    this.setData({
      textAreaShow: true
    })
  },
  blur: function (params) {
    if (this.data.textAreaShow) {
      this.setData({
        textAreaShow: false,
        textAreaShow1: true
      })
    } else {
      this.setData({
        textAreaShow: false,
        textAreaShow1: false
      })
    }
  },
  alertMe: function (params) {
    wx.showToast({
      title: this.data.motto.length + "条",
      icon: "none"
    })
  },
  send_msg: function (params) {
    if (this.data.inputValue === "") {
      return wx.showToast({
        title: '内容不能为空',
        icon: "none"
      })
    }
    let first = this.data.inputValue.split("@#")[0]
    let second = this.data.inputValue.split("@#")[1] ? this.data.inputValue.split("@#")[1] : ''
    let date = Date.now()
    let util = require("../../utils/util");
    date = util.formatTime(date)
    this.setData({
      time: date
    })
    let that = this;
    if (this.data.filePath === '') {
      db.collection('words').add({
        data: {
          content: first,
          backWord: second,
          time: this.data.time,
        },
        success: res => {
          wx.showToast({
            title: '新增骚话成功',
          })
          let heightTime = this.data.textAreaShow

          let timer = setInterval(() => {
            if (heightTime === 0) {
              clearInterval(timer)
            } else {
              heightTime -= 10
              this.setData({
                textAreaShow: heightTime
              })
            }
          }, 1);
          wx.cloud.callFunction({
              name: 'check'
            })
            .then(res => {
              res.result.data.reverse()
              this.setData({
                motto: res.result.data
              })
            })
          // console.log(12)
          console.log('[数据库] [新增记录] 成功，记录 _id: ', res)
        },
        fail: err => {
          wx.showToast({
            icon: 'none',
            title: '新增骚话失败'
          })
          console.error('[数据库] [新增记录] 失败：', err)
        }
      })
    } else {
      console.log(that.data.motto.length);
      wx.cloud.uploadFile({
        // 指定上传到的云路径
        cloudPath: `my-photo${that.data.motto.length}`,
        // 指定要上传的文件的小程序临时文件路径
        filePath: that.data.filePath,
        count: 1,
        // 成功回调
        success: res => {
          console.log(res);
          const db = wx.cloud.database()
          db.collection('words').add({
            data: {
              content: first,
              backWord: second,
              time: that.data.time,
              imgUrl: res.fileID
            },
            success: res => {
              wx.showToast({
                title: '新增骚话成功',
              })
              wx.cloud.callFunction({
                  name: 'check'
                })
                .then(res => {
                  res.result.data.reverse()
                  that.setData({
                    motto: res.result.data
                  })
                })
              // console.log(12)
              console.log('[数据库] [新增记录] 成功，记录 _id: ', res)
            },
            fail: err => {
              wx.showToast({
                icon: 'none',
                title: '新增骚话失败'
              })
              console.error('[数据库] [新增记录] 失败：', err)
            }
          })
        },
        fail: res => {
          wx.showToast({
            title: '上传图片失败,请重试',
          })
          console.log(res);
        }
      })
    }
    this.setData({
      textAreaShow: false
    })
    console.log(this.data.time);
  },
  chose_image() {
    let that = this;
    wx.chooseImage({
      success: function (res) {
        console.log(res);
        that.setData({
          filePath: res.tempFiles[0].path
        })
      }
    })
  },
  passWdInput: function (e) {
    this.setData({
      inputValue: e.detail.value
    });
  },
  lower: function (e) {
    let scrollTop = e.detail.scrollTop
    if (scrollTop > 100 && !this.data.visual) {
      this.setData({
        visual: true
      })
    }
    if (scrollTop <= 100 && this.data.visual) {
      this.setData({
        visual: false
      });
    }
    if (this.data.myIndex >= this.data.motto.length) {
      wx.showToast({ //如果全部加载完成了也弹一个框
        title: '我也是有底线的',
        icon: 'info',
        duration: 3000
      });
      return false;
    } else {
      wx.showLoading({ //期间为了显示效果可以添加一个过度的弹出框提示“加载中”  
        title: '骚话加载中',
        icon: 'loading',
      });
      setTimeout(() => {
        this.setData({
          myIndex: this.data.myIndex + 5
        });
        wx.hideLoading();
      }, 1500)
    }
  },
  scrollToTop() {
    this.setData({
      scrollTop: 0
    })
  },
  touchstart(e) {
    let that = this
    this.data.motto[e.currentTarget.dataset.id].isBack = !this.data.motto[e.currentTarget.dataset.id].isBack;
    if (this.data.motto[e.currentTarget.dataset.id].isBack) {
      if (this.data.motto[e.currentTarget.dataset.id].imgUrl) {
        wx.cloud.getTempFileURL({
          fileList: [this.data.motto[e.currentTarget.dataset.id].imgUrl],
          success: res => {
            that.data.motto[e.currentTarget.dataset.id].imageUrl = res.fileList[0].tempFileURL
            that.setData({
              motto: that.data.motto
            })
            console.log(res.fileList)
          },
          fail: console.error
        })
      } else {
        that.setData({
          motto: that.data.motto
        })
      }
    } else {
      delete this.data.motto[e.currentTarget.dataset.id].imageUrl
      that.setData({
        motto: that.data.motto
      })
    }
    // this.setData({
    //   motto: this.data.motto,
    // })
    console.log(this.data.touchTime);
  },
  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs',
      home: '../home/home'
    })
  },
  bindGetUserInfo(e) {
    console.log(e.detail.userInfo)
  },
  onLoad: function () {
    let date = Date.now()
    let util = require("../../utils/util");
    date = util.formatTime(date)
    this.setData({
      time: date
    })
    console.log(this.data.time)
    const db = wx.cloud.database()
    db.collection('enter-time').add({
      data: {
        time: this.data.time,
        Page: '留言'
      },
      success: res => {

      }
    })

    wx.cloud.init()
    wx.cloud.callFunction({
        name: 'check'
      })
      .then(res => {
        res.result.data.reverse()
        console.log(res)
        this.setData({
          motto: res.result.data
        })
      })
    wx.getSystemInfo({
      success: (res) => {
        this.setData({
          height: res.windowHeight
        })
      }
    })
  },
  getUserProfile: function () {
    wx.getUserProfile({
      desc: '用于完善会员资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        console.log(res);
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      },
      fail: (res) => {
        console.log(res);
      }
    })
  },
  onReachBottom() {

  },
  getUserInfo: function (e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  onHide: function (params) {},
  onShareAppMessage: function () {



  }
})
