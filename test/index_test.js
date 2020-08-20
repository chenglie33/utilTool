import {Utiltool, MessageCentre} from '../src/index'
describe("MessageCentre函数 数据驱动器",function(){
  let  bus = new MessageCentre()
  it("开始注册",function(){
    bus.sub('fFn2',{fn: function (x,y) {
      
      return x
    }, context:this, args:[2,1]})
    bus.sub('fFn3',{fn: function (x,y) {
      
      return x
    }, context:this, args:[2,1]})
    bus.sub('fFn',{fn: function (x,y) {
      
      return x
    }, context:this, args:[2,1]})
    bus.pub('fFn',222,111)
    bus.pub('fFn',[2,1])
  });
  it("获取已有的订阅",function(){
    // console.log(bus.getMessageName())
  });
  it("开始销毁",function(){
    bus.removeSub('fFn')
    bus.pub('fFn')
  });
  it("全部销毁",function(){
    // console.log(bus.getMessageName())
    bus.clearMessageCenter()
    // console.log(bus.getMessageName())
  });

});
describe("Utiltool函数",function(){

  it("isEmpty 判断是否为空",function(){
       expect(Utiltool.isEmpty(' ')).to.equal(true)
  });
  it("getUrlparam 获取地址栏参数",function(){
    expect(Utiltool.getUrlparam('param')).to.equal('1')
  });
  it("dateFormat 时间格式化",function(){
    console.log(Utiltool.dateFormat("YYYY-mm-dd HH:MM:SS", new Date()))
  });
  it("accDivCoupon 除法",function(){
    expect(Utiltool.accDivCoupon(100, 2.222)).to.equal(45.004500450045)
  });

});