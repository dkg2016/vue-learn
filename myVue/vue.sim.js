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
    Vue.prototype._update = function () {

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

    Vue.prototype._render = render()

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

// patch
Vue.prototype.__patch__ = patch
var patch = createPatchFunction()

function createPatchFunction() {}

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
        console.log(vm)
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
    console.log(el)
    if (el === document.body || el === document.documentElement) {
        console.log("Do not mount Vue to <html> or <body> - mount to normal elements instead.")
        return this
    }

    var options = this.$options

    if (!options.render) {

    }

    return mount.call(this, el, hydrating)
}

// let myObj = {
//     data: {
//         name: 'kg'
//     }
// }
let vm = new Vue({
    el: '#one'
})
// console.log(vm)
// console.log(vm)
// console.dir(Vue)