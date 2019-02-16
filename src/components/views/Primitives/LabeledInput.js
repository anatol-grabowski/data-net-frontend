import React from 'react'
import PropTypes from 'prop-types'
import Input from './Input'
import styles from './LabeledInput.module.scss'

export default function LabeledInput(props) {
  const {
    onChange,
    label,
    value,
  } = props
  return (
    <div className={styles.LabeledInput}>
      <div>{label}</div>
      <Input
        onChange={onChange}
        value={value}
      />
    </div>
  )
}

LabeledInput.propTypes = {
  onChange: PropTypes.func.isRequired,
  label: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
}
