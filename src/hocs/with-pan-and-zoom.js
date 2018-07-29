import React from 'react'
import './with-pan-and-zoom.css'

export default function withPanAndZoom(Child) {
  return class PanAndZoom extends React.Component {
    constructor(props) {
      super(props)
      this.graphRef = React.createRef()
      this.state = {
        translate: [0, 0],
        scale: props.scale || 1,
      }
    }

    componentDidMount() {
      const transformEvent = {
        scaleScreenToWorld: this.scaleScreenToWorld,
        mapScreenToWorld: this.mapScreenToWorld,
        mapWorldToScreen: this.mapWorldToScreen,
      }
      this.props.onGetTransformFunctions && this.props.onGetTransformFunctions(transformEvent)
    }

    scaleScreenToWorld = ([x, y], scale = this.state.scale) => {
      x = x / scale
      y = y / scale
      return [x, y]
    }

    mapScreenToWorld = ([pageX, pageY]) => {
      const rect = this.graphRef.current.getBoundingClientRect()
      const scale = this.state.scale
      const x = (pageX - rect.left- this.state.translate[0]) / scale
      const y = (pageY - rect.top - this.state.translate[1]) / scale
      return [x, y]
    }

    mapWorldToScreen = ([x, y], scale = this.state.scale) => {
      x = x * scale + this.state.translate[0]
      y = y * scale + this.state.translate[1]
      return [x, y]
    }

    handleMouseDown = evt => {
      if (evt.button !== 0) return
      this.setState({
        translating: {
          initialCursor: [evt.clientX, evt.clientY],
          initialWorld: this.state.translate,
        }
      })
    }

    handleMouseMove = event => {
      const x = this.state.translating.initialWorld[0] + event.clientX - this.state.translating.initialCursor[0]
      const y = this.state.translating.initialWorld[1] + event.clientY - this.state.translating.initialCursor[1]
      this.setState({translate: [x, y]})
    }

    handleMouseUp = () => {
      this.setState({translating: null})
    }

    handleWheel = evt => {
      const scaleSensitivity = 0.002
      const newScale = this.state.scale * (1 - scaleSensitivity * evt.deltaY)
      const rect = this.graphRef.current.getBoundingClientRect()
      const p = [
        evt.pageX - rect.left,
        evt.pageY - rect.top,
      ]
      const pWorld = this.mapScreenToWorld([evt.pageX, evt.pageY])
      const pAfterScale = this.mapWorldToScreen(pWorld, newScale)
      const translateToKeepPointUnderCursorStatic = [
        this.state.translate[0] + (p[0] - pAfterScale[0]),
        this.state.translate[1] + (p[1] - pAfterScale[1]),
      ]
      this.setState({
        scale: newScale,
        translate: translateToKeepPointUnderCursorStatic,
      })
    }

    render() {
      const scale = this.state.scale
      const translate = this.state.translate
      return (
        <div className='with-pan-and-zoom-interact'
          ref={this.graphRef}
          onMouseDown={this.handleMouseDown}
          onMouseMove={this.state.translating && this.handleMouseMove}
          onMouseUp={this.state.translating && this.handleMouseUp}
          onWheel={this.handleWheel}
        >
          <div className='with-pan-and-zoom-transform'
            style={{
              transform: `translate(${translate[0]}px,${translate[1]}px) scale(${scale})`,
              transformOrigin: '0px 0px',
            }}
          >
            <Child {...this.props} />
          </div>
        </div>
      )
    }
  }
}