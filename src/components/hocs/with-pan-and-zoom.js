import React from 'react'
import './with-pan-and-zoom.css'

export default function withPanAndZoom(Child) {
  return class PanAndZoom extends React.Component {
    constructor(props) {
      super(props)
      this.graphRef = React.createRef()
      this.touches = []
      this.state = {
        translate: [0, 0],
        scale: props.scale || 1,
        translating: null,
        scaling: null,
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
      this.startMove(evt.clientX, evt.clientY)
    }

    startMove(clientX, clientY) {
      this.setState({
        translating: {
          initialCursor: [clientX, clientY],
          initialWorld: this.state.translate,
        }
      })
    }

    move(clientX, clientY) {
      const x = this.state.translating.initialWorld[0] + clientX - this.state.translating.initialCursor[0]
      const y = this.state.translating.initialWorld[1] + clientY - this.state.translating.initialCursor[1]
      this.setState({translate: [x, y]})
    }

    endMove() {
      this.setState({translating: null})
    }

    handleMouseMove = event => {
      this.move(event.clientX, event.clientY)
    }

    handleMouseUp = () => {
      this.endMove()
    }

    handleWheel = evt => {
      const scaleSensitivity = 0.002
      const newScale = this.state.scale * (1 - scaleSensitivity * evt.deltaY)
      this.scale(newScale, evt.pageX, evt.pageY)
    }

    scale(newScale, centerX, centerY) {
      const rect = this.graphRef.current.getBoundingClientRect()
      const p = [
        centerX - rect.left,
        centerY - rect.top,
      ]
      const pWorld = this.mapScreenToWorld([centerX, centerY])
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

    calcDelta(x1, y1, x2, y2) {
      const lenSq = Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2)
      const len = Math.sqrt(lenSq)
      return len
    }

    startScale(delta) {
      this.setState({
        scaling: {
          initialDelta: delta,
          initialScale: this.state.scale,
        }
      })
    }

    endScale() {
      this.setState({scaling: null})
    }

    updateTouches(changedTouches, remove=false) {
      const touches = this.touches
      for (let i = 0; i < changedTouches.length; i++) {
        const touch = changedTouches[i]
        const index = touches.findIndex(t => t.identifier === touch.identifier)
        if (index === -1) {
          if (remove) return
          touches.push(touch)
          return
        }
        if (remove) {
          this.touches.splice(index, 1)
          return
        }
        touches[index] = touch
      }
    }

    touchesNumberChanged() {
      if (this.touches.length === 1) {
        const touch = this.touches[0]
        this.startMove(touch.clientX, touch.clientY)
      } else {
        this.state.translating && this.endMove()
      }
      if (this.touches.length === 2) {
        const [ t1, t2 ] = this.touches
        const delta = this.calcDelta(t1.clientX, t1.clientY, t2.clientX, t2.clientY)
        this.startScale(delta)
      } else {
        this.state.scaling && this.endScale()
      }
    }

    handleTouchStart = evt => {
      this.updateTouches(evt.changedTouches)
      this.touchesNumberChanged()
    }

    handleTouchMove = evt => {
      this.updateTouches(evt.changedTouches)
      if (this.touches.length === 1) {
        const touch = this.touches[0]
        this.move(touch.clientX, touch.clientY)
      }
      if (this.touches.length === 2) {
        const [ t1, t2 ] = this.touches
        const delta = this.calcDelta(t1.clientX, t1.clientY, t2.clientX, t2.clientY)
        const newScale = delta / this.state.scaling.initialDelta * this.state.scaling.initialScale
        const centerX = (t1.pageX + t2.pageX) / 2
        const centerY = (t1.pageY + t2.pageY) / 2
        this.scale(newScale, centerX, centerY)
      }
    }

    handleTouchEnd = evt => {
      this.updateTouches(evt.changedTouches, true)
      this.touchesNumberChanged()
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
          onMouseLeave={this.state.translating && this.handleMouseUp}
          onWheel={this.handleWheel}
          onTouchStart={this.handleTouchStart}
          onTouchMove={this.handleTouchMove}
          onTouchEnd={this.handleTouchEnd}
          onTouchCancel={this.handleTouchEnd}
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