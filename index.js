var isArray = require('is-array')

module.exports = gMap

function gMap (root, preserveFn, kvFn) {
  var map = new Map
  var set = new Set

  function visit (e) {
    if ( e instanceof Function || !( e instanceof Object ) || preserveFn(e) ) return e
    if ( isArray(e) )                                                         return e.map(visit)
    if ( set.has(e) )                                                         return map.get(e) || e

    var out = Object.create(Object.getPrototypeOf(e))

    set.add(e)
    map.set(e, out)
    for (var key in e) {
      out[key] = visit(kvFn(out, key, e[key]))
    }
    return out
  }
  return visit(root)
}
