// 配置路由的地方
import Vue from 'vue'
import VueRouter from 'vue-router'
import routes from './routes'
// 使用插件
Vue.use(VueRouter);
// 引入store
import store from '@/store'

// 先把VueRouter原型对象的push，先保存一份
let originPush = VueRouter.prototype.push;
let originReplace = VueRouter.prototype.replace;

// 重写push|replace
// 第一个参数：告诉原来push方法，你往哪里跳转（传递哪些参数）
// 第二个参数：成功的回调
// 第三个参数：失败的回调
// call||apply区别
// 相同点，都可以调用函数一次，都可以篡改函数的上下文一次
// 不同点：call与apply传递参数：call传递参数用逗号隔开，apply方法执行，传递数组

// 重写VueRouter.prototype身上的push方法了
VueRouter.prototype.push = function (location, resolve, reject) {
    if (resolve && reject) {
        originPush.call(this, location, resolve, reject);
    } else {
        originPush.call(this, location, () => { }, () => { });
    }
};
//重写VueRouter.prototype身上的replace方法了 
VueRouter.prototype.replace = function (location, resole, reject) {
    if (resole && reject) {
        originReplace.call(this, location, resole, reject);
    } else {
        originReplace.call(this, location, () => { }, () => { })
    }
};
// 配置路由 对外暴露VueRouter类的实例
let router = new VueRouter({
    // 第一：路径的前面需要有/（不是二级路由）
    // 路径中单词都是小写
    // component右侧v别给加单引号【字符串：组件时对象（vueComponen类的实例）】
    routes,
    // 滚动行为
    scrollBehavior(to, from, savedPosition) {
        return { y: 0 }
    }
});

// 全局守卫：前置守卫（再路由跳转之间进行判断）
router.beforeEach(async (to, from, next) => {
    // to:获取到要跳转到的路由信息
    // from: 获取到从哪个路由跳转过来的信息
    // next: next() 放行  next(/home) 指定放行
    // next();
    // 用户登录了，才会有token，未登录一定不会有token
    let token = store.state.user.token;
    // 用户信息
    let name = store.state.user.userInfo.name;
    // 用户已经登录了
    if (token) {
        // 用户已经登录了 还想去login[不能去，停留再首页]
        if (to.path == '/login' || to.path == '/register') {
            next('/home')
        } else {
            // 登录，去的不是login【home|search|detail|shopcart】
            // 登录了且拥有用户信息放行
            if (name) {
                next();
            } else {
                // 登录了且没有用户信息，派发action让仓库存储用户信息再跳转
                // 再路由跳转之前获取用户信息且放行
                try {
                    // 获取用户信息成功
                    await store.dispatch('getUserInfo');
                    next();
                } catch (error) {
                    //  token失效了获取不到用户信息，重新登录
                    // 清除token
                    await store.dispatch('userLogout')
                    next('/login')
                }
            }
        }

    } else {
        // 未登录：不能去交易相关、不能去支付相关【pay|paysuccess】、不能去个人中心
        // 未登录去上面这些路由-----登录
        let toPath = to.path;
        if (toPath.indexOf('/trade') != -1 || toPath.indexOf('/pay') != -1 || toPath.indexOf('/center') != -1) {
            next('/login?redirect='+toPath)
        } else {
            // 去的不是上面这些路由（home|search|shopCart）---放行
            next();
        }


    }
});

export default router;