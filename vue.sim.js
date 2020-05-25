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
    arr.splice(index, 1)
  }
},

Dep.prototype.notify = function () {
  let watchers = this.watchers.slice()
  for(let i = 0, l = watchers.length; i < l; i++) {
    watchers[i].update()
  }
}

Dep.prototype.change = function () {
  this.notifyAllWatchers()
}

Dep.prototype.depend = function () {
  if (Dep.target) {
    Dep.target.addDep(this);
  }
}

Dep.target = null;
var targetStack = [];


function Observer (name, sub) {
  this.name = name
  this.sub = sub
  this.sub.add(this)
}

Observer.prototype.update = function () {
  console.log(this.sub + '更新')
}

let data = {
  msgOne: '',
  msgTwo: ''
}

Object.defineProperty(data, 'msgOne', {
  get: function() {
    let msg = '第一行'
    return msg || ''
  },
  set: function (val) {
    data.msgOne = val
  }
})

function V () {

}

V.prototype.init = function (options) {
  Observer(optiosn)
}

function observe (data) {
  let ob = new Observer(data)
}

function Observer (data) {
  this.value = data
  this.dep = new Dep()
  
  const keys = Object.keys(data)
  for (let i = 0; i< keys.length;i++) {
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
      const value = val
      val = newVal
      dep.notify()
    }
  })
}