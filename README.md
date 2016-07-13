# Graph Clone

This module offers a traversal mechanic for circular data JSON structures that allows you to clone or skip cloning on nodes
and also apply optional transforms to encountered nodes.

# Example usage

See test.js for best illustrating example.  Below is a dead simple version but the test is more exhaustive

```javascript
var w = require('graph-clone')
var stringify = require('json-stringify-safe')
var obj = {
  foo: {
    name: 'boris',
    bar: null 
  }
}
obj.foo.bar = obj

var copy = w(obj, () => true, (obj, key, val) => key === 'name' ? val + '!!!' : val)

console.log(stringify(copy))

// copy = {
//   foo: {
//      name: 'boris!!!',
//      bar: [ circular ]
//   }
// }
```
