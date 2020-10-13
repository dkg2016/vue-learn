var emptyNode = new VNode('', {}, []);
var hooks = ['create', 'activate', 'update', 'remove', 'destroy']

var nodeOps = Object.freeze({
    createElement: function (tagName, vnode) {
        var elm = document.createElement(tagName)
        if (tagName !== 'select') {
            return elm
        }
    },

    appendChild: function (node, child) {
        node.appendChild(child)
    },

    createTextNode: function (text) {
        return document.createTextNode(text)
    },

    tagName: function (node) {
        return node.tagName
    },

    parentNode: function (node) {
        return node.parentNode
    },

    nextSibling: function (node) {
        return node.nextSibling
    },

    removeChild: function (node, child) {
        node.removeChild(child)
    }
})

function updateAttrs(oldVnode, vnode) {
    var opts = vnode.componentOptions
    if (isDef(opts) && opts.Ctor.options.inheritAttrs === false) {
        return
    }

    if (isUndef(oldVnode.data.attrs) && isUndef(vnode.data.attrs)) {
        return
    }

    var key, cur, old
    var elm = vnode.elm
    var oldAttrs = oldVnode.data.attrs || {}
    var attrs = vnode.data.attrs || {}

    if (isDef(attrs.__ob__)) {
        attrs = vnode.data.attrs = extend({}, attrs)
    }

    for (key in attrs) {
        cur = attrs[key]
        old = oldAttrs[key]
        if (old !== cur) {
            setAttr(elm, key, cur)
        }
    }
    for (key in oldAttrs) {
        if (isUndef(attrs[key])) {
            if (isXlink(xlinkNS)) {
                elm.removeAttributeNS(xlinkNS, getXlinkProp(key))
            } else if (!isEnumeratedAttr(key)) {
                elm.removeAttribute(key)
            }
        }
    }

}

function setAttr(el, key, value) {
    if (el.tagName.indexOf('-') > -1) {
        baseSetAttr(el, key, value)
    } else if (isBooleanAttr(key)) {

    } else if (isEnumeratedAttr(key)) {

    } else if (isXlink(key)) {

    } else {
        baseSetAttr(el, key, value);
    }
}

function baseSetAttr(el, key, value) {
    if (isFalsyAttrValue(value)) {
        el.removeAttribute(key)
    } else {
        // 省略对 ie 的特别处理
        el.setAttribute(key, value)
    }
}

var attrs = {
    create: updateAttrs,
    update: updateAttrs
}


function updateClass(oldVnode, vnode) {
    var el = vnode.el
    var data = vnode.data
    var oldData = oldVnode.data

    if (
        isUndef(data.staticClass) &&
        isUndef(data.class) &&
        (isUndef(oldData) || (isUndef(oldData.staticClass) && isUndef(oldData.class)))
    ) {
        return
    }

    var cls = genClassForVnode(vnode)

    var transitionClass = el._transitionClasses
    if (isDef(transitionClass)) {
        cls = concat(cls, stringifyClass(transitionClass))
    }

    if (cls !== el._prevClass) {
        el.setAttribute('class', cls)
        el._prevClass = cls
    }
}

function genClassForVnode(vnode) {
    var data = vnode.data
    var parentNode = vnode
    var childNode = vnode

    while (isDef(childNode.componentInstance)) {
        childNode = childNode.componentInstance._vnode
        if (childNode && childNode.data) {
            data = mergeClassData(childNode.data, data)
        }
    }

    while (isDef(parentNode = parentNode.parent)) {
        if (parentNode && parentNode.data) {
            data = mergeClassData(data, parentNode.data)
        }
    }

    return renderClass(data.staticClass, data.class)
}

function mergeClassData(child, parent) {
    return {
        staticClass: concat(child.staticClass, parent.staticClass),
        class: isDef(child.class) ? [child.class, parent.class] : parent.class
    }
}

function renderClass(staticClass, dynamicClass) {
    if (isDef(staticClass) || isDef(dynamicClass)) {
        return concat(staticClass, stringifyClass(dynamicClass))
    }
    return ''
}

function concat(a, b) {
    return a ? b ? (a + ' ' + b) : a : (b || '')
}

function stringifyClass(value) {
    if (Array.isArray(value)) {
        return stringifyArray(value)
    }

    if (isObject(value)) {
        return stringifyObject(value)
    }

    if (typeof value === 'string') {
        return value
    }

    return ''
}

function stringifyArray(value) {
    var res = ''
    var stringified
    for (var i = 0, l = value.length; i < l; i++) {
        if (isDef(stringified = stringifyClass(value[i])) && stringified !== '') {
            if (res) {
                res += ' '
            }
            res += stringified
        }
    }
    return res
}

function stringifyObject(value) {
    var res = ''
    for (var key in value) {
        if (value[key]) {
            if (res) {
                res += ' '
            }
            res += key
        }
    }
    return res
}

var klass = {
    create: updateClass,
    update: updateClass
}

function normalizeEvents(on) {

}

var target$1

function createOnceHandler (handler, event, capture) {
    var _target = target$1
    return function onceHandler () {
        var res = handler.apply(null, arguments)
        if (res !== null) {
            remove$2(event, onceHandler, capture, _target)
        }
    }
}

function add$1(
    event,
    handler,
    once$$1,
    capture,
    passive
) {
    handler = withMacroTask(handler)
    if (once$$1) {
        handler = createOnceHandler(handler, event, capture)
    }
    target$1.addEventListener(
        event, handler, supportsPassive ? {
            capture: capture,
            passive: passive
        } : capture
    )
}

function remove$2 (
    event,
    handler,
    capture,
    _target
) {
    (_target || target$1).removeEventListener(
        event,
        handler._withTask || handler,
        capture
    )
}

function updateDOMListeners(oldVnode, vnode) {
    if (isUndef(oldVnode.data.on) && isUndef(vnode.data.on)) {
        return
    }

    var on = vnode.data.on || {}
    var oldOn = oldVnode.data.on || {}
    target$1 = vnode.elm
    normalizeEvents(on)
    updateListeners(on, oldOn, add$1, remove$2, vnode.context)
    target$1 = undefined
}

var events = {
    create: updateDOMListeners,
    update: updateDOMListeners
}

var modules = [
    attrs,
    klass,
    events,
    // domProps,
    // style,
    // transition,
    // ref,
    // directives
]


// patch
function createPatchFunction(backend) {
    var i, j;
    var cbs = {}

    var modules = backend.modules

    var nodeOps = backend.nodeOps

    for (var i = 0; i < hooks.length; ++i) {
        cbs[hooks[i]] = []
        for (j = 0; j < modules.length; ++j) {
            if (isDef(modules[j][hooks[i]])) {
                cbs[hooks[i]].push(modules[j][hooks[i]])
            }
        }
    }

    function emptyNodeAt(elm) {
        return new VNode(nodeOps.tagName(elm).toLowerCase(), {}, [], undefined, elm)
    }

    function invokeCreateHooks(vnode, insertedVnodeQueue) {
        for (var i$1 = 0; i$1 < cbs.create.length; ++i$1) {
            cbs.create[i$1](emptyNode, vnode)
        }
        i = vnode.data.hook
        // debugger
        if (isDef(i)) {
            i.create(emptyNode, vnode)
            if (isDef(i.insert)) {
                insertedVnodeQueue.push(vnode)
            }
        }
    }

    function createElm(
        vnode,
        insertedVnodeQueue,
        parentElm,
        refElm,
        nested,
        ownerArray,
        index
    ) {
        if (createComponent(vnode, insertedVnodeQueue, parentElm, refElm)) {
            return
        }

        var data = vnode.data
        var children = vnode.children
        var tag = vnode.tag

        if (isDef(tag)) {
            vnode.elm = nodeOps.createElement(tag, vnode)

            try {
                createChildren(vnode, children, insertedVnodeQueue)
                debugger
                if (isDef(data)) {
                    invokeCreateHooks(vnode, insertedVnodeQueue)
                }
            } catch {
                console.log('createChildren 出错')
            }
            insert(parentElm, vnode.elm, refElm);
        } else if (isTrue(vnode.isComment)) {

        } else {
            vnode.elm = nodeOps.createTextNode(vnode.text)
            insert(parentElm, vnode.elm, refElm)
        }
    }

    function createChildren(vnode, children, insertedVnodeQueue) {
        if (Array.isArray(children)) {
            for (var i = 0; i < children.length; i++) {
                createElm(children[i], insertedVnodeQueue, vnode.elm, null, true, children, i)
            }
        } else if (isPrimitive(vnode.text)) {
            nodeOps.appendChild(vnode.elm, nodeOps.createTextNode(String(vnode.text)))
        }
    }

    function isPatchable(vnode) {
        while (vnode.componentInstance) {
            vnode = vnode.componentInstance._vnode
        }
        return isDef(vnode.tag)
    }

    function createComponent(vnode, insertedVnodeQueue, parentElm, refElm) {
        var i = vnode.data
        // debugger
        if (isDef(i)) {
            if (isDef(i = i.hook) && isDef(i = i.init)) {
                i(vnode, false, parentElm, refElm)
            }
        }
    }

    function insert(parent, elm, ref$$1) {
        if (isDef(parent)) {
            nodeOps.appendChild(parent, elm)
        }
    }

    function removeVnodes(parentElm, vnodes, startIdx, endIdx) {
        // debugger
        for (; startIdx <= endIdx; ++startIdx) {
            var ch = vnodes[startIdx]
            if (isDef(ch)) {
                if (isDef(ch.tag)) {
                    removeAndInvokeRemoveHook(ch)
                    invokeDestroyHook(ch)
                } else {
                    removeNode(ch.elm)
                }
            }
        }
    }

    function removeAndInvokeRemoveHook(vnode, rm) {
        if (isDef(rm) || isDef(vnode.data)) {

        } else {
            rmmoveNode(vnode.elm)
        }
    }

    function invokeDestroyHook(vnode) {

    }

    function removeNode(el) {
        var parent = nodeOps.parentNode(el)
        if (isDef(parent)) {
            nodeOps.removeChild(parent, el);
        }
    }

    function invokeInsertHook(vnode, queue, initial) {
        if (isTrue(initial) && isDef(vnode.parent)) {
            vnode.parent.data.pendingInsert = queue;
        } else {
            for (var i = 0; i < queue.length; ++i) {
                queue[i].data.hook.insert(queue[i]);
            }
        }
    }

    return function patch(oldVnode, vnode, hydrating, removeOnly, parentElm, refElm) {
        var isInitialPatch = false

        var insertedVnodeQueue = []
        // console.log(oldVnode, vnode)
        if (isUndef(oldVnode)) {
            isInitialPatch = true
            createElm(vnode, insertedVnodeQueue, parentElm, refElm)
        } else {
            var isRealElement = isDef(oldVnode.nodeType)

            if (!isRealElement && sameVnode(oldVnode, vnode)) {
                patchVnode(oldVnode, vnode, insertedVnodeQueue, removeOnly)
            } else {
                if (isRealElement) {
                    oldVnode = emptyNodeAt(oldVnode)
                }

                var oldElm = oldVnode.elm

                var parentElm$1 = nodeOps.parentNode(oldElm)

                createElm(
                    vnode,
                    insertedVnodeQueue,
                    parentElm$1,
                    nodeOps.nextSibling(oldElm)
                )

                if (isDef(vnode.parent)) {
                    var ancestor = vnode.parent
                    var patchable = isPatchable(vnode)
                    for (var i = 0; i < cbs.destroy.length; ++i) {
                        cbs.destroy[i](ancestor)
                    }
                    ancestor.elm = vnode.elm
                    if (patchable) {

                    } else {

                    }
                    while (ancestor) {
                        ancestor = ancestor.parent
                    }
                }
                // debugger
                if (isDef(parentElm$1)) {
                    removeVnodes(parentElm$1, [oldVnode], 0, 0)
                } else if (isDef(oldVnode.tag)) {
                    console.log(oldVnode.tag)
                }
            }
        }

        invokeInsertHook(vnode, insertedVnodeQueue, isInitialPatch)
        return vnode.elm
    }
}