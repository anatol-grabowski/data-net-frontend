import React from 'react'
import './index.css'
import GraphApi from './api/graph.api'
import { WsApi } from './api/graph-ws-api'
import { GraphEditor } from './components/containers'

const helpText = ``

export default class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      backgroundText: helpText
    }
    this.wsApi = new WsApi()
    window.app = this
  }

  rerender = (newState) => {
    console.log('rerender', newState, this.state.graph)
    this.setState({
      graph: newState.graph,
      wsStatusText: `ws status: ${newState.wsState}, users: ${newState.numSubscriptions}`,
    })
  }

  handleKeyDown = event => {
    const { graphName } = this.props
    let charCode = String.fromCharCode(event.which).toLowerCase()
    if (event.ctrlKey && charCode === 's') {
      const start = Date.now()
      event.preventDefault()
      console.log('Ctrl + S pressed')
      if (!this.state.graph) return
      this.setState({backgroundText: helpText + 'Saving ' + graphName})
      GraphApi.saveGraph(this.state.graph, graphName)
        .then(() => this.setState({backgroundText: helpText + 'Saved ' + graphName + '\n' + new Date() + '\n' + (Date.now() - start) + ' ms'}))
        .catch(err => this.setState({backgroundText: helpText + 'Error while saving\n' + err}))
    }
  }

  async openGraph() {
    const { graphName } = this.props
    this.setState({backgroundText: helpText + 'Opening graph ' + graphName})
    const start = Date.now()
    try {
      const graph = await GraphApi.getGraph(graphName)
      window.g = graph
      try {
        await this.wsApi.connect(this.rerender)
        this.wsApi.init(graphName, graph)
      } catch (err) {
        console.log('ws error', err)
      }
      this.setState({
        graph,
        backgroundText: helpText + 'Opened graph ' + graphName + '\n' + (Date.now() - start) + ' ms'
      })
    } catch (err) {
      this.setState({
        backgroundText: helpText + 'Error while opening\n' + err
      })
    }
  }

  componentDidMount() {
    this.openGraph()
  }

  componentDidUpdate(props) {
    if (props === this.props) return
    console.log('props updated', this.props)
    this.openGraph()
  }

  handleUpdate = () => {
    this.wsApi.sendUpdate(this.state.graph)
  }

  render() {
    const {
      graph,
      wsStatusText,
      backgroundText,
    } = this.state
    const {
      handleUpdate,
      handleKeyDown,
    } = this
    return (
      <div>
        <div className='graph-container'
          onKeyDown={handleKeyDown}
          tabIndex="0"
        >
          <div>{wsStatusText}</div>
          <div className='graph-info-text'>{backgroundText}</div>
          {graph && <GraphEditor graph={graph} onUpdate={handleUpdate}/>}
        </div>
      </div>
    )
  }
}
