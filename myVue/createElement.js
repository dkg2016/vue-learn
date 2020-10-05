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

function normalizeChildren(children) {
    return isPrimitive(children) ?
        [createTextVNode(children)] :
        Array.isArray(children) ?
        normalizeArrayChildren(children) :
        undefined
}

function normalizeArrayChildren(children, nestedIndex) {
    var res = []
    var i, c, lastIndex, last
    for (var i = 0; i < children.length; i++) {
        c = children[i]
        if (isUndef(c) || typeof c === 'boolean') { continue }
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
            console.log(c)
            res.push(c)
        }
    }

    return res
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

function isTextNode (node) {
    return isDef(node) && isDef(node.text) && isFalse(node.isComment)
}