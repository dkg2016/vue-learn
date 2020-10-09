var uid$1 = 0

var Watcher = function Watcher(
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

    // 在 initState 中执行了 vm._watchers = []
    vm._watchers.push(this)

    if (options) {
        this.deep = !!options.deep
        this.user = !!options.user
        this.lazy = !!options.lazy
        this.sync = !!options.sync
    } else {
        this.deep = this.user = this.lazy = this.sync = false
    }

    this.cb = cb
    this.id = ++uid$1
    this.active = true
    this.dirty = this.lazy

    this.deps = []
    this.newDeps = []

    this.depIds = new _Set()
    this.newDeps = new _Set()

    this.expression = expOrFn.toString()

    if (typeof expOrFn === 'function') {
        this.getter = expOrFn
    } else {
        this.getter = parsePath(expOrFn)
        if (!this.getter) {
            this.getter = function () {}
        }
    }
    debugger
    this.value = this.lazy ? undefined : this.get()
}

Watcher.prototype.get = function get() {
    // 将当前 watcher 指定为全局 Dep 的 target
    pushTarget(this)

    var value
    var vm = this.vm
    try {
        value = this.getter.call(vm, vm)
    } catch (e) {
        console.log('watcher 出错')
        throw e
    } finally {
        if (this.deep) {

        }
        popTarget()
        this.cleanupDeps()
    }

    return value
}

Watcher.prototype.addDep = function addDep(dep) {
    var id = dep.id
    if (!this.newDepIds.has(id)) {
        this.newDepIds.add(id)
        this.newDeps.push(dep)
        if (!this.depIds.has(id)) {
            dep.addSub(this)
        }
    }
}

Watcher.prototype.cleanupDeps = function cleanupDeps() {
    var this$1 = this

    var i = this.deps.length
    while (i--) {
        var dep = this$1.deps[i]
        if (!this$1.newDepIds.has(dep.id)) {
            dep.removeSub(this$1)
        }
    }

    var tmp = this.depIds
    this.depIds = this.newDepIds
    this.newDepIds = tmp
    this.newDepIds.clear()
    tmp = this.deps
    this.deps = this.newDepIds
    this.newDeps = tmp
    this.newDeps.length = 0
}

Watcher.prototype.update = function update() {
    if (this.lazy) {

    } else if (this.sync) {

    } else {
        queueWatcher(this)
    }
}

Watcher.prototype.run = function run() {
    if (this.active) {
        var value = this.get()

        if (value !== this.value || isObject(value) || this.depp) {
            var oldValue = this.value
            this.value = value
            if (this.user) {

            } else {
                this.cb.call(this.vm, value, oldValue)
            }
        }
    }
}

Watcher.prototype.evaluate = function evaluate() {
    this.value = this.get()
    this.dirty = false
}

Watcher.prototype.depend = function depend() {
    var this$1 = this
    var i = this.deps.length
    while (i--) {
        this$1.deps[i].depend()
    }
}

Watcher.prototype.teardown = function teardown() {
    var this$1 = this
    if (this.active) {
        if (!this.vm._isBeingDestroyed) {
            remove(this.vm._watchers, this)
        }

        var i = this.deps.length
        while (i--) {
            this$1.deps[i].removeSub(this$1)
        }
        this.active = false
    }
}


function createWatcher(
    vm,
    expOrFn,
    handler,
    options
) {
    if (isPlainObject(handler)) {
        options = handler
        handler = handler.handler
    }

    if (typeof handler === 'string') {
        handler = vm[handler]
    }

    return vm.$watch(expOrFn, handler, options)
}