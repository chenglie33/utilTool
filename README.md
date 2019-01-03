# utilTool
集成常用的方法驱动<br/>
引入方式<br/>
``` bash
    npm i utiltool-pubsub --S
    import {MessageCenter} from 'utiltool-pubsub'
```
####目录

####订阅发布驱动
首先实例化参数 new MessageCenter（）<br/>
API<br>
``` bash
    |--sub() 注册驱动方法
    |   |-name 注册的名称 
    |   |-{ fn, context, args } 注册的方法 上下文 参数
    |--subOnce（） 注册驱动方法 在第一次执行以后将会被注销
    |--removeSub（） 删除指定的驱动名称
    |   |-name 注册的名称
    |--clearMessageCenter（） 注销所有的驱动
    |--getMessageName（） 获取注册的所有的驱动名称
    |
      
```


