// 1.vue-router 让路由具备响应式，路径变了更新视图
// 2.路由的核心 我们要自己维护路径的功能，要维护跳转的状态 replace push 状态信息
// 3.可以注入监听方法
function createCurrentLocation(base = '') {
    let { pathname, search, hash } = location;

    if (base.startsWith('#')) { // # => /
        return hash.slice(1) || '/'
    }


    return pathname + search + hash
}

function buildState(back, current, forward, replaced = false, computedScroll = false) {
    return {
        back,
        current,
        forward,
        replaced,
        scroll: computedScroll ? { left: window.pageXOffset, top: window.pageYOffset } : null
    }
}

function useHistoryStateNavigation(base) {
    // 用对象 方便修改引用传参
    const currentLocation = {
        value: createCurrentLocation(base)
    }

    const currentState = {
        value: history.state
    }

    function changeLocation(to, state, replaced) {
        history[replaced ? 'replaceState' : 'pushState'](state, '', base + to)
        currentLocation.value = to
        currentState.value = state
    }

    function push(to, data) {
        // 做push的时候 要有两个状态 跳转前 跳转后
        const state1 = {
            ...currentState.value,
            ...{
                forward: to,
                scroll: { left: window.pageXOffset, top: window.pageYOffset }
            }
        }

        changeLocation(currentLocation.value, state1, true)

        let state2 = {
            ...buildState(currentLocation.value, to, null),
            ...data
        }

        changeLocation(to, state2, false)
    }

    function replace(to, data) {
        // 构建一个全新状态 替换路径
        let state = {
            ...buildState(
                currentState.value.back,
                to,
                currentState.value.forward,
                true,
            ),
            ...data
        }
        changeLocation(to, state, true)
    }



    if (!currentState.value) {
        changeLocation(currentLocation.value, buildState(null, currentLocation.value, null, true, false), true)
    }

    console.log('currentLocation,currentState,history.state', currentLocation, currentState, history.state)

    return {
        location: currentLocation,
        state: currentState,
        push,
        replace
    }
}

function useHistoryListener(currentLocation, currentState) {
    let listeners = [];
    function listen(callback) {
        listeners.push(callback)
    }

    window.addEventListener('popstate', (state) => {
        const from = currentLocation.value;
        currentLocation.value = createCurrentLocation();
        currentState.value = state

        listeners.forEach((listener) => { listener(currentLocation.value, from, state) })
    })

    return {
        listen
    }
}

export function createWebHistory(base) {
    // 1.实现维护路径和状态
    const historyNavigation = useHistoryStateNavigation(base)
    // 2.监听前进后退事件
    const historyListener = useHistoryListener(historyNavigation.location, historyNavigation.state);

    const routerHistory = {
        ...historyNavigation,
        ...historyListener
    }

    Object.defineProperty(routerHistory, 'location', {
        get: () => historyNavigation.location.value
    })

    Object.defineProperty(routerHistory, 'state', {
        get: () => historyNavigation.state.value
    })

    return routerHistory
}