// Dep
let uid = 0;
function Dep () {
  this.watchers = []
}

Dep.prototype.addWatcher = function (watcher) {
  this.watchers.push(watcher)
}

Dep.prototype.removeWatcher = function (watcher) {
  let index = this.watchers.indexOf(watcher)
  if (index > -1) {
    this.watchers.splice(index, 1)
  }
}

Dep.prototype.notify = function () {
  let watchers = this.watchers.slice()
  for (let i = 0, l = watchers.length; i < l; i++) {
    watchers[i].update()
  }
}

Dep.prototype.change = function () {
  this.notifyAllWatchers()
}

Dep.prototype.depend = function () {
  if (Dep.target) {
    Dep.target.addDep(this)
  }
}

Dep.target = null
// var targetStack = []

// Watcher
function Watcher (name, sub) {
  this.name = name
  this.sub = sub
  this.sub.add(this)
}

Watcher.prototype.update = function () {
  console.log(this.sub + '更新')
}

let data = {
  msg: ''
}

function V (options) {
  this.init(options)
}

V.prototype.init = function (options) {
  observe(options)
}

function observe (data) {
  let ob = new Observer(data)
  return ob
}

function Observer (data) {
  this.value = data
  this.dep = new Dep()
  const keys = Object.keys(data)
  for (let i = 0; i < keys.length; i++) {
    defineReactive(data, keys[i])
  }
}

function defineReactive (obj, key) {
  const dep = new Dep()
  let val = obj[key]

  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    get: function () {
      const value = val
      if (Dep.target) {
        dep.depend()
      }
      return value
    },
    set: function (newVal) {
      val = newVal
      dep.notify()
    }
  })
}
new V(data)
console.log(data)
