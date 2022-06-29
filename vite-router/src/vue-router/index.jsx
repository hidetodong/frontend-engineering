export * from "./history";

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

function createRecord(record,parent) {
    const obj = {
        path:parent?.path ? `${parent.path}${record.path}`:record.path,
        record,
        parent,
        children:[],
    }

    console.log('obj',obj.path)

    if (parent) {
      parent.children.push(obj)
    }

    return obj
}

function createRouterMatcher(routes) {
  const matchers = [];

  function addRoute(record, parent) {
    // 需要将用户写的record格式化 再存入
    let normalRecord = normalizeRecord(record);

    let newRecord = createRecord(normalRecord,parent)
  
    for (let i = 0; i < normalRecord.children.length; i++) {
      const child = normalRecord.children[i];
      addRoute(child, newRecord);
    }
    matchers.push(newRecord)
  }

  function addRoutes(routes){
      routes.forEach((route) => addRoute(route));
  }

  addRoutes(routes)


  return {
    addRoute, // vue中动态路由添加 就是调用这个方法
    addRoutes
  }
}

export function createRouter(options) {
  const { history, routes } = options;

  createRouterMatcher(routes);

  // 根据routes生成对应的匹配器 [{path:'/',component}]
  const router = {
    install(app) {
      console.log("router -install");
      app.component("RouterLink", {
        setup(props, { slots }) {
          return () => <a>{slots.default()}</a>;
        },
      });

      app.component("RouterView", {
        setup(props, { slots }) {
          return () => <div></div>;
        },
      });
    },
  };

  return router;
}
