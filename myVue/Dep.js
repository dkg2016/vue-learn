var uid = 0

var Dep = function Dep () {
    this.id = uid++

    this.subs = []
}

Dep.prototype.addSub = function addSub (sub) {
    this.subs.push(sub)
}

Dep.prototype.removeSub = function removeSub (sub) {
    remove(this.subs, sub)
}

Dep.prototype.depend = function depend () {
    if (Dep.target) {
        Dep.target.addDep(this)
    }
}

Dep.prototype.notify = function notify () {
    var subs = this.subs.slice()
    for (var i = 0, l = subs.length; i < l; i++) {
        subs[i].update()
    }
}

Dep.target = null
var targetStack = []

function pushTarget (_target) {
    if (Dep.target) { targetStack.push(Dep.target)}
    Dep.target = _target
}

function popTarget () {
    Dep.target = targetStack.pop()
}


// 测试
// let tf = {
//     update: function () {
//         this.tf()
//     },

//     tf: function () {
//         console.log(124)
//     }
// }
// var t = new Dep()
// t.addSub(tf)
// t.notify()
// console.log(t)