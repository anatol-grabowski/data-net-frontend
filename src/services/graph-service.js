import EventEmitter from 'events'
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

function getEdgeForRender(edge) {
  const from = [edge.from.data.x, edge.from.data.y]
  const to = [edge.to.data.x, edge.to.data.y]
  const edgeForRender = {
    id: edge.id,
    points: [from, to],
  }
  return edgeForRender
}

function getGraphForRender(graph) {
  if (!graph) return { nodes: [], edges: [] }
  const nodes = graph.nodes.map(n => getNodeForRender(n))
  const edges = graph.edges.map(e => getEdgeForRender(e))
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
    const { id } = this.graph.node(data)
    this.updateGraphForRender()
    return id
  }

  addEdge(fromId, toId) {
    const from = findNodeById(this.graph, fromId)
    const to = findNodeById(this.graph, toId)
    this.graph.edge(from, to)
    this.updateGraphForRender()
  }

  removeNode(nodeId) {
    const node = findNodeById(this.graph, nodeId)
    node.remove()
    this.updateGraphForRender()
  }

  removeEdge(edgeId) {
    const edge = findEdgeById(this.graph, edgeId)
    edge.remove()
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