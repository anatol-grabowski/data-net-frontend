import React from 'react'
import { action } from '@storybook/addon-actions'
import { Graph } from '../../../components/views/Graph'
import styles from '../../stories.module.scss'

const nodes = [
  {
    id: '435',
    coords: [100, 50],
    text: 'hello 100, 50',
    details: 'hint',
  },
  {
    id: 'fds',
    coords: [300, 50],
    text: 'hello `markdown`; 300, 50',
    details: '',
  },
  {
    id: '54hj',
    coords: [200, 200],
    text: 'hello\ntwo lines; 200, 200',
    details: '',
  },
]

const edges = [
  {
    id: 'sdlfj',
    points: [
      nodes[0].coords,
      nodes[1].coords,
    ],
  },
  {
    id: 'lsfj4',
    points: [
      nodes[1].coords,
      nodes[2].coords,
    ],
  },
]

export default () => (
  <div>
    <div className={styles.Container}>
      <Graph
        nodes={nodes}
        edges={edges}
        onNodeMouseDown={action('node mouse down')}
        onNodeMouseUp={action('node mouse up')}
        onNodeDoubleClick={action('node double click')}
        onEdgeDoubleClick={action('edge double click')}
      />
    </div>
  </div>
)