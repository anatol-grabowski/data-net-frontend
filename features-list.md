# Implemented features
- draw nodes and edges (view)
- pan and zoom (hoc)
- drag nodes (hoc), uses scaleScreenToWorld to get offset of node's x and y
- create nodes (component), uses mapScreenToWorld to get node's x and y
- create edges (component), draws in screen space
- edit nodes (component), uses mapWorldToScreen to get input's left and right
- save graph
- delete edges
- delete nodes

# To do
- node details
- attachments