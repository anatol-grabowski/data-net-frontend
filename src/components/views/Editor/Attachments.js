import React from 'react'

export default function Attachments(props) {
  const {attachments = [], onAttachmentRemove} = props
  return (
    <div className='attachments-list'>
      {
        attachments.map((att, i) => (
          <div className='attachment' key={i}>
            <input type='button' value='X' onClick={() => onAttachmentRemove(att, i)}></input>
            <a
              href={makeDownloadLink(att.filepath)}
            >{att.filepath}</a>
          </div>
        ))
      }
    </div>
  )
}