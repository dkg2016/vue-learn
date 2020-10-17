// 配置、常量
var MAX_UPDATE_COUNT = 100;

var queue = [];
var activatedChildren = [];
var has = {};
var circular = {};
var waiting = false;
var flushing = false;
var index = 0;

var arrayProto = Array.prototype
var arrayMethods = Object.create(arrayProto)

var methodsToPatch = [
    'push',
    'pop',
    'shift',
    'unshift',
    'splice',
    'sort',
    'reverse'
]
methodsToPatch.forEach(function (method) {
    var original = arrayProto[method]

    def(arrayMethods, method, function mutator() {
        var args = [],
            len = arguments.length
        while (len--) {
            args[len] = arguments[len]
        }

        var result = original.apply(this, args)

        var ob = this.__ob__
        var inserted

        switch (method) {
            case 'push':
            case 'unshift':
                inserted = args
                break
            case 'splice':
                inserted = args.splice(2)
                break
        }

        if (inserted) {
            ob.observeArray(inserted)
        }

        ob.dep.notify()
        return result
    })
})

var arrayKeys = Object.getOwnPropertyNames(arrayMethods)

var config = {}
var ASSET_TYPES = [
    'component',
    'directive',
    'filter'
]

var RANGE_TOKEN = '__r';
var CHECKBOX_RADIO_TOKEN = '__c';

var LIFECYCLE_HOOKS = [
    'beforeCreate',
    'created',
    'beforeMount',
    'mounted',
    'beforeUpdate',
    'updated',
    'beforeDestroy',
    'destroyed',
    'activated',
    'deactivated',
    'errorCaptured'
];


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

function mergeHook(
    parentVal,
    childVal
) {
    return childVal ?
        parentVal ?
        parentVal.concat(childVal) :
        Array.isArray(childVal) ?
        childVal : [childVal] :
        parentVal
}
LIFECYCLE_HOOKS.forEach(function (hook) {
    strats[hook] = mergeHook
})

function mergeAssets(
    parentVal,
    childVal,
    vm,
    key
) {
    var res = Object.create(parentVal || null)
    if (childVal) {
        return extend(res, childVal)
    } else {
        return res
    }
}
ASSET_TYPES.forEach(function (type) {
    strats[type + 's'] = mergeAssets;
});

function updateListeners(
    on,
    oldOn,
    add,
    remove$$1,
    vm
) {
    var name, def, cur, old, event;

    for (name in on) {
        def = cur = on[name]
        old = oldOn[name]
        event = normalizeEvent(name)
        if (isUndef(cur)) {

        } else if (isUndef(old)) {
            if (isUndef(cur.fns)) {
                cur = on[name] = createFnInvoker(cur)
            }
            add(event.name, cur, event.once, event.capture, event.passive, event.params)
        } else if (cur !== old) {
            old.fns = cur
            on[name] = old
        }
    }

    for (name in oldOn) {
        if (isUndef(on[name])) {
            event = normalizeEvent(name)
            remove$$1(event.name, oldOn[name], event.capture)
        }
    }
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
        debugger
        var vm = this
        vm._uid = uid$3++
        vm._isVue = true
        // 组件 init
        if (options && options._isComponent) {
            initInternalComponent(vm, options)
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

        callHook(vm, 'created');

        if (vm.$options.el) {
            vm.$mount(vm.$options.el)
        }
    }
}

function initInternalComponent(vm, options) {
    var opts = vm.$options = Object.create(vm.constructor.options)

    var parentVnode = options._parentVnode

    opts.parent = options.parent
    opts._parentVnode = parentVnode

    opts._parentElm = options._parentElm
    opts._refElm = options._refElm

    var vnodeComponentOptions = parentVnode.vnodeComponentOptions
    // opts.propsData = vnodeComponentOptions.propsData;

    // opts._parentListeners = vnodeComponentOptions.listeners;

    // opts._renderChildren = vnodeComponentOptions.children;
    // opts._componentTag = vnodeComponentOptions.tag;
    if (options.render) {
        opts.render = options.render;
        opts.staticRenderFns = options.staticRenderFns;
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

        var prevActiveInstance = activeInstance;
        activeInstance = vm;

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
        activeInstance = prevActiveInstance
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

        vnode.parent = _parentVnode
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

    initExtend(Vue)
    initAssetRegisters(Vue)
}

function initExtend(Vue) {
    Vue.cid = 0
    var cid = 1

    Vue.extend = function (extendOptions) {
        extendOptions = extendOptions || {}

        var Super = this // Vue
        var SuperId = Super.cid

        var cachedCtors = extendOptions._Ctor || (extendOptions._Ctor = {})

        if (cachedCtors[SuperId]) {
            return cachedCtors[SuperId]
        }

        var name = extendOptions.name || Super.options.name

        var Sub = function VueComponent(options) {
            this._init(options)
        }

        Sub.prototype = Object.create(Super.prototype)

        Sub.prototype.constructor = Sub
        Sub.cid = cid++

        Sub.options = mergeOptions(Super.options, extendOptions)

        Sub['super'] = Super

        Sub.extend = Super.extend

        ASSET_TYPES.forEach(function (type) {
            Sub[type] = Super[type]
        })

        if (name) {
            Sub.options.components[name] = Sub
        }

        Sub.superOptions = Super.options
        Sub.extendOptions = extendOptions
        Sub.sealedOptions = extend({}, Sub.options)

        cachedCtors[SuperId] = Sub
        return Sub
    }
}

function initAssetRegisters(Vue) {
    ASSET_TYPES.forEach(function (type) {
        Vue[type] = function (id, definition) {
            if (!definition) {
                return this.options[type + 's'][id]
            } else {
                if (type === 'component' && isPlainObject(definition)) {
                    definition.name = definition.name || id
                    definition = this.options._base.extend(definition)
                }

                if (type === 'directive' && typeof definition === 'function') {
                    definition = {
                        bind: definition,
                        update: definition
                    }
                }

                this.options[type + 's'][id] = definition
                return definition
            }
        }
    })
}

// 

function mergeDataOrFn(parentVal, childVal, vm) {
    // 组件合并时没有 vm
    if (!vm) {
        if (!childVal) {
            return parentVal
        }
        if (!parentVal) {
            return childVal
        }
        return function mergeDataFn() {
            return mergeData(
                typeof childVal === 'function' ? childVal.call(this, this) : childVal,
                typeof parentVal === 'function' ? parentVal.call(this, this) : parentVal
            )
        }
    } else {
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
    
    normalizeProps(child, vm)

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

function normalizeProps(options, vm) {
    var props = options.props
    if (!props) {
        return
    }

    var res = {}
    var i, val, name

    if (Array.isArray(props)) {
        i = props.length
        while (i--) {
            val = props[i]
            if (typeof val === 'string') {
                name = camelize(val)
                res[name] = {type: null}
            }
        }
    } else if (isPlainObject(props)) {
        for (var key in props) {
            val = props[key]
            name = camelize(key)
            res[name] = isPlainObject(val) ? val : {type: val}
        }
    }

    options.props = res
}

var activeInstance = null;

// 是否正在更新子组件
var isUpdatingChildComponent = false;

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

var target

function add(event, fn, once) {
    if (once) {
        target.$once(event, fn)
    } else {
        target.$on(event, fn)
    }
}

function remove$1(event, fn) {
    target.$off(event, fn)
}

function updateComponentListeners(
    vm,
    listeners,
    oldListeners
) {
    target = vm
    updateListeners(listeners, oldListeners || {}, add, remove$1, vm)
    target = undefined
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
    var opts = vm.$options

    if (opts.props) {
        initProps(vm, opts.props)
    }

    // 初始化 data
    if (opts.data) {
        initData(vm)
    }
}

function initProps (vm, propsOptions) {
    var propsData = vm.$options.propsData || {}
    var props = vm._props = {}

    var keys = vm.$options._propKeys = []
    var isRoot = !vm.$parent

    if (!isRoor) {
        toggleObserving(false)
    }

    var loop = function (key) {
        keys.push(key)

        var value = validateProp(key, propsOptions, propsData, vm)
        defineReactive(props, key, value)

        if ((!key in vm)) {
            proxy(vm, "_props", key)
        }
    }

    for (var key in propsOptions) {
        loop(key)
    }
    toggleObserving(true)
}

function initData(vm) {
    var data = vm.$options.data
    data = vm._data = typeof data === 'function' ? getData(data, vm) : data || {}
    var keys = Object.keys(data)
    var i = keys.length

    while (i--) {
        var key = keys[i]
        proxy(vm, "_data", key)
    }

    observe(data, true)
}

function getData(data, vm) {
    try {
        return data.call(vm, vm)
    } catch (e) {
        console.log('初始化data出错')
    }
}

function observe(value, asRootData) {
    if (!isObject(value) || value instanceof VNode) {
        return
    }

    var ob

    if (hasOwn(value, '__ob__') && value.__ob__ instanceof Observer) {
        ob = value.__ob__
    } else if (
        shouldObserve &&
        (Array.isArray(value) || isPlainObject(value)) &&
        Object.isExtensible(value) &&
        !value._isVue
    ) {
        ob = new Observer(value)
    }

    if (asRootData && ob) {
        ob.vmCount++
    }

    return ob
}

var shouldObserve = true

function toggleObserving(value) {
    shouldObserve = value
}

var Observer = function Observer(value) {
    this.value = value
    this.dep = new Dep()
    this.vmCount = 0

    def(value, '__ob__', this)

    if (Array.isArray(value)) {
        var augment = hasProto ?
            protoAugment :
            copyAugment
        augment(value, arrayMethods, arrayKeys)
        this.observeArray(value)
    } else {
        this.walk(value)
    }
}

Observer.prototype.walk = function walk(obj) {
    var keys = Object.keys(obj)
    for (var i = 0; i < keys.length; i++) {
        defineReactive(obj, keys[i])
    }
}

Observer.prototype.observeArray = function observeArray(items) {
    for (var i = 0, l = items.length; i < l; i++) {
        observe(items[i])
    }
}


// ! 执行
initMixin(Vue)
stateMixin(Vue)
eventsMixin(Vue)
lifecycleMixin(Vue)
renderMixin(Vue)
initGlobalAPI(Vue)

function callHook(vm, hook) {
    // console.log(hook)
    // console.log(vm.$options)
    pushTarget()

    var handlers = vm.$options[hook]
    if (handlers) {
        for (var i = 0, j = handlers.length; i < j; i++) {
            try {
                handlers[i].call(vm)
            } catch (e) {
                throw e
            }
        }
    }

    popTarget()
}

Vue.config.isReservedTag = function (tag) {
    return isHTMLTag(tag)
}


var patch = createPatchFunction({
    nodeOps: nodeOps,
    modules: modules
})

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