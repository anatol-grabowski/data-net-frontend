import React from 'react'
import { storiesOf } from '@storybook/react'
import Node from './Node'
import Edge from './Edge'
import Nodes from './Nodes'
import Edges from './Edges'
import Graph from './Graph'

storiesOf('Graph', module)
  .add('Node', () => <Node />)
  .add('Edge', () => <Edge />)
  .add('Nodes', () => <Nodes />)
  .add('Edges', () => <Edges />)
  .add('Graph', () => <Graph />)