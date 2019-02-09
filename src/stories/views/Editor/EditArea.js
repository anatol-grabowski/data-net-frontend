import React from 'react'
import { EditArea } from '../../../components/views/Editor'
import styles from '../../stories.module.scss'
import { action } from '@storybook/addon-actions'

export default () => (
  <div>
    <div className={styles.Container}>
      <EditArea
        id={'123'}
        text={'text\nlines'}
        coords={[10, 20]}
        attachments={[]}
        onEdit={action('edit')}
      />
    </div>
  </div>
)