import PropTypes from 'prop-types'
import React from 'react'
import AttachmentsSection from './AttachmentsSection'
import styles from './EditArea.module.scss'

export default class EditArea extends React.Component {
  handleTextChange = (event) => {
    const { onTextUpdate, id } = this.props
    onTextUpdate(id, event.target.value)
  }

  handleRemove = () => {
    const { onRemove, id } = this.props
    onRemove(id)
  }

  handleRemoveAttachment = (i) => {
    const { onRemoveAttachment, id } = this.props
    onRemoveAttachment(id, i)
  }

  handleUploadAttachements = (files) => {
    const { onUploadAttachments, id } = this.props
    onUploadAttachments(id, files)
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
      handleRemoveAttachment,
      handleUploadAttachements,
    } = this
    return (
      <div className={styles.EditArea}>
        <div>{`node id: ${id}`}</div><br/>
        <div>{`node xy: ${displayedCoords}`}</div><br/>
        <div>Text:</div>
        <textarea
          ref={input => input && input.focus()}
          className={styles.Text}
          rows={10}
          value={text}
          onChange={handleTextChange}
        />
        <input
          type='button'
          value='remove'
          onClick={handleRemove}
        />
        <AttachmentsSection
          attachments={attachments}
          onRemoveAttachment={handleRemoveAttachment}
          onUploadAttachments={handleUploadAttachements}
        />
      </div>
    )
  }
}

EditArea.propTypes = {
  id: PropTypes.string.isRequired,
  coords: PropTypes.arrayOf(PropTypes.number).isRequired,
  text: PropTypes.string.isRequired,
  attachments: PropTypes.arrayOf(PropTypes.object).isRequired,
  onTextUpdate: PropTypes.func.isRequired,
  onRemove: PropTypes.func.isRequired,
  onRemoveAttachment: PropTypes.func.isRequired,
  onUploadAttachments: PropTypes.func.isRequired,
}