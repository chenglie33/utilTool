// 实现Symbol Promise的pub/sub的事件驱动  所有的驱动执行完成后执行promise
// import '@babel/polyfill';
// import axios from 'axios'
var MessageCentre = function () {
  this.messageArr = new Map();
  this.globalMessage = new Map();
  this.sub = async function (name, { fn, context, args }) {
    let flexContex = Array.prototype.slice.call(arguments, 1)[0]
    let p = await new Promise((resolve, reject) => {
      flexContex.once = false
      let fnArr = this.messageArr.get(name) || [];
      fnArr.push(flexContex)
      this.messageArr.set(name, fnArr);
      resolve();
    });

    return p
  }
  /**
   *执行驱动中的指定函数 同步执行
   */
  this.pub = async function (name) {
    let p = await new Promise((resolve, reject) => {
      let fnArr = this.messageArr.get(name) || [];
      let newFnArr = fnArr.filter((item, index) => {
        let fn = item.fn; let context = item.context; let args = item.args; let once = item.once
        fn.apply(context, args);
        if (!once) { return item }
      })
      this.messageArr.set(name, newFnArr);
      resolve();
    })
    return p
  }
  /**
     *执行驱动中的指定函数 异步执行
     */
  this.pubasync = async function (name) {
    let p = new Promise((resolve, reject) => {
      let fnArr = this.messageArr.get(name) || [];
      let newFnArr = fnArr.filter((item, index) => {
        let fn = item.fn; let context = item.context; let args = item.args; let once = item.once
        fn.apply(context, args);
        if (!once) { return item }
      })
      this.messageArr.set(name, newFnArr);
      resolve();
    })
    return p
  }
  /**
   *只存储一次驱动 一次性驱动
   */
  this.subOnce = async function (name, { fn, context, args }) {
    let flexContex = Array.prototype.slice.call(arguments, 1)[0];
    let p = await new Promise((resolve, reject) => {
      flexContex.once = true
      let fnArr = this.messageArr.get(name) || [];
      fnArr.push(flexContex);
      this.messageArr.set(name, fnArr);
      resolve()
    });
    return p;
  }
  /**
   *清空指定sub
   */
  this.removeSub = async function (name) {
    let p = await new Promise((resolve, reject) => {
      let fnArr = this.messageArr.get(name) || [];
      fnArr = [];
      this.messageArr.set(name, fnArr);
      resolve()
    })
    return p;
  }

  this.clearMessageCenter = async function () {
    let p = await new Promise((resolve, reject) => {
      this.messageArr.clear();
      resolve()
    })
    return p;
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

  this.setGlobal = function (name, value) {
    let sname = Symbol(name);
    this.globalMessage.set(sname, value);
    return sname
  }

  this.getGlobal = function (name) {
    return this.globalMessage.get(name) || ''
  }
}

class Utiltool {
  /**
     * 判断是否为空 空返回为false（去除空格）
     * @param data
     * @returns {boolean}
     */
  static isEmpty (data) {
    let str = /\s+/g;
    if (!data || data === '' || data === undefined || data === null) {
      return false
    }
    let datas = data.replace(str, '');
    if (datas === '') return false
    return true;
  }
}

export {
  MessageCentre, Utiltool
};
