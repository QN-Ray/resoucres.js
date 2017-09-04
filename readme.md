### 介绍
业务需要，封装的一个页面跳转模块
### 使用

```js
window.pageload.init({
    cacheMap:{
        name:'userName',
        user_id:{
            rename:'userId',
            storage:'session'
        }
    },
    callKeys:{
        // '*':'/default/index.html',
        'id=2':'detail/?id={id}'
    }
});
```

### 开发
npm start //打包
npm test //测试
