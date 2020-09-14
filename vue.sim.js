// 辅助函数
function hasOwn(obj, key) {
    return Object.prototype.hasOwnProperty.call(obj, key)
}

// Vue 构造函数
function Vue(options) {
    this._init(options)
}

// * initMixin
var uid$3 = 0

function initMixin(Vue) {
    Vue.prototype._init = function (options) {
        var vm = this
        vm._uid = uid$3++
        vm._isVue = true

        // 组件 init
        if (options && options._isComponent) {

        } else {
            vm.$options = mergeOptions(vm.constructor.options, options || {}, vm)
        }

        vm._renderProxy = vm;
    }
}

var strats = Object.create(null)

// 对 data 的合并
strats.data = function (parentVal, childVal, vm) {
    return mergeDataOrFn(parentVal, childVal, vm)
}

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


function mergeOptions(parent, child, vm) {
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



// ? 执行
initMixin(Vue)
let vm = new Vue({data: {a:1}})
console.dir(Vue)