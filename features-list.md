# Implemented
- draw nodes and edges (view)
- pan and zoom (hoc)
- drag nodes (hoc), uses scaleScreenToWorld to get offset of node's x and y
- create nodes (component), uses mapScreenToWorld to get node's x and y
- create edges (component), draws in screen space
- edit nodes (component), uses mapWorldToScreen to get input's left and right
- save graph
- delete edges and nodes
- node details
- edge arrows
- markdown
- tags

# To do
- attachments (dropbox)
- node hints
- tags search
- nodes collapse, focus
- node clusters

# Bugs
- links should be rmb-clickable
- tags end space
- images shouldn't be draggable

# Refactor
- ugly code at graph-render-and-edit-area
- during creation of new connection the line is drawn not the same way that it normally is
- hacky code in with-pan-and-zoom hoc
- think of some way of node inheritance?
- eslint and eslint-plugin-react should be dev dependencies