var SIMPLE_NORMALIZE = 1
var ALWAYS_NORMALIZE = 2

function createElement(
    context,
    tag,
    data,
    children,
    normalizationType,
    alwaysNormalize
) {
    if (Array.isArray(data) || isPrimitive(data)) {
        normalizationType = children
        children = data
        data = undefined
    }

    if (isTrue(alwaysNormalize)) {
        normalizationType = ALWAYS_NORMALIZE
    }
    return _createElement(context, tag, data, children, normalizationType)
}

function _createElement(
    context,
    tag,
    data,
    children,
    normalizationType
) {
    if (!tag) {
        return createEmptyVNode()
    }

    if (normalizationType === ALWAYS_NORMALIZE) {
        children = normalizeChildren(children)
    }

    var vnode

    if (typeof tag === 'string') {
        var Ctor
        if (config.isReservedTag(tag)) {
            vnode = new VNode(
                tag, data, children, undefined, undefined, context
            )
        } else if (isDef(Ctor = resolveAsset(context.$options, 'components', tag))) {
            vnode = createComponent(Ctor, data, context, children, tag)
        } else {
            vnode = new VNode(tag, data, children, undefined, undefined, context)
        }
    } else {
        // 组件生成 VNode
        vnode = createComponent(tag, data, context, children)
    }

    if (Array.isArray(vnode)) {
        return vnode
    } else if (isDef(vnode)) {
        return vnode
    }
}

function normalizeChildren(children) {
    return isPrimitive(children) ? [createTextVNode(children)] :
        Array.isArray(children) ?
        normalizeArrayChildren(children) :
        undefined
}

function normalizeArrayChildren(children, nestedIndex) {
    var res = []
    var i, c, lastIndex, last
    for (var i = 0; i < children.length; i++) {
        c = children[i]
        if (isUndef(c) || typeof c === 'boolean') {
            continue
        }
        lastIndex = res.length - 1
        last = res[lastIndex]

        if (Array.isArray(c)) {
            if (c.length > 0) {
                c = normalizeArrayChildren(c, ((nestedIndex || '') + "_" + i))
                if (isTextNode(c[0]) && isTextNode(last)) {
                    res[lastIndex] = createTextVNode(last.text + (c[0]).text)
                    c.shift()
                    res.push.apply(res, c)
                }
            }
        } else if (isPrimitive(c)) {
            if (isTextNode(last)) {
                res[lastIndex] = createTextVNode(last.text + c)
            } else if (c !== '') {
                res.push(createTextVNode(c))
            }
        } else {
            if (isTrue(children.isVList) &&
                isDef(c.tag) &&
                isUndef(c.key) &&
                isDef(nestedIndex)) {
                c.key = "__vlist" + nestedIndex + "_" + i + "__";
            }
            res.push(c)
        }
    }

    return res
}

function createComponent(
    Ctor,
    data,
    context,
    children,
    tag
) {
    if (isUndef(Ctor)) {
        return
    }

    var baseCtor = context.$options._base

    if (isObject(Ctor)) {
        Ctor = baseCtor.extend(Ctor)
    }

    data = data || {}
    installComponentHooks(data)

    var name = Ctor.options.name || tag

    var vnode = new VNode(
        ("vue-component-" + (Ctor.cid) + (name ? ("-" + name) : '')), // tag
        data, undefined, undefined, undefined, context, {
            Ctor: Ctor,
            propsData: {},
            listeners: {},
            tag: tag,
            children: children
        }, // 组件对象
        asyncFactory = undefined
    )

    return vnode

}

function updateChildComponent(
    vm,
    propsData,
    listeners,
    parentVnode,
    renderChildren
) {
    var hasChildren = !!(
        renderChildren ||
        vm.$options._renderChildren ||
        parentVnode.data.scopedSlots ||
        vm.$scopedSlots !== emptyObject
    )

    vm.$options._parentVnode = parentVnode
    vm.$vnode = parentVnode

    if (vm._vnode) {
        vm._vnode.parent = parentVnode
    }
    vm.$options._renderChildren = renderChildren

    vm.$attrs = parentVnode.data.attrs || emptyObject
    vm.$listeners = listeners || emptyObject

    if (propsData && vm.$options.props) {
        toggleObserving(false)
        var props = vm._props
        var propKeys = vm.$options._propKeys || []
        for (var i = 0; i < propKeys.length; i++) {
            var key = propKeys[i]
            var propOptions = vm.$options.props
            props[key] = validateProp(key, propOptions, propsData, vm)
        }
        toggleObserving(true)
        vm.$options.propsData = propsData
    }

    listeners = listeners || emptyObject
    var oldListeners = vm.$options._parentListeners
    vm.$options._parentListeners = listeners
    updateComponentListeners(vm, listeners, oldListeners)

    // slot
    if (hasChildren) {

    }
}

var componentVNodeHooks = {
    init: function init(
        vnode,
        hydrating,
        parentElm,
        refElm
    ) {
        // debugger
        if (
            vnode.componentInstance &&
            !vnode.componentInstance._isDestroyed &&
            vnode.data.keepAlive
        ) {

        } else {

            var child = vnode.componentInstance = createComponentInstanceForVnode(
                vnode,
                activeInstance,
                parentElm,
                refElm
            )
            child.$mount(hydrating ? vnode.elm : undefined, hydrating)
        }
    },

    prepatch: function prepatch(oldVnode, vnode) {
        var options = vnode.componentOptions
        var child = vnode.componentInstance = oldVnode.componentInstance
        updateChildComponent(
            child,
            options.propsData,
            options.listeners,
            vnode,
            options.children
        )
    },

    insert: function insert(vnode) {
        var context = vnode.context;
        var componentInstance = vnode.componentInstance;
        if (!componentInstance._isMounted) {
            componentInstance._isMounted = true;

            // 执行组件的 mounted 钩子函数
            callHook(componentInstance, 'mounted');
        }
    },

    destroy: function destroy() {

    }
}
var hooksToMerge = Object.keys(componentVNodeHooks)

function createComponentInstanceForVnode(
    vnode,
    parent,
    parentElm,
    refElm
) {
    var options = {
        _isComponent: true,
        parent: parent,
        _parentVnode: vnode,
        _parentElm: parentElm || null,
        _refElm: refElm || null
    }

    return new vnode.componentOptions.Ctor(options)
}

// 安装组件 patch 过程中的钩子函数
function installComponentHooks(data) {
    var hooks = data.hook || (data.hook = {})

    for (var i = 0; i < hooksToMerge.length; i++) {
        var key = hooksToMerge[i]

        hooks[key] = componentVNodeHooks[key]
    }
}

function createEmptyVNode(text) {
    if (text === void 0) text = ''

    var node = new VNode()

    node.text = text
    node.isComment = true
    return node
}

function createTextVNode(val) {
    return new VNode(undefined, undefined, undefined, String(val))
}

function isTextNode(node) {
    return isDef(node) && isDef(node.text) && isFalse(node.isComment)
}