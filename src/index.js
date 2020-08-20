// 实现Symbol Promise的pub/sub的事件驱动  所有的驱动执行完成后执行promise
// import '@babel/polyfill';
// import axios from 'axios'
export const MessageCentre = function () {
  this.messageArr = new Map();
  this.globalMessage = new Map();
  this.sub = async function (name, { fn, context }) {
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
  this.pub = function (name) {
    const args = Array.prototype.slice.call(arguments, 1)
    let fnArr = this.messageArr.get(name) || [];
    let newFnArr = fnArr.filter((item, index) => {
      let fn = item.fn; let context = item.context; let once = item.once
      fn.apply(context, args);
      if (!once) { return item }
    })
    this.messageArr.set(name, newFnArr);
  }
  /**
     *执行驱动中的指定函数 异步执行
     */
  this.pubAsync = async function (name) {
    const args = Array.prototype.slice.call(arguments, 1)
    let p = new Promise((resolve, reject) => {
      let fnArr = this.messageArr.get(name) || [];
      let newFnArr = fnArr.filter((item, index) => {
        let fn = item.fn; let context = item.context; let once = item.once
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

export class Utiltool {
  /**
     * 判断是否为空 空返回为false（去除空格）
     * @param data
     * @returns {boolean}
     */
  static isEmpty (data) {
    let str = /\s+/g;
    if (!data || data === '' || typeof data === 'undefined' || data === null) {
      return true
    }
    let datas = String(data).replace(str, '');
    if (datas === '') return true
    return false;
  }

  /**
     * 获取地址栏的参数信息
     * @param name
     * @returns {*}
     */
  static getUrlparam (name) {
    const search = location.search;
    var value;
    if (search) {
      search.slice(1).split('&').some((fragment) => {
        const arr = fragment.split('=');
        if (arr[0] === name) {
          value = arr[1];
          return true;
        }
      });
    }
    return value;
  }
  /**
   * 时间格式化
   * @param {*} fmt
   * @param {*} date
   */
  static dateFormat (fmt, date) {
    let ret;
    const opt = {
      'Y+': date.getFullYear().toString(), // 年
      'm+': (date.getMonth() + 1).toString(), // 月
      'd+': date.getDate().toString(), // 日
      'H+': date.getHours().toString(), // 时
      'M+': date.getMinutes().toString(), // 分
      'S+': date.getSeconds().toString() // 秒
    };
    for (let k in opt) {
      ret = new RegExp('(' + k + ')').exec(fmt);
      if (ret) {
        fmt = fmt.replace(ret[1], (ret[1].length === 1) ? (opt[k]) : (opt[k].padStart(ret[1].length, '0')))
      };
    };
    return fmt;
  }
  /**
   * 加
   * @param {*} arg1
   * @param {*} arg2
   */
  static accAdd (arg1, arg2) {
    var r1, r2, m;
    try { r1 = arg1.toString().split('.')[1].length } catch (e) { r1 = 0 };
    try { r2 = arg2.toString().split('.')[1].length } catch (e) { r2 = 0 };
    m = Math.pow(10, Math.max(r1, r2));
    return (arg1 * m + arg2 * m) / m;
  }
  /**
   * 减
   * @param {*} arg1
   * @param {*} arg2
   */
  static accSubtr (arg1, arg2) {
    var r1, r2, m, n;
    try { r1 = arg1.toString().split('.')[1].length; } catch (e) { r1 = 0; }
    try { r2 = arg2.toString().split('.')[1].length; } catch (e) { r2 = 0; }
    m = Math.pow(10, Math.max(r1, r2));
    // 动态控制精度长度
    n = (r1 >= r2) ? r1 : r2;
    return ((arg1 * m - arg2 * m) / m).toFixed(n);
  }
  /**
   * 乘
   * @param {*} arg1
   * @param {*} arg2
   */
  static accMul (arg1, arg2) {
    var m = 0; var s1 = arg1.toString(); var s2 = arg2.toString();
    try { m += s1.split('.')[1].length } catch (e) {};
    try { m += s2.split('.')[1].length } catch (e) {};
    return Number(s1.replace('.', '')) * Number(s2.replace('.', '')) / Math.pow(10, m);
  }
  /**
   * 除
   * @param {*} arg1
   * @param {*} arg2
   */
  static accDivCoupon (arg1, arg2) {
    var t1 = 0; var t2 = 0; var r1; var r2;
    try { t1 = arg1.toString().split('.')[1].length } catch (e) {}
    try { t2 = arg2.toString().split('.')[1].length } catch (e) {}

    r1 = Number(arg1.toString().replace('.', ''));

    r2 = Number(arg2.toString().replace('.', ''));
    return (r1 / r2) * Math.pow(10, t2 - t1);
  }
}
