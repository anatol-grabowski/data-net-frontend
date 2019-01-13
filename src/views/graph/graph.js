import React from 'react'
import PropTypes from 'prop-types'
import Debug from 'debug'
import withGroupedEvents from '../../hocs/withGroupedEvents'
import logChangedProps from '../../utils/log-changed-props'
import './graph.css'

const debug = Debug('graph')

export default function graph(Node, Edge) {
  const Nodes = ({nodes, onNodeMouseDown, onNodeMouseUp, onNodeDoubleClick}) => (
    <div className='nodes'>
      {
        nodes.map(node => (
          <Node
            key={node.id}
            node={node}
            onMouseDown={onNodeMouseDown(node)}
            onMouseUp={onNodeMouseUp(node)}
            onDoubleClick={onNodeDoubleClick(node)}
          />
        ))
      }
    </div>
  )
  const NodesWithGroupedEvents = withGroupedEvents({
    onNodeMouseDown: 'nodes',
    onNodeMouseUp: 'nodes',
    onNodeDoubleClick: 'nodes',
  })(Nodes)

  const Edges = ({edges, onEdgeDoubleClick}) => (
    <svg className="edges">
      <defs>
        <marker id="arrow" markerWidth="30" markerHeight="10" refX="30" refY="3" orient="auto" markerUnits="strokeWidth">
          <path d="M0,0 L0,6 L30,3 z" fill="#000" />
        </marker>
      </defs>
      <g>
        {
          edges.map(edge => (
            <Edge
              key={edge.id}
              edge={edge}
              onDoubleClick={onEdgeDoubleClick(edge)}
            />
          ))
        }
      </g>
    </svg>
  )
  const EdgesWithGroupedEvents = withGroupedEvents({
    onEdgeDoubleClick: 'edges',
  })(Edges)

  class Graph extends React.Component {
    componentDidUpdate(prevProps) {
      if (debug.enabled) logChangedProps(this.props, prevProps, debug)
    }

    render() {
      const nodes = this.props.graph.nodes
      const edges = this.props.graph.edges
      return (
        <div className="graph">
          <EdgesWithGroupedEvents
            edges={edges}
            onEdgeDoubleClick={this.props.onEdgeDoubleClick}
          />
          <NodesWithGroupedEvents
            nodes={nodes}
            onNodeMouseDown={this.props.onNodeMouseDown}
            onNodeMouseUp={this.props.onNodeMouseUp}
            onNodeDoubleClick={this.props.onNodeDoubleClick}
          />
        </div>
      )
    }
  }

  Graph.propTypes = {
    graph: PropTypes.object,
    onNodeMouseDown: PropTypes.func,
    onNodeMouseUp: PropTypes.func,
    onNodeDoubleClick: PropTypes.func,
    onEdgeMouseDown: PropTypes.func,
    onEdgeMouseUp: PropTypes.func,
    onEdgeDoubleClick: PropTypes.func,
  }

  return Graph
}