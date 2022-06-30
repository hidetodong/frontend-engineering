export * from "./history";

import { shallowRef, computed,inject } from "vue";
/** 格式化route */
function normalizeRecord(record) {
  return {
    path: record.path,
    components: {
      default: record.component,
      ...(record.components ? record.components : {}),
    },
    children: record.children || [],
    beforeEnter: record.beforeEnter,
    meta: record.meta,
    // ...props name
  };
}

function createRecord(record, parent) {
  const obj = {
    path: parent?.path ? `${parent.path}${record.path}` : record.path,
    record,
    parent,
    children: [],
  };

  if (parent) {
    parent.children.push(obj);
  }

  return obj;
}

function createRouterMatcher(routes) {
  const matchers = [];

  function addRoute(record, parent) {
    // 需要将用户写的record格式化 再存入
    let normalRecord = normalizeRecord(record);

    let newRecord = createRecord(normalRecord, parent);

    for (let i = 0; i < normalRecord.children.length; i++) {
      const child = normalRecord.children[i];
      addRoute(child, newRecord);
    }
    matchers.push(newRecord);
  }

  function addRoutes(routes) {
    routes.forEach((route) => addRoute(route));
  }

  function resolveMatcher(route) {
    let matched = [];
    let matcher = matchers.find((m) => m.path === route.path);

    // 溯源 把当前路径往上所有的节点都找到
    while (matcher) {
      matched.unshift(matcher.record);
      matcher = matcher.parent;
    }

    return {
      path: route.path,
      matched,
    };
  }

  // 初次直接添加一次初始化路由
  addRoutes(routes);

  return {
    resolveMatcher,
    matchers,
    addRoute, // vue中动态路由添加 就是调用这个方法
    addRoutes,
  };
}

// 开始状态
const START_LOCATION_STATE = {
  path: "/",
  matched: [],
  query: {},
  params: {},
};

export function createRouter(options) {
  const { history, routes } = options;
  let ready = false;

  // 根据history模式 获取路径在matchers中匹配 匹配后渲染组件
  const { addRoute, addRoutes, matchers, resolveMatcher } =
    createRouterMatcher(routes);

  let currentRoute = shallowRef(START_LOCATION_STATE);

  if (currentRoute.value === START_LOCATION_STATE) {
    // 用户一加载
    push(history.location); // 根据用户当前的路径做一次匹配操作
    // router link:  :to="/xxx"  :to="{path:'/xxx}"
  }

  let reactiveRoute = {}; // 可以将对象里面的属性全部变成计算属性
  for (let key in START_LOCATION_STATE) {
    reactiveRoute[key] = computed(() => currentRoute.value[key]);
  }

  function resolve(to) {
    if (typeof to === "string") {
      // :to='/xxx'
      to = { path: to };
    }
    // 匹配
    return resolveMatcher(to); // 当前路径是什么 匹配到的结果是什么
  }

  function markReady(){
    if(ready) return
    ready = true

    history.listen((to)=>{

        // 监听用户前进后退 再次发生跳转逻辑
        const targetLocation = resolve(to)
        const from = currentRoute.value
        finalNavigation(targetLocation,from,true)
    })
  }

  function finalNavigation(to, from,replaced = false) {
    if (from === START_LOCATION_STATE || replaced) { //第一次是replace
      history.replace(to.path);
    } else {
      history.push(to.path);
    }
    currentRoute.value = to;

    markReady();
  }

  function push(to) {
    const targetLocation = resolve(to);
    const from = currentRoute.value;

    // 更新currentRoute 这个属性是响应式的

    finalNavigation(targetLocation, from);

    
  }

  // 根据routes生成对应的匹配器 [{path:'/',component}]
  const router = {
    push,
    replace() {},
    install(app) {
      console.log("router -install");

      let router = this;
      app.config.globalProperties.$router = router;

      Object.defineProperty(app.config.globalProperties, "$route", {
        get: () => currentRoute.value,
      });

      // vue3 注册到组件里中，组件通过inject API实现注入
      app.provide("router", router);
      app.provide("route", currentRoute);

      app.component("RouterLink", {
        props: {
          to: {},
        },
        setup(props, { slots }) {
          const router = inject("router");
          const navigate = () => {
            router.push(props.to);
          };

          return () => <a onClick={navigate}>{slots.default()}</a>;
        },
      });


      // 当前路径使用 matched来渲染
      app.component("RouterView", {
        setup(props, { slots }) {
          return () => <div></div>;
        },
      });
    },
  };

  return router;
}
