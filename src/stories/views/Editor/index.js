import React from 'react'
import { storiesOf } from '@storybook/react'
import GraphArea from './GraphArea'
import EditArea from './EditArea'

storiesOf('Editor', module)
  .add('GraphArea', () => <GraphArea />)
  .add('EditArea', () => <EditArea />)