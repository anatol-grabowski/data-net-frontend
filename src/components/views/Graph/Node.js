import PropTypes from 'prop-types'
import React from 'react'
import { pure } from 'recompose'
import Measure from 'react-measure'
import { PaperclipIcon } from '../Primitives'
import ReactMarkdownMathjax from './ReactMarkdownMathjax'
import styles from './Node.module.scss'

const PureReactMarkdown = pure(ReactMarkdownMathjax)
const preventDefault = evt => evt.preventDefault()

export default class Node extends React.Component {
  onMouseDown = (event) => {
    const isLink = event.target.nodeName.toLowerCase() === 'a'
    if (isLink) return
    const { onMouseDown } = this.props
    onMouseDown(event)
  }

  render() {
    const {
      coords,
      text,
      details,
      tags,
      attachments,
      onMouseUp,
      onDoubleClick,
      onResize,
    } = this.props
    const { onMouseDown } = this
    const [x, y] = coords
    return (
      <Measure
        onResize={onResize}
      >
        {({ measureRef }) => (
          <div
            ref={measureRef}
            className={styles.NodeWrapper}
            style={{
              top: y + 'px',
              left: x + 'px',
            }}
          >
            <div
              className={styles.Node}
              title={details}
              onMouseDown={onMouseDown}
              onContextMenu={preventDefault}
              onMouseUp={onMouseUp}
              onDoubleClick={onDoubleClick}
            >
              <PureReactMarkdown
                className={styles.MarkdownWrapper}
                source={text}
              />
              <NodeTags tags={tags}/>
            </div>
            {attachments.length > 0 && <PaperclipIcon /> }
          </div>
        )}
      </Measure>
    )
  }
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
