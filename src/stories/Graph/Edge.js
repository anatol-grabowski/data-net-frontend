import React from 'react'
import { action } from '@storybook/addon-actions'
import { Edge, ArrowMarker } from '../../components/views/Graph'
import styles from '../stories.module.scss'

const edges = [
  {
    points: [
      [10, 20],
      [100, 200],
    ],
    onDoubleClick: action('double click'),
  },
]

export default () => (
  <div>
    <svg className={styles.Container}>
      <defs>
        <ArrowMarker />
      </defs>
      <g>
        <Edge {...edges[0]} />
      </g>
    </svg>
  </div>
)