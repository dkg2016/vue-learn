var _Set
if (typeof Set !== undefined && isNative(Set)) {
    _Set = Set
} else {
    _Set = (function () {
        function Set () {
            this.set = Object.create(null)
        }
        Set.prototype.has = function has (key) {
            return this.set[key] === true
        }

        Set.prototype.add = function add (key) {
            this.set[key] = true
        }

        Set.prototype.clear = function clear () {
            this.set = Object.create(null)
        }

        return Set
    }())
}