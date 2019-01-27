import React from 'react'
import { GraphArea } from '../../../components/containers/Graph'
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

const graph = {
  nodes,
  edges,
}

export default () => (
  <div>
    <div className={styles.Container}>
      <GraphArea
        graph={graph}
        onNodeDoubleClick={() => {}}
        onEdgeDoubleClick={() => {}}
      />
    </div>
  </div>
)