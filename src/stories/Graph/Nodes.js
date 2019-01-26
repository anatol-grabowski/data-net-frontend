import React from 'react'
import cx from 'classnames'
import { action } from '@storybook/addon-actions'
import { Nodes } from '../../components/views/Graph'
import styles from '../stories.module.scss'

const mouseActions = {
  onNodeMouseDown: action('node mouse down'),
  onNodeMouseUp: action('node mouse up'),
  onNodeDoubleClick: action('node double click'),
}

const nodes = [
  {
    id: '435',
    coords: [100, 50],
    text: 'hello 100, 50',
    details: 'hint',
  },
  {
    id: 'fds',
    coords: [200, 50],
    text: 'hello `markdown`; 200, 50',
    details: '',
  },
  {
    id: '54hj',
    coords: [200, 200],
    text: 'hello\ntwo lines; 200, 200',
    details: '',
  },
]

export default () => (
  <div>
    <div className={cx(styles.Container)}>
      <Nodes
        nodes={nodes}
        {...mouseActions}
      />
    </div>
  </div>
)