var emptyObject = Object.freeze({});

// 判断有无某个自有属性
function hasOwn(obj, key) {
    return Object.prototype.hasOwnProperty.call(obj, key)
}

function remove(arr, item) {
    if (arr.length) {
        var index = arr.indexOf(item)
        if (index > -1) {
            return arr.splice(index, 1)
        }
    }
}

// 
function isValidArrayIndex(val) {
    var n = parseFloat(String(val))
    return n >= 0 && Math.floor(n) === n && isFinite(val)
}

function isObject(obj) {
    return obj !== null && typeof obj === 'object'
}

function isPlainObject(obj) {
    return Object.prototype.toString.call(obj) === '[object Object]'
}

function isNative(Ctor) {
    return typeof Ctor === 'function' && /native code/.test(Ctor.toString())
}

function toArray(list, start) {
    start = start || 0
    var i = list.length - start
    var ret = new Array(i)
    while (i--) {
        ret[i] = list[i + start]
    }
    return ret
}

function extend(to, _from) {
    for (var key in _from) {
        to[key] = _from[key]
    }
    return to
}

// 向响应式对象中添加一个属性，并确保这个新属性同样是响应式的，且触发视图更新
function set(target, key, val) {
    if (Array.isArray(target) && isValidArrayIndex(key)) {
        target.length = Math.max(target.length, key)
        target.splice(key, 1, val)
        return val
    }

    if (key in target && !(key in Object.prototype)) {
        target[key] = val
        return val
    }

    var ob = (target).__ob__
    if (target._isVue || (ob && ob.vmCount)) {
        return val
    }

    if (!ob) {
        terget[key] = val
        return val
    }

    defineReactive(ob.value, key, val)

    ob.dep.notify()
    return val

}

// 删除对象的属性。如果对象是响应式的，确保删除能触发更新视图
function del(target, key) {
    if (Array.isArray(target) && isValidArrayIndex(key)) {
        target.splice(key, 1)
        return
    }

    var ob = (target).__ob__
    if (target._isVue || (ob && ob.vmCount)) {
        return
    }

    if (!hasOwn(target, key)) {
        return
    }

    delete target[key]

    if (!ob) {
        return
    }

    ob.dep.notify()
}

function query(el) {
    if (typeof el === 'string') {
        var selected = document.querySelector(el)
        return selected
    } else {
        return el
    }
}

function noop(a, b, c) {}

var inBrowser = typeof window !== 'ubdefined'

function isPrimitive(value) {
    return (
        typeof value === 'string' ||
        typeof value === 'number' ||
        typeof value === 'symbol' ||
        typeof value === 'boolean'
    )
}

function isTrue(v) {
    return v === true
}

function isFalse(v) {
    return v === false
}

function isDef(v) {
    return v !== undefined && v !== null
}

function isUndef(v) {
    return v === undefined || v === null
}

function def(obj, key, val, enumerable) {
    Object.defineProperty(obj, key, {
        value: val,
        enumerable: !!enumerable,
        writable: true,
        configurable: true
    })
}

var hasProto = '__proto__' in {}

function protoAugment(target, src, keys) {
    target.__proto__ = src
}

function copyAugment(target, src, keys) {
    for (var i = 0, l = keys.length; i < l; i++) {
        var key = keys[i]
        def(target, key, src[key])
    }
}

var xlinkNS = 'http://www.w3.org/1999/xlink';

var isXlink = function (name) {
    return name.charAt(5) === ':' && name.slice(0, 5) === 'xlink'
};

var getXlinkProp = function (name) {
    return isXlink(name) ? name.slice(6, name.length) : ''
};

var isFalsyAttrValue = function (val) {
    return val == null || val === false
};

var supportsPassive = false;
if (inBrowser) {
  try {
    var opts = {};
    Object.defineProperty(opts, 'passive', ({
      get: function get () {
        /* istanbul ignore next */
        supportsPassive = true;
      }
    })); // https://github.com/facebook/flow/issues/285
    window.addEventListener('test-passive', null, opts);
  } catch (e) {}
}