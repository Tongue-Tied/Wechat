//logs.js
const util = require('../../utils/util.js')

Page({
  data: {
    logs: [],
    recordsArr:null,
  },
  reverse2:function(array){
    for(var i=0;i<array.length/2;i++){
        var temp = array[i];
        array[i] = array[array.length-1-i];
        array[array.length-1-i] = temp;
    }
    return array;   //Array对象中的方法返回了一个数组。
},
  onLoad: function () {
    const db = wx.cloud.database()
    // 2. 构造查询语句
    // collection 方法获取一个集合的引用
    // where 方法传入一个对象，数据库返回集合中字段等于指定值的 JSON 文档。API 也支持高级的查询条件（比如大于、小于、in 等），具体见文档查看支持列表
    // get 方法会触发网络请求，往数据库取数据
    var that = this
    db.collection('counters').where({

    }).get({
      success: function (res) {
        // 输出 [{ "title": "The Catcher in the Rye", ... }]
        for(var i=0;i<res.data.length/2;i++){
          var temp = res.data[i];
          res.data[i] = res.data[res.data.length-1-i];
          res.data[res.data.length-1-i] = temp;
        }
        // that.data.reverse2(that.data.recordsArr)
        that.setData({
          AllRecords: res.data[res.data.length - 1].total,
          recordsArr: res.data,
        })
        console.log(res.data)
        console.log(that.data.recordsArr)
      }
    })
    this.setData({
      logs: (wx.getStorageSync('logs') || []).map(log => {
        return util.formatTime(new Date(log))
      })
    })
  }
})
