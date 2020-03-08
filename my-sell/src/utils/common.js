var convertor = {
  toStr: function (orderStatus, payStatus) {
    var result = '';
    if (orderStatus == 'NEW' &&
      payStatus == 'WAIT') {
      result = '订单等待支付' //可以继续支付和取消订单
    } else if (orderStatus == 'NEW' &&
      payStatus == 'SUCCESS') {
      result = '订单等待发货' //可以申请退款
    } else if (orderStatus == 'SHIPMENT' &&
      payStatus == 'SUCCESS') {
      result = '订单等待收货' //可以查看物流
    } else if (orderStatus == 'FINISHED' &&
      payStatus == 'CLOSED') {
      result = '订单已完结' //表示成功
    } else if (orderStatus == 'REVIEW' &&
      payStatus == 'SUCCESS') {
      result = '订单待评价' //可以继续评价
    }else if (orderStatus == 'CANCEL' &&
      payStatus == 'CLOSED') {
      result = '订单已取消' //表示退款或失败
    }
    return result;
  },
  toStatus: function (orderStatus, payStatus) {
    var result = 0;
    if (orderStatus == 'NEW' &&
      payStatus == 'WAIT') {
      result = 0 //可以继续支付和取消订单
    } else if (orderStatus == 'NEW' &&
      payStatus == 'SUCCESS') {
      result = 1 //可以申请退款
    } else if (orderStatus == 'SHIPMENT' &&
      payStatus == 'SUCCESS') {
      result = 2 //可以查看物流
    } else if (orderStatus == 'FINISHED' &&
      payStatus == 'CLOSED') {
      result = 3 //表示成功
    } else if (orderStatus == 'REVIEW' &&
      payStatus == 'SUCCESS') {
      result = 4 //可以继续评价
    }else if (orderStatus == 'CANCEL' &&
      payStatus == 'CLOSED') {
      result = 5 //表示退款或失败
    }
    return result;
  },
  toEnStr: function (orderStatus, payStatus, targetOrderStatus, targetPayStatus) {
    var result = false;
    if (orderStatus == targetOrderStatus &&
      payStatus == targetPayStatus) {
      result = true
    }
    return result;
  }
}

module.exports = {
  toStr: convertor.toStr,
  toEnStr: convertor.toEnStr,
  toStatus: convertor.toStatus
}
