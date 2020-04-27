import * as clone from 'clone'
import * as jsondiffpatch from 'jsondiffpatch'
import { apiUrl } from './api-url'

const diffpatcher = jsondiffpatch.create({})

export class WsApi {
  async connect(upd) {
    const url = apiUrl.replace(/^http/, 'ws') || 'ws://localhost:8080'
    const ws = new WebSocket(url)
    this.ws = ws
    this._upd = upd

    this.wsState = 'connecting'
    this.update()

    ws.addEventListener('close', () => {
      this.wsState = 'closed'
      this.update()
    })

    ws.addEventListener('message', (event) => {
      console.log('ws message', event.data)
      const message = JSON.parse(event.data)
      this.numSubscriptions = message.numSubscribers
      if (message.action === 'subscribed') {
        this.sessionId = message.sessionId
        const graph = message.graph
        this.update(graph)
      }
      if (message.action === 'updated') {
        if (message.graphId !== this.graphId) return
        if (message.sessionId === this.sessionId) {
          this.update()
          return
        }
        const graph = diffpatcher.patch(this.graph, message.delta)
        this.update(graph)
      }
    })

    await new Promise((resolve, reject) => {
      ws.addEventListener('open', () => {
        this.wsState = 'connected'
        resolve()
      })

      ws.addEventListener('error', (event) => {
        this.wsState = 'error'
        reject(event)
        this.update()
      })
    })
    console.log('ws open')
  }

  update(graph) {
    if (graph) {
      this.graph = graph
    }
    this._upd({
      numSubscriptions: this.numSubscriptions,
      wsState: this.wsState,
      graph: clone(this.graph),
    })
  }

  init(graphId, graph) {
    // if (this.graphId !== undefined) {
    //   this._upd = null
    //   const message = {
    //     action: 'unsubscribe',
    //   }
    //   this.ws.send(JSON.stringify(message))
    // }
    this.graphId = graphId
    const message = {
      action: 'subscribe',
      graphId,
      graph,
    }
    this.ws.send(JSON.stringify(message))
  }

  sendUpdate(graph) {
    const delta = diffpatcher.diff(this.graph, graph)
    console.log(this.graph === graph, this.graph, graph, delta)
    const message = {
      action: 'update',
      graphId: this.graphId,
      delta,
      sessionId: this.sessionId,
    }
    const msgStr = JSON.stringify(message, null, 2)
    // if (delta) {
      console.log('ws send', msgStr)
      this.ws.send(msgStr)
    // }
    this.graph = clone(graph)
  }
}
