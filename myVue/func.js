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

        get: function reactiveGetter() {
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

        set: function reactiveSetter(newVal) {
            var value = getter ? getter.call(obj) : val
            // debugger
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

function dependArray(value) {
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

function resolveAsset(
    options,
    type,
    id,
    warnMissing
) {
    if (typeof id !== 'string') {
        return
    }

    var assets = options[type]

    if (hasOwn(assets, id)) {
        return assets[id]
    }

    var camelizedId = camelize(id)
    if (hasOwn(assets, camelizedId)) {
        return assets[camelizedId]
    }

    var PascalCaseId = capitalize(camelizedId)
    if (hasOwn(assets, PascalCaseId)) {
        return assets[PascalCaseId]
    }

    var res = assets[id] || assets[camelizedId] || assets[PascalCaseId]

    return res
}

function cached(fn) {
    var cache = Object.create(null)
    return (function cachedFn(str) {
        var hit = cache[str]
        return hit || (cache[str] = fn(str))
    })
}

var camelizeRE = /-\w/g
var camelize = cached(function (str) {
    return str.replace(camelizeRE, function (_, c) {
        return c ? c.toUpperCase() : ''
    })
})

var capitalize = cached(function (str) {
    return str.charAt(0).toUpperCase() + str.slice(1)
})

var normalizeEvent = cached(function (name) {
    var passive = name.charAt(0) === '&'
    name = passive ? name.slice(1) : name
    var once$$1 = name.charAt(0) === '~'
    name = once$$1 ? name.slice(1) : name;
    var capture = name.charAt(0) === '!';
    name = capture ? name.slice(1) : name;
    return {
        name: name,
        once: once,
        capture: capture,
        passive: passive
    }
})

function makeMap(str, expectsLowerCase) {
    var map = Object.create(null)

    var list = str.split(',')
    for (var i = 0; i < list.length; i++) {
        map[list[i]] = true
    }

    return expectsLowerCase ?
        function (val) {
            return map[val.toLowerCase()]
        } :
        function (val) {
            return map[val]
        }
}

var isHTMLTag = makeMap('html,body,base,head,link,meta,style,title,' +
    'address,article,aside,footer,header,h1,h2,h3,h4,h5,h6,hgroup,nav,section,' +
    'div,dd,dl,dt,figcaption,figure,picture,hr,img,li,main,ol,p,pre,ul,' +
    'a,b,abbr,bdi,bdo,br,cite,code,data,dfn,em,i,kbd,mark,q,rp,rt,rtc,ruby,' +
    's,samp,small,span,strong,sub,sup,time,u,var,wbr,area,audio,map,track,video,' +
    'embed,object,param,source,canvas,script,noscript,del,ins,' +
    'caption,col,colgroup,table,thead,tbody,td,th,tr,' +
    'button,datalist,fieldset,form,input,label,legend,meter,optgroup,option,' +
    'output,progress,select,textarea,' +
    'details,dialog,menu,menuitem,summary,' +
    'content,element,shadow,template,blockquote,iframe,tfoot')

var isBooleanAttr = makeMap(
    'allowfullscreen,async,autofocus,autoplay,checked,compact,controls,declare,' +
    'default,defaultchecked,defaultmuted,defaultselected,defer,disabled,' +
    'enabled,formnovalidate,hidden,indeterminate,inert,ismap,itemscope,loop,multiple,' +
    'muted,nohref,noresize,noshade,novalidate,nowrap,open,pauseonexit,readonly,' +
    'required,reversed,scoped,seamless,selected,sortable,translate,' +
    'truespeed,typemustmatch,visible'
);

var isEnumeratedAttr = makeMap('contenteditable,draggable,spellcheck');

function createFnInvoker (fns) {
    function invoker () {
        var arguments$1 = arguments

        var fns = invoker.fns
        if (Array.isArray(fns)) {
            var cloned = fns.slice();
            for (var i = 0; i < cloned.length; i++) {
                cloned[i].apply(null, arguments$1)
            }
        } else {
            return fns.apply(null, arguments)
        }
    }
    invoker.fns = fns
    return invoker
}