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


function nextTick(cb, ctx) {

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
            // vm.constructor.options => Vue.options
            vm.$options = mergeOptions(vm.constructor.options, options || {}, vm)
        }

        vm._renderProxy = vm;
        vm._self = vm

        initLifecycle(vm)

        initEvents(vm)
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
        return function unwatchFn () {
            watcher.teardown()
        }
    }

}

function eventsMixin(Vue) {
    var hookRE = /^hook:/
    Vue.prototype.$on = function (event, fn) {

    }

    Vue.prototype.$once = function (event, fn) {

    }

    Vue.prototype.$off = function (event, fn) {

    }

    Vue.prototype.$emit = function (event) {

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

    Vue.prototype.$nextTick = function () {

    }

    Vue.prototype._render = function () {

    }

}

function installRenderHelpers(target) {

}

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
    console.log(435)
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

// 
function createWatcher () {

}

// Watcher
var uid$1 = 0;

var Watcher = function Watcher (
    vm,
    expOrFn,
    cb,
    options,
    isRenderWatcher
) {
    this.vm = vm
    if (isRenderWatcher) {
        vm._watcher = this
    }
    vm._watchers.push(this)

    if (options) {
        this.deep = !!options.deep
        this.user = !!options.user
        this.lazy = !!options.lazy
        this.sync = !!options.sync
    } else {
        this.deep = this.user = this.lazy = this.sync = false;
    }

    this.cb = cb
    this.id = ++uid$1
    this.active = true
    this.dirty = this.lazy

    this.deps = []
    this.newDeps = []
    
    this.depIds = new _Set()
    this.newDepIds = new _Set()

    this.expression = expOrFn.toString()

    if (typeof expOrFn === 'function') {
        this.getter = expOrFn
    } else {
        this.getter = parsePath(expOrFn)
        if (!this.getter) {
            this.getter = function () {}
        }
    }

    this.value = this.lazy ? undefined : this.get()
}

Watcher.prototype.get = function () {}

function createWatcher () {}


// ! 执行
initMixin(Vue)
stateMixin(Vue)
eventsMixin(Vue)
lifecycleMixin(Vue)
renderMixin(Vue)
initGlobalAPI(Vue)
// let myObj = {
//     data: {
//         name: 'kg'
//     }
// }
// let vm = new Vue()
// console.log(vm)
console.dir(Vue)