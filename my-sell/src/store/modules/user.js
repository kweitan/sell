// 导入 types.js 文件
import types from "./../types";

const user = {
  namespaced: true,
  state : {
      adminToken: '' || sessionStorage.getItem("adminToken"),
      avatarUrl: '' || sessionStorage.getItem("avatarUrl"),
      sellerName: '' || sessionStorage.getItem("sellerName"),
      isLogin: '0' || sessionStorage.getItem("isLogin")
  },


  actions : {
      SETUSERINFO({ commit }, userinfo ){
          commit(types.SETUSERINFO,userinfo)
      },
      CLEARUSERINFO({commit}){
          commit(types.CLEARUSERINFO)
      }
  },

  mutations : {
      [types.SETUSERINFO](state,userinfo){
          state.adminToken = userinfo.adminToken;
          state.avatarUrl = userinfo.avatarUrl;
          state.sellerName = userinfo.sellerName;
          state.isLogin = userinfo.isLogin;
        sessionStorage.setItem("adminToken", userinfo.adminToken);
        sessionStorage.setItem("avatarUrl", userinfo.avatarUrl);
        sessionStorage.setItem("sellerName", userinfo.sellerName);
        sessionStorage.setItem("isLogin", userinfo.isLogin);
      },
      [types.CLEARUSERINFO](state){
          state.adminToken = '';
          state.avatarUrl = '';
          state.sellerName = '';
          state.isLogin = '0';
        sessionStorage.setItem("adminToken","");
        sessionStorage.setItem("avatarUrl","");
        sessionStorage.setItem("sellerName", "");
        sessionStorage.setItem("isLogin", '0');
      }
  }
}


// 最后统一导出
export default user



