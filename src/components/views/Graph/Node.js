import PropTypes from 'prop-types'
import React from 'react'
import ReactMarkdown from 'react-markdown'
import styles from './Node.module.scss'
import { pure } from 'recompose'

const PureReactMarkdown = pure(ReactMarkdown)
const preventDefault = evt => evt.preventDefault()

export default function Node(props) {
  const {
    coords,
    text,
    details,
    tags,
    attachments,
    onMouseDown,
    onMouseUp,
    onDoubleClick,
  } = props
  const [x, y] = coords
  return (
    <div className={styles.NodeWrapper}
      style={{
        top: y + 'px',
        left: x + 'px',
      }}
    >
      <div className={styles.Node}
        title={details}
        onMouseDown={onMouseDown}
        onContextMenu={preventDefault}
        onMouseUp={onMouseUp}
        onDoubleClick={onDoubleClick}
      >
        <PureReactMarkdown className='node-markdown-container' source={text}/>
        <NodeTags tags={tags}/>
      </div>
      <NodeAttachments attachments={attachments}/>
    </div>
  )
}

Node.defaultProps = {
  tags: [],
  attachments: [],
}

Node.propTypes = {
  coords: PropTypes.arrayOf(PropTypes.number).isRequired,
  text: PropTypes.string.isRequired,
  details: PropTypes.string.isRequired,
  tags: PropTypes.arrayOf(PropTypes.string),
  attachments: PropTypes.arrayOf(PropTypes.object),
  onMouseDown: PropTypes.func.isRequired,
  onMouseUp: PropTypes.func.isRequired,
  onDoubleClick: PropTypes.func.isRequired,
}

const NodeTags = ({tags}) => (
  <div className='node-tags'>
    {tags.map((tag, i) => <NodeTag key={i} text={tag}/>)}
  </div>
)

const NodeTag = ({text}) => (
  <div className='node-tag'>{text}</div>
)

const NodeAttachments = ({attachments = []}) => (
  attachments.length > 0 && <div className='node-attachments'>
    <div className='top'></div>
    <div className='bottom'></div>
  </div>
)