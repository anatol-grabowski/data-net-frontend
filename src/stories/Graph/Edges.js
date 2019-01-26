import React from 'react'
import cx from 'classnames'
import { action } from '@storybook/addon-actions'
import { Edges } from '../../components/views/Graph'
import styles from '../stories.module.scss'

const mouseActions = {
  onEdgeDoubleClick: action('node double click'),
}

const edges = [
  {
    id: 'sdlfj',
    points: [
      [10, 20],
      [100, 200],
    ],
  },
  {
    id: 'lsfj4',
    points: [
      [100, 200],
      [200, 20],
    ],
  },
]

export default () => (
  <div>
    <div className={cx(styles.Container)}>
      <Edges
        edges={edges}
        {...mouseActions}
      />
    </div>
  </div>
)