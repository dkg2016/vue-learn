function render () {
    var vm = this
    var ref = vm.$options

    var render = ref.render
    var _parentVnode = ref._parentVnode

    if (_parentVnode) {
        vm.$scopedSlots = _parentVnode.data.scopedSlots || emptyObject
    }
    return {}
}