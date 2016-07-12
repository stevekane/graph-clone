var isArray = require('is-array')
var UUID = require('node-uuid')
var sbs = require('log-side-by-side')
var test = require('tape')

class Edition {
  constructor(chapters = []) {
    this.Type = 'Edition'
    this.objectId = UUID()
    this.chapters = chapters
    this.selected = null
  }
}

class Chapter {
  constructor(name) { 
    this.Type = 'Chapter'
    this.name = name
    this.objectId = UUID()
    this.media = null
  }
}

class Media {
  constructor() {
    this.Type = 'Media'
    this.objectId = UUID() 
  }
}

var map = new Map
function cloneWith (e, depth) {
  depth = depth || 0
  if ( depth > 5 )              return e
  if (!( e instanceof Object )) return e
  if ( e.Type === 'Media' )     return e
  if ( isArray(e) )             return e.map(i => cloneWith(i, depth + 1))
  if ( map.has(e.objectId) )    return map.get(e.objectId)

  const out = Object.create(Object.getPrototypeOf(e))
  const keys = Object.keys(out)
  const oldId = e.objectId

  for (var key in e) {
    out[key] = key === 'objectId' ? UUID() : cloneWith(e[key], depth + 1)
  }
  map.set(oldId, out)
  return out
}

var media = [ new Media ]
var e = new Edition([ new Chapter('steve') ])
e.selected = e.chapters[0]
e.chapters[0].media = media[0]
var copy = cloneWith(e)

test('copy is truly deepcloned', t => {
  t.true(e !== copy, 'not equal')
  t.true(e.chapters !== copy.chapters)
  t.true(e.chapters[0] !== copy.chapters[0])

  t.true(e.chapters[0].media === copy.chapters[0].media)
  console.log(sbs(10, e, copy))
  t.end()
})
