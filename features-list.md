# Implemented
- draw nodes and edges (view)
- pan and zoom (hoc)
- drag nodes (hoc), uses scaleScreenToWorld to get offset of node's x and y
- create nodes (component), uses mapScreenToWorld to get node's x and y
- create edges (component), draws in screen space
- edit nodes (component), uses mapWorldToScreen to get input's left and right
- save graph (mongodb)
- delete edges and nodes
- node details
- edge arrows
- markdown
- tags
- node hints
- attachments upload, download, delete (dropbox)
- nice paper clip
- TEX math
- collaborative editing (with websockets)
- arrows to edges of nodes (not centers)

# To do
- logins, private graphs
- graphs list
- stars for graphs
- fork graphs
- search users, graphs
- pure data-net object
- select and move/copy multiple nodes
- flexible edges
- tags search
- nodes collapse, focus
- node clusters
- autoarrange nodes

# Bugs
- links should be rmb-clickable
- tags end space
- images shouldn't be draggable
- paper clip blinking

# Refactor
- ugly code at graph-render-and-edit-area
- during creation of new connection the line is drawn not the same way that it normally is
- hacky code in with-pan-and-zoom hoc
- think of some way of node inheritance?
- eslint and eslint-plugin-react should be dev dependencies
- optimize arrows
- optimize collaboration
