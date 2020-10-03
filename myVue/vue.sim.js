// 配置、常量
var config = {}
var ASSET_TYPES = [
    'component',
    'directive',
    'filter'
]


var defaultStrat = function (parentVal, childVal) {
    return childVal === undefined ?
        parentVal :
        childVal
};
// strats 中有对不同属性的合并方法
var strats = Object.create(null)

// 对 data 的合并
strats.data = function (parentVal, childVal, vm) {
    return mergeDataOrFn(parentVal, childVal, vm)
}


// Vue 构造函数
function Vue(options) {
    this._init(options)
}

// * initMixin
// 首先在 vue 实例上挂载了 _init 方法
// 在 _init 的执行中，会执行一些其它的初始化方法
// initLifecycle
var uid$3 = 0

function initMixin(Vue) {
    Vue.prototype._init = function (options) {
        var vm = this
        vm._uid = uid$3++
        vm._isVue = true

        // 组件 init
        if (options && options._isComponent) {

        } else {
            // 合并配置
            // vm.constructor.options => Vue.options
            vm.$options = mergeOptions(vm.constructor.options, options || {}, vm)
        }

        vm._renderProxy = vm;
        vm._self = vm

        // 初始化生命周期
        initLifecycle(vm)

        // 初始化事件中心
        initEvents(vm)

        // 初始化 _render
        initRender(vm)

        // 初始化数据
        initState(vm)

        if (vm.$options.el) {
            vm.$mount(vm.$options.el)
        }
    }
}

function stateMixin(Vue) {
    var dataDef = {}
    dataDef.get = function () {
        return this._data
    }

    var propsDef = {}
    propsDef.get = function () {
        return this._props
    }

    Object.defineProperty(Vue.prototype, '$data', dataDef)
    Object.defineProperty(Vue.prototype, '$props', propsDef)

    Vue.prototype.$set = set
    Vue.prototype.$delete = del

    Vue.prototype.$watch = function (expOrFn, cb, options) {
        var vm = this
        if (isPlainObject(cb)) {
            return createWatcher(vm, expOrFn, cb, options)
        }

        options = options || {}

        options.user = true
        var watcher = new Watcher(vm, vm, expOrFn, cb, options)
        if (options.immediate) {
            cb.call(vm, watcher.value)
        }
        return function unwatchFn() {
            watcher.teardown()
        }
    }

}

function eventsMixin(Vue) {
    var hookRE = /^hook:/
    Vue.prototype.$on = function (event, fn) {
        var this$1 = this

        var vm = this
        if (Array.isArray(event)) {
            for (var i = 0, l = event.length; i < l; i++) {
                this$1.$on(event[i], fn)
            }
        } else {
            (vm._events[event] || (vm._events[event] = [])).push(fn)
            if (hookRE.test(event)) {
                vm._hasHookEvent = true
            }
        }
        return vm
    }

    Vue.prototype.$once = function (event, fn) {
        var vm = this

        function on() {
            vm.$off(event, on)
            fn.apply(vm, arguments)
        }
        on.fn = fn
        vm.$on(event, on)
        return vm
    }

    Vue.prototype.$off = function (event, fn) {
        var this$1 = this

        var vm = this

        if (!arguments.length) {
            vm._events = Object.create(null)
            return vm
        }

        if (Array.isArray(event)) {
            for (var i = 0, l = event.length; i < l; i++) {
                this$1.$off(event[i], fn)
            }
            return vm
        }

        var cbs = vm._events[event]
        if (!cbs) {
            return vm
        }
        if (!fn) {
            vm._events[event] = null
            return vm
        }

        if (fn) {
            var cb
            var i$1 = cbs.length
            while (i$1--) {
                cb = cbs[i$1]
                if (cb == fn || cb.fn === fn) {
                    cbs.splice(i$1, 1)
                    break
                }
            }
        }
        return vm
    }

    Vue.prototype.$emit = function (event) {
        var vm = this
        var cbs = vm._events[event]

        if (cbs) {
            cbs = cbs.length > 1 ? toArray(cbs) : cbs
            var args = toArray(arguments, 1)

            for (var i = 0, l = cbs.length; i < l; i++) {
                try {
                    chs[i].apply(vm, args)
                } catch (e) {
                    console.log('$emit 出错')
                }
            }
        }
        return vm
    }

}

function lifecycleMixin(Vue) {
    Vue.prototype._update = function (vnode, hydrating) {
        var vm = this
        if (vm._isMounted) {
            callHook(vm, 'beforeUpdate')
        }

        var prevEl = vm.$el

        var prevVnode = vm._vnode

        vm._vnode = vnode
        if (!prevVnode) {
            vm.$el = vm.__patch__(
                vm.$el, vnode, hydrating, false,
                vm.$options._parentElm,
                vm.$options._refElm
            )
        } else {
            vm.$el = vm.__patch__(prevVnode, vnode)
        }
    }

    Vue.prototype.$forceUpdate = function () {

    }

    Vue.prototype.$destroy = function () {

    }
}

function renderMixin(Vue) {
    installRenderHelpers(Vue.prototype)

    Vue.prototype.$nextTick = function (fn) {
        return nextTick(fn, this)
    }

    Vue.prototype._render = function () {
        var vm = this
        var ref = vm.$options

        var render = ref.render
        var _parentVnode = ref._parentVnode

        if (_parentVnode) {
            vm.$scopedSlots = _parentVnode.data.scopedSlots || emptyObject
        }

        vm.$vnode = _parentVnode

        var vnode

        try {
            vnode = render.call(vm._renderProxy, vm.$createElement)
        } catch (e) {
            console.log(e)
        }
        return vnode
    }

}

function installRenderHelpers(target) {

}

// 给 Vue 这个对象本身扩展全局的静态方法
function initGlobalAPI(Vue) {
    var configDef = {}
    configDef.get = function () {
        return config
    }
    Object.defineProperty(Vue, 'config', configDef)

    Vue.util = {
        extend,
        mergeOptions,
        defineReactive
    }

    Vue.set = set
    Vue.delete = del
    Vue.nextTick = nextTick

    Vue.options = Object.create(null)
    ASSET_TYPES.forEach(function (type) {
        Vue.options[type + 's'] = Object.create(null)
    })
    Vue.options._base = Vue
}


// 

function mergeDataOrFn(parentVal, childVal, vm) {
    if (vm) {
        return function mergedInstanceDataFn() {
            var instanceData = typeof childVal === 'function' ? childVal.call(vm, vm) : childVal
            var defaultData = typeof parentVal === 'function' ? parentVal.call(vm, vm) : parentVal
            if (instanceData) {
                return mergeData(instanceData, defaultData)
            } else {
                return defaultData
            }
        }
    }
}

function mergeData(to, from) {
    if (!from) {
        return to
    }
    var key, toVal, fromVal
    var keys = Object.keys(from)
    for (var i = 0; i < keys.length; i++) {
        key = keys[i]
        toVal = to[key]
        fromVal = from[key]

        if (!hasOwn(to, key)) {
            set(to, key, fromVal)
        }
    }
    return to
}

function mergeOptions(parent = {}, child, vm) {
    var options = {}
    var key

    for (key in parent) {
        mergeField(key)
    }
    for (key in child) {
        if (!hasOwn(parent, key)) {
            mergeField(key)
        }
    }

    function mergeField(key) {
        var strat = strats[key] || defaultStrat
        options[key] = strat(parent[key], child[key], vm, key)
    }
    return options
}

function initLifecycle(vm) {
    var options = vm.$options

    var parent = options.parent

    vm.$parent = parent
    vm.$root = parent ? parent.$root : vm

    vm.$children = []
    vm.$refs = {}

    vm._watcher = null
    vm._inactive = null
    vm._directInactive = false
    vm._isMounted = false
    vm._isDestroyed = false
    vm._isBeingDestroyed = false
}

function initEvents(vm) {
    vm._events = Object.create(null)
    vm._hasHookEvent = false

    var listeners = vm.$options._parentListeners
    if (listeners) {
        updataComponentListeners(vm, listeners)
    }
}

function initRender(vm) {
    vm._vnode = null
    vm._staticTrees = null
    
    var options = vm.$options


    //...

    vm.$createElement = function (a, b, c, d) {
        return createElement(vm, a, b, c, d, true)
    }
}

function initState(vm) {
    vm._watchers = []
}


// ! 执行
initMixin(Vue)
stateMixin(Vue)
eventsMixin(Vue)
lifecycleMixin(Vue)
renderMixin(Vue)
initGlobalAPI(Vue)

function callHook() {

}

Vue.config.isReservedTag = function (tag) {
    return isHTMLTag(tag)
}

// patch
var nodeOps = Object.freeze({
    createElement: function (tagName, vnode) {
        var elm = document.createElement(tagName)
        if (tagName !== 'select') {
            return elm
        }
    },

    appendChild: function (node, child) {
        node.appendChild(child)
    },

    createTextNode: function (text) {
        return document.createTextNode(text)
    },

    tagName: function (node) {
        return node.tagName
    },

    parentNode: function (node) {
        return node.parentNode
    },

    nextSibling: function (node) {
        return node.nextSibling
    }
})

var modules = [
    // attrs,
    // klass,
    // events,
    // domProps,
    // style,
    // transition,
    // ref,
    // directives
]


var patch = createPatchFunction({nodeOps: nodeOps, modules: modules})

Vue.prototype.__patch__ = patch

// mount
function mountComponent(
    vm,
    el,
    hydrating
) {
    // DOM
    vm.$el = el

    if (!vm.$options.render) {

    }

    callHook(vm, 'beforeMount')

    var updateComponent = function () {
        vm._update(vm._render(), hydrating)
    }

    new Watcher(vm, updateComponent, noop, null, true)

    hydrating = false

    if (vm.$vnode == null) {
        vm._isMounted = true
        callHook(vm, 'mounted')
    }

    return vm
}

Vue.prototype.$mount = function (el, hydrating) {
    el = el && inBrowser ? query(el) : undefined
    return mountComponent(this, el, hydrating)
}

var mount = Vue.prototype.$mount
Vue.prototype.$mount = function (el, hydrating) {
    el = el && query(el)
    if (el === document.body || el === document.documentElement) {
        console.log("Do not mount Vue to <html> or <body> - mount to normal elements instead.")
        return this
    }

    var options = this.$options

    if (!options.render) {

    }

    return mount.call(this, el, hydrating)
}