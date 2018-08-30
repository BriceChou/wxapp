let host = 'https://aip.baidubce.com'
// This access token will expires in 2018-09-24
let accessToken = '24.e5cf9e01fe591eef2e875371a26a26dd.2592000.1538031397.282335-11723916'
let baseUrl = host + '/rpc/2.0/ai_custom/v1/classification/cn_mainland?access_token=' + accessToken

function requestCoinRecog(base64Img, matchList) {
  let dataParams = {
    image: base64Img,
    top_num: 3
  }
  return new Promise((resolve, reject) => {
    wx.request({
      url: baseUrl,
      data: dataParams,
      header: {
        'content-type': 'application/json'
      },
      method: 'POST',
      success: function(res) {
        if (res.data) {
          let resultList = _parseRecogResult(res.data, matchList)
          if (resultList) {
            resolve(resultList)
          } else {
            reject()
          }
        }
      },
      fail: reject
    })
  })
}

function _parseRecogResult(res, matchList) {
  let resultList = [],
    nameList = []
  let item, itemInfo = {}
  if (res.results) {
    let itemList = res.results
    for (let idx in itemList) {
      item = itemList[idx]
      nameList = item.name.split('_')
      itemInfo = matchList[nameList[0]]
      if (itemInfo) {
        resultList.push({
          'unknown': false,
          'value': itemInfo.value + itemInfo.unit,
          'side': nameList[1],
          'probability': (parseFloat(item.score) * 100).toFixed(1),
          'years': itemInfo.years,
          'info': itemInfo.info
        })
      } else {
        resultList.push({
          'unknown': true
        })
      }
    }
    return resultList
  }
}

function _genRecogAcsToken() {
  let baiId = 'your_baidu_ai_id'
  let baidSk = 'your_baidu_ai_screct_key'
  let baiGenUrl = 'https://aip.baidubce.com/oauth/2.0/token'
  let headerParams = {
    'content-type': 'application/x-www-form-urlencoded'
  }
  let dataParams = {
    grant_type: 'client_credentials',
    client_id: baiId,
    client_secret: baidSk
  }
  return new Promise((resolve, reject) => {
    wx.request({
      url: baiGenUrl,
      data: dataParams,
      header: headerParams,
      method: 'POST',
      success: function(res) {
        resolve(res)
      },
      fail: function(err) {
        reject(err)
      }
    })
  })
}

module.exports = {
  request: requestCoinRecog
}
