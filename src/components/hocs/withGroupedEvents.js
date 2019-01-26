import React from 'react'
import Debug from 'debug'

const debug = Debug('with-grouped-events')
const debugHandlersMap = Debug('handlers-map')

class HandlersMap {
  constructor() {
    this.map = null
    this.handler = null
    this.groupedHandler = this.groupedHandler.bind(this)
  }

  /**
   * This is a function that a parent calls to get a cached handler for each el.
   * It takes an element and returns an elHandler for it
   * If parent handler is null - return a function that returns null,
   * so that the Parent can call it without error.
   * If el is in the map - return the elHandler from the map.
   * If el is not in the map - create new elHandler, add to map and return it.
   */
  groupedHandler(el) {
    if (!this.handler) return () => this.handler
    const elHandler = this.map.get(el)
    if (elHandler) debugHandlersMap(`found "${handler && handler.name}" for`, el)
    if (elHandler) return elHandler
    const createdElHandler = (...args) => this.handler(el, ...args)
    this.map.set(el, createdElHandler)
    debugHandlersMap(`added "${this.handler && this.handler.name}" for`, el)
    return createdElHandler
  }

  _reset(handler) {
    this.map = new WeakMap()
    this.handler = handler
    debugHandlersMap(`reset "${handler && handler.name}"`)
  }

  update(handler) {
    const isHandlerChanged = handler !== this.handler
    if (!isHandlerChanged) return
    this._reset(handler)
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
 *   export default withGroupedEvents(['onItemEvent'])(List)
 * ```
 * Now `List` will emit `onItemEvent` with `item` in the first argument, then original `onEvent` arguments
 */
const withGroupedEvents = (handlersProps) => (Component) => {
  const createMaps = () => {
    const maps = {}
    handlersProps.forEach(handlerProp => {
      maps[handlerProp] = new HandlersMap()
    })
    return maps
  }

  const getGroupedHandlers = (props, maps) => {
    const groupedHandlers = {}
    handlersProps.forEach(handlerProp => {
      const handler = props[handlerProp]
      const map = maps[handlerProp]
      map.update(handler)
      debug('updated', handlerProp, handler && handler.name)
      groupedHandlers[handlerProp] = map.groupedHandler
    })
    debug('getGroupedHandlers', groupedHandlers)
    return groupedHandlers
  }

  class WithGroupedEvents extends React.Component {
    constructor(props) {
      super(props)
      this.maps = createMaps()
    }

    render() {
      const { props, maps } = this
      const groupedHandlers = getGroupedHandlers(props, maps)
      return <Component {...props} {...groupedHandlers} />
    }
  }
  return WithGroupedEvents
}

export default withGroupedEvents