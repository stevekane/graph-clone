var test = require('tape')
var sbs = require('log-side-by-side')
var UUID = require('node-uuid')
var gMap = require('./index')

class Doc {
  constructor(nodes, media) {
    this.Type = 'Edition'
    this.objectId = UUID()
    this.nodes = nodes
    this.media = media
    this.selected = null
    this.fn = function () { return 'dogs' }
  }
}

class Node {
  constructor(name) { 
    this.Type = 'Node'
    this.objectId = UUID()
    this.name = name
    this.stage = new Asset
  }
}

class Media {
  constructor() {
    this.Type = 'Media'
    this.objectId = UUID() 
  }
}

class Asset {
  constructor() {
    this.Type = 'Asset'
    this.objectId = UUID()
    this.children = []
    this.media = null
    this.parent = null
  }

  setParent(parent) {
    if ( this.parent ) this.parent.children.splice(this.parent.children.indexOf(this), 1)
    this.parent = parent 
    if ( parent.children.indexOf(this) === -1 ) parent.children.push(this)
  }
}

test('copy is truly deepcloned', t => {
  var e = new Doc(
    [ new Node('sequence 1') ],
    [ new Media, new Media ])

  var a1 = new Asset
  var a2 = new Asset

  a1.setParent(e.nodes[0].stage)
  a1.media = e.media[0]
  a2.setParent(a1)

  var copy = gMap(e, e => e instanceof Media, (t, k, v) => k === 'objectId' ? UUID() : v)

  console.log(sbs(10, e, copy))
  t.true(e !== copy, 'not equal')
  t.true(e.nodes !== copy.nodes)
  t.true(e.media[0] === copy.media[0])
  t.true(e.nodes[0] !== copy.nodes[0])
  t.true(e.nodes[0].stage !== copy.nodes[0].stage)
  t.true(e.nodes[0].stage.children[0] !== copy.nodes[0].stage.children[0])
  t.true(e.nodes[0].stage.children[0] !== copy.nodes[0].stage.children[0])
  t.true(e.nodes[0].stage.children[0].children[0] !== copy.nodes[0].stage.children[0].children[0])
  t.true(e.nodes[0].stage.children[0].parent !== copy.nodes[0].stage.children[0].parent)
  t.true(e.nodes[0].stage.children[0].children[0].parent !== copy.nodes[0].stage.children[0].children[0].parent)
  t.true(e.nodes[0].stage.objectId !== copy.nodes[0].stage.objectId)
  t.true(e.nodes[0].media === copy.nodes[0].media)

  // test fns
  t.true(e.fn === copy.fn)
  t.end()
})
