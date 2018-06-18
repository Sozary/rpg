var cy = cytoscape({

  container: $('#treeview'),
  elements: {
    nodes: [{
      data: {
        id: '1',
        title: 'racine',
        daddy: undefined,
        pic: 'http://209.97.134.204/rpg/images/sprout.png',
        shape: 'ellipse',
        content: ''
      }
    }],
    edges: []
  },
  style: [ // the stylesheet for the graph
    {
      selector: 'node',
      style: {
        'label': 'data(title)',
        'width': '200px',
        'height': '200px',
        'shape': 'data(shape)',
        'background-fit': 'cover',
        'background-image': 'data(pic)',
        'background-color': 'white',
        'color': 'white',
        'text-valign': 'center',
        'text-halign': 'center',
        'font-size': '2.4em',
        'text-wrap': 'wrap',
        'text-max-width': '170px',
        'font-family': '"Roboto", Arial',
        'text-background-shape': 'roundrectangle',
        'text-background-color': 'black',
        'text-background-opacity': '.56',
        'text-background-padding': '15px',
        'text-border-opacity': '.24',
        'text-border-width': '5px',
        'text-border-color': 'black',
        'text-border-style': 'solid',
        'text-outline-width': '3',
        'text-outline-color': '#ccc',
        'transition-property': 'width,height',
        'transition-duration': '.1s'
      }
    },
    {
      selector: 'edge',
      style: {
        'width': 10,
        'line-color': '#bbb',
        'curve-style': 'bezier',
        'opacity': 1,
        'target-arrow-shape': 'triangle',
        'source-arrow-shape': 'circle',
        'target-arrow-color': '#bbb',
        'target-arrow-shape': 'triangle'
      }
    },
    {
      selector: '.hovered',
      style: {
        'label': 'data(title)',
        'width': '300px',
        'height': '300px',
        'shape': 'data(shape)',
        'background-fit': 'cover',
        'background-image': 'data(pic)',
        'background-color': 'red',
        'color': 'white',
        'text-valign': 'center',
        'text-halign': 'center',
        'font-size': '2.4em',
        'text-wrap': 'wrap',
        'text-max-width': '170px',
        'font-family': '"Roboto", Arial',
        'text-background-shape': 'roundrectangle',
        'text-background-color': 'black',
        'text-background-opacity': '.56',
        'text-background-padding': '15px',
        'text-border-opacity': '.24',
        'text-border-width': '5px',
        'text-border-color': 'black',
        'text-border-style': 'solid',
        'text-outline-width': '3',
        'text-outline-color': '#ccc',
      }
    }
  ],


});

var layout = cy.layout({
  name: 'breadthfirst', //cose?
  directed: true,
  padding: 10,
  animate: false
})

cy.fit(cy.$('#1'));

var defaults = {
  container: $('#navigator') // can be a HTML or jQuery element or jQuery selector
    ,
  viewLiveFramerate: 0 // set false to update graph pan only on drag end; set 0 to do it instantly; set a number (frames per second) to update not more than N times per second
    ,
  thumbnailEventFramerate: 30 // max thumbnail's updates per second triggered by graph updates
    ,
  thumbnailLiveFramerate: false // max thumbnail's updates per second. Set false to disable
    ,
  dblClickDelay: 200 // milliseconds
    ,
  removeCustomContainer: true // destroy the container specified by user on plugin destroy
    ,
  rerenderDelay: 100 // ms to throttle rerender updates to the panzoom for performance
};

var nav = cy.navigator(defaults); // get navigator instance, nav
function distanceTo(pos1, pos2) {
  return Math.sqrt(((pos1.x - pos2.x) ** 2) + ((pos1.y - pos2.y) ** 2));
}

function triggerElem(e) {
  let nodes = [];
  cy.elements("node").forEach((el) => {
    if (el.id() != e.id() && distanceTo(el.position(), e.position()) < 200)
      nodes.push(el)

  })
  return nodes;
}
cy.on('click', 'node', function(evt) {
  edit(this);
});
var hoveredNodes = []

function nodeInArray(node, arr) {
  for (let el of arr)
    if (node.id() == el.id())
      return true
  return false
}
cy.on('drag', 'node', function(e) {
  let trig = triggerElem(this)
  trig.forEach((el) => {
    if (!nodeInArray(el, hoveredNodes)) {
      hoveredNodes.push(el)
      el.addClass('hovered')
    }
  })
  for (let i = 0; i < hoveredNodes.length; i++)
    if (!nodeInArray(hoveredNodes[i], trig)) {
      hoveredNodes[i].removeClass('hovered')
      hoveredNodes.splice(i, 1)
    }
});
cy.on('free', 'node', function(e) {

  if (hoveredNodes.length != 0) {
    let selected = hoveredNodes[0]
    selected.removeClass('hovered')
    hoveredNodes = []

    cy.add([{
      group: "edges",
      data: {
        id: this.data('daddy') + 'E' + selected.id(),
        source: this.data('daddy'),
        target: selected.id()
      }
    }])
    this.remove()
    layout = cy.layout({
      name: 'breadthfirst', //cose?
      directed: true,
      padding: 10,
      animate: false
    })

  }
})