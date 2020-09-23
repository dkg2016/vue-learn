function defineReactive(
    obj,
    key,
    val,
    customSetter,
    shallow
) {
    var dep = new Dep()

    var property = Object.getOwnPropertyDescriptor(obj, key)

    if (property && property.configurable === false) {
        return
    }

    var getter = property && property.get

    if (!getter && arguments.length === 2) {
        val = obj[key]
    }

    var setter = property && property.set

    var childOb = !shallow && observe(val)

    Object.defineProperty(obj, key, {
        enumerable: true,
        configurable: true,

        get: function reactiveGetter () {
            var value = getter ? getter.call(obj) : val

            if (Dep.target) {
                dep.depend()
                if (childOb) {
                    childOb.dep.depend()
                    if (Array.isArray(value)) {
                        dependArray(value)
                    }
                }
            }
            return value
        },

        set: function reactiveSetter (newVal) {
            var value = getter ? getter.call(obj) : val

            if (newVal === value || (newVal !== newVal && value !== value)) {
                return
            }

            if (setter) {
                setter.call(obj, newVal)
            } else {
                val = newVal
            }
            childOb = !shallow && observe(newVal)

            dep.notify()
        }
    })
}

function dependArray (value) {
    for (var e = (void 0), i = 0, l = value.length; i < l; i++) {
        e = value[i]
        e && e.__ob__ && e.__ob__.dep.depend()
        if (Array.isArray(e)) {
            dependArray(e)
        }
    }
}


var bailRE = /[^\w.$]/;

function parsePath(path) {
    if (bailRE.test(path)) {
        return
    }
    var segments = path.split('.');
    return function (obj) {
        for (var i = 0; i < segments.length; i++) {
            if (!obj) {
                return
            }
            obj = obj[segments[i]];
        }
        return obj
    }
}