// pages/index/index.js
var util = require('../../common/util')
var InfoList = require('../../models/infoList')
var api = require('../../common/coinRecogAPI')
var QQMapWX = require('../../libs/qqmapwx.min')
import ImageHandler from '../../common/imageHandler'
import UploadHandler from '../../common/uploadHandler'

Page({
  /**
   * 页面的初始数据
   */
  data: {
    resPanelHidden: true,
    canvasHidden: true,
    tipHidden: false,
    currentLocation: '中国',
    resultList: []
  },

  onUploadImageClick: function (evt) {
    let that = this
    // 选择图片
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {
        util.showBusy('正在上传')
        that.setData({
          canvasHidden: false,
          tipHidden: true,
        })
        let filePath = res.tempFilePaths[0]
        that.handler.setImage(filePath)
          .then((res) => {
            that.cosHandler.uploadFile(filePath)
            return api.request(res, that.matchList)
          })
          .then((res) => {
            console.log(res)
            util.showSuccess('图片上传成功')
            let resultList = []
            let i = 0
            if (res[0].unknown || res[0].probability < 55) {
              resultList.push({
                unknown: true
              })
            } else {
              for (i; i < res.length; i++) {
                let item = res[i]
                if (item.probability > 30) {
                  resultList.push(item)
                }
              }
            }
            that.setData({
              resPanelHidden: false,
              resultList: resultList
            })

          })
          .catch((e) => {
            console.log(e)
            util.showModal('上传失败', '无法识别到硬币')
          })
      },
      fail: function (e) {
        console.log(e)
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.canvasId = 'imgCanvas'
    this.matchList = InfoList.infoList[0]
    this.handler = new ImageHandler(this)
    this.cosHandler = new UploadHandler()
    this.mpaHanlder = new QQMapWX({
      key: 'https://bricechou.github.io'
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    let that = this
    wx.getLocation({
      success: function (res) {
        let latitude = res.latitude,
          longitude = res.longitude
        // test data
        // let latitude = 7.394570, longitude = 80.560993
        // let latitude =  13.479920,  longitude = 99.616787
        that.mpaHanlder.reverseGeocoder({
          location: {
            latitude: latitude,
            longitude: longitude
          },
          success: function (res) {
            console.log(res)
            let nation = res.result.address_component.nation
            that.setData({
              currentLocation: nation
            })
          },
          fail: function (res) {
            console.log(res)
          }
        })
      },
      fail: function (err) {
        console.log(err)
      }
    })
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
    return {
      title: '你还在为识别硬币烦恼么？',
      path: '/pages/index/index',
      imageUrl: '../../assets/img/coin_sample.jpg',
      success: function success(res) {
        // 分享成功
      },
      fail: function fail(res) {
        // 分享失败
      }
    };
  }
})
