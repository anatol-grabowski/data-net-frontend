import React from 'react'
import { storiesOf } from '@storybook/react'
import { LoginForm } from '../../../components/views/Login'

storiesOf('Login', module)
  .add('LoginForm', () => (
    <div>
      <LoginForm />
    </div>
  ))