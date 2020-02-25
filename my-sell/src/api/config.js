import store from "../store"
// 配置API接口地址
var root = 'http://kweitan.natapp1.cc/hotsell'

var uploadPicUrl = root + '/admin/upload/uploadIcon' ;

export default {
  uploadPicUrl: uploadPicUrl,
  testContent: 'fuck',
  baseRootUrl: root,
  verifyCodeUrl: root + '/admin/defaultKaptcha',
  adminToken: store.getters.adminToken,
  socketPath: 'ws://kweitan.natapp1.cc/hotsell/webSocket'
}


