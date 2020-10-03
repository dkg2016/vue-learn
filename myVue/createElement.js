var SIMPLE_NORMALIZE = 1
var ALWAYS_NORMALIZE = 2

function createElement (
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

function _createElement (
    context,
    tag,
    data,
    children,
    normalizationType
) {
    if (normalizationType === ALWAYS_NORMALIZE) {
        children = normalizeChildren(children)
    }

    var vnode

    if (typeof tag === 'string') {
        // if (config.isReservedTag(tag)) {
        vnode = new VNode(
            tag, data, children, undefined, undefined, context
        )
        // }
    }
    console.log(vnode)

    if (Array.isArray(vnode)) {
        return vnode
    } else if (isDef(vnode)) {
        return vnode
    }
}

function normalizeChildren (children) {
    return [createTextVNode(children)]
}

function createTextVNode(val) {
    return new VNode(undefined, undefined, undefined, String(val))
}