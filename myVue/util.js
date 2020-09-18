// 判断有无某个自有属性
function hasOwn(obj, key) {
    return Object.prototype.hasOwnProperty.call(obj, key)
}

// 
function isValidArrayIndex(val) {
    var n = parseFloat(String(val))
    return n >= 0 && Math.floor(n) === n && isFinite(val)
}

function isPlainObject (obj) {
    return Object.prototype.toString.call(obj) === '[object object]'
}

function isNative (Ctor) {
    return typeof Ctor === 'function' && /native code/.test(Ctor.toString())
}

function defineReactive() {

}

function extend(to, _from) {
    for (var key in _from) {
        to[key] = _from[key]
    }
    return to
}

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