import React from 'react'
import PropTypes from 'prop-types'
import Dropzone from 'react-dropzone'
import Attachments from './Attachments'
import styles from './AttachmentsSection.module.scss'

export default class AttachmentsSection extends React.Component {
  constructor(props) {
    super(props)
    this.files = []
    this.state = {
      filesToUpload: [],
    }
  }

  handleAddFiles = (files) => {
    this.files = files
    const filesToUpload = files.map(f => f.name)
    this.setState({ filesToUpload })
  }

  handleUploadClick = () => {
    const { onUploadAttachments } = this.props
    onUploadAttachments(this.files)
  }

  render() {
    const {
      attachments = [],
      onRemoveAttachment,
    } = this.props
    const {
      handleAddFiles,
      handleUploadClick,
    } = this
    const { filesToUpload } = this.state
    return (
      <div className={styles.AttachmentsSection}>
        Attachments:
        <Attachments
          attachments={attachments}
          onRemoveAttachment={onRemoveAttachment}
        />
        <Dropzone className={styles.Dropzone} onDrop={handleAddFiles}>
          <div>Drop files here or click to browse for files</div>
        </Dropzone>
        {filesToUpload.map((file, i) => <div key={i}>{file}</div>)}
        <input type='button' value='Upload' onClick={handleUploadClick}></input>
      </div>
    )
  }
}

AttachmentsSection.propTypes = {
  attachments: PropTypes.arrayOf(PropTypes.object).isRequired,
  onRemoveAttachment: PropTypes.func.isRequired,
  onUploadAttachments: PropTypes.func.isRequired,
}