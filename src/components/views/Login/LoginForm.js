import React from 'react'
import PropTypes from 'prop-types'
import { LabeledInput, Button } from '../Primitives'

export default class LoginForm extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      username: '',
      password: '',
    }
  }

  handleSubmit = () => {
    const { onSubmit } = this.props
    const { username, password } = this.state
    onSubmit({ username, password })
  }

  handleUsernameChange = (event) => {
    this.setState({ username: event.target.value })
  }

  handlePasswordChange = (event) => {
    this.setState({ password: event.target.value })
  }

  render() {
    const {
      username,
      password,
    } = this.state
    const {
      handleUsernameChange,
      handlePasswordChange,
      handleSubmit,
    } = this
    return (
      <div>
        <LabeledInput
          label='Username'
          value={username}
          onChange={handleUsernameChange}
        />
        <LabeledInput
          label='Password'
          value={password}
          onChange={handlePasswordChange}
        />
        <Button
          text='Sign In'
          onClick={handleSubmit}
        />
      </div>
    )
  }
}

LoginForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
}
