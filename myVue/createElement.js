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
    
    if (!tag) {
        return createEmptyVNode()
    }

    if (typeof tag === 'string') {
        // if (config.isReservedTag(tag)) {
        vnode = new VNode(
            tag, data, children, undefined, undefined, context
        )
        // }
    }

    if (Array.isArray(vnode)) {
        return vnode
    } else if (isDef(vnode)) {
        return vnode
    }
}

function normalizeChildren (children) {
    return [createTextVNode(children)]
}


function createEmptyVNode (text) {
    if (text === void 0) text = ''

    var node = new VNode()

    node.text = text
    node.isComment = true
    return node
}
function createTextVNode(val) {
    return new VNode(undefined, undefined, undefined, String(val))
}