import React from 'react'
import { storiesOf } from '@storybook/react'
import WithPanAndZoom from './withPanAndZoom'

storiesOf('hocs', module)
  .add('withPanAndZoom', () => <WithPanAndZoom />)