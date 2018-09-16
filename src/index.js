import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import GraphApi from './api/graph.api'
import Graph from './components/graph-render-and-edit-area'
import withPanAndZoom from './hocs/with-pan-and-zoom'

const helpText = `
LMB double click on empty space - create node
LMB on node and drag - move node

RMB on node and drag - create edge (connection) to another node
LMB double click on node/edge - edit node/edge

mouse wheel - zoom
LMB on empty space and drag - pan

Ctrl + S - save graph

To open a graph enter its name to the location bar after '/', e.g. 'http://localhost:3000/js' will open a graph named 'js'.
If the graph with this name doesn't exist then it will be created on save.

Source code:
https://github.com/grabantot/data-net
https://github.com/grabantot/data-net-backend
https://github.com/grabantot/data-net-frontend
`

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      backgroundText: helpText
    }
  }

  handleKeyDown = event => {
    let charCode = String.fromCharCode(event.which).toLowerCase()
    if (event.ctrlKey && charCode === 's') {
      event.preventDefault()
      console.log('Ctrl + S pressed')
      if (!this.state.graph) return
      this.setState({backgroundText: helpText + '\n\nSaving'})
      GraphApi.saveGraph(this.state.graph)
        .then(() => this.setState({backgroundText: helpText + '\n\nSaved\n' + new Date()}))
        .catch(err => this.setState({backgroundText: helpText + '\n\nError while saving\n' + err}))
    }
  }

  componentDidMount() {
    this.setState({backgroundText: helpText + '\n\nOpening graph'})
    GraphApi.getGraph()
      .then(graph => {
        window.g = graph
        this.setState({
          graph,
          backgroundText: helpText + '\n\nOpened'
        })
      })
      .catch(err => {
        this.setState({
          backgroundText: helpText + '\n\nError while opening\n' + err
        })
      })
  }

  render() {

    return (
      <div>
        <DivWithPanAndZoom/>
        <span>
          slf
        </span>
        <div className='graph-container'
          onKeyDown={this.handleKeyDown}
          tabIndex="0"
        >
          <div style={{position: 'absolute', whiteSpace: 'pre', color: '#ccc', userSelect: 'none'}}>{this.state.backgroundText}</div>
          {this.state.graph && <Graph graph={this.state.graph}/>}
        </div>
      </div>
    )
  }
}

const Div = () => (<div>
  some text to add offsets and see<br/>
  if render area still calculates positions correctly and the content stays withing the container
</div>)
const DivWithPanAndZoom = withPanAndZoom(Div)

// ========================================

ReactDOM.render(<App />, document.getElementById('root'))
