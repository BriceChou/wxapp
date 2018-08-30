let util = require('util.js')
let md5 = require('../libs/md5.min.js')

let appId = 'your_tencent_ai_app_id'
let appKey = 'your_tencent_ai_app_key'
let host = 'https://api.ai.qq.com'
let url = host + '/fcgi-bin/ptu/ptu_facemerge'

function requestFaceMerge(base64Img) {
  let dataParams = {
    app_id: appId,
    image: base64Img,
    nonce_str: Math.random().toString(36).substr(2),
    time_stamp: parseInt(new Date().getTime() / 1000).toString(),
    model: 15160
  }
  dataParams['sign'] = _genSignKey(dataParams)
  return new Promise((resolve, reject) => {
    wx.request({
      url: url,
      data: dataParams,
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      method: 'POST',
      success: function(res) {
        if (res.data.data.image) {
          resolve(res.data.data.image)
        } else {
          reject(res.data.msg)
        }
      },
      fail: reject
    })
  })
}

function _genSignKey(params) {
  params = util.sortObject(params)
  let paramStr = ''
  let keys = Object.keys(params)
  for (let idx in keys) {
    let key = keys[idx]
    paramStr += key + '=' + encodeURIComponent(params[key]) + '&'
  }
  paramStr += 'app_key=' + appKey
  return md5(paramStr).toUpperCase()
}

module.exports = {
  request: requestFaceMerge
}
