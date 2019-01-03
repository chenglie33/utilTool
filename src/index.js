// 实现Symbol Promise的pub/sub的事件驱动
// import '@babel/polyfill';
var MessageCentre = function () {
  this.messageArr = new Map();
  this.sub = function (name, { fn, context, args }) {
    let flexContex = Array.prototype.slice.call(arguments, 1)[0]
    flexContex.once = false
    let fnArr = this.messageArr.get(name) || [];
    fnArr.push(flexContex)
    this.messageArr.set(name, fnArr);
  }
  /**
   *执行驱动中的指定函数
   */
  this.pub = function (name) {
    let fnArr = this.messageArr.get(name) || [];
    let newFnArr = fnArr.filter((item, index) => {
      let fn = item.fn; let context = item.context; let args = item.args; let once = item.once
      fn.apply(context, args);
      if (!once) { return item }
    })
    this.messageArr.set(name, newFnArr);
  }
  /**
   *只存储一次驱动 一次性驱动
   */
  this.subOnce = function (name, { fn, context, args }) {
    let flexContex = Array.prototype.slice.call(arguments, 1)[0]
    flexContex.once = true
    let fnArr = this.messageArr.get(name) || [];
    fnArr.push(flexContex);
    this.messageArr.set(name, fnArr);
  }
  /**
   *清空指定sub
   */
  this.removeSub = function (name) {
    let fnArr = this.messageArr.get(name) || [];
    fnArr = [];
    this.messageArr.set(name, fnArr);
  }

  this.clearMessageCenter = function () {
    this.messageArr.clear();
  }
  /**
     *获取注册中心中已注册的驱动名称
     */
  this.getMessageName = function () {
    let key = this.messageArr.keys();
    let nameArr = [];
    for (let name of key) {
      nameArr.push(name)
    };
    return nameArr
  }
}

export {
  MessageCentre
};
