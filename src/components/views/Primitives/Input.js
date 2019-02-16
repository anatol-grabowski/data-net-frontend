import React from 'react'
import PropTypes from 'prop-types'
import styles from './Input.module.scss'

export default function Input(props) {
  const { onChange, value } = props
  return (
    <input
      className={styles.Input}
      type='text'
      onChange={onChange}
      value={value}
    />
  )
}

Input.propTypes = {
  onChange: PropTypes.func.isRequired,
  value: PropTypes.string.isRequired,
}
