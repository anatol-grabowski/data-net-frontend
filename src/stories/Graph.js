import React from 'react';
import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import { Node, Edge, Graph } from '../components/views/Graph'

storiesOf('Graph', module)
  .add('Node', () => (
    <Node  />
  ));
