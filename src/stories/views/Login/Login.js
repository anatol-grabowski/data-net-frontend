import React from 'react'
import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import { LoginForm } from '../../../components/views/Login'

storiesOf('Login', module)
  .add('LoginForm', () => (
    <div>
      <LoginForm onSubmit={action('submit')} />
    </div>
  ))
