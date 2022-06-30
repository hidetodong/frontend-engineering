export * from "./history";
import { shallowRef, computed, inject, provide, Fragment, h } from "vue";
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

  function useCallback() {
    const handlers = [];
    const add = (callback) => handlers.push(callback);
    return {
      list: () => handlers,
      add,
    };
  }

  const beforeGuards = useCallback();
  const beforeResolveGuards = useCallback();
  const afterEachGuards = useCallback();

  function resolve(to) {
    if (typeof to === "string") {
      // :to='/xxx'
      to = { path: to };
    }
    // 匹配
    return resolveMatcher(to); // 当前路径是什么 匹配到的结果是什么
  }

  function markReady() {
    if (ready) return;
    ready = true;

    history.listen((to) => {
      // 监听用户前进后退 再次发生跳转逻辑
      const targetLocation = resolve(to);
      const from = currentRoute.value;
      finalNavigation(targetLocation, from, true);
    });
  }

  function extractRecords(to, from) {
    const leavingRecords = [];
    const updatingRecords = [];
    const enteringRecords = [];

    let len = Math.max(to.matched.length, from.matched.length);

    for (let i = 0; i < len; i++) {
      let fromMatched = from.matched[i];
      let toMatched = to.matched[i];

      if (fromMatched) {
        // 1) 可能是更新 来的和去的一样 说明要更新
        // 2）来的和去的不一样 说明要离开

        if (to.matched.find((record) => record.path === fromMatched.path)) {
          updatingRecords.push(fromMatched);
        } else {
          leavingRecords.push(fromMatched);
        }
      }

      if (toMatched) {
        if (!from.matched.find((record) => record.path === toMatched.path)) {
          enteringRecords.push(toMatched);
        }
      }
    }

    return [leavingRecords, updatingRecords, enteringRecords];
  }

  // 把用户传的函数包装成promise
  function guardToPromise(guard,to,from) {
    return ()=> new Promise((resolve,reject)=>{
        const next = ()=> resolve()
        // 用户可以主动调用next向下执行 
        // 也可以等待钩子执行完毕后，自动往下走
        return Promise.resolve(guard(to,from,next)).then(next);
    })
  }

  function extractComponentGuards(records, guardType, to, from) {
    const guards = []
    for(let i = 0; i < records.length;i++){
        let Comp = records[i].components.default
        let guard =  Comp[guardType];
        guard && guards.push(guardToPromise(guard,to,from))
    }
    return guards;
  }

  function runQueue(guards){ // 让promise链在一起
    return guards.reduce((p,guard)=>{
        return p.then(()=> guard())
    },Promise.resolve())
  }

  function navigateBefore(to, from) {
    // 收集离开的钩子 和 更新的钩子，进入的钩子
    let [leavingRecords, updatingRecords, enteringRecords] = extractRecords(
      to,
      from
    );

    leavingRecords = leavingRecords.reverse();


    // promise数组
    let leaveGuards = extractComponentGuards(leavingRecords, "beforeRouteLeave", to, from);

    return runQueue(leaveGuards).then(()=>{
        let guards = []
        for(let guard of beforeGuards.list()) {
            guards.push(guardToPromise(guard,to,from))
        };
        return runQueue(guards)
    }).then(()=>{
        let updateRecords = extractComponentGuards(updatingRecords,'beforeRouteUpdate',to,from);
        return runQueue(updateRecords)
    }).then(()=>{
        let guards = []
        to.matched.forEach(record=> {
            if(record.beforeEnter){
                guards.push(guardToPromise(record.beforeEnter,to,from))
            }
        });
        return runQueue(guards)
    }).then(()=>{
        let enterRecords = extractComponentGuards(enteringRecords,'beforeRouteEnter',to,from);
        return runQueue(enterRecords)
    })  

  }

  function finalNavigation(to, from, replaced = false) {
    if (from === START_LOCATION_STATE || replaced) {
      //第一次是replace
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
    // 先走钩子 再走跳转
    navigateBefore(targetLocation, from)
      .then(() => {
        return finalNavigation(targetLocation, from);
      })
      .then(() => {
        //afterEach
        for (let guard of afterEachGuards.list()) {
          guard(to, from);
        }
      });
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

      // router-view 有两层
      // router-view 0
      // - router-view 1
      // 当前路径使用 matched来渲染 ['/','/a']
      app.component("RouterView", {
        setup(props, { slots }) {
          const depth = inject("depth", 0);
          provide("depth", depth + 1);

          const currentRoute = inject("route");
          const computedRecord = computed(
            () => currentRoute.value.matched[depth]
          );

          return () => {
            let record = computedRecord.value;

            const Comp = record?.components.default;

            if (!Comp) {
              return h(Fragment, []);
            }
            return h(Comp);
          };
        },
      });
    },
    beforeEach: beforeGuards.add,
    beforeResolve: beforeResolveGuards.add,
    afterEach: afterEachGuards.add,
  };

  return router;
}

// beforeRouteLeave
// beforeEach
// beforeRouteUpdate

// beforeEnter
// beforeRouteEnter
// beforeResolve
// afterEach
