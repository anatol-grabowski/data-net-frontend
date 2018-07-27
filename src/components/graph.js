import graph from '../views/graph/graph'
import Node from '../views/node/node'
import Edge from '../views/edge/edge'
import withPanAndZoom from '../hocs/with-pan-and-zoom'

const Graph = graph(Node, Edge)
const GraphWithPanAndZoom = withPanAndZoom(Graph)

export default GraphWithPanAndZoom