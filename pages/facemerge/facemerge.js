// pages/facemerge.js
var util = require('../../common/util.js')
var api = require('../../common/faceMergeAPI.js')
import ImageHandler from '../../common/imageHandler.js'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    canvasHidden: true,
    resPanelHidden: true,
    tipHidden: false
  },

  onUploadImageClick: function(evt) {
    let that = this
    // 选择图片
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: function(res) {
        util.showBusy('正在上传')
        that.setData({
          canvasHidden: false,
          tipHidden: true,
        })
        let filePath = res.tempFilePaths[0]
        that.handler.setImage(filePath)
          .then((res) => {
            return api.request(res)
          })
          .then((data) => {
            util.showSuccess('图片上传成功')
            that.setData({
              resPanelHidden: false,
              base64: data
            })
          })
          .catch((e) => {
            console.log(e)
            util.showModal('上传失败', '没有检测到正面人脸，请重新上传图片。')
          })
      },
      fail: function(e) {
        console.error(e)
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.canvasId = 'imgCanvas'
    this.handler = new ImageHandler(this)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {
    return {
      title: '是时候给自己量身打造一枚硬币头像啦！',
      path: '/pages/facemerge/facemerge',
      imageUrl: '../../assets/img/avater_template.png',
      success: function success(res) {
        // 分享成功
      },
      fail: function fail(res) {
        // 分享失败
      }
    };
  }
})