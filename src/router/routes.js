
// 路由配置信息
export default [
    {
        path: '/center',
        component: () => import('@/pages/Center'),
        // 路由元信息key不能瞎写：只能叫meta
        meta: { show: true },
        // 二级路由
        children: [
            {
                path: 'myorder',
                component: () => import('@/pages/Center/myOrder'),
            },
            {
                path: 'grouporder',
                component: () => import('@/pages/Center/groupOrder'),
            },
            {
                path: '/center',
                redirect: '/center/myorder'
            }
        ]
    },
    {
        path: '/paysuccess',
        component: () => import('@/pages/PaySuccess'),
        // 路由元信息key不能瞎写：只能叫meta
        meta: { show: true }
    },
    {
        path: '/pay',
        component: () => import('@/pages/Pay'),
        // 路由元信息key不能瞎写：只能叫meta
        meta: { show: true },
        beforeEnter: (to, from, next) => {
            if (from.path == '/trade') {
                next();
            } else (false);
        }
    },
    {
        path: '/trade',
        component: () => import('@/pages/Trade'),
        // 路由元信息key不能瞎写：只能叫meta
        meta: { show: true },
        // 路由独享守卫
        beforeEnter: (to, from, next) => {
            // 去交易页面，必须是购物车而来
            if (from.path == '/shopcart') {
                next();
            } else {
                // 其他的路由组件而来，停留在当前
                next(false)
            }
        }
    },
    {
        path: '/shopcart',
        component: () => import('@/pages/ShopCart'),
        // 路由元信息key不能瞎写：只能叫meta
        meta: { show: true }
    },
    {
        path: '/addcartsuccess',
        name: 'addcartsuccess',
        component: () => import("@/pages/AddCartSuccess"),
        // 路由元信息key不能瞎写：只能叫meta
        meta: { show: true }
    },
    {
        path: '/detail/:skuid',
        component: () => import("@/pages/Detail"),
        // 路由元信息key不能瞎写：只能叫meta
        meta: { show: true }
    },
    {
        path: '/home',
        component: () => import("@/pages/Home"),
        meta: { show: true }
    },
    {
        path: '/search/:keyword?',
        component: () => import('@/pages/Search'),
        meta: { show: true },
        name: 'search',
        // 路由组件能不能传递props数据？
        // 布尔值写法:params
        // props: true,
        // props: { a: 1, b: 2 }
        // 函数写法：可以params参数、query参数，通过props传递给路由组件
        props: ($route) => ({ keyword: $route.params.keyword, k: $route.query.k })

    },
    {
        path: '/login',
        component: () => import('@/pages/Login'),
        meta: { show: false }
    },
    {
        path: '/register',
        component: () => import('@/pages/Register'),
        meta: { show: false }
    },
    // 重定向，在项目跑起来的时候，访问/,立马让他定向到首页
    {
        path: '*',
        redirect: '/home'
    },
]