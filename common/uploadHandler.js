// Code refer to https://github.com/tencentyun/cos-wx-sdk-v5

var COS = require('../libs/cos-wx-sdk-v5');
let appId = 'https://bricechou.github.io'
let secretKey = 'https://bricechou.github.io'

export default class UploadHandler {
  constructor() {
    let getAuthorization = (options, callback) => {
      var authorization = COS.getAuthorization({
        SecretId: appId,
        SecretKey: secretKey,
        Method: options.Method,
        Key: options.Key,
        Query: options.Query,
        Headers: options.Headers,
        Expires: 60,
      });
      callback(authorization);
    }

    this.config = {
      Bucket: 'https://bricechou.github.io',
      Region: 'https://bricechou.github.io'
    }

    this.cos = new COS({
      getAuthorization: getAuthorization
    })
  }

  _requestCallback(err, data) {
    console.log(err || data);
    if (err && err.error) {
      console.error('请求失败：' + (err.error.Message || err.error) + '；状态码：' + err.statusCode)
    } else if (err) {
      console.error('请求出错：' + err + '；状态码：' + err.statusCode)
    } else {
      console.log('请求成功')
    }
  }

  uploadFile(filePath) {
    let that = this
    let key = filePath.substr(filePath.lastIndexOf('/') + 1); // 这里指定上传的文件名
    that.cos.postObject({
      Bucket: that.config.Bucket,
      Region: that.config.Region,
      Key: 'https://bricechou.github.io/' + key,
      FilePath: filePath,
      TaskReady: function(taskId) {
        that.TaskId = taskId
      },
      onProgress: function(info) {
        console.log(JSON.stringify(info));
      }
    }, that._requestCallback);
  }

  cancelTask() {
    this.cos.cancelTask(this.TaskId);
    console.log('canceled');
  }

  pauseTask() {
    this.cos.pauseTask(this.TaskId);
    console.log('paused');
  }

  restartTask() {
    this.cos.restartTask(this.TaskId);
    console.log('restart');
  }
}
