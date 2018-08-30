// Code refer to https://github.com/zh8637688/wx-cardscanner
var upng = require('../libs/UPNG.js')

export default class ImageHandler {
  constructor(page) {
    this.canvasId = page.canvasId
    this.canvas = wx.createCanvasContext(page.canvasId)
  }

  setImage(imgFilePath) {
    return new Promise((resolve, reject) => {
      if (imgFilePath) {
        let that = this
        this.img = {
          path: imgFilePath
        }
        this._getImgSize(this.img)
          .then((img) => {
            return that._getCanvasSize()
          })
          .then(() => {
            that._calcImgSize()
            return that._drawTargetImg()
          })
          .then(() => {
            return that._getBase64Data()
          })
          .then((res) => {
            resolve(res)
          })
          .catch((err) => {
            reject(err)
          })
      }
    })
  }

  _getImgSize(img) {
    return new Promise(resolve => {
      if (img.width && img.height) {
        resolve(img)
      } else {
        let that = this
        wx.getImageInfo({
          src: img.path,
          success(res) {
            img['radio'] = res.width / res.height
            img['width'] = res.width
            img['height'] = res.height
            resolve(img)
          },
          fail(e) {
            console.error(e)
          }
        })
      }
    })
  }

  _getCanvasSize() {
    let that = this
    return new Promise(resolve => {
      if (that.canvasSize) {
        resolve()
      } else {
        wx.createSelectorQuery().select('#' + that.canvasId).boundingClientRect((res) => {
          that.canvasSize = {
            radio: res.width / res.height,
            width: res.width,
            height: res.height
          }
          resolve()
        }).exec()
      }
    })
  }

  _calcImgSize() {
    let target = {}
    if (this.img.radio > this.canvasSize.radio) {
      target['width'] = this.canvasSize.width
      target['height'] = parseInt(target['width'] / this.img.radio)
      target['top'] = parseInt((this.canvasSize.height - target['height']) / 2)
      target['left'] = 0
    } else {
      target['height'] = this.canvasSize.height
      target['width'] = parseInt(target['height'] * this.img.radio)
      target['left'] = parseInt((this.canvasSize.width - target['width']) / 2)
      target['top'] = 0
    }
    this.target = target
  }

  _drawTargetImg() {
    let that = this
    return new Promise((resolve, reject) => {
      that.canvas.drawImage(that.img.path, that.target.left, that.target.top, that.target.width, that.target.height)
      that.canvas.draw(false, resolve)
    })
  }

  _getBase64Data() {
    let that = this
    let reverseImgData = (res) => {
      let width = res.width, height = res.height
      let con = 0, i = 0, j = 0
      for (i; i < height / 2; i++) {
        for (j; j < width * 4; j++) {
          con = res.data[i * width * 4 + j]
          res.data[i * width * 4 + j] = res.data[(height - i - 1) * width * 4 + j]
          res.data[(height - i - 1) * width * 4 + j] = con
        }
      }
      return res
    }
    return new Promise((resolve, reject) => {
      wx.canvasGetImageData({
        canvasId: that.canvasId,
        x: that.target.left,
        y: that.target.top,
        width: that.target.width,
        height: that.target.height,
        success(res) {
          let platform = wx.getSystemInfoSync().platform
          if (platform == 'ios') {
            // handle the IOS platform
            res = reverseImgData(res)
          }
          let pngData = upng.encode([res.data.buffer], res.width, res.height)
          resolve(wx.arrayBufferToBase64(pngData))
        },
        reject
      })
    })
  }
}
