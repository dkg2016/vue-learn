var callbacks = []

// 在等待
var pending = false

function flushCallbacks () {
    pending = false
    var copies = callbacks.slice(0)
    callbacks.length = 0
    for (var i = 0; i < copies.length; i++) {
        copies[i]()
    }
}

var microTimerFunc
var macroTimerFunc
var useMacroTask = false

// macroTask 的实现

if (typeof setImmediate !== 'undefined' && isNative(setImmediate)) {
    macroTimerFunc = function () {
        setImmediate(flushCallbacks)
    }
} else if (typeof MessageChannel !== undefined && isNative(MessageChannel)) {
    var channel = new MessageChannel()
    var port = channel.port2
    channel.port1.onmessage = flushCallbacks
    macroTimerFunc = function () {
        port.postMessage(1)
    }
} else {
    macroTimerFunc = function () {
        setTimeout(flushCallbacks, 0);
    }
}

// microTask
if (typeof Promise !== 'undefined' && isNative(Promise)) {
    var p = Promise.resolve()
    microTimerFunc = function () {
        p.then(flushCallbacks)
    }
} else {
    microTimerFunc = macroTimerFunc
}

function withMacroTask (fn) {
    return fn._withTask || (fn._withTask = function () {
        useMacroTask = true
        var res = fn.apply(null, arguments)
        return res
    })
}

function nextTick (cb, ctx) {
    var _resolve
    callbacks.push(function () {
        if (cb) {
            try {
                cb.call(ctx)
            } catch (e) {
                console.log('next Tick 出错')
            }
        } else if (_resolve) {
            _resolve(ctx)
        }
    })

    if (!pending) {
        pending = true

        if (useMacroTask) {
            macroTimerFunc()
        } else {
            microTimerFunc()
        }
    }

    if (!cb && typeof Promise !== 'undefined') {
        return new Promise(function (resolve) {
            _resolve = resolve
        })
    }
}