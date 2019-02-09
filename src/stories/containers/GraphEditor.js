import React from 'react'
import { GraphEditor } from '../../components/containers'
import styles from '../stories.module.scss'
import { action } from '@storybook/addon-actions'

import { Graph } from 'data-net'

const nodes = [
  {
    id: 'n1',
    data: {
      x: 100,
      y: 50,
      text: 'hello 100, 50',
      details: 'hint',
    },
  },
  {
    id: 'n2',
    data: {
      x: 300,
      y: 50,
      text: 'hello `markdown`; 300, 50',
      details: '',
    },
  },
  {
    id: 'n3',
    data: {
      x: 200,
      y: 200,
      text: 'hello\ntwo lines; 200, 200',
    },
  },
]

const edges = [
  {
    id: 'e1',
    from: 'n1',
    to: 'n2',
  },
  {
    id: 'e2',
    from: 'n2',
    to: 'n3',
  },
]

const graph = Graph.create({ nodes, edges })
window.g = graph
console.log(graph)

export default () => (
  <div>
    <div className={styles.Container}>
      <GraphEditor
        graph={graph}
      />
    </div>
  </div>
)