import React from 'react'
import { storiesOf } from '@storybook/react'
import GraphArea from './GraphArea'
import EditArea from './EditArea'
import GraphEditor from './GraphEditor'

storiesOf('Editor', module)
  .add('GraphArea', () => <GraphArea />)
  .add('EditArea', () => <EditArea />)
  .add('GraphEditor', () => <GraphEditor />)