let md5 = require('../libs/md5.min.js')

let host = 'https://apis.map.qq.com'
let geoCoderUrl = '/ws/geocoder/v1/'
let secretKey = 'your_qq_map_screct_key'
let appKey = 'your_qq_map_app_key'

function requestFaceMerge(base64Img) {
  let dataParams = {
    key: appKey,
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
          reject(res.data.data.msg)
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

/**
 * @brief 计算SN签名算法
 * 签名后的 get 请求不能修改参数顺序，否则不能通过验证。
 * @param string $sk secret key
 * @param string $url url值，例如: /ws/geocoder/v1 不能带hostname和querstring，也不能带？
 * @param array  $querystring_arrays 参数数组，key=>value形式。在计算签名后不能重新排序，也不能添加或者删除数据元素
 * @param string $method 只能为'POST'或者'GET'
 */
// public function caculateAKSN( $sk, $url, $querystring_arrays, $method = 'GET'){
// //这个 querystring 汉字和部分字符会被 url 编码，所以在后面使用前应先反编码
// $querystring = http_build_query($querystring_arrays);
// return md5(urlencode($url.'?'. urldecode($querystring) . $sk));
// }


// $params = array(
//         "keyword"=>"酒店",
//         "boundary"=>"nearby(39.908491,116.374328,1000)",
//         "key"=>"K3HBZ-ZSA3U-BMUVL-BUEEN-FL6JT-XUFLM"
//     );


// echo caculateAKSN("7mW2LPFnPL4eIvkA63EZfhMRnRPeJXk", "/ws/place/v1/search", $params, "GET") . "\n";
