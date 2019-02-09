import PropTypes from 'prop-types'
import React from 'react'
import Attachments from './Attachments'
import styles from './EditArea.module.scss'

export default class EditArea extends React.Component {
  handleTextChange = (event) => {
    const { onEditUpdate, id } = this.props
    onEditUpdate(id, event.target.value)
  }

  handleRemove = () => {
    const { onRemove, id } = this.props
    onRemove(id)
  }

  render() {
    const {
      id,
      coords,
      text,
      attachments,
    } = this.props
    const displayedCoords = coords.map(c => c.toFixed(1)).join(' ')
    const {
      handleTextChange,
      handleRemove,
    } = this
    return (
      <div className={styles.EditArea}>
        <div>{`node id: ${id}`}</div><br/>
        <div>{`node xy: ${displayedCoords}`}</div><br/>
        <div>Text:</div>
        <textarea
          rows={10}
          value={text}
          onChange={handleTextChange}
        />
        <input
          type='button'
          value='remove'
          onClick={handleRemove}
        />
        <div>Attachments:</div>
        <Attachments
          attachments={attachments}
        />
        {/* <Dropzone className='dropzone' onDrop={this.handleAddAttachments}>
          <p>Try dropping some files here, or click to select files to upload.</p>
        </Dropzone> */}
        {/* <input type='button' value='Attach' onClick={this.handleUploadAttachments}></input> */}
      </div>
    )
  }
}

EditArea.propTypes = {
  id: PropTypes.string.isRequired,
  coords: PropTypes.arrayOf(PropTypes.number).isRequired,
  text: PropTypes.string.isRequired,
  attachments: PropTypes.arrayOf(PropTypes.object).isRequired,
  onEditUpdate: PropTypes.func.isRequired,
  onRemove: PropTypes.func.isRequired,
}