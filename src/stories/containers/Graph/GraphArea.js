import React from 'react'
import { GraphArea } from '../../../components/containers/Graph'
import styles from '../../stories.module.scss'
import { action, decorate } from '@storybook/addon-actions';

const nodes = [
  {
    id: 'n1',
    coords: [100, 50],
    text: 'hello 100, 50',
    details: 'hint',
  },
  {
    id: 'n2',
    coords: [300, 50],
    text: 'hello `markdown`; 300, 50',
    details: '',
  },
  {
    id: 'n3',
    coords: [200, 200],
    text: 'hello\ntwo lines; 200, 200',
    details: '',
  },
]

const edges = [
  {
    id: 'e1',
    points: [
      nodes[0].coords,
      nodes[1].coords,
    ],
  },
  {
    id: 'e2',
    points: [
      nodes[1].coords,
      nodes[2].coords,
    ],
  },
]

const graph = {
  nodes,
  edges,
}

function verboseDecorator(args) {
  return args.map(arg => (arg instanceof Array ? arg.join(' ') : arg))
}
const verbose = decorate([verboseDecorator])

const handlers = {
  onAddNode: verbose.action('add node'),
  onAddEdgeBegin: verbose.action('add edge begin'),
  onAddEdgeMove: verbose.action('add edge move'),
  onAddEdgeCancel: verbose.action('add edge cancel'),
  onAddEdgeEnd: verbose.action('add edge end'),
  onRemoveNode: verbose.action('remove node'),
  onRemoveEdge: verbose.action('remove edge'),
  onEditNode: verbose.action('edit node'),
  onEditEdge: verbose.action('edit edge'),
  onDragNodeBegin: verbose.action('drag node begin'),
  onDragNodeMove: verbose.action('drag node move'),
  onDragNodeEnd: verbose.action('drag node end'),
}

export default () => (
  <div>
    <div className={styles.Container}>
      <GraphArea
        graph={graph}
        {...handlers}
      />
    </div>
  </div>
)