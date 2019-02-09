import React from 'react'
import { PaperclipIcon } from '../../../components/views/Primitives'
import styles from '../../stories.module.scss'

export default () => (
  <div>
    <div
      className={styles.Container}
      style={{position: 'absolute', top: '50px', left: '50px', width: '100px'}}
    >
      <PaperclipIcon />
    </div>
  </div>
)