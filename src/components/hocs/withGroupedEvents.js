import React from 'react'
import Debug from 'debug'

const debug = Debug('with-grouped-events')
const debugHandlersMap = Debug('handlers-map')

class HandlersMap {
  constructor() {
    this.map = null
    this.handler = null
    this.groupedHandler = null
  }

  _reset(handler) {
    this.map = new WeakMap()
    this.handler = handler
    debugHandlersMap(`reset "${handler && handler.name}"`)
  }

  _updateMap(elements) {
    const { map, handler } = this
    elements.forEach(el => {
      const isInMap = map.has(el)
      if (isInMap) return
      const elHandler = (...args) => handler(el, ...args)
      map.set(el, elHandler)
      debugHandlersMap('updated element', el)
    })
  }

  update(handler, elements) {
    const isHandlerChanged = handler !== this.handler
    if (isHandlerChanged) this._reset(handler)
    if (!handler) {
      this.groupedHandler = () => handler
      return
    }
    this.groupedHandler = el => this.map.get(el)
    this._updateMap(elements)
  }
}

/** Get child as the first argument in events emitted by children,
 * chache children's event handlers (in WeakMaps) to avoid superfluous renders.
 *
 * Extra children renders occur if the following pattern is used in the Parent's render:
 * `{childs.map(child => <Child onEvent{evt => onItemEvent(child, evt)}...`
 * They happen because `onEvent` handler is a new function every time.
 *
 * USAGE EXAMPLE:
 * ```
 *   const List = ({onItemEvent, items}) => (
 *     <div>
 *       {items.map(item => <Item key={item.id} onEvent{onItemEvent(item)} {...item} />)}
 *     </div>
 *   )
 *   export default withGroupedEvents({ onItemEvent: 'items' })(Parent)
 * ```
 * Now `List` will emit `onItemEvent` with `item` in the first argument, then original `onEvent` arguments
 */
const withGroupedEvents = (groupsMappings) => (Component) => {
  // we use `{ handler: 'elements' }`  mappings and not `{ elements: [ 'handler' ] }`.
  // That makes conflicting mappings,
  // like `{ elements: ['handler'], 'items': ['handler', 'handler2'] }`, impossible
  const handlersProps = Object.keys(groupsMappings)

  const createMaps = () => {
    const maps = {}
    handlersProps.forEach(handlerProp => {
      maps[handlerProp] = new HandlersMap()
    })
    return maps
  }

  const updateMaps = (props, maps) => {
    const groupedHandlers = {}
    handlersProps.forEach(handlerProp => {
      const handler = props[handlerProp]
      const elementsProp = groupsMappings[handlerProp]
      const elements = props[elementsProp]
      const map = maps[handlerProp]
      map.update(handler, elements)
      groupedHandlers[handlerProp] = map.groupedHandler
    })
    debug('updateMaps', groupedHandlers)
    return groupedHandlers
  }

  class WithGroupedEvents extends React.Component {
    constructor(props) {
      super(props)
      this.maps = createMaps()
    }

    render() {
      const { props, maps } = this
      const groupedHandlers = updateMaps(props, maps)
      return <Component {...props} {...groupedHandlers} />
    }
  }
  return WithGroupedEvents
}

export default withGroupedEvents