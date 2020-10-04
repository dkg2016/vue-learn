var sharedPropertyDefinition = {
    enumerable: true,
    configurable: true,
    get: noop,
    set: noop
}

// proxy(vm, "_data", key);
function proxy (target, sourceKey, key) {
    sharedPropertyDefinition.get = function proxyGetter () {
        return this[sourceKey][key]
    }

    sharedPropertyDefinition.set = function proxySetter (val) {
        this[sourceKey][key] = val
    }

    Object.defineProperty(target, key, sharedPropertyDefinition)
}