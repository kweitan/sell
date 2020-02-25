const getters = {
  adminToken: state => state.user.adminToken,
  avatarUrl: state => state.user.avatarUrl,
  sellerName: state => state.user.sellerName,
  isLogin: state => state.user.isLogin
}
export default getters
