// 导入 types.js 文件
import types from "./../types";

const user = {
  namespaced: true,
  state : {
      adminToken:'' || localStorage.getItem("adminToken"),
      avatarUrl: '' || localStorage.getItem("avatarUrl"),
      sellerName: '' || localStorage.getItem("sellerName"),
      isLogin: '0' || localStorage.getItem("isLogin")
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
          localStorage.setItem("adminToken", userinfo.adminToken);
          localStorage.setItem("avatarUrl", userinfo.avatarUrl);
          localStorage.setItem("sellerName", userinfo.sellerName);
          localStorage.setItem("isLogin", userinfo.isLogin);
      },
      [types.CLEARUSERINFO](state){
          state.adminToken = '';
          state.avatarUrl = '';
          state.sellerName = '';
          state.isLogin = 0;
          localStorage.setItem("adminToken","");
          localStorage.setItem("avatarUrl","");
          localStorage.setItem("sellerName", "");
          localStorage.setItem("isLogin", '0');
      }
  }
}


// 最后统一导出
export default user



