var hooks = ['create, cativate', 'update', 'remove', 'destroy']



function createPatchFunction(backend) {
    // var i, j;
    // var cbs = {}

    // var modules = backend.modules

    // var nodeOps = backend.nodeOps

    // for (var i = 0; i < hooks.length; ++i) {
    //     cbs[hooks[i]] = []
    //     for (j = 0; j < modules.length; ++j) {
    //         if (isDef(modules[j][hooks[i]])) {
    //             cbs[hooks[i]].push(modules[j][hooks[i]])
    //         }
    //     }
    // }

    function emptyNodeAt (elm) {
        return new VNode(nodeOps.tagName(elm).toLowerCase(), {}, [], undefined, elm)
    }

    function createElm (
        vnode,
        insertedVnodeQueue,
        parentElm,
        refElm,
        nested,
        ownerArray,
        index
    ) {
        var data = vnode.data
        var children = vnode.children
        var tag = vnode.tag

        if (isDef(tag)) {
            vnode.elm = nodeOps.createElement(tag, vnode)
            {
                createChildren(vnode, children, insertedVnodeQueue)
            }
            insert(parentElm, vnode.elm, refElm);
        } else if (isTrue(vnode.isComment)) {

        } else {
            vnode.elm = nodeOps.createTextNode(vnode.text)
            insert(parentElm, vnode.elm, refElm)
        }
    }

    function createChildren (vnode, children, insertedVnodeQueue) {
        if (Array.isArray(children)) {
            for (var i = 0; i < children.length; i++) {
                createElm(children[i], insertedVnodeQueue, vnode.elm, null, true, children, i)
            }
        } else if (isPrimitive(vnode.text)) {
            nodeOps.appendChild(vnode.elm, nodeOps.createTextNode(String(vnode.text)))
        }
    }

    function insert (parent, elm, ref$$1) {
        if (isDef(parent)) {
            nodeOps.appendChild(parent, elm)
        }
    }

    return function patch (oldVnode, vnode, hydrating, removeOnly, parentElm, refElm) {
        var isInitialPatch = false

        var insertedVnodeQueue = []
        // console.log(oldVnode, vnode)
        if (isUndef(oldVnode)) {
            isInitialPatch = true
            createElm(vnode, insertedVnodeQueue, parentElm, refElm)
        } else {
            var isRealElement = isDef(oldVnode.nodeType)

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
            console.log(vnode)
        }
    }
}