import EventEmitter from 'events'
import { Graph } from 'data-net'
import { uploadFile } from '../api/upload.api'

function getNodeForRender(node) {
  const {
    x,
    y,
    text,
    details,
    attachments,
  } = node.data
  const nodeForRender = {
    id: node.id,
    coords: [x, y],
    text,
    details: details || '',
    attachments: attachments || [],
  }
  return nodeForRender
}

function getEdgeForRender(graph, edge) {
  const fromNode = findNodeById(graph, edge.from)
  const toNode = findNodeById(graph, edge.to)
  const from = [fromNode.data.x, fromNode.data.y]
  const to = [toNode.data.x, toNode.data.y]
  const edgeForRender = {
    id: edge.id,
    points: [from, to],
  }
  return edgeForRender
}

function getGraphForRender(graph) {
  if (!graph) return { nodes: [], edges: [] }
  // const nodesMap = new Map()
  // graph.nodes.forEach(n => nodesMap.set(n.id, n))
  const nodes = graph.nodes.map(n => getNodeForRender(n))
  const edges = graph.edges.map(e => getEdgeForRender(graph, e))
  return { nodes, edges }
}

function findNodeById(graph, id) {
  return graph.nodes.find(n => n.id === id)
}

function findEdgeById(graph, id) {
  return graph.edges.find(e => e.id === id)
}

class GraphService {
  constructor(graph) {
    this.graph = graph
    this.graphForRender = getGraphForRender(graph)
    this.events = new EventEmitter()
  }

  updateGraphForRender() {
    this.graphForRender = getGraphForRender(this.graph)
    this.events.emit('update')
  }

  addNode(pos) {
    const data = {
      x: pos[0],
      y: pos[1],
      text: 'aaa',
    }
    const { id } = Graph.createNode(this.graph, data)
    this.updateGraphForRender()
    return id
  }

  addEdge(fromId, toId) {
    Graph.createEdge(this.graph, fromId, toId)
    this.updateGraphForRender()
  }

  removeNode(nodeId) {
    Graph.deleteNode(this.graph, nodeId)
    this.updateGraphForRender()
  }

  removeEdge(edgeId) {
    Graph.deleteEdge(this.graph, edgeId)
    this.updateGraphForRender()
  }

  updateNode(nodeId, updates) {
    const node = findNodeById(this.graph, nodeId)
    node.data = {
      ...node.data,
      ...updates
    }
    this.updateGraphForRender()
  }

  async addAttachments(nodeId, files) {
    const node = findNodeById(this.graph, nodeId)
    const upload = async (file) => {
      const uploadResponse = await uploadFile(file)
      const newAttachments = uploadResponse.metadatas.map(met => {
        const attachment = {
          filepath: met.path_display,
        }
        return attachment
      })
      if (!node.data.attachments) node.data.attachments = []
      node.data.attachments = node.data.attachments.concat(newAttachments)
      this.updateGraphForRender()
    }
    const uploadPromises = files.map(f => upload(f))
    await Promise.all(uploadPromises)
  }

  removeAttachment(nodeId, attachmentIndex) {
    const node = findNodeById(this.graph, nodeId)
    node.data.attachments.splice(attachmentIndex, 1)
    this.updateGraphForRender()
  }
}

export default GraphService
