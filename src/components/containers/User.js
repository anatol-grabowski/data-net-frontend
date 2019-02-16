import React from 'react'
import PropTypes from 'prop-types'
import { login } from '../../api/login.api'
import { LoginForm } from '../views/Login'
import styles from './User.module.scss'

export default class User extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      username: null,
    }
  }

  handleSubmit = async (event) => {
    const { username, password } = event
    const response = await login(username, password)
    if (!response) {
      this.setState({ username: null })
      return
    }
    this.setState({ username: response.username })
  }

  render() {
    const { username } = this.state
    const { handleSubmit } = this
    return (
      <div>
        <LoginForm onSubmit={handleSubmit}/>
        {`logged in as: '${username}'`}
      </div>
    )
  }
}

User.propTypes = {
}
