import { Graph } from 'data-net'

const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:8080'
const standalone = process.env.REACT_APP_STANDALONE === 'true'

if (standalone) console.log(`REACT_APP_STANDALONE=${standalone}`)
else console.log(`REACT_APP_API_URL=${apiUrl}`)

const getGraphName = () => window.location.pathname.substr(1) || '/'

export default class GraphApi {
  static async getGraph() {
    const graphName = getGraphName()
    if (standalone) {
      if (graphName !== 'test') return makeDummyGraph()
      return genGraph(500)
    }
    console.log('opening', graphName)
    const url = `${apiUrl}/graph/${encodeURIComponent(graphName)}`
    const response = await fetch(url)
    const json = await response.json()
    const graph = Graph.create(json.graph)
    console.log('opened', graph.nodes.length)
    return graph
  }

  static async saveGraph(graph) {
    const graphName = getGraphName()
    console.log('saving', graphName)
    const url = `${apiUrl}/graph/${encodeURIComponent(graphName)}`
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ graph }),
    })
    console.log('saved', response)
    return response
  }
}

function makeDummyGraph() {
  const graph = Graph.create()
  const n1 = graph.node({
    x: 0,
    y: 0,
    width: 200,
    height: 80,
    text: 'abc',
  })
  const n2 = graph.node({
    x: 500,
    y: 600,
    width: 200,
    height: 80,
    text: '123',
  })
  graph.edge(n1, n2)
  return graph
}

function genGraph(num) {
  const graph = Graph.create()
  for (let i = 0; i < num; i++) {
    graph.node({
      x: Math.random() * 1000,
      y: Math.random() * 1000,
      width: 160,
      height: 70,
      text: 'test',
    })
  }
  return graph
}