import PropTypes from 'prop-types'
import React from 'react'
import Attachments from './Attachments'
import styles from './EditArea.module.scss'

export default class EditArea extends React.Component {
  handleTextChange = (event) => {
    const { onEditUpdate, id } = this.props
    onEditUpdate(id, event.target.value)
  }

  render() {
    const {
      id,
      coords,
      text,
      attachments,
    } = this.props
    const {
      handleTextChange,
    } = this
    return (
      <div className={styles.EditArea}>
        <div>{`node id: ${id}`}</div><br/>
        <div>{`node xy: ${coords.join(' ')}`}</div><br/>
        <div>Text:</div>
        <textarea
          rows={10}
          value={text}
          onChange={handleTextChange}
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
}