import React from 'react'
import withPanAndZoom from '../../components/hocs/withPanAndZoom'
import styles from '../stories.module.scss'

function Div() {
  return (
    <div className='test-offset'>
      some draggable and zoomable<br/>
      multiline text
    </div>
  )
}
const DivWithPanAndZoom = withPanAndZoom(Div)

export default () => (
  <div>
    <div className={styles.Container}>
      <DivWithPanAndZoom />
    </div>
  </div>
)