import React from 'react'
import PropTypes from 'prop-types'
import styles from './Button.module.scss'

export default function Button(props) {
  const {
    onClick,
    text,
  } = props
  return (
    <input
      className={styles.Button}
      type='button'
      value={text}
      onClick={onClick}
    />
  )
}

Button.propTypes = {
  text: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
}
