import store from "../store"
// 配置API接口地址
var root = 'https://guixin.mynatapp.cc/hotsell'

var uploadPicUrl = root + '/admin/upload/uploadIcon' ;

export default {
  uploadPicUrl: uploadPicUrl,
  testContent: 'fuck',
  baseRootUrl: root,
  verifyCodeUrl: root + '/admin/defaultKaptcha',
  adminToken: store.getters.adminToken,
  socketPath: 'ws://guixin.mynatapp.cc/hotsell/webSocket'
}


